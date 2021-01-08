import React, { useRef } from 'react';
import "./MessageWheel.css";
import { Popper } from '@material-ui/core';

const RADIUS = 120;
const STROKE = 5;
const MESSAGE_WIDTH = 100;

function MessageWheel({onClick,showMessageContent,messagesList,outputMessage,anchorEl,onTouchStart,onTouchMove,onTouchEnd,showMessageWheel, messageSelectedInWheel}) {

  const src = "https://p1.hiclipart.com/preview/139/395/752/button-ui-requests-blue-and-white-target-illustration-png-clipart.jpg"

  const styleFunction = (index) => {
    const angleForEachSection = 360/(messagesList.length)
    const angleForMessage = index*angleForEachSection
    let textAlign;
    let translateX;
    let translateY;
    const r = RADIUS + STROKE
    let color;
    let fontWeight;

    if(angleForMessage === 0 || angleForMessage === 180){
      textAlign = "center";
      translateX = r*(Math.sin(angleForMessage*Math.PI/180)) ;
      if(angleForMessage === 0){
        translateY = -r*(Math.cos(angleForMessage*Math.PI/180)) - 5;
      }else translateY = -r*(Math.cos(angleForMessage*Math.PI/180)) + 5;
      
    }

    else if(angleForMessage < 180){
      textAlign = "left";
      translateX = r*(Math.sin(angleForMessage*Math.PI/180)) + (MESSAGE_WIDTH/2);
      translateY = -r*(Math.cos(angleForMessage*Math.PI/180));
    }

    else if(angleForMessage > 180){
      textAlign = "right"
      translateX = r*(Math.sin(angleForMessage*Math.PI/180)) - (MESSAGE_WIDTH/2);
      translateY = -r*(Math.cos(angleForMessage*Math.PI/180));
    }

    if((index+1) === messageSelectedInWheel){
      color = "red";
      fontWeight = "700"
    }
    else{
      color = "black";
      fontWeight = "100"
    } 

    const style = {
      transform: `translate(${translateX}px,${translateY}px)`,
      textAlign: textAlign,
      color: color,
      fontWeight: fontWeight
    }

    return style;
  }

  return (
    <div className="message__contentPage">

      <div className="message__container">
        <img src={src} alt="" onClick = {onClick} onTouchStart = {onTouchStart} onTouchEnd = {onTouchEnd} onTouchMove = {onTouchMove} className="message__icon"/>
        <Popper placement="left" open={showMessageContent} anchorEl={anchorEl}>
          <div className="message__box" onTouchStart={(e)=> {e.stopPropagation()}} onTouchEnd={(e)=> {e.stopPropagation()}} onTouchMove={(e)=> {e.stopPropagation()}}>
            {
              messagesList.map((message,index) => (
                <p key={index} className="message" data-index={index} onClick={outputMessage}>{message}</p>
              ))
            }
          </div>
        </Popper>
      </div>

      
      
      {showMessageWheel && <div className="message__wheel">
        <svg height="250" width="250" className="message__wheelSvg">
          <circle cx="125" cy="125" r="120" stroke="black" strokeWidth="5" fill="none" opacity="0.6"/>        
        </svg>
        {
          messagesList.map((message,index) => (
            <p key={index} className="message__inWheel" style={styleFunction(index)} data-index={index} onClick={outputMessage}>{message}</p>
          ))
        }
      </div>}
      
      
    </div>
  )
}

export default MessageWheel
