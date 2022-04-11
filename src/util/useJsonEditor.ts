import JSONEditor from "jsoneditor";
import { isEqual } from "lodash-es";
import { Dispatch, SetStateAction } from "react";

import { builder } from "@/store";
import { Dashboard } from "@/types";

export const useJsonEditor = ({
  setEditor,
  props,
}: {
  setEditor: Dispatch<SetStateAction<JSONEditor | null>>;
  props: Record<string, unknown>;
}) => {
  const handleEditorChange = (val: Dashboard) => {
    if (!isEqual(val, builder.dashboard)) {
      builder.dashboard = val;
    }
  };
  const setEditorRef = (instance?: { jsonEditor: JSONEditor }) => {
    setEditor(instance?.jsonEditor || null);
  };

  return {
    theme: "ace/theme/tomorrow_night_eighties",
    ref: setEditorRef,
    onChange: handleEditorChange,
    ...props,
  };
};
