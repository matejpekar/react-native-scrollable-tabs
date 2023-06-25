import Animated, {
  interpolate,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import React, {
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { ScrollableTabsMethods } from '../../types';
import { useSnapPoints, useCenterPoints } from '../../hooks';
import { ScrollableTabsProvider } from '../../context/external';
import { ScrollableTabsProps } from './types';
import ChildrenWidthMeter from '../ChildrenWidthMeter';

export default forwardRef<ScrollableTabsMethods, ScrollableTabsProps>(
  (
    {
      width,
      scrollEventThrottle = 16,
      showsHorizontalScrollIndicator = false,
      decelerationRate = 'fast',
      onContentSizeChange,
      contentContainerStyle,

      animatedIndex: animatedIndexProp,

      scrollIndicator,
      children,
      ...props
    },
    ref
  ) => {
    const indexes = useMemo(
      () => Array.from(Array(children.length).keys()),
      [children.length]
    );

    const scrollRef = useAnimatedRef<Animated.ScrollView>();

    const insets = {
      left:
        // @ts-ignore
        contentContainerStyle?.paddingLeft ??
        // @ts-ignore
        contentContainerStyle?.paddingHorizontal ??
        0,
      right:
        // @ts-ignore
        contentContainerStyle?.paddingRight ??
        // @ts-ignore
        contentContainerStyle?.paddingHorizontal ??
        0,
    };

    const childrenWidths = useSharedValue<number[]>([]);
    const animatedIndex = useSharedValue(0);
    const animatedFocusedIndex = useSharedValue(0);
    const animatedScrollX = useSharedValue(0);
    const contentWidth = useSharedValue(0);
    const haptics = useSharedValue(false);

    const snapPoints = useSnapPoints(childrenWidths, contentWidth, width);
    const centerPoints = useCenterPoints(
      childrenWidths,
      snapPoints,
      width,
      insets
    );

    const onScroll = useAnimatedScrollHandler({
      onScroll: ({ contentOffset }) => {
        animatedScrollX.value = contentOffset.x;
        animatedIndex.value = Math.round(
          interpolate(contentOffset.x, snapPoints.value, indexes, 'clamp')
        );
      },
    });

    const animatedCenterOffset = useDerivedValue(
      () =>
        interpolate(
          animatedScrollX.value,
          snapPoints.value,
          centerPoints.value,
          'clamp'
        ),
      []
    );

    const animatedWidth = useDerivedValue(
      () => childrenWidths.value[animatedIndex.value] ?? 0,
      []
    );

    const animatedFocusedWidth = useDerivedValue(
      () => childrenWidths.value[animatedFocusedIndex.value] ?? 0,
      []
    );

    useAnimatedReaction(
      () => animatedIndex.value,
      (_animatedIndex) => {
        if (animatedIndexProp) {
          animatedIndexProp.value = _animatedIndex;
        }
      }
    );

    const handleSnapToIndex = useCallback(
      (index: number, animated?: boolean) =>
        scrollRef.current?.scrollTo({
          x: snapPoints.value[index],
          animated,
        }),
      [snapPoints, scrollRef]
    );

    const externalContextVariables = useMemo(
      () => ({
        animatedIndex,
        animatedFocusedIndex,
        animatedWidth,
        animatedFocusedWidth,
        animatedScrollX,
        animatedCenterOffset,
        snapToIndex: handleSnapToIndex,
      }),
      [
        animatedIndex,
        animatedFocusedIndex,
        animatedWidth,
        animatedFocusedWidth,
        animatedScrollX,
        animatedCenterOffset,
        handleSnapToIndex,
      ]
    );

    useImperativeHandle(ref, () => ({
      snapToIndex: handleSnapToIndex,
    }));

    const animatedProps = useAnimatedProps(() => ({
      snapToOffsets: snapPoints.value,
    }));

    return (
      <ScrollableTabsProvider value={externalContextVariables}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal={true}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          scrollToOverflowEnabled={true}
          animatedProps={animatedProps}
          onContentSizeChange={(w: number, h: number) => {
            contentWidth.value = w;
            // @ts-ignore
            onContentSizeChange?.(w, h);
          }}
          snapToAlignment="start"
          decelerationRate={decelerationRate}
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
          contentContainerStyle={contentContainerStyle}
          onScrollBeginDrag={() => (haptics.value = true)}
          onMomentumScrollEnd={() => {
            animatedFocusedIndex.value = animatedIndex.value;
            haptics.value = false;
          }}
          {...props}
        >
          <ChildrenWidthMeter childrenWidths={childrenWidths}>
            {children}
          </ChildrenWidthMeter>
        </Animated.ScrollView>
        {scrollIndicator}
      </ScrollableTabsProvider>
    );
  }
);
