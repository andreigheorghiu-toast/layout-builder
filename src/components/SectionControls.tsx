import { omit } from "lodash-es";
import { reaction } from "mobx";
import { ChangeEvent, useEffect, useState } from "react";

import GridResizerDropdown from "@/components/GridResizerDropdown";
import { builder } from "@/store";
import { titleCase } from "@/util";
type ContainerInputType = "width" | "height";
const useContainerSize = (prop: ContainerInputType) => {
  const storeKey = `container${titleCase(prop)}` as
    | "containerWidth"
    | "containerHeight";
  const [value, setValue] = useState(builder[storeKey]);
  useEffect(
    reaction(() => builder[storeKey], setValue),
    []
  );
  return {
    type: "number",
    name: prop,
    value,
    onInput: (e: ChangeEvent<HTMLInputElement>): void => {
      builder[storeKey] = +e.target.value;
    },
  };
};

const SectionControls = () => {
  const containerInputs = [
    useContainerSize("width"),
    useContainerSize("height"),
  ];
  const addComponent = () => {
    builder.addComponent();
  };
  const resetInterval = () => {
    const section = builder.section;
    if (section) {
      builder.replaceSection(section.id, {
        ...section,
        grid: omit(section.grid, [builder.activeSectionInterval]),
        components: section.components.map((c) => ({
          ...c,
          grid: omit(c.grid, [builder.activeSectionInterval]),
        })),
      });
    }
  };
  return (
    <div className="section-editor">
      {containerInputs.map((input) => (
        <input {...input} key={input.name} />
      ))}
      <GridResizerDropdown />
      <button style={{ marginLeft: "1rem" }} onClick={addComponent}>
        Add component
      </button>
      <button style={{ marginLeft: "1rem" }} onClick={resetInterval}>
        Reset interval
      </button>
    </div>
  );
};
export default SectionControls;
