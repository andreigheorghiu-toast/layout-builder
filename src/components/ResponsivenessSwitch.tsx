import { screenSizes } from "@/util";
import { Builder } from "@/store";
import ReactSlider from "react-slider";
import { observer } from "mobx-react";
interface Props {
  builder: Builder;
}
const ResponsivenessSwitch = observer(({ builder }: Props) => {
  const setContainerWidth = (width: number) => {
    builder.containerWidth = width - 1;
  };
  return (
    <div>
      <div className="toggle-switch">
        {screenSizes.map((interval) => (
          <div
            key={interval.id}
            className={interval.id === builder.currentScreenSize ? "active" : ""}
            onClick={() => setContainerWidth(interval.to)}
          >
            {interval.id}
          </div>
        ))}
      </div>
      <ReactSlider max={1920} min={240} minDistance={1} />
    </div>
  );
});
export default ResponsivenessSwitch;
