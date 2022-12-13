import React from "react";
import { Rnd } from "react-rnd";
import { useWindowSize } from "@react-hook/window-size";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField, Window, WindowHeader } from "react95";
import { closeModal } from "../reducers/modal";
import { ModalTypes } from "../constants/modalTypes";
import { usePrompt } from "../hooks/usePrompt";

export function Modal() {
  const [inputValue, setInputValue] = React.useState("");
  const { message, type } = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const [width, height] = useWindowSize();
  const { onConfirm, onCancel } = usePrompt();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleConfirm = () => {
    onConfirm(inputValue);
  };
  const handleCancel = () => {
    onCancel();
  };

  const handleCloseButton = () => {
    dispatch(closeModal());
  };

  return (
    <Rnd
      default={{
        x: width / 2,
        y: height / 2,
        width: 300,
      }}
      minWidth={300}
      dragHandleClassName="window-header"
      maxWidth={"100vw"}
    >
      <Window style={{ width: "100%", height: "100%" }} className="window">
        <WindowHeader active={true} className="window-header">
          <span>
            {type === ModalTypes.SUCCESS
              ? "Success"
              : type === ModalTypes.ERROR
              ? "Error"
              : type === ModalTypes.INFO
              ? "Info"
              : ""}
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              gap: "0.25rem",
            }}
          >
            <Button onClick={handleCloseButton}>
              <span className="close-icon" />
            </Button>
          </div>
        </WindowHeader>
        <div>{message}</div>
        {type === ModalTypes.INFO && (
          <div>
            <TextField onChange={handleInputChange} type="number"></TextField>
            <Button onClick={handleConfirm}>Ok</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        )}
      </Window>
    </Rnd>
  );
}
