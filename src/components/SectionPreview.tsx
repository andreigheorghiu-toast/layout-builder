import { isEqual } from "lodash-es";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import {
  CSSProperties,
  DragEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import ComponentResizer from "@/components/ComponentResizer";
import { Builder, Layout } from "@/store";
import { MEvent } from "@/types";

interface Props {
  builder: Builder;
  layout: Layout;
}

const SectionPreview = observer(({ builder, layout }: Props) => {
  const container = useRef<null | HTMLDivElement>(null);
  const [decorators, setDecorators] = useState<CSSProperties[]>([]);
  const updateDecorators = (delay = 0) => {
    setTimeout(
      () =>
        requestAnimationFrame(() =>
          setDecorators(
            builder.boxes.map((_, index) => {
              if (container.current instanceof HTMLDivElement) {
                const el =
                  container.current.querySelectorAll(".component-handle")[
                    index
                  ];
                if (el) {
                  const cBox = container.current.getBoundingClientRect();
                  const eBox = el.getBoundingClientRect();
                  return {
                    width: `${eBox.width}px`,
                    height: `${eBox.height}px`,
                    transform: `translate(${eBox.left - cBox.left}px, ${
                      eBox.top - cBox.top
                    }px)`,
                  };
                }
              }
              return {};
            })
          )
        ),
      delay
    );
  };
  useEffect(updateDecorators, []);

  useEffect(
    () =>
      reaction(
        () => [
          builder.boxes,
          builder.indicatorStyle,
          builder.gridSize,
          builder.containerHeight,
          builder.containerWidth,
        ],
        () => updateDecorators(),
        { equals: isEqual }
      ),
    []
  );
  useEffect(
    () =>
      reaction(
        () => [builder.currentScreenSize, layout.pageSize],
        () => updateDecorators(300)
      ),
    []
  );

  useEffect(() => {
    window.addEventListener("mouseup", onDragEnd);
    return () => {
      window.removeEventListener("mouseup", onDragEnd);
    };
  }, []);

  const onDragOver = useCallback((e) => {
    e.dataTransfer.effectAllowed = "move";
    e.preventDefault();
  }, []);

  const onDragEnd = useCallback((e: MEvent) => {
    if (
      builder.draggedComponentId &&
      container.current instanceof HTMLDivElement
    ) {
      const bbox = container.current.getBoundingClientRect();
      const componentCell = builder.getComponentCell(
        builder.draggedComponentId
      );
      if (builder.activeSectionId && componentCell) {
        const indexX =
          Math.floor(((e.clientX - bbox.x) / bbox.width) * builder.gridSize.w) +
          1;
        const indexY =
          Math.floor(
            ((e.clientY - bbox.y) / bbox.height) * builder.gridSize.h
          ) + 1;
        if (
          builder.section &&
          !builder.section?.grid[builder.currentScreenSize]
        ) {
          builder.updateSection(builder.section.id, {
            grid: {
              [builder.currentScreenSize]: builder.gridSize,
            },
            components:
              builder.currentScreenSize !== builder.activeSectionInterval
                ? builder.sectionComponents.map((component) => ({
                    ...component,
                    grid: {
                      ...component.grid,
                      [builder.currentScreenSize]:
                        component.grid[builder.currentScreenSize] ||
                        component.grid[builder.activeSectionInterval],
                    },
                  }))
                : builder.sectionComponents,
          });
        }
        builder.updateComponent(builder.draggedComponentId, {
          grid: {
            [builder.currentScreenSize]: {
              x: builder.isResizing
                ? componentCell.x
                : builder.dragStart.c.x + indexX - builder.dragStart.x,
              y: builder.isResizing
                ? componentCell.y
                : builder.dragStart.c.y + indexY - builder.dragStart.y,
              w: builder.isResizing
                ? indexX - componentCell.x + 1
                : builder.dragStart.c.w,
              h: builder.isResizing
                ? indexY - componentCell.y + 1
                : builder.dragStart.c.h,
            },
          },
        });
      }
      builder.isResizing = false;
      builder.draggedComponentId = "";
    }
  }, []);

  const onDragMove: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    if (
      builder.draggedComponentId &&
      container.current instanceof HTMLDivElement
    ) {
      const bbox = container.current.getBoundingClientRect();
      if (bbox) {
        const pX = (e.clientX - bbox.x) / bbox.width;
        const indexX = Math.floor(pX * builder.gridSize.w) + 1;
        const pY = (e.clientY - bbox.y) / bbox.height;
        const indexY = Math.floor(pY * builder.gridSize.h) + 1;
        builder.indicatorStyle = {
          gridColumn: builder.isResizing
            ? `${builder.dragStart.c.x}/${indexX + 1}`
            : `${builder.dragStart.c.x + indexX - builder.dragStart.x}/${
                builder.dragStart.c.x +
                builder.dragStart.c.w +
                indexX -
                builder.dragStart.x
              }`,
          gridRow: builder.isResizing
            ? `${builder.dragStart.c.y}/${indexY + 1}`
            : `${builder.dragStart.c.y + indexY - builder.dragStart.y}/${
                builder.dragStart.c.y +
                builder.dragStart.c.h +
                indexY -
                builder.dragStart.y
              }`,
        };
      }
    }
  }, []);

  return (
    <div
      {...{
        key: "section-preview-container",
        ref: container,
        className: builder.dashboardClassName,
        onDragOver,
        onMouseMove: onDragMove,
      }}
    >
      {builder.boxes.map((box, index) => {
        return (
          <div
            key={`i-${box.id}`}
            className="decorator"
            style={decorators[index]}
          >
            {"c-" + (index + 1)}
          </div>
        );
      })}
      {builder.sectionComponentsIds.map((componentId) => (
        <ComponentResizer
          {...{
            componentId,
            container: container.current,
          }}
          key={componentId}
        />
      ))}
    </div>
  );
});

export default SectionPreview;
