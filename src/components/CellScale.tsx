import { times } from "lodash-es";

import { builder } from "@/store";
interface Props {
  dir: "v" | "h";
  currentValue: number;
  size: number;
}
const CellScale = ({ dir, currentValue, size }: Props) => {
  return (
    <div className={`scale-${dir}`}>
      {times(size).map((n) => (
        <div
          key={n}
          style={
            n + 1 === currentValue
              ? {
                  backgroundColor: "rgba(189, 0, 0, .05)",
                  color: "rgb(189, 0, 0)",
                }
              : n + 1 === builder.gridSize[dir === "v" ? "h" : "w"]
              ? {
                  backgroundColor: "rgb(23, 162, 184, .35)",
                }
              : {}
          }
        >
          {n + 1}
        </div>
      ))}
    </div>
  );
};
export default CellScale;
