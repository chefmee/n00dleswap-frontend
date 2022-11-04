import { configureStore } from '@reduxjs/toolkit'
import selectNFTReducer from './reducers/selectNFT'

import selectNFTSwapReducer from './reducers/selectNFTSwap'
import openWindowReducer from './reducers/openWindow'
import imageViewerReducer from './reducers/imageViewer'
import userReducer from './reducers/user'

export default configureStore({
  reducer: {
    selectNFT: selectNFTReducer,
    selectNFTSwap: selectNFTSwapReducer,
    openWindow: openWindowReducer,
    imageViewer: imageViewerReducer,
    user: userReducer,
  },
})