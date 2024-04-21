import React from "react";

export interface SpinnerProps {
  size?: string;
  className?: string;
  color?: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

const Spinner: React.FC<SpinnerProps> = ({
  className,
  color = "#000",
  size = "60",
  width,
  height,
  style,
}): React.ReactElement => {
  const newWidth = width ?? size;
  const newHeight = height ?? size;
  return (
    <svg
      width={newWidth}
      height={newHeight}
      viewBox={`0 0 ${newWidth} ${newWidth}`}
      // preserveAspectRatio="xMidYMid"
      style={{ background: "none", ...style }}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="36"
        cy="36"
        r="32"
        stroke={color}
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="2s"
          repeatCount="indefinite"
          from="502" // Reverse direction
          to="0" // Reverse direction
          fill={color}
        />
        <animate
          attributeName="stroke-dasharray"
          dur="2s"
          repeatCount="indefinite"
          values="150.6 100.4;1 250;150.6 100.4"
          fill={color}
        />
      </circle>
    </svg>
  );
};

export default Spinner;
