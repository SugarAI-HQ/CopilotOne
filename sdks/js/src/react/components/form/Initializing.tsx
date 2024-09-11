import React from "react";
import "~/react/styles/form.css";
import { type FC } from "react";

export const Initializing: FC = () => {
  return (
    <div className="sai-vf-welcome-message flex items-center justify-center h-[85dvh]">
      <span className="blinking-cursor">|</span>
    </div>
  );
};

export default Initializing;
