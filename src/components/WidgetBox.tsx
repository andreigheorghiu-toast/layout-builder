import React, { useState, Suspense, useEffect } from "react";
import { Builder, Layout } from "@/store";
import GenericIcon from "@/components/GenericIcon";
import { ArrowsExpandIcon, SelectorIcon, XIcon } from "@/components/async";
import { Collapse } from "react-collapse";
import { pick } from "lodash-es";
import { prevent, stop } from "@/util";
import { MEvent } from "@/types";

interface Props {
  widgetId: string;
  layout: Layout;
  builder: Builder;
}
const WidgetBox = ({ widgetId, layout, builder }: Props) => {
  const widget = layout.allWidgets.find((w) => w.id === widgetId);
  const [isOpen, setIsOpen] = useState(widget?.isOpen || false);
  const stores = { layout, builder };
  const [isActive, setIsActive] = useState(layout.activeWidget === widgetId);
  const open = () => {
    if (isOpen) {
      if (!isActive) {
        layout.activeWidget = widgetId;
      }
    } else {
      setIsOpen(true);
      layout.activeWidget = widgetId;
    }
  };

  const close = (e: MEvent) => {
    prevent(stop(e));
    layout.removeWidget(widgetId);
  };
  const toggle = (e: MEvent) => {
    prevent(stop(e));
    if (widget) {
      widget.toggle();
      setIsOpen(widget.isOpen || false);
    }
  };
  const widgetActions = [
    {
      icon: ArrowsExpandIcon,
      className: "drag-handle",
      onClick: (e: MEvent) => prevent(stop(e)),
    },
    {
      icon: SelectorIcon,
      onClick: (e: MEvent) => toggle(e),
    },
    {
      icon: XIcon,
      onClick: (e: MEvent) => close(e),
    },
  ];

  const widgetClassName = ["widget", [widgetId]]
    .concat(isOpen ? ["isOpen"] : [])
    .concat(isActive ? ["isActive"] : [])
    .join(" ");

  useEffect(() => {
    setIsOpen(widget?.isOpen || false);
  }, [widget?.isOpen]);
  useEffect(() => {
    setIsActive(layout.activeWidget === widgetId);
  }, [layout.activeWidget]);

  return (
    <div className={widgetClassName} onClick={open}>
      <div className="w-top">
        {widget ? (
          <>
            <GenericIcon icon={widget.icon} />
            <div className="w-title">{widget.title}</div>
            <div className="w-actions">
              {widgetActions.map((item, key) => (
                <GenericIcon {...item} key={key} />
              ))}
            </div>
          </>
        ) : null}
      </div>
      <Collapse isOpened={isOpen}>
        <div className="w-body">
          {widget?.component ? (
            <Suspense fallback={<>...</>}>
              <widget.component
                {...pick(stores, widget.stores)}
                key="whatever"
              />
            </Suspense>
          ) : null}
        </div>
      </Collapse>
    </div>
  );
};

export default WidgetBox;
