import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isSudoMirror: false,
  startPrice: 0,
  priceIncrement: 0,
  selectedRow: {},
}
export const poolSlice = createSlice({
  name: 'pool',
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
  },
})

// Action creators are generated for each case reducer function
export const { setIsSudoMirror, setPriceIncrement, setStartPrice, setSelectedRow } = poolSlice.actions

export default poolSlice.reducer