import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isSudoMirror: false,
  startPrice: 0,
  priceIncrement: 0,
  selectedRow: {},
  keyword: '',
  isPurchase: true,
  amount: 0,
  stakeAmount: 0,
}
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsSudoMirror: (ref, raction) => {
      const {payload: action} = raction
      ref.isSudoMirror = action
      return ref
    },
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
    setSelectedRow: (ref, raction) => {
      const {payload: action} = raction
      ref.selectedRow = action
      return ref
    },
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
    setStakeAmount: (ref, raction) => {
      const {payload: action} = raction
      ref.stakeAmount = action
      return ref
    },
  },
})

// Action creators are generated for each case reducer function
export const { setAmount, setIsPurchase, setIsSudoMirror, setKeyword, setPriceIncrement, setSelectedRow, setStakeAmount, setStartPrice } = userSlice.actions

export default userSlice.reducer