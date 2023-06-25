import React from 'react';
import type { ScrollableTabsMethods } from '../../types';
import type { ScrollViewProps } from 'react-native';
import type { AnimateProps } from 'react-native-reanimated';

export interface ScrollableTabsProps extends AnimateProps<ScrollViewProps> {
  width: number;
  children: React.ReactNode[];

  scrollIndicator?: React.ReactNode[] | React.ReactNode;

  /**
   * Animated value to be used as a callback for the position index node internally.
   * @type SharedValue<number>
   */
  animatedIndex?: SharedValue<number>;
}

declare type ScrollableTabs = ScrollableTabsMethods;
declare const ScrollableTabs: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    ScrollableTabsProps & React.RefAttributes<ScrollableTabsMethods>
  >
>;

export default ScrollableTabs;
