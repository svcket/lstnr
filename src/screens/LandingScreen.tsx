import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Animated, Easing } from 'react-native';
import { BackgroundOrbit } from '../components/BackgroundOrbit';
import { COLORS, SPACING, FONT_FAMILY, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    titleMain: 'Believe early\nGrow together',
    subtitle: 'Invest in their story, earn in their success.',
    buttonLabel: 'Next',
    skipLabel: 'Skip for now',
    gradient: ['#000000', '#550000', '#FF3636', '#FFAA00'], // Black -> Dark Red -> Red -> Yellow/Orange
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  {
    id: 2,
    titleMain: 'Read the culture\nPredict the rise',
    subtitle: 'Predict momentum. Profit from the climb.',
    buttonLabel: 'Get started',
    skipLabel: 'Go back',
    gradient: ['#000000', '#001A33', '#004488', '#0066CC', '#6600CC'], // Black -> Deep Blue -> Blue -> Purple
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  {
    id: 3,
    titleMain: 'Get Started',
    subtitle: 'Where belief meets reward.',
    buttonLabel: 'Get started',
    isAuth: true,
  }
];

const DURATION = 5000; // 5 seconds per slide

export const LandingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // Support navigating directly to a specific slide (e.g., auth slide)
  const initialSlide = route.params?.slide ?? 0;
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const progress = useRef(new Animated.Value(0)).current;

  // Reset slide when route params change (e.g., coming from close button)
  useEffect(() => {
    if (route.params?.slide !== undefined) {
      setCurrentSlide(route.params.slide);
    }
  }, [route.params?.slide]);

  useEffect(() => {
    // Reset progress when slide changes to a non-auth slide
    const slide = SLIDES[currentSlide];
    
    if (slide.isAuth) {
      // Stop animation on Auth screen
      progress.setValue(1); 
      return;
    }

    progress.setValue(0);
    
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: DURATION,
      easing: Easing.linear,
      useNativeDriver: false, // width doesn't support native driver
    });

    animation.start(({ finished }) => {
      if (finished) {
        handleNext();
      }
    });

    return () => animation.stop();
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleBack = () => {
     if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    // Navigate to Get Started slide (last slide) which is the "Auth" slide
    setCurrentSlide(SLIDES.length - 1);
  };

  const slide = SLIDES[currentSlide];

  const renderProgressBar = (index: number) => {
    // If this bar is for a past slide, it's full.
    // If it's for the current slide, it takes the animated value.
    
    let widthInterp: any = 0;
    
    if (index < currentSlide) {
      widthInterp = '100%';
    } else if (index > currentSlide) {
      widthInterp = '0%';
    } else {
      widthInterp = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      });
    }

    return (
      <View key={index} style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBarFill, { width: widthInterp }]} />
      </View>
    );
  };

  // Precise Design Specs
  const ORBIT_LAYOUT = {
    width: 387.07,
    height: 405.18,
    top: 170.82,
    left: 21.78,
    cardSize: 78,
  };

  /* Auth Slide Components */
  const renderAuthSlide = () => (
    <View style={styles.authContainer}>
       {/* Background Orbit - Behind everything with strict positioning */}
       <View 
         style={{ 
            position: 'absolute', 
            top: ORBIT_LAYOUT.top, 
            left: ORBIT_LAYOUT.left,
            width: ORBIT_LAYOUT.width,
            height: ORBIT_LAYOUT.height,
            zIndex: 0,
            transform: [{ scale: 1.1 }] // Final visual adjustment (+10% size)
         }}
       >
         <BackgroundOrbit 
           width={ORBIT_LAYOUT.width}
           height={ORBIT_LAYOUT.height}
           itemSize={ORBIT_LAYOUT.cardSize}
           opacity={0.3}
           rotationDuration={60000} 
         />
       </View>

       <View style={styles.logoContainer}>
          {/* Logo 32px x 24px */}
          <Image 
            source={require('../../assets/logo_top.png')} 
            style={styles.logoBox}
            resizeMode="contain"
          />
       </View>

       {/* Spacer to push content down roughly where it should be */}
       <View style={{ flex: 1 }} />

       <View style={styles.authContent}>
         {/* Background with Fade Top */}
         <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.background }]} />
         <LinearGradient
           colors={['transparent', COLORS.background]}
           style={{
             position: 'absolute',
             top: -100,
             left: 0,
             right: 0,
             height: 100,
           }}
         />

         <Text style={styles.authTitle}>Get Started</Text>
         <Text style={styles.authSubtitle}>Where belief meets reward.</Text>

         <View style={styles.authButtons}>
            <TouchableOpacity style={styles.outlineButton}>
               <Image source={require('../../assets/icon_wallet.png')} style={styles.btnIcon} resizeMode="contain" />
               <Text style={styles.outlineButtonText}>Continue with Wallet</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.outlineButton}>
              <Image source={require('../../assets/icon_google.png')} style={styles.btnIcon} resizeMode="contain" />
              <Text style={styles.outlineButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlineButton}>
               <Image source={require('../../assets/icon_apple.png')} style={styles.btnIcon} resizeMode="contain" />
               <Text style={styles.outlineButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
            
            <View style={styles.divider}>
              <View style={styles.line} />
              <View style={styles.orBadge}>
                <Text style={styles.orText}>OR</Text>
              </View>
              <View style={styles.line} />
            </View>

            <TouchableOpacity 
              style={styles.outlineButton}
              onPress={() => navigation.navigate('AuthEntry')} 
            >
              <Text style={styles.outlineButtonText}>Continue Up with Email or WhatsApp</Text>
            </TouchableOpacity>
         </View>
       </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {slide.gradient ? (
        <LinearGradient
          colors={slide.gradient as [string, string, ...string[]]}
          start={slide.start}
          end={slide.end}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.background }]} />
      )}

      <SafeAreaView style={styles.safeArea}>
        {!slide.isAuth ? (
           <View style={styles.slideContent}>
              <View style={styles.headerSpacer} />
              
              <View style={styles.progressContainer}>
                {/* Render bars for all non-auth slides */}
                {SLIDES.filter(s => !s.isAuth).map((_, index) => renderProgressBar(index))}
              </View>

              <View style={styles.tagContainer} />

              <View style={styles.textContainer}>
                <Text style={styles.title}>{slide.titleMain}</Text>
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
              </View>

              <View style={styles.spacer} />

              <View style={styles.footer}>
                 <TouchableOpacity 
                   style={[
                     styles.mainButton, 
                     slide.id === 2 && styles.solidButton
                   ]} 
                   onPress={handleNext}
                 >
                   <Text style={[
                     styles.mainButtonText,
                     slide.id === 2 && styles.solidButtonText
                   ]}>
                     {slide.buttonLabel}
                   </Text>
                 </TouchableOpacity>
                 
                 <TouchableOpacity 
                   style={styles.skipButton} 
                   onPress={slide.id === 2 ? handleBack : handleSkip}
                 >
                   <Text style={[
                     styles.skipButtonText,
                     slide.id === 2 && { color: '#FFFFFF' }
                   ]}>
                     {slide.skipLabel}
                   </Text>
                 </TouchableOpacity>
              </View>
           </View>
        ) : (
          renderAuthSlide()
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  headerSpacer: {
    height: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.l,
    gap: 8,
    marginBottom: 40,
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  tagContainer: {
    paddingHorizontal: SPACING.l,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  tagText: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.header,
    fontSize: 14,
  },
  slideContent: {
    flex: 1,
  },
  textContainer: {
    paddingHorizontal: SPACING.l,
  },
  title: {
    fontFamily: FONT_FAMILY.medium, // Semibold
    fontWeight: '600',
    fontSize: 52,
    lineHeight: 56,
    color: '#FFFFFF',
    marginBottom: SPACING.m,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
  },
  spacer: {
    flex: 1,
  },
  footer: {
    padding: SPACING.l,
    gap: 16,
    marginBottom: 20,
  },
  mainButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButtonText: {
    fontFamily: FONT_FAMILY.header,
    fontWeight: '600',
    color: '#FFFFFF',
    fontSize: 16, // Standard app size
  },
  solidButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
  },
  solidButtonText: {
    color: '#000000',
  },
  skipButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    fontFamily: FONT_FAMILY.header,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  // Auth Slide
  // Auth Slide Styles
  authContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  logoBox: {
    width: 32,
    height: 24,
  },
  authContent: {
    width: '100%',
    paddingHorizontal: SPACING.l,
    marginBottom: 40,
    zIndex: 10,
    paddingTop: 20, // Add some breathing room since we added a background
  },
  authTitle: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  authSubtitle: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  authButtons: {
    gap: 12,
  },
  outlineButton: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  btnIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  outlineButtonText: {
    fontFamily: FONT_FAMILY.header, // Back to Oswald
    fontWeight: '600',
    color: '#FFFFFF',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#222',
  },
  orBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  orText: {
    color: '#444',
    fontFamily: FONT_FAMILY.header,
    fontSize: 12,
  },
});
