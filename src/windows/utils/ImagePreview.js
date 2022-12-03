import { WindowContent } from "react95";
import { useSelector } from "react-redux";

export function ImagePreview() {
  const imageSrc = useSelector((state) => state.imageViewer)
  return (
    <div className="window-content">
      <img src={imageSrc} style={{maxWidth:400}}></img>
    </div>
  )
}