import { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
}

interface DropNumberProps {
  number: string;
  color: string;
  delay: number;
}

const DropNumber = ({ number, color, delay }: DropNumberProps) => {
  const translateY = useSharedValue(-SCREEN_HEIGHT / 2 - 100);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(-15);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Fade in at start
    opacity.value = withDelay(delay, withTiming(1, { duration: 100 }));

    // Drop animation
    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 8,
        stiffness: 100,
        mass: 1,
      })
    );

    // Rotation on drop
    rotate.value = withDelay(
      delay,
      withSequence(
        withTiming(15, { duration: 200, easing: Easing.out(Easing.quad) }),
        withSpring(0, { damping: 10, stiffness: 150 })
      )
    );

    // Scale bounce on impact
    scale.value = withDelay(
      delay + 400,
      withSequence(
        withSpring(1.3, { damping: 5, stiffness: 300 }),
        withSpring(1, { damping: 8, stiffness: 200 })
      )
    );
  }, [delay, opacity, rotate, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.numberContainer, animatedStyle]}>
      <Animated.Text
        style={[
          styles.number,
          styles.numberShadow,
          { color: '#000' },
        ]}
      >
        {number}
      </Animated.Text>
      <Animated.Text style={[styles.number, { color }]}>
        {number}
      </Animated.Text>
    </Animated.View>
  );
};

export const AnimatedSplash = ({ onAnimationComplete }: AnimatedSplashProps) => {
  useEffect(() => {
    // Navigate 3 seconds after numbers start dropping
    const timer = setTimeout(onAnimationComplete, 3000);
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.numbersRow}>
        <DropNumber number="5" color="#FFD700" delay={0} />
        <DropNumber number="3" color="#FF4444" delay={500} />
        <DropNumber number="1" color="#4488FF" delay={1000} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numbersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  numberContainer: {
    position: 'relative',
  },
  number: {
    fontSize: 120,
    fontWeight: '900',
    textAlign: 'center',
    // Comic book style text stroke effect
    textShadowColor: '#000',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
  },
  numberShadow: {
    position: 'absolute',
    left: 4,
    top: 4,
  },
});
