import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Image, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

interface BackgroundOrbitProps {
  width: number;
  height: number;
  itemSize?: number;
  rotationDuration?: number; // ms
  opacity?: number;
}

export const BackgroundOrbit = ({ 
  width,
  height,
  itemSize = 78, 
  rotationDuration = 40000, 
  opacity = 0.2, 
}: BackgroundOrbitProps) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  // 8 items evenly spaced
  const itemCount = 8;
  const items = Array.from({ length: itemCount }, (_, i) => i);
  
  // Calculate radius based on container size, leaving space for itemSize
  // If we want the *orbit* to fill the container, radius is approx half the smaller dimension.
  // We subtract itemSize/2 so items don't clip outside (if that's the desired behavior).
  // Given the specs (387x405), let's use the smaller dimension to define the circle.
  // Radius = (min(w, h) - itemSize) / 2
  const maxRadius = (Math.min(width, height) - itemSize) / 2;
  const radius = maxRadius; 

  const centerX = width / 2;
  const centerY = height / 2;

  useEffect(() => {
    // 1. Slow Rotation
    const rotateAnim = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: rotationDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // 2. Subtle Float/Pulse
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    rotateAnim.start();
    pulseAnim.start();

    return () => {
      rotateAnim.stop();
      pulseAnim.stop();
    };
  }, [rotationDuration]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const floatScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05], // Slight breathing
  });

  return (
    <View 
      style={[
        styles.container, 
        { width, height }, 
      ]} 
    >
      <Animated.View
        style={[
          styles.orbitContainer,
          {
            width: width,
            height: height,
            opacity: opacity,
            transform: [
              { rotate: spin },
              { scale: floatScale }
            ],
          },
        ]}
      >
        {items.map((_, index) => {
          // Polar coordinates
          const angleDeg = index * (360 / itemCount);
          const angleRad = (angleDeg * Math.PI) / 180;
          
          // Position relative to container center
          const x = centerX + radius * Math.cos(angleRad) - itemSize / 2;
          const y = centerY + radius * Math.sin(angleRad) - itemSize / 2;

          // Alternate rotation: 0deg (square) vs 45deg (diamond)
          const cardRotation = index % 2 === 0 ? '0deg' : '45deg';

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
                  transform: [{ rotate: cardRotation }],
                },
              ]}
            >
               <Image 
                 source={require('../../assets/card_orbit.png')} 
                 style={styles.cardImage}
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
    // Parent handles positioning
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    overflow: 'visible', // Allow float scale to go slightly out? "Card size 78". Orbit fills container.
    // If container == orbit size, we might clip if we don't allow overflow.
  },
  orbitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9, // Slight internal opacity
  }
});
