import type { ScrollViewProps } from 'react-native';
import type { AnimateProps, WithTimingConfig } from 'react-native-reanimated';

export interface ScrollIndicatorProps extends AnimateProps<ScrollViewProps> {
  /**
   * Animation configs for the scroll indicator
   * @type WithTimingConfig
   *
   * @default { duration: 200 }
   *
   * @see {WithTimingConfig}
   */
  animationConfigs?: WithTimingConfig;
}
