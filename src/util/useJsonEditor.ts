import { Dispatch, SetStateAction } from "react";
import JSONEditor from "jsoneditor";
import { Dashboard } from "@/types";
import { isEqual } from "lodash-es";
import { builder } from "@/store";

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
