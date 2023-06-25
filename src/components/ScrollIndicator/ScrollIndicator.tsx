import React from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { ScrollIndicatorProps } from './types';
import { styles } from './styles';
import { useScrollableTabs } from '../../hooks';

export default ({
  style = {},
  animationConfigs = { duration: 200 },
  children,
  ...props
}: ScrollIndicatorProps) => {
  const { animatedCenterOffset, animatedWidth } = useScrollableTabs();

  const width = useDerivedValue(() =>
    withTiming(animatedWidth.value, animationConfigs)
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: animatedCenterOffset.value - width.value / 2,
      },
    ],
    width: width.value,
  }));

  return (
    <Animated.View
      style={[styles.scrollIndicator, animatedStyle, style]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};
