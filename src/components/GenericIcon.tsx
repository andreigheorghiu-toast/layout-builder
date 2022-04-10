import { LazyExoticComponent, Suspense } from "react";
import { MEvent } from "@/types";

interface Props {
  icon: LazyExoticComponent<any>;
  className?: string;
  onClick?: (e: MEvent) => void;
}

const GenericIcon = (props: Props) => {
  const className = [props.className || "", "generic-icon"].join(" ");
  const { icon, ...rest } = props;
  return (
    <div {...rest} className={className}>
      <Suspense fallback={<>...</>}>
        <props.icon />
      </Suspense>
    </div>
  );
};
export default GenericIcon;
