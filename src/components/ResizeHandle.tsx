import React from "react";

import { MEvent } from "@/types";

interface Props {
  side: string;
  onMouseDown: (e: MEvent, side: string) => void;
}
const ResizeHandle = ({ side, onMouseDown }: Props) => (
  <div
    className={`resize-handle side-${side}`}
    onMouseDown={(e) => onMouseDown(e, side)}
  />
);
export default ResizeHandle;
