import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import * as Icons from "@mui/icons-material";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
// import { LabelledState } from "~/validators/prompt_log";
import {
  LabelledStateSchema,
  LabelledStateType,
} from "~/generated/prisma-client-zod.ts";

interface LabelStateIconsProps {
  logId: string;
  labelledState: string;
  cube?: boolean;
}

const labelStateIcons: { [key: string]: any } = {
  // UNLABELLED: [Icons.Unarchive, "default"],
  SELECTED: [Icons.ThumbUpOffAlt, "success"],
  REJECTED: [Icons.ThumbDownOffAlt, "error"],
  NOTSURE: [Icons.Help, "warn"],
};

const LabelIcons: React.FC<LabelStateIconsProps> = ({
  logId,
  labelledState,
  cube = false,
}) => {
  const labelStates = Object.keys(labelStateIcons);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(
    labelledState,
  );

  const mutation = api.log.updateLogLabel.useMutation();

  const handleLabelChange = (
    logId: string,
    newLabelState: LabelledStateType,
  ) => {
    mutation.mutate({ id: logId, labelledState: newLabelState });
    toast.success(
      `The label state has been successfully changed to "${newLabelState}".`,
    );
  };

  const handleIconClick = (state: LabelledStateType) => {
    setSelectedLabel(state);
    handleLabelChange(logId, state);
  };

  return (
    <div className="flex space-x-2">
      {labelStates.map((state) => {
        const color = labelStateIcons[state][1];
        const IconComponent = labelStateIcons[state][0];
        const isSelected = selectedLabel === state;

        return (
          <Tooltip key={state} title={state} arrow>
            <span>
              <IconButton
                color={isSelected ? color : "default"}
                onClick={() => handleIconClick(state as LabelledStateType)}
                // disabled={isSelected}
                disableFocusRipple={isSelected}
                // size={isSelected ? "large" : "small"}
                sx={
                  cube
                    ? {
                        color: "var(--sugarhub-text-color)",
                      }
                    : {
                        color: "default",
                      }
                }
              >
                <IconComponent />
              </IconButton>
            </span>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default LabelIcons;
