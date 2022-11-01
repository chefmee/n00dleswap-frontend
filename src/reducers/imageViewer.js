import { createSlice } from '@reduxjs/toolkit'

export const imageViewerSlice = createSlice({
  name: 'viewedImage',
  initialState: '',
  reducers: {
    view: (ref, raction) => {
      const { payload: action } = raction
      ref = action
      return ref
    }
  },
})

// Action creators are generated for each case reducer function
export const { view } = imageViewerSlice.actions

export default imageViewerSlice.reducer