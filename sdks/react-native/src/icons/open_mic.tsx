import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { type SvgIconProps } from "./mic";

// Create an animated version of the Rect component
const AnimatedRect = Animated.createAnimatedComponent(Rect);

export const OpenMic: React.FC<SvgIconProps> = ({
  width,
  height,
  color,
  size = "26",
}): React.ReactElement => {
  const newWidth = width ?? parseInt(size);
  const newHeight = height ?? parseInt(size);

  const barWidth = newWidth / 10;
  const barSpacing = barWidth / 2;

  const animationValues = Array(5)
    .fill(0)
    .map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    const animations = animationValues.map((anim) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]),
      ),
    );

    Animated.stagger(100, animations).start();
  }, [animationValues]);

  return (
    <Svg width={newWidth} height={newHeight} viewBox={`0 0 26 26`}>
      {animationValues.map((anim, index) => {
        const barHeight = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [newHeight * 0.2, newHeight * 0.8],
        });

        return (
          <AnimatedRect
            key={index}
            x={
              index * (barWidth + barSpacing) +
              newWidth / 2 -
              2.5 * (barWidth + barSpacing)
            }
            y={anim.interpolate({
              inputRange: [0, 1],
              outputRange: [newHeight * 0.4, newHeight * 0.1],
            })}
            width={barWidth}
            height={barHeight}
            fill={color}
          />
        );
      })}
    </Svg>
  );
};
