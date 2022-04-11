import { omit } from "lodash-es";

import { PencilIcon, XIcon } from "@/components/async";
import GenericIcon from "@/components/GenericIcon";
import { builder } from "@/store";
import { CellPayload } from "@/types";

const RowActions = ({ gridIndex, gridKey, section }: Partial<CellPayload>) => {
  const removeGridInterval = ({
    gridIndex,
    gridKey,
    section,
  }: Partial<CellPayload>) => {
    if (section && gridKey) {
      if (!gridIndex) {
        builder.removeSection(section.id);
      } else {
        builder.replaceSection(section.id, {
          ...section,
          grid: omit(section.grid, [gridKey]),
        });
      }
    }
  };

  const editSection = (id: string) => {
    builder.activeSectionId = id;
  };
  return (
    <div className="row-actions">
      {section && !gridIndex ? (
        <GenericIcon
          {...{
            key: "edit",
            className: "edit",
            icon: PencilIcon,
            onClick: () => editSection(section.id),
          }}
        />
      ) : null}
      <GenericIcon
        {...{
          key: "delete",
          icon: XIcon,
          className: "delete",
          onClick: () => removeGridInterval({ gridIndex, gridKey, section }),
        }}
      />
    </div>
  );
};
export default RowActions;
