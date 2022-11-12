import React from "react";
import { Rnd } from "react-rnd";
import { Button, Window, WindowHeader } from "react95";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../reducers/errorDialog";
import { useWindowSize } from "@react-hook/window-size";

export function ErrorModal() {
    const [width, height] = useWindowSize();
    const dispatch = useDispatch();
    const error = useSelector((state) => state.error);
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
          <span>Error</span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              gap: "0.25rem",
            }}
          >
            <Button
              onClick={(event) => {
                dispatch(setError(""));
              }}
            >
              <span className="close-icon" />
            </Button>
          </div>
        </WindowHeader>
        <div
          style={{
            overflowY: "scroll",
            overflowX: "hidden",
            height: "calc(100% - 2.5em)",
          }}
        >
          {error}
        </div>
      </Window>
    </Rnd>
  );
}
