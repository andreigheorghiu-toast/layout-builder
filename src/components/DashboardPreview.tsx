import { pick } from "lodash-es";
import { reaction } from "mobx";
import { CSSProperties, useCallback, useEffect } from "react";
import { useRef, useState } from "react";

import ResizeHandle from "@/components/ResizeHandle";
import SectionControls from "@/components/SectionControls";
import SectionPreview from "@/components/SectionPreview";
import { builder, layout } from "@/store";
import { MEvent } from "@/types";

interface ResizeHandleProps {
  side: string;
  onMouseDown: (e: MEvent, side: string) => void;
}
const DashboardPreview = () => {
  const container = useRef<HTMLDivElement>(null);
  const [startPosition, setStartPosition] = useState({
    clientX: 0,
    clientY: 0,
    side: "",
    width: 0,
    height: 0,
  });
  const [isResizing, setIsResizing] = useState(false);
  const [containerWidth, setContainerWidth] = useState(builder.containerWidth);
  const [containerHeight, setContainerHeight] = useState(
    builder.containerHeight
  );
  const [containerStyle, setContainerStyle] = useState<CSSProperties>({});

  const onMouseUp = useCallback(() => {
    setIsResizing(false);
  }, [containerHeight, containerWidth, isResizing]);
  const onMouseDown = useCallback((e: MEvent, side: string) => {
    if (container.current instanceof HTMLDivElement) {
      setStartPosition({
        ...pick(e, ["clientX", "clientY"]),
        side,
        ...pick(container.current.getBoundingClientRect(), ["width", "height"]),
      });
      setIsResizing(true);
    }
  }, []);
  const onMouseMove = useCallback(
    (e: MEvent): void => {
      if (isResizing) {
        if (container.current instanceof HTMLDivElement) {
          if (startPosition.side === "bottom") {
            builder.containerHeight =
              startPosition.height - startPosition.clientY + e.clientY;
            setContainerHeight(builder.containerHeight);
          } else {
            builder.containerWidth =
              startPosition.width +
              (startPosition.clientX - e.clientX) *
                (startPosition.side === "left" ? 2 : -2);
            setContainerWidth(builder.containerWidth);
          }
        }
      }
    },
    [startPosition, containerWidth, containerHeight, isResizing]
  );

  useEffect(
    () =>
      reaction(
        () => [builder.containerWidth, builder.containerHeight],
        () => {
          setContainerStyle({
            maxWidth: builder.containerWidth + "px",
            maxHeight: builder.containerHeight
              ? builder.containerHeight + "px"
              : "auto",
          });
        }
      ),
    []
  );

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseUp);
    window.addEventListener("mouseenter", onMouseUp);
    if (container.current instanceof HTMLDivElement) {
      builder.containerWidth = container.current.clientWidth;
      builder.containerHeight = container.current.clientHeight;
    }
    if (!builder.dashboard.sections.length) {
      builder.addSection();
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseleave", onMouseUp);
      window.removeEventListener("mouseenter", onMouseUp);
    };
  }, [isResizing]);

  return (
    <>
      <SectionControls />
      <div
        ref={container}
        className={["responsive-container"]
          .concat(isResizing ? ["isResizing"] : [])
          .join(" ")}
        style={containerStyle}
      >
        {["left", "right", "bottom"]
          .map((side) => ({ side, onMouseDown }))
          .map((props: ResizeHandleProps) => (
            <ResizeHandle {...props} key={props.side} />
          ))}
        <SectionPreview builder={builder} layout={layout} />
      </div>
    </>
  );
};
export default DashboardPreview;
