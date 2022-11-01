import { createSlice } from '@reduxjs/toolkit'

export const selectNFTSlice = createSlice({
  name: 'selectedNFTSwap',
  initialState: [],
  reducers: {
    select:  (ref, raction) => {
      const {payload: action} = raction
      if (!ref.includes(action.address + '|*|' + action.id+ '|*|'+ action.imageUrl +  '|*|' + action.name)) {
        if (ref[0] && ref[0]?.split('|*|')[0] !== action.address) {
          alert('Can only select NFTs from the same collection')
          return ref
        }
        ref.push(action.address + '|*|' + action.id+ '|*|' + action.imageUrl +  '|*|' + action.name)
      }
      else ref.splice(ref.indexOf(action.address + '|*|' + action.id+ '|*|' + action.imageUrl +  '|*|' + action.name), 1)
    },
    unselectAll: (ref) => {
      ref = []
      return ref
    } 
  },
})

// Action creators are generated for each case reducer function
export const { select, unselectAll } = selectNFTSlice.actions

export default selectNFTSlice.reducer