import React from 'react';

export default function IexploreWindow({setIexploreWindow, iframesrc}) {
  return (
    
              <div className='window-content'>
                <iframe width="100%" height={500} src={iframesrc}></iframe>
              </div>
            
  )
}