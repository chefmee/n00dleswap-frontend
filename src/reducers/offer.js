import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  startPrice: 0,
  priceIncrement: 0,
  keyword: '',
  stakeAmount: 0,
}
export const offerSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    setStartPrice: (ref, raction) => {
      const {payload: action} = raction
      ref.startPrice = action
      return ref
    },
    setPriceIncrement: (ref, raction) => {
      const {payload: action} = raction
      ref.priceIncrement = action
      return ref
    },
    setKeyword: (ref, raction) => {
      const {payload: action} = raction
      ref.keyword = action
      return ref
    },
    setStakeAmount: (ref, raction) => {
      const {payload: action} = raction
      ref.stakeAmount = action
      return ref
    },
  },
})

// Action creators are generated for each case reducer function
export const { setKeyword, setPriceIncrement, setStakeAmount, setStartPrice } = offerSlice.actions

export default offerSlice.reducer