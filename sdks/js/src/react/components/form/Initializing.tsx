import React from "react";
import "~/react/styles/form.css";

export const Initializing: React.FC = () => {
  return (
    <div className="sai-vf-welcome-message flex items-center justify-center h-[85dvh]">
      <span className="blinking-cursor">|</span>
    </div>
  );
};

export default Initializing;
