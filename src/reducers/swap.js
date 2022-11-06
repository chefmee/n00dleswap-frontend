import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  keyword: '',
  isPurchase: true,
  amount: 0,
}
export const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setKeyword: (ref, raction) => {
      const {payload: action} = raction
      ref.keyword = action
      return ref
    },
    setIsPurchase: (ref, raction) => {
      const {payload: action} = raction
      ref.isPurchase = action
      return ref
    },
    setAmount: (ref, raction) => {
      const {payload: action} = raction
      ref.amount = action
      return ref
    },
  },
})

// Action creators are generated for each case reducer function
export const { setAmount, setIsPurchase, setKeyword } = swapSlice.actions

export default swapSlice.reducer