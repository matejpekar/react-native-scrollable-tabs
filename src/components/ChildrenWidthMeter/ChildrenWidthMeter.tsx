import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ChildrenWidthMeterProps } from './types';

export default ({
  childrenWidths: childrenWidthsProp,
  children,
}: ChildrenWidthMeterProps) => {
  const [childrenWidths, setChildrenWidths] = useState<
    { index: number; width: number }[]
  >([]);

  useEffect(() => {
    if (childrenWidths.length === children.length) {
      childrenWidthsProp.value = childrenWidths
        .sort((a, b) => a.index - b.index)
        .map(({ width }) => width);
    }
  }, [childrenWidths, childrenWidthsProp, children.length]);

  return (
    <>
      {children.map((child, i) => (
        <View
          key={i}
          onLayout={({ nativeEvent }) =>
            setChildrenWidths((prev) => [
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
