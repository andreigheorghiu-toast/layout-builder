import { useEffect, useState } from "react";

import { layout } from "@/store";
const EmptyPage = () => {
  const [className, setClassName] = useState("empty-page");
  useEffect(() => {
    setClassName(layout.makePageClassName("empty-page"));
  }, [layout.pageSize]);
  return <div className={className} />;
};
export default EmptyPage;
