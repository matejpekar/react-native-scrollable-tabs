import { SharedValue, useDerivedValue } from 'react-native-reanimated';

/**
 * Calculates the snap points for a scrollable view based on the widths of its children.
 *
 * @param childrenWidths The widths of the children.
 * @param contentWidth The width of the scroll view content.
 * @param width The width of the visible portion of the scrollable view.
 * @returns The snap points.
 */
export const useScaledWidths = (
  childrenWidths: SharedValue<number[]>,
  contentWidth: SharedValue<number>,
  width: number
) =>
  useDerivedValue(() => {
    // Calculate the scale factor for the snap points.
    const first = childrenWidths.value[0] ?? 0;
    const last = childrenWidths.value.at(-1) ?? 0;
    const relativeContentWidth = contentWidth.value - first / 2 - last / 2;
    const scale = (contentWidth.value - width) / relativeContentWidth;

    return childrenWidths.value.map((val) => val * scale);
  }, [width]);
