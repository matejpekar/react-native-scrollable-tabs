import type { ReactNode } from 'react';
import type { SharedValue } from 'react-native-reanimated';

export interface ChildrenWidthMeterProps {
  /**
   * The widths of the children.
   * @type SharedValue<number[]>
   */
  childrenWidths: SharedValue<number[]>;
  /**
   * The children to measure.
   * @type ReactNode[]
   */
  children: ReactNode[];
}
