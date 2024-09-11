import { CSSProperties, FC, ReactElement, ReactNode } from "react";

export interface SvgIconProps {
  size?: string;
  className?: string;
  width?: string;
  height?: string;
  onClick?: any;
  style?: CSSProperties;
}

const SvgIcon: FC<SvgIconProps & { children: ReactNode }> = ({
  className,
  size = 25,
  children,
  width,
  height,
  onClick,
  style = {},
}): ReactElement => {
  const newWidth = width ?? size;
  const newHeight = height ?? size;
  return (
    <svg
      width={newWidth}
      height={newHeight}
      style={style}
      viewBox={`0 0 ${newWidth} ${newHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      {children}
    </svg>
  );
};

export default SvgIcon;
