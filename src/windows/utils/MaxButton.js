import { Button } from "react95";

export function MaxButton({changeFunction, target}) {
  return <Button onClick={() => changeFunction(target)}>Max</Button>
}