import { WindowContent } from "react95";
import { useSelector } from "react-redux";

export function ImagePreview() {
  const imageSrc = useSelector((state) => state.imageViewer)
  return (
    <WindowContent>
      <img src={imageSrc} style={{maxWidth:400}}></img>
    </WindowContent>
  )
}