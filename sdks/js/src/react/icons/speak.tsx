import React from "react";
import SvgIcon, { type SvgIconProps } from "./svg_icons";

export interface OpenMicSvgProps extends SvgIconProps {
  color?: string;
  style?: React.CSSProperties;
}

const Speak = (props: OpenMicSvgProps): React.ReactElement => {
  const newWidth = parseInt((props?.width ?? props?.size) as string);
  const newHeight = parseInt((props?.height ?? props?.size) as string);
  const centerX = newWidth / 2;
  const centerY = newHeight / 2;
  const color = props.color;

  return (
    <SvgIcon {...props}>
      <g fill="none">
        <polygon
          points={`${centerX - 10},${centerY - 8} ${centerX - 2},${centerY - 8} ${centerX + 2},${centerY - 12} ${centerX + 2},${centerY + 12} ${centerX - 2},${centerY + 8} ${centerX - 10},${centerY + 8}`}
          fill={color}
        />

        {/* Animated sound waves */}
        {[0.5, 1, 1.5].map((scale, index) => (
          <circle
            key={index}
            cx={centerX + 2}
            cy={centerY}
            r={scale * 4}
            fill="none"
            stroke={color}
            strokeWidth="1"
          >
            <animate
              attributeName="r"
              values={`4;${scale * 12}`}
              dur="1.5s"
              begin={`${index * 0.5}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0"
              dur="1.5s"
              begin={`${index * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </SvgIcon>
  );
};

export default Speak;
