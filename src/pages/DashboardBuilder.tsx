import "@sinm/react-chrome-tabs/css/chrome-tabs.css";

import { useChromeTabs } from "@sinm/react-chrome-tabs";
import JSONEditor from "jsoneditor";
import { JsonEditor as Editor } from "jsoneditor-react";
import { isEqual } from "lodash-es";
import { autorun, reaction, values } from "mobx";
import { useEffect, useState } from "react";

import DashboardPreview from "@/components/DashboardPreview";
import { builder, layout } from "@/store";
import { useJsonEditor } from "@/util";
const DashboardBuilder = () => {
  const [className, setClassName] = useState("report-editor");
  const [editor, setEditor] = useState<JSONEditor | null>(null);
  useEffect(() => {
    autorun(() => {
      setClassName(layout.makePageClassName("report-editor"));
    });
  }, [layout.pageSize]);
  const [currentTab, setCurrentTab] = useState("preview");
  const { ChromeTabs, addTab, activeTab } = useChromeTabs({
    onTabActivated: (tabId) => {
      setCurrentTab(tabId);
      activeTab(tabId);
    },
    onTabClosed: () => false,
  });

  useEffect(
    () =>
      reaction(
        () => [currentTab, ...values(builder.dashboard)],
        () => {
          if (currentTab === "editor") {
            editor?.set(builder.dashboard);
          }
        },
        {
          equals: isEqual,
        }
      ),
    [editor]
  );
  useEffect(() => {
    let widget;
    switch (currentTab) {
      case "preview":
        widget = layout.allWidgets.find((w) => w.id === "responsiveness");
        if (widget) {
          layout.activeWidget = widget.id;
        }
        break;
      case "editor":
        widget = layout.allWidgets.find((w) => w.id === "section-builder");
        if (widget) {
          layout.activeWidget = widget.id;
        }
    }
  }, [currentTab]);
  useEffect(() => {
    addTab({ id: "editor", title: "Code Editor", favicon: false });
    addTab({ id: "preview", title: "Visual editor", favicon: false });
  }, []);

  const aceOptions = useJsonEditor({
    setEditor,
    props: {
      mode: "code",
      value: builder.dashboard,
    },
  });

  return (
    <div className={`${className} ${currentTab}`}>
      <ChromeTabs />
      <div className={["tab-panel", currentTab].join(" ")}>
        {currentTab === "editor" ? <Editor {...aceOptions} /> : null}
        {currentTab === "preview" ? <DashboardPreview /> : null}
      </div>
    </div>
  );
};
export default DashboardBuilder;
