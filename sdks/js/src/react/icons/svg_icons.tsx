import React from "react";

export interface SvgIconProps {
  size?: string;
  className?: string;
  width?: string;
  height?: string;
}

const SvgIcon: React.FC<SvgIconProps & { children: React.ReactNode }> = ({
  className,
  size = 25,
  children,
  width,
  height,
}): React.ReactElement => {
  const newWidth = width ?? size;
  const newHeight = height ?? size;
  return (
    <svg
      width={newWidth}
      height={newHeight}
      viewBox={`0 0 ${newWidth} ${newHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {children}
    </svg>
  );
};

export default SvgIcon;
