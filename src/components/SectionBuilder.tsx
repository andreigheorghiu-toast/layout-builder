import { builder } from "@/store";
import { getItemTitle } from "@/util";
import { reaction } from "mobx";
import { CellPayload, ScreenSizeType, TableField } from "@/types";
import { useEffect, useState } from "react";
import { isEqual } from "lodash-es";
import RowActions from "@/components/RowActions";

const SectionBuilder = () => {
  const fields: TableField[] = [
    { id: "position", title: "No." },
    { id: "interval", title: "Scr." },
    { id: "size" },
    { id: "gap" },
    { id: "actions", title: "..." },
  ];

  const getFieldValue = ({
    field,
    gridKey,
    value,
    gridIndex,
    section,
    sectionIndex,
  }: CellPayload) => {
    switch (field.id) {
      case "position":
        return !gridIndex ? `${sectionIndex + 1}` : "";
      case "interval":
        return gridKey;
      case "size":
        return value && `${value.w}×${value.h}`;
      case "gap":
        return `${section.gap}`;
      case "actions":
        return <RowActions {...{ gridIndex, gridKey, section }} />;
      default:
        return null;
    }
  };
  const [sections, setSections] = useState(builder.dashboard.sections);
  useEffect(
    () =>
      reaction(
        () => builder.dashboard.sections,
        () => {
          setSections(builder.dashboard.sections);
        },
        { equals: isEqual }
      ),
    []
  );

  return (
    <div className="section-builder-widget">
      <button onClick={() => builder.addSection()}>Add new section</button>
      <table className="sections-table">
        <thead>
          <tr>
            {fields.map((field) => (
              <th key={field.id}>{getItemTitle(field)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sections.map((section, sectionIndex) =>
            Object.entries(section.grid).map(([gridKey, value], gridIndex) =>
              gridKey ? (
                <tr key={`${sectionIndex}-${gridIndex}`}>
                  {fields.map((field) => (
                    <td key={field.id}>
                      {getFieldValue({
                        field,
                        gridKey: gridKey as ScreenSizeType,
                        value,
                        gridIndex,
                        section,
                        sectionIndex,
                      })}
                    </td>
                  ))}
                </tr>
              ) : null
            )
          )}
        </tbody>
      </table>
    </div>
  );
};
export default SectionBuilder;
