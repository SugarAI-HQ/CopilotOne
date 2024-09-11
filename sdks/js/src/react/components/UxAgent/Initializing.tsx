import { type FC } from "react";
import "~/react/styles/form.css";

const Initializing: FC = () => {
  return (
    <div className="sai-vf-welcome-message flex items-center justify-center h-scree">
      <span className="blinking-cursor">|</span>
    </div>
  );
};

export default Initializing;
