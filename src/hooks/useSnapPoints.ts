import { SharedValue, useDerivedValue } from 'react-native-reanimated';

/**
 * Calculates the snap points for a scrollable view based on the widths of its children.
 *
 * @param childrenWidths The widths of the children.
 * @param contentWidth The width of the scroll view content.
 * @param width The width of the visible portion of the scrollable view.
 * @returns The snap points.
 */
export const useSnapPoints = (
  childrenWidths: SharedValue<number[]>,
  contentWidth: SharedValue<number>,
  width: number
) =>
  useDerivedValue(() => {
    // Calculate the total width of the children.
    const totalChildrenWidth = childrenWidths.value.reduce(
      (acc, curr) => acc + curr,
      0
    );

    // Calculate the spacing between the children.
    const gap =
      (contentWidth.value - totalChildrenWidth) /
      (childrenWidths.value.length - 1);

    // Calculate the scale factor for the snap points.
    const first = childrenWidths.value[0] ?? 0;
    const last = childrenWidths.value.at(-1) ?? 0;
    const relativeContentWidth = contentWidth.value - first / 2 - last / 2;
    const scale = (contentWidth.value - width) / relativeContentWidth;

    // Calculate the snap point for each child.
    const snaps = ((sum) => (value: number, index: number) => {
      const prev = childrenWidths.value[index] ?? 0;
      return (sum += ((prev + value) / 2 + gap) * scale);
    })(0);

    // Calculate the inner snap points.
    const innerSnapPoints = childrenWidths.value.slice(1, -1).map(snaps);

    // Add the outer snap points. For better accuracy, the outer snap points are fixed.
    return [0, ...innerSnapPoints, contentWidth.value - width];
  }, [width]);
