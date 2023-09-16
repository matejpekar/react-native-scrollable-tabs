import type React from 'react';
import type { ScrollViewProps } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export interface ScrollableTabsProps extends Omit<ScrollViewProps, ''> {
  /**
   * The width of the scrollable tabs container.
   * @type number
   */
  width: number;

  /**
   * The tabs which will be measured and rendered inside the scrollable tabs container.
   * @type React.ReactNode[]
   */
  children: React.ReactNode[];

  /**
   * The scroll indicator component to be rendered.
   * @type React.ReactNode[] | React.ReactNode
   */
  scrollIndicator?: React.ReactNode[] | React.ReactNode;

  /**
   * Animated value to be used as a callback for the position index node internally.
   * @type SharedValue<number>
   */
  animatedIndex?: SharedValue<number>;
  /**
   * Animated value to be used as a callback for the position focused index node internally.
   * @type SharedValue<number>
   */
  animatedFocusIndex?: SharedValue<number>;

  /**
   * Callback when the tab changes.
   *
   * @type (index: number) => void;
   */
  onChange?: (index: number) => void;
  /**
   * Callback when the focus changes.
   *
   * @type (index: number) => void;
   */
  onFocusChange?: (index: number) => void;
}
