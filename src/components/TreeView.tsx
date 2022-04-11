import JSONEditor from "jsoneditor";
import { JsonEditor as Editor } from "jsoneditor-react";
import { isEqual } from "lodash-es";
import { reaction } from "mobx";
import { useEffect, useState } from "react";

import { builder } from "@/store";
import { useJsonEditor } from "@/util";

const TreeView = () => {
  const [editor, setEditor] = useState<JSONEditor | null>(null);
  const aceOptions = useJsonEditor({
    setEditor,
    props: {
      mode: "tree",
      value: builder.section,
    },
  });
  useEffect(
    () =>
      reaction(
        () => [builder.section],
        () => {
          editor?.set(builder.section);
        },
        { equals: isEqual }
      ),
    [editor]
  );
  return <Editor {...aceOptions} />;
};

export default TreeView;
