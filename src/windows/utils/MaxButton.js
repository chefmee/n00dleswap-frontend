import { Button } from "react95";

export function MaxButton({changeFunction, target}) {
  return <div className="button" onClick={() => changeFunction(target)}>Max</div>
}