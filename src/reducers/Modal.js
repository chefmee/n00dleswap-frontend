import { createSlice } from '@reduxjs/toolkit'
import { ModalTypes } from '../constants/modalTypes';

const initialState = ''
export const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    message: '',
    type: ModalTypes.SUCCESS
  },
  reducers: {
    setModalStatus: (ref, raction) => {
      const {payload: action} = raction
      ref.message = action.message;
      ref.type = action.type;
      return ref
    },
    closeModal: (ref, raction) => {
      ref.message = '';
      ref.type = ModalTypes.SUCCESS;
      return ref
    }
  },
})

// Action creators are generated for each case reducer function
export const { setModalStatus, closeModal } = modalSlice.actions

export default modalSlice.reducer