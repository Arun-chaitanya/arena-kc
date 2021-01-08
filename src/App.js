import './App.css';
import React,{useState,useEffect,useRef} from 'react';
import MessageWheel from "./MessageWheel"


const App = () => {

  const src = "https://p1.hiclipart.com/preview/139/395/752/button-ui-requests-blue-and-white-target-illustration-png-clipart.jpg"
  const [screenButtonData,setScreenButtonData] = useState();
  const [isCameraAvailable,setIsCameraAvailable] = useState(true)  
  const [joystickWidth,setJoystickWidth] = useState()

  //messageBox related state
  const [isMessagesAvailable,setIsMessagesAvailable] = useState(true)
  const [showMessageContent,setShowMessageContent] = useState(false)
  const [messagesList,setMessagesList] = useState([])
  const [anchorEl,setAnchorEl] = useState(null);
  const [showMessageWheel,setShowMessageWheel] = useState(false)
  const [buttonTouchData,setButtonTouchData] = useState({})
  const [messageSelectedInWheel, setMessageSelectedInWheel] = useState()
  //messageBox related state

  const screenRef = useRef();
  console.log(messageSelectedInWheel)
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

    const messagesList = [
      "Message1",
      "Message2",
      "Message3",
      "Message4",
      "Message5",
      "Message6",
      "Message7",
      "Message8",
    ]    
    setMessagesList(messagesList)
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

  //message button code starts from here

  const listSize = messagesList.length
  const angleForEachSection = 360/listSize

  const messageWheelAngle = (cx, cy, ex, ey) => {
    var dy = -(ey - cy);
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    theta -= (90 + (angleForEachSection/2))
    if (theta < 0) theta = 360 + theta;
    theta = 360 - theta
    return theta;
  }

  const onMessageButtonPress = (e) => {
    setShowMessageContent(!showMessageContent)
    setAnchorEl(anchorEl ? null : e.currentTarget);
  }

  const outputMessage = (e) => {
    e.stopPropagation()
    const index = e.target.getAttribute("data-index")
    console.log(messagesList[index])
  }



  const messageButtonTouchStart = (e) => {
    e.stopPropagation()
    for(let i=0;i<e.changedTouches.length;i++){
      var touch = e.changedTouches[i]
      setButtonTouchData({identifier:touch.identifier, startX: touch.clientX, startY: touch.clientY})
    }
  }

  const messageButtonTouchMove = (e) => {
    e.stopPropagation()
    for(let i=0;i<e.touches.length;i++){
      var touch = e.touches[i]
      if(buttonTouchData.identifier === touch.identifier){
        const a = buttonTouchData.startX - touch.clientX;
        const b = buttonTouchData.startY - touch.clientY;
        var dist = Math.sqrt( a*a + b*b );
        if(dist>5 && showMessageWheel === false){
          setShowMessageWheel(true)
        }

        if(dist>10){
          const messageSelected = Math.ceil(messageWheelAngle(buttonTouchData.startX,buttonTouchData.startY,touch.clientX,touch.clientY)/angleForEachSection)
          if(messageSelected !== messageSelectedInWheel) setMessageSelectedInWheel(messageSelected)
        }
      }
    }
  }

  const messageButtonTouchEnd = (e) => {
    e.stopPropagation()
    setShowMessageWheel(false)
    setButtonTouchData({})
  }
  // message button code ends here

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
      {
        isMessagesAvailable && 
        <MessageWheel 
          onClick={onMessageButtonPress} 
          showMessageContent={showMessageContent} 
          messagesList={messagesList}
          outputMessage = {outputMessage}
          anchorEl = {anchorEl}
          onTouchStart = {messageButtonTouchStart}
          onTouchMove = {messageButtonTouchMove}
          onTouchEnd = {messageButtonTouchEnd}
          showMessageWheel = {showMessageWheel}
          messageSelectedInWheel = {messageSelectedInWheel}
        />
      }
    </div>
  );
}

export default App;
