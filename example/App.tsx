import React, { useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from 'react-native';
import ScrollableTabs, {
  ScrollableTabsMethods,
  ScrollIndicator,
} from 'react-native-scrollable-tabs';

export default () => {
  const { width } = useWindowDimensions();
  const ref = useRef<ScrollableTabsMethods>(null);

  const indexes = useMemo(
    () =>
      Array(50)
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
      >
        {indexes.map((item, i) => (
          <Tab
            index={item}
            key={i}
            onPress={() => ref.current?.snapToIndex(i)}
          />
        ))}
      </ScrollableTabs>
    </View>
  );
};

const Tab = ({
  index,
  ...props
}: TouchableWithoutFeedbackProps & { index: number }) => (
  <TouchableWithoutFeedback {...props}>
    <View style={styles.tab}>
      {index % 2 ? (
        <Text>This is as a fi{index}</Text>
      ) : (
        <Text>Tab {index}</Text>
      )}
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    height: 100,
    backgroundColor: 'red',
  },
  contentContainer: {
    gap: 100,
    paddingHorizontal: 40,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
});
