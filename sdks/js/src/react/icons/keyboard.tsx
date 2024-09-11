import { ReactElement } from "react";
import SvgIcon, { type SvgIconProps } from "./svg_icons";

export interface MicSvgProps extends SvgIconProps {
  color?: string;
}

const KeyboardIcon = (props: MicSvgProps): ReactElement => {
  return (
    <SvgIcon {...props}>
      <g fill="none">
        {/* <g filter="url(#filter0_dd_381_827)">
          <rect x="12" y="8" width="44" height="44" rx="10" fill="white" />
          <path
            d="M26 37C25.45 37 24.9793 36.8043 24.588 36.413C24.1967 36.0217 24.0007 35.5507 24 35V25C24 24.45 24.196 23.9793 24.588 23.588C24.98 23.1967 25.4507 23.0007 26 23H42C42.55 23 43.021 23.196 43.413 23.588C43.805 23.98 44.0007 24.4507 44 25V35C44 35.55 43.8043 36.021 43.413 36.413C43.0217 36.805 42.5507 37.0007 42 37H26ZM26 35H42V25H26V35ZM30 34H38V32H30V34ZM27 31H29V29H27V31ZM30 31H32V29H30V31ZM33 31H35V29H33V31ZM36 31H38V29H36V31ZM39 31H41V29H39V31ZM27 28H29V26H27V28ZM30 28H32V26H30V28ZM33 28H35V26H33V28ZM36 28H38V26H36V28ZM39 28H41V26H39V28Z"
            fill="#444444"
          />
        </g>
        <defs>
          <filter
            id="filter0_dd_381_827"
            x="0"
            y="0"
            width="68"
            height="76"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="2"
              operator="erode"
              in="SourceAlpha"
              result="effect1_dropShadow_381_827"
            />
            <feOffset dy="-4" />
            <feGaussianBlur stdDeviation="3" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.03 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_381_827"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="4"
              operator="erode"
              in="SourceAlpha"
              result="effect2_dropShadow_381_827"
            />
            <feOffset dy="12" />
            <feGaussianBlur stdDeviation="8" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.08 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow_381_827"
              result="effect2_dropShadow_381_827"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow_381_827"
              result="shape"
            />
          </filter>
        </defs> */}
        <path
          d="M2 14C1.45 14 0.979333 13.8043 0.588 13.413C0.196667 13.0217 0.000666667 12.5507 0 12V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V12C20 12.55 19.8043 13.021 19.413 13.413C19.0217 13.805 18.5507 14.0007 18 14H2ZM2 12H18V2H2V12ZM6 11H14V9H6V11ZM3 8H5V6H3V8ZM6 8H8V6H6V8ZM9 8H11V6H9V8ZM12 8H14V6H12V8ZM15 8H17V6H15V8ZM3 5H5V3H3V5ZM6 5H8V3H6V5ZM9 5H11V3H9V5ZM12 5H14V3H12V5ZM15 5H17V3H15V5Z"
          fill={props.color}
        />
      </g>
    </SvgIcon>
  );
};

export default KeyboardIcon;
