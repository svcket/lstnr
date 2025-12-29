import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const RadialOrbit = ({ 
  radius, 
  itemSize = 80, 
  rotationSpeed = 60000 
}: { radius: number; itemSize?: number; rotationSpeed?: number }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  // Generate enough items to fill the circle
  // Circumference = 2 * PI * r. itemSize + gap.
  // gaps ~ 20px?
  // Let's settle on a fixed count that looks dense enough. 12 cards?
  // 360 / 12 = 30 deg.
  const itemCount = 12;
  const items = Array.from({ length: itemCount }, (_, i) => i);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: rotationSpeed,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [rotationSpeed]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { height: radius * 2 + itemSize }]}>
      <Animated.View
        style={[
          styles.orbitContainer,
          {
            width: radius * 2,
            height: radius * 2,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        {items.map((_, index) => {
          const angleDeg = (index * (360 / itemCount)); 
          const angleRad = (angleDeg * Math.PI) / 180;
          
          // Position relative to center of the rotating container
          // Container is 2r x 2r. Center is r, r.
          const x = radius + radius * Math.cos(angleRad) - itemSize / 2;
          const y = radius + radius * Math.sin(angleRad) - itemSize / 2;

          return (
            <View
              key={index}
              style={[
                styles.itemContainer,
                {
                  width: itemSize,
                  height: itemSize,
                  left: x,
                  top: y,
                  transform: [{ rotate: `${angleDeg + 90}deg` }], 
                },
              ]}
            >
               <Image 
                 source={require('../../assets/card_shape.png')} 
                 style={{ width: '100%', height: '100%' }}
                 resizeMode="contain"
               />
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // The parent will handle the masking/positioning
  },
  orbitContainer: {
    // backgroundColor: 'rgba(255,255,255,0.05)', // Debug
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
