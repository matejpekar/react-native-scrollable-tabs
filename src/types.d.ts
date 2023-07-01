import type { SharedValue } from 'react-native-reanimated';

export interface ScrollableTabsMethods {
  /**
   * Snap to one of the provided points from `snapPoints`.
   * @param index snap point index.
   * @param animated whether to animate the transition or not.
   */
  snapToIndex: (index: number, animated?: boolean) => void;
}

export interface ScrollableTabsVariables {
  /**
   * Current position index.
   * @type SharedValue<number>
   */
  animatedIndex: SharedValue<number>;
  /**
   * Current focused position index.
   * @type SharedValue<number>
   */
  animatedFocusedIndex: SharedValue<number>;
  /**
   * Current position width.
   * @type SharedValue<number>
   */
  animatedWidth: SharedValue<number>;
  /**
   * Current focused position width.
   * @type SharedValue<number>
   */
  animatedFocusedWidth: SharedValue<number>;
  /**
   * Current scroll position.
   * @type SharedValue<number>
   */
  animatedScrollX: SharedValue<number>;
  /**
   * Current center offset of the tab.
   * @type SharedValue<number>
   */
  animatedCenterOffset: SharedValue<number>;
  /**
   * The widths of individual components inside scrolView.
   * @type SharedValue<number>
   */
  animatedMiddlePoints: SharedValue<number[]>;
  /**
   * The widths of individual components inside scrolView.
   * @type SharedValue<number>
   */
  animatedChildrenWidths: SharedValue<number[]>;
}
