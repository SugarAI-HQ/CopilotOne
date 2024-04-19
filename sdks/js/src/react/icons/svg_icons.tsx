import React from "react";

export interface SvgIconProps {
  size?: string;
  className?: string;
}

const SvgIcon: React.FC<SvgIconProps & { children: React.ReactNode }> = ({
  className,
  size = 25,
  children,
}): React.ReactElement => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {children}
    </svg>
  );
};

export default SvgIcon;
