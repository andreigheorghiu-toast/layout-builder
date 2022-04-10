import { observer } from "mobx-react";
import { Builder, Layout } from "@/store";
import { CursorClickIcon, SelectorIcon, XIcon } from "@/components/async";
import { TrackSide } from "@/types";
import { ReactSortable } from "react-sortablejs";
import { useEffect, useRef } from "react";
import WidgetBox from "@/components/WidgetBox";
import GenericIcon from "@/components/GenericIcon";
import gsap from "gsap";
interface Props {
  layout: Layout;
  builder: Builder;
  side: TrackSide;
}
interface ListItem {
  id: string;
}

const toItem = (id: string): ListItem => ({ id });
const fromItem = ({ id }: ListItem): string => id;

const WidgetTrack = observer(({ layout, builder, side }: Props) => {
  const stores = { layout, builder };
  const track = useRef<HTMLDivElement>(null);
  const goToActive = () => {
    if (track.current instanceof HTMLDivElement) {
      const activeElement = track.current.querySelector(".isActive");
      if (activeElement) {
        const scrollTo = () =>
          gsap.to(track.current, {
            scrollTo: { y: activeElement, offsetY: 12 },
          });
        const closedActiveWidget = layout.allWidgets.find(
          (w) => w.id === layout.activeWidget && !w.isOpen
        );
        if (closedActiveWidget) {
          closedActiveWidget.isOpen = true;
          closedActiveWidget.update();
          setTimeout(scrollTo, 300);
        } else {
          scrollTo();
        }
      }
      layout.getsFocus = "";
    }
  };
  useEffect(() => {
    requestAnimationFrame(goToActive);
  }, [layout.activeWidget]);
  const toggleWidgets = () => {
    const shouldOpen = !!allWidgets.find((w) => !w.isOpen);
    layout.allWidgets.forEach((w) => {
      w.isOpen = shouldOpen;
      w.update();
    });
  };
  const closeWidgets = () => {
    layout.allWidgets.forEach((w) => {
      layout.removeWidget(w.id);
    });
  };

  const widgetExists = ({ id }: ListItem) =>
    layout.allWidgets.map(fromItem).includes(id);

  const trackClass = ["track-wrapper"]
    .concat(
      (side === "left" ? layout.isLeftTrackOpen : layout.isRightTrackOpen)
        ? ["open-track"]
        : []
    )
    .join(" ");

  const trackWidgets = layout.tracks[side].map(toItem).filter(widgetExists);
  const setTrackWidgets = (val: ListItem[]) => {
    layout.tracks[side] = val.filter(widgetExists).map(fromItem);
  };

  const allWidgets = layout.allWidgets.filter((w) =>
    trackWidgets.map(fromItem).includes(w.id)
  );

  const trackControls = [
    {
      icon: CursorClickIcon,
      onClick: goToActive,
    },
    {
      icon: SelectorIcon,
      onClick: toggleWidgets,
    },
    {
      icon: XIcon,
      onClick: closeWidgets,
    },
  ];
  return (
    <div className={trackClass}>
      <div className="widget-controls">
        {trackControls.map((item, key) => (
          <GenericIcon {...item} key={key} />
        ))}
      </div>
      <div className="widget-track">
        <div className="w-track" ref={track}>
          <ReactSortable
            className="list-group"
            group="widgets"
            animation={200}
            list={trackWidgets}
            setList={setTrackWidgets}
            handle=".drag-handle"
            onStart={() => (layout.isDragging = true)}
            onEnd={() => (layout.isDragging = false)}
          >
            {trackWidgets.map((item) => (
              <div className="list-item" key={item.id}>
                <WidgetBox widgetId={item.id} {...stores} />
              </div>
            ))}
          </ReactSortable>
        </div>
      </div>
    </div>
  );
});
export default WidgetTrack;
