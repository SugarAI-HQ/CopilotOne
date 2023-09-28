import React, {useState} from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import * as Icons from '@mui/icons-material';
import { api } from "~/utils/api";
import toast from 'react-hot-toast';

interface LabelStateIconsProps {
  logId: string;
  labelledState: string;
}

const labelStateIcons = {
  UNLABELLED: Icons.ThumbUp,
  SELECTED: Icons.CheckCircle,
  REJECTED: Icons.Cancel,
  NOTSURE: Icons.Help,
};


const LabelIcons: React.FC<LabelStateIconsProps> = ({ logId, labelledState }) => {
  const labelStates = Object.keys(labelStateIcons);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(labelledState);

  const mutation = api.log.updateLogLabel.useMutation();

  const handleLabelChange = (logId: string, newLabelState: string) => {
    mutation.mutate({ id: logId, labelledState: newLabelState });
    toast.success(`The label state has been successfully changed to "${newLabelState}".`);
  };

  const handleIconClick = (state: string) => {
    setSelectedLabel(state);
    handleLabelChange(logId, state)
  };

  return (
    <div className="flex space-x-2">
      {labelStates.map((state) => {
        const IconComponent = labelStateIcons[state];
        const isSelected = selectedLabel === state;

        return (
          <Tooltip key={state} title={state} arrow>
            <span>
              <IconButton
                size="small"
                onClick={() => handleIconClick(state)}
                disabled={isSelected}
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