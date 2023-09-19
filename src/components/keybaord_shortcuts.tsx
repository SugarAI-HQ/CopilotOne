import React from 'react';
import { GlobalHotKeys } from 'react-hotkeys';

const KeyboardShortcuts = ({ children, onSave }) => {
  // Define the keymap for the save shortcut
  const keyMap = {
    SAVE: ['ctrl+s', 'command+s'], // Define the key combinations (Ctrl+S or Command+S)
  };

  // Define the handlers for the key combinations
  const handlers = {
    SAVE: (event) => {
      event.preventDefault();
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
