import { configureStore } from '@reduxjs/toolkit'
import selectNFTReducer from './reducers/selectNFT'

import selectNFTSwapReducer from './reducers/selectNFTSwap'
import openWindowReducer from './reducers/openWindow'
import imageViewerReducer from './reducers/imageViewer'
import swapReducer from './reducers/swap'
import offerReducer from './reducers/offer'
import poolReducer from './reducers/pool'
import modalReducer from './reducers/modal'

export default configureStore({
  reducer: {
    selectNFT: selectNFTReducer,
    selectNFTSwap: selectNFTSwapReducer,
    openWindow: openWindowReducer,
    imageViewer: imageViewerReducer,
    swap: swapReducer,
    offer: offerReducer,
    pool: poolReducer,
    modal: modalReducer,
  },
})