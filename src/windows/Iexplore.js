import React from 'react';
import {
  WindowContent,
} from 'react95';

export default function IexploreWindow({setIexploreWindow, iframesrc}) {
  return (
    <div className='window-content'>
      <iframe width="100%" height={500} src={iframesrc}></iframe>
    </div>            
  )
}