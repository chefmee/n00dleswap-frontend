import { createSlice } from '@reduxjs/toolkit'
import { ModalTypes } from '../constants/modalTypes';

export const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    message: '',
    type: ModalTypes.INITIAL,
  },
  reducers: {
    setModalStatus: (ref, raction) => {
      const {payload: action} = raction
      ref.message = action.message;
      ref.type = action.type;
      return ref
    },
    closeModal: (ref) => {
      ref.message = '';
      ref.type = ModalTypes.INITIAL;
      return ref
    },
  },
})

// Action creators are generated for each case reducer function
export const { setModalStatus, closeModal } = modalSlice.actions

export default modalSlice.reducer