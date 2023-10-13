import React, { ReactNode, KeyboardEvent } from "react";
import { GlobalHotKeys, KeyMap } from "react-hotkeys";

interface KeyboardShortcutsProps {
  children: ReactNode;
  onSave: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  children,
  onSave,
}) => {
  // Define the keymap for the save shortcut
  const keyMap: KeyMap = {
    SAVE: ["ctrl+s", "command+s"], // Define the key combinations (Ctrl+S or Command+S)
  };

  // Define the handlers for the key combinations
  const handlers:
    | {
        [key: string]: (
          keyEvent?: globalThis.KeyboardEvent | undefined,
        ) => void;
      }
    | undefined = {
    SAVE: (keyEvent?: globalThis.KeyboardEvent | undefined) => {
      keyEvent?.preventDefault();
      onSave(); // Call the onSave function when the shortcut is triggered
    },
  };

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
      {/* This component will listen for the defined shortcut */}
      {children}
    </GlobalHotKeys>
  );
};

export default KeyboardShortcuts;
