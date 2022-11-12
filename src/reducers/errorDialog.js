import { createSlice } from '@reduxjs/toolkit'

const initialState = ''
export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (ref, raction) => {
      const {payload: action} = raction
      ref = action;
      return ref
    },
  },
})

// Action creators are generated for each case reducer function
export const { setError } = errorSlice.actions

export default errorSlice.reducer