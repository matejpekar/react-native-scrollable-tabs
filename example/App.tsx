import React, { useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from 'react-native';
import ScrollableTabs, {
  ScrollIndicator,
  useScrollableTabs,
} from 'react-native-scrollable-tabs';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

export default () => {
  const { width } = useWindowDimensions();
  const ref = useRef<ScrollableTabs>(null);
  const [haptics, setHaptics] = useState(false);

  const hapticFeedback = () => impactAsync(ImpactFeedbackStyle.Light);

  const indexes = useMemo(
    () =>
      Array(15)
        .fill(0)
        .map((_, index) => index + 1),
    []
  );

  return (
    <View style={styles.container}>
      <ScrollableTabs
        ref={ref}
        width={width}
        contentContainerStyle={styles.contentContainer}
        scrollIndicator={<ScrollIndicator />}
        onScrollBeginDrag={() => setHaptics(true)}
        onMomentumScrollEnd={() => setHaptics(false)}
        onChange={() => haptics && hapticFeedback()}
        decelerationRate="fast"
      >
        {indexes.map((item, i) => (
          <Tab
            index={item}
            key={i}
            onPress={() => {
              ref.current?.snapToIndex(i);
              hapticFeedback();
            }}
          />
        ))}
      </ScrollableTabs>
    </View>
  );
};

const Tab = ({
  index,
  ...props
}: TouchableWithoutFeedbackProps & { index: number }) => {
  const { animatedIndex } = useScrollableTabs();

  const animatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      animatedIndex.value + 1,
      [index - 0.5, index, index + 0.5],
      ['gray', 'black', 'gray']
    ),
  }));

  return (
    <TouchableWithoutFeedback {...props}>
      <View style={[styles.tab]}>
        {index % 2 ? (
          <Animated.Text style={animatedStyle}>Tab long {index}</Animated.Text>
        ) : (
          <Animated.Text style={animatedStyle}>Tab {index}</Animated.Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    height: 100,
  },
  contentContainer: {
    gap: 20,
    paddingHorizontal: 20,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
});
