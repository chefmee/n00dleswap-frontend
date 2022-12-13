import { createSlice } from '@reduxjs/toolkit'

export const selectNFTSlice = createSlice({
  name: 'selectedNFTs',
  initialState: {
    selectNFTs: [],
    isSameCollection: true,
  },
  reducers: {
    select:  (ref, raction) => {
      const {payload: action} = raction
      if (!ref.selectNFTs.includes(action.address + '|*|' + action.id+ '|*|'+ action.imageUrl +  '|*|' + action.name)) {
        if (ref.selectNFTs[0] && ref.selectNFTs[0]?.split('|*|')[0] !== action.address) {
          ref.isSameCollection = false;
          // alert('Can only select NFTs from the same collection')
          return ref
        }
        ref.selectNFTs.push(action.address + '|*|' + action.id+ '|*|' + action.imageUrl +  '|*|' + action.name)
      }
      else ref.selectNFTs.splice(ref.selectNFTs.indexOf(action.address + '|*|' + action.id+ '|*|' + action.imageUrl +  '|*|' + action.name), 1)
      ref.isSameCollection = true;
    },
    unselectAll: (ref) => {
      ref.selectNFTs = []
      return ref
    } 
  },
})

// Action creators are generated for each case reducer function
export const { select, unselectAll } = selectNFTSlice.actions

export default selectNFTSlice.reducer