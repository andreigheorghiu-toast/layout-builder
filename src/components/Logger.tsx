import { isEqual } from "lodash-es";
import { reaction } from "mobx";
import { useEffect, useState } from "react";

import { builder } from "@/store";

const Logger = () => {
  const [value, setValue] = useState({
    dash: builder.dashboard,
    sizes: builder.availableScreenSizes,
  });
  useEffect(
    () =>
      reaction(
        () => [builder.section, builder.availableScreenSizes],
        () =>
          setValue({
            dash: builder.dashboard,
            sizes: builder.availableScreenSizes,
          }),
        { equals: isEqual }
      ),
    []
  );
  return (
    <div>
      <pre
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(value, null, 2),
        }}
      />
    </div>
  );
};
export default Logger;
