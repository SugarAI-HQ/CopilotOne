import React from "react";
import SvgIcon, { type SvgIconProps } from "./svg_icons";

export interface LoaderSvgProps extends SvgIconProps {
  color?: string;
}

const Loader = (props: LoaderSvgProps): React.ReactElement => {
  return (
    <SvgIcon {...props}>
      <circle
        cx="14"
        cy="14"
        r="12"
        stroke={props.color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke-dasharray"
          dur="2s"
          repeatCount="indefinite"
          values="150.6 100.4;1 250;150.6 100.4"
          fill={props.color}
        />
      </circle>
    </SvgIcon>
  );
};

export default Loader;
