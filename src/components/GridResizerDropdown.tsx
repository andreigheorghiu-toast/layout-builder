import { times } from "lodash-es";
import { reaction } from "mobx";
import { ChangeEvent, CSSProperties, useEffect, useState } from "react";
import { ArrowContainer, Popover } from "react-tiny-popover";

import { ChevronDownIcon } from "@/components/async";
import CellScale from "@/components/CellScale";
import GenericIcon from "@/components/GenericIcon";
import { builder } from "@/store";

const GridResizerDropdown = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => reaction(() => builder.gridSize.w, setGridWidth), []);
  useEffect(() => reaction(() => builder.gridSize.h, setGridHeight), []);
  const [gridWidth, setGridWidth] = useState(builder.gridSize.w);
  const [gridHeight, setGridHeight] = useState(builder.gridSize.h);
  const setGridSize = (h: number, w: number) => {
    const section = builder.section;
    if (section) {
      builder.updateSection(section.id, {
        grid: {
          [builder.currentScreenSize]: { h, w },
        },
      });
    }
  };
  const updateWidth = (e: ChangeEvent<HTMLInputElement>): void => {
    const val = +e.target.value;
    const section = builder.section;
    if (section) {
      builder.updateSection(section.id, {
        grid: {
          [builder.currentScreenSize]: {
            h: Math.max(
              section.grid[builder.gridSourceInterval]?.h || 1,
              Math.ceil(section.components.length / val)
            ),
            w: val,
          },
        },
      });
    }
  };
  const updateHeight = (e: ChangeEvent<HTMLInputElement>) => {
    const val = +e.target.value;
    const section = builder.section;
    if (section) {
      builder.updateSection(section.id, {
        grid: {
          [builder.currentScreenSize]: {
            w: Math.max(
              section.grid[builder.gridSourceInterval]?.w || 1,
              Math.ceil(section.components.length / val)
            ),
            h: val,
          },
        },
      });
    }
  };

  const [gridStyle, setGridStyle] = useState<CSSProperties>({});
  useEffect(
    () =>
      reaction(
        () => [builder.gridSize.w, builder.gridSize.h],
        () => {
          setGridStyle({
            width: `calc(var(--cell-size) * ${builder.gridSize.w})`,
            height: `calc(var(--cell-size) * ${builder.gridSize.h})`,
          });
        }
      ),
    []
  );

  const getCellStyle = (h: number, w: number) =>
    h === gridHeight && w === gridWidth
      ? { border: "1px solid rgb(189, 0, 0)" }
      : (h === gridHeight && w <= gridWidth) ||
        (w === gridWidth && h <= gridHeight)
      ? { backgroundColor: "rgba(189, 0, 0, .05)" }
      : {};

  const min = (val: number, limit = 1) => Math.max(val, limit);

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={["bottom"]}
      padding={0}
      onClickOutside={() => setIsPopoverOpen(false)}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor="white"
          arrowSize={10}
          arrowStyle={{ opacity: 1 }}
          className="popover-arrow-container"
          arrowClassName="popover-arrow"
        >
          <div className="popover-content">
            <div
              className="grid-resizer"
              style={{ "--cell-size": "1.3rem" } as CSSProperties}
            >
              <CellScale
                dir="v"
                currentValue={gridHeight}
                size={(builder.section?.components.length || 3) + 4}
              />
              <CellScale dir="h" currentValue={gridWidth} size={24} />
              <div className="the-grid">
                <span className="currentSize" style={gridStyle} />
                {times((builder.section?.components.length || 3) + 4).map(
                  (m) => (
                    <div key={m}>
                      {times(24).map((n) => (
                        <div
                          key={n}
                          onClick={() => {
                            setGridSize(min(m + 1), min(n + 1));
                            setIsPopoverOpen(false);
                          }}
                          style={getCellStyle(min(m + 1), min(n + 1))}
                          onMouseEnter={() => {
                            setGridWidth(min(n + 1));
                            setGridHeight(min(m + 1));
                          }}
                        />
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </ArrowContainer>
      )}
    >
      <div
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        className="grid-resizer"
      >
        <code style={{ marginLeft: "1rem" }}>grid</code>
        <GenericIcon icon={ChevronDownIcon} />
        <input
          value={builder.gridSize.w}
          onInput={updateWidth}
          type="number"
          className="drop-input"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
        <input
          value={builder.gridSize.h}
          onInput={updateHeight}
          type="number"
          className="drop-input"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      </div>
    </Popover>
  );
};

export default GridResizerDropdown;
