import React from "react";

interface Props {
  side: string;
  onMouseDown: (e: MouseEvent | React.MouseEvent, side: string) => void;
}
const ResizeHandle = ({ side, onMouseDown }: Props) => {
  return (
    <div
      className={`resize-handle side-${side}`}
      onMouseDown={(e) => onMouseDown(e, side)}
    />
  );
};
export default ResizeHandle;
