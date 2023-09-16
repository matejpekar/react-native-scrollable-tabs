import Animated, {
  interpolate,
  runOnJS,
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
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const ScrollableTabs = forwardRef<ScrollableTabsMethods, ScrollableTabsProps>(
  (
    {
      width,
      scrollEventThrottle = 16,
      showsHorizontalScrollIndicator = false,
      decelerationRate = 'fast',
      onContentSizeChange,
      onMomentumScrollEnd,
      contentContainerStyle,

      animatedIndex: animatedIndexProp,
      animatedFocusIndex: animatedFocusIndexProp,

      onChange: onChangeProp,
      onFocusChange: onFocusChangeProp,

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

    const animatedChildrenWidths = useSharedValue<number[]>([]);
    const animatedIndex = useSharedValue(0);
    const animatedFocusedIndex = useSharedValue(0);
    const animatedScrollX = useSharedValue(0);
    const contentWidth = useSharedValue(0);

    const snapPoints = useSnapPoints(
      animatedChildrenWidths,
      contentWidth,
      width
    );
    const animatedMiddlePoints = useCenterPoints(
      animatedChildrenWidths,
      snapPoints,
      width,
      insets
    );

    useAnimatedReaction(
      () => animatedIndex.value,
      (index) => {
        if (animatedIndexProp) {
          animatedIndexProp.value = index;
        }
      }
    );
    useAnimatedReaction(
      () => Math.round(animatedIndex.value),
      (index, prev) => {
        if (index !== prev && onChangeProp) {
          runOnJS(onChangeProp)(index);
        }
      }
    );

    useAnimatedReaction(
      () => animatedFocusedIndex.value,
      (index, prev) => {
        if (animatedFocusIndexProp) {
          animatedFocusIndexProp.value = index;
        }
        if (index !== prev && onFocusChangeProp) {
          runOnJS(onFocusChangeProp)(index);
        }
      }
    );

    const onScroll = useAnimatedScrollHandler((event) => {
      animatedScrollX.value = event.contentOffset.x;
      animatedIndex.value = interpolate(
        event.contentOffset.x,
        snapPoints.value,
        indexes,
        'clamp'
      );
    });

    const animatedCenterOffset = useDerivedValue(() =>
      interpolate(
        animatedScrollX.value,
        snapPoints.value,
        animatedMiddlePoints.value,
        'clamp'
      )
    );
    const animatedWidth = useDerivedValue(
      () => animatedChildrenWidths.value[Math.round(animatedIndex.value)] ?? 0
    );
    const animatedFocusedWidth = useDerivedValue(
      () => animatedChildrenWidths.value[animatedFocusedIndex.value] ?? 0
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
        animatedChildrenWidths,
        animatedMiddlePoints,
        snapToIndex: handleSnapToIndex,
      }),
      [
        animatedIndex,
        animatedFocusedIndex,
        animatedWidth,
        animatedFocusedWidth,
        animatedScrollX,
        animatedCenterOffset,
        animatedChildrenWidths,
        animatedMiddlePoints,
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
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
          contentContainerStyle={contentContainerStyle}
          decelerationRate={decelerationRate}
          onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            animatedFocusedIndex.value = Math.round(animatedIndex.value);
            onMomentumScrollEnd?.(e);
          }}
          disableIntervalMomentum={true}
          {...props}
        >
          <ChildrenWidthMeter animatedChildrenWidths={animatedChildrenWidths}>
            {children}
          </ChildrenWidthMeter>
        </Animated.ScrollView>
        {scrollIndicator}
      </ScrollableTabsProvider>
    );
  }
);

type ScrollableTabs = ScrollableTabsMethods;
export default ScrollableTabs;
