import React from "react";
import SvgIcon, { type SvgIconProps } from "./svg_icons";

export interface OpenMicSvgProps extends SvgIconProps {
  color?: string;
  style?: React.CSSProperties;
}

const OpenMic = (props: OpenMicSvgProps): React.ReactElement => {
  const newWidth = parseInt((props?.width ?? props?.size) as string);
  const newHeight = parseInt((props?.height ?? props?.size) as string);

  const barWidth = newWidth / 10;
  const barSpacing = barWidth / 2;

  return (
    <SvgIcon {...props}>
      <g fill="none">
        {[0, 1, 2, 3, 4].map((index) => (
          <rect
            key={index}
            x={
              index * (barWidth + barSpacing) +
              newWidth / 2 -
              2.5 * (barWidth + barSpacing)
            }
            y={newHeight * 0.2}
            width={barWidth}
            height={newHeight * 0.6}
            fill={props.color}
          >
            <animate
              attributeName="height"
              values={`${newHeight * 0.2};${newHeight * 0.8};${newHeight * 0.2}`}
              dur="1s"
              begin={`${index * 0.1}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values={`${newHeight * 0.4};${newHeight * 0.1};${newHeight * 0.4}`}
              dur="1s"
              begin={`${index * 0.1}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </g>
    </SvgIcon>
  );
};

export default OpenMic;
