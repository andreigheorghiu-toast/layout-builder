import { omit } from "lodash-es";
import { LazyExoticComponent, Suspense } from "react";

import { MEvent } from "@/types";

interface Props {
  icon: LazyExoticComponent<any>;
  className?: string;
  onClick?: (e: MEvent) => void;
}

const GenericIcon = (props: Props) => {
  const className = [props.className || "", "generic-icon"].join(" ");
  return (
    <div {...omit(props, ["icon"])} className={className}>
      <Suspense fallback={<>...</>}>
        <props.icon />
      </Suspense>
    </div>
  );
};
export default GenericIcon;
