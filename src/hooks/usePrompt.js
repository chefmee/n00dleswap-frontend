import { useDispatch } from "react-redux";
import { ModalTypes } from "../constants/modalTypes";
import { closeModal, setModalStatus } from "../reducers/modal";

let resolveCallback = () => {};

export const usePrompt = () => {
  const dispatch = useDispatch();
  const promptDialog = (message) => {
    dispatch(
      setModalStatus({
        type: ModalTypes.INFO,
        message,
      })
    );
    return new Promise((res) => {
        resolveCallback = res;
    })
  };

  const onConfirm = (inputValue) => {
    resolveCallback(inputValue);
    dispatch(closeModal());
  }

  const onCancel = () => {
    resolveCallback(null);
    dispatch(closeModal());
  }

  return { promptDialog, onConfirm, onCancel };
};
