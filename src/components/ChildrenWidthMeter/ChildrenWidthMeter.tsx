import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ChildrenWidthMeterProps } from './types';

export default ({
  animatedChildrenWidths: animatedChildrenWidthsProp,
  children,
}: ChildrenWidthMeterProps) => {
  const [animatedChildrenWidths, setAnimatedChildrenWidths] = useState<
    { index: number; width: number }[]
  >([]);

  useEffect(() => {
    if (animatedChildrenWidths.length === children.length) {
      animatedChildrenWidthsProp.value = animatedChildrenWidths
        .sort((a, b) => a.index - b.index)
        .map(({ width }) => width);
    }
  }, [animatedChildrenWidths, animatedChildrenWidthsProp, children.length]);

  return (
    <>
      {children.map((child, i) => (
        <View
          key={i}
          onLayout={({ nativeEvent }) =>
            setAnimatedChildrenWidths((prev) => [
              ...prev,
              { index: i, width: nativeEvent.layout.width },
            ])
          }
        >
          {child}
        </View>
      ))}
    </>
  );
};
