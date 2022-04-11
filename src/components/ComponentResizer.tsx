import { omit } from "lodash-es";
import { reaction, toJS } from "mobx";
import { CSSProperties, useCallback, useEffect, useState } from "react";

import { XIcon } from "@/components/async";
import GenericIcon from "@/components/GenericIcon";
import { builder } from "@/store";
import { MEvent, Section } from "@/types";
import { prevent, preventStop, stop } from "@/util";

interface Props {
  componentId: string;
  container: HTMLDivElement | null;
}
const ComponentResizer = ({ componentId, container }: Props) => {
  const getComponentStyle = () =>
    builder.draggedComponentId === componentId
      ? toJS(builder.indicatorStyle)
      : toJS(builder.componentStyle(componentId));

  const [className, setClassName] = useState(
    builder.componentClassName(componentId)
  );
  const [isFixed, setIsFixed] = useState(builder.isComponentFixed(componentId));
  const [componentStyle, setComponentStyle] = useState<CSSProperties>(
    getComponentStyle()
  );

  useEffect(
    () =>
      reaction(
        () => [
          builder.draggedComponentId,
          isFixed,
          builder.indicatorStyle,
          builder.gridSize,
          builder.currentScreenSize,
        ],
        () => setClassName(builder.componentClassName(componentId))
      ),
    []
  );

  useEffect(
    () =>
      reaction(
        () => [builder.sectionComponents.find((c) => c.id === componentId)],
        () => setIsFixed(builder.isComponentFixed(componentId))
      ),
    []
  );

  useEffect(
    () =>
      reaction(
        () => [
          builder.draggedComponentId,
          builder.indicatorStyle,
          builder.componentStyle(componentId),
        ],
        () => setComponentStyle(getComponentStyle())
      ),
    []
  );

  const onDragStart = useCallback((e: MEvent) => {
    builder.draggedComponentId = componentId;
    if (container instanceof HTMLDivElement) {
      const bbox = container.getBoundingClientRect();
      if (bbox) {
        const pX = (e.clientX - bbox.x) / bbox.width;
        const pY = (e.clientY - bbox.y) / bbox.height;
        builder.dragStart = {
          x: Math.floor(pX * builder.gridSize.w) + 1,
          y: Math.floor(pY * builder.gridSize.h) + 1,
          c: builder.getComponentCell(componentId),
        };
      }
    }
  }, []);

  const resizeHandleEvents = {
    onMouseDown: (e: MEvent) => {
      prevent(stop(e));
      builder.startResize(componentId);
    },
    onMouseUp: preventStop,
  };

  const resizeActionsEvents = {
    onMouseDown: preventStop,
    onMouseUp: preventStop,
  };

  const removeInterval = () => {
    requestAnimationFrame(() => {
      const dash = toJS(builder.dashboard);
      const sectionIndex = dash.sections.findIndex(
        (s) => s.id === builder.activeSectionId
      );
      const section = toJS(builder.section) as Section;
      const componentIndex = section.components.findIndex(
        (c) => c.id === componentId
      );
      const component = toJS(builder.sectionComponents[componentIndex]);
      if (sectionIndex > -1 && componentIndex > -1) {
        if (builder.currentScreenSize === builder.gridSourceInterval) {
          component.grid = omit(component.grid, [builder.currentScreenSize]);
          section.components.splice(componentIndex, 1, component);
        } else {
          section.grid[builder.currentScreenSize] =
            section.grid[builder.gridSourceInterval];
          section.components = section.components.map((c) => ({
            ...c,
            grid: {
              ...c.grid,
              [builder.currentScreenSize]:
                c.id === component.id
                  ? undefined
                  : c.grid[builder.gridSourceInterval],
            },
          }));
        }
        dash.sections.splice(sectionIndex, 1, section);
        builder.dashboard = dash;
        builder.indicatorStyle = {};
      }
    });
  };

  return (
    <div className={className} style={componentStyle} onMouseDown={onDragStart}>
      <div className="component-resize-handle" {...resizeHandleEvents} />
      <div className="resize-actions" {...resizeActionsEvents}>
        {isFixed ? <GenericIcon icon={XIcon} onClick={removeInterval} /> : null}
      </div>
    </div>
  );
};
export default ComponentResizer;
