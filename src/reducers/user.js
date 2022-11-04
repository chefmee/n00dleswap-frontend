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
  },
})

// Action creators are generated for each case reducer function
export const {  } = userSlice.actions

export default userSlice.reducer