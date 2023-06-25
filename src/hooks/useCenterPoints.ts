import { SharedValue, useDerivedValue } from 'react-native-reanimated';

/**
 * Calculates the center points for each child based on the snap points and the width of the scrollable view.
 *
 * @param childrenWidths The widths of the children.
 * @param snapPoints The snap points for the scrollable view.
 * @param width The width of the visible portion of the scrollable view.
 * @param insets The insets of the scrollable view.
 * @returns The center points for each child.
 */
export const useCenterPoints = (
  childrenWidths: SharedValue<number[]>,
  snapPoints: SharedValue<number[]>,
  width: number,
  insets: { left: number; right: number }
) =>
  useDerivedValue(() => {
    const first = childrenWidths.value[0] ?? 0;
    const last = childrenWidths.value.at(-1) ?? 0;
    const contentSize = snapPoints.value.at(-1) ?? 1;
    const availableWidth =
      width - first / 2 - last / 2 - insets.left - insets.right;
    return snapPoints.value.map(
      (val) => (val * availableWidth) / contentSize + first / 2 + insets.left
    );
  }, [width, insets]);
