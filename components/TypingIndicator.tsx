import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

export const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (val: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, []);

  const Dot = ({ opacity }: { opacity: Animated.Value }) => (
    <Animated.View
      style={{ opacity }}
      className="w-1 h-1 rounded-full bg-emerald-400"
    />
  );

  return (
    <View className="flex-row items-center mt-0.5">
      <View className="flex-row items-center space-x-1 px-1">
        <Dot opacity={dot1} />
        <Dot opacity={dot2} />
        <Dot opacity={dot3} />
      </View>
      <Text className="text-emerald-400/90 text-[11px] font-medium lowercase ml-1">
        typing...
      </Text>
    </View>
  );
};