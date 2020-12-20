import './App.css';
import React,{useState,useEffect,useRef} from 'react';


const App = () => {

  const src = "https://p1.hiclipart.com/preview/139/395/752/button-ui-requests-blue-and-white-target-illustration-png-clipart.jpg"
  const [screenButtonData,setScreenButtonData] = useState();
  const [isCameraAvailable,setIsCameraAvailable] = useState(true)
  const [joystickWidth,setJoystickWidth] = useState()
  const screenRef = useRef();

  useEffect(() => {
    const data = [
      {
        actionName:"shoot",
        svgSrc:src,
        opacity:1,
        defaultWidth:30,
        sizeRatio:1,
        zIndex:1,
        xPosition:"200px",
        yPosition:"100px",
        touchStartResponse:"spaceBar1Down",
        touchEndResponse:"spaceBar2Up"
      },
      {
        actionName:"shootHigh",
        svgSrc:src,
        opacity:1,
        defaultWidth:30,
        sizeRatio:1,
        zIndex:1,
        xPosition:"300px",
        yPosition:"100px",
        touchStartResponse:"spaceBar2Down",
        touchEndResponse:"spaceBar2Up"
      },
      {
        actionName:"heal",
        svgSrc:src,
        opacity:1,
        defaultWidth:30,
        sizeRatio:1,
        zIndex:1,
        xPosition:"400px",
        yPosition:"100px",
        touchStartResponse:"spaceBar3Down",
        touchEndResponse:"spaceBar3Up"
      },
      {
        actionName:"prone",
        svgSrc:src,
        opacity:1,
        defaultWidth:50,
        sizeRatio:1,
        zIndex:1,
        xPosition:"500px",
        yPosition:"100px",
        touchStartResponse:"spaceBar4Down",
        touchEndResponse:"spaceBar4Up"
      }
    ]
    setScreenButtonData(data)
  },[])

  useEffect(() => {
    if(!isCameraAvailable){
      setJoystickWidth(screenRef.current.clientWidth)
    }
    else{
      setJoystickWidth((screenRef.current.clientWidth)/2)
    }
  },[isCameraAvailable])

  const assignAttributes = (object) => {
    const style = {
      position:'absolute',
      opacity:object.opacity,
      width:`${(object.defaultWidth)*(object.sizeRatio)}px`,
      height:"auto",
      top:object.yPosition,
      left:object.xPosition
    }
    return style;
  }

  const touchStartEvent = (e) => {
    e.stopPropagation()
    const index = e.target.getAttribute("data-index")
    console.log(screenButtonData[index].touchStartResponse)
  }

  const touchEndEvent = (e) => {
    e.stopPropagation()
    const index = e.target.getAttribute("data-index")
    console.log(screenButtonData[index].touchEndResponse)
  }

  const touchCache = {}

  const screenTouchStart = (e) => {
    for(let i=0;i<e.touches.length;i++){
      var touch = e.touches[i]
      if(touchCache[`${touch.identifier}`]===undefined && touchCache.joystickStartX===undefined && touch.clientX <= joystickWidth){
        touchCache[`${touch.identifier}`] = 
        {
          type:"joystick",
          joystickStartX:touch.clientX,
          joystickStartY:touch.clientY
        }
      }
      else if(touchCache[`${touch.identifier}`]===undefined && touchCache.CameraStartX===undefined && touch.clientX >= joystickWidth && isCameraAvailable){
        touchCache[`${touch.identifier}`] = 
        {
          type:"camera",
          cameraStartX:touch.clientX,
          cameraStartY:touch.clientY
        }
      }
    }
    console.log(" screen touch started")
  }

  const screenTouchEnd = (e) => {
    for(let i=0;i<e.changedTouches.length;i++){
      var touch = e.changedTouches[i]
      delete touchCache[`${touch.identifier}`]
    }
    console.log("screen touch ended")
  }

  const screenTouchMove = (e) => {
    for(let i=0;i<e.touches.length;i++){
      var touch = e.touches[i]
      if(touchCache[`${touch.identifier}`]!==undefined && touchCache[`${touch.identifier}`].type==="joystick"){
        touchCache[`${touch.identifier}`]["joystickMoveX"] = touch.clientX;
        touchCache[`${touch.identifier}`]["joystickMoveY"] = touch.clientY;
        touchCache[`${touch.identifier}`]["joystickAngle"] = angle(touchCache[`${touch.identifier}`].joystickStartX,touchCache[`${touch.identifier}`].joystickStartY,touch.clientX,touch.clientY)
        console.log(touchCache[`${touch.identifier}`]["joystickAngle"],"joystick")
      }
      else if(touchCache[`${touch.identifier}`]!==undefined && touchCache[`${touch.identifier}`].type==="camera"){
        touchCache[`${touch.identifier}`]["cameraMoveX"] = touch.clientX;
        touchCache[`${touch.identifier}`]["cameraMoveY"] = touch.clientY;
        touchCache[`${touch.identifier}`]["cameraAngle"] = angle(touchCache[`${touch.identifier}`].cameraStartX,touchCache[`${touch.identifier}`].cameraStartY,touch.clientX,touch.clientY)
        console.log(touchCache[`${touch.identifier}`]["cameraAngle"],"camera")
      }
    }
  }


  const angle = (cx, cy, ex, ey) => {
    var dy = -(ey - cy);
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  }

  return (
    <div className="App" ref={screenRef} onTouchStart = {screenTouchStart} onTouchEnd = {screenTouchEnd} onTouchMove={screenTouchMove}>
      {screenButtonData?.map((object,index) => (  
          <img src={object.svgSrc}
            key = {index}
            data-index = {index}
            className={object.actionName} 
            style={assignAttributes(object)} alt=""
            onTouchStart = {touchStartEvent}
            onTouchEnd = {touchEndEvent}
          />
      ))}
    </div>
  );
}

export default App;
