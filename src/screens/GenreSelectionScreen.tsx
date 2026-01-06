import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_FAMILY, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { GENRES } from '../constants/genres';

// 2) Metrics defined here
const { width } = Dimensions.get('window');
const GAP = 14;
const HPAD = 20; // Horizontal Padding
// Calculate card width for 3 columns with consistent spacing
const CARD_W = (width - (HPAD * 2) - (GAP * 2)) / 3;
const FOOTER_HEIGHT = 120; // Estimated footer height for padding

export const GenreSelectionScreen = () => {
  const navigation = useNavigation<any>();
  const { completeOnboarding } = useAuth();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      await completeOnboarding();
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }], 
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: string, index: number }) => {
    const isSelected = selectedGenres.includes(item);
    
    // Rotation logic
    const colIndex = index % 3;
    let rotation = '0deg';
    let topOffset = 0;

    if (colIndex === 0) {
      rotation = '-8deg';
      topOffset = 12; // Push down to align visual top peak
    }
    if (colIndex === 2) {
      rotation = '8deg'; 
      topOffset = 12; // Push down to align visual top peak
    }

    return (
      <TouchableOpacity
        style={[
          styles.genreItem,
          { 
            transform: [{ rotate: rotation }],
            marginTop: topOffset,
            marginBottom: GAP,
          },
          isSelected && styles.genreItemActive
        ]}
        onPress={() => toggleGenre(item)}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.genreText,
          isSelected && styles.genreTextActive
        ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  // 3) CTA Logic
  const hasSelection = selectedGenres.length > 0;

  return (
    <SafeAreaView style={styles.root}>
      {/* 1) Header Zone (Static) */}
      <View style={styles.header}>
        <Text style={styles.title}>Personalize your genres of interest</Text>
        <Text style={styles.subtitle}>Invest in their story, earn in their success.</Text>
      </View>

      {/* 2) Grid Scroll Area (Flexible) */}
      <View style={styles.listContainer}>
        <FlatList
          data={GENRES}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          numColumns={3}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* 3) Footer Zone (Static) */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButtonWrapper, { opacity: hasSelection ? 1 : 0.45 }]}
          onPress={handleContinue}
          disabled={!hasSelection}
        >
          <LinearGradient
            colors={['#8B6914', '#CD0000']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButton}
          >
            <Text style={styles.continueText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleContinue} style={styles.skipButton}>
          <Text style={styles.skipText}>Do this later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000', // Solid background
  },
  header: {
    paddingHorizontal: SPACING.l,
    paddingTop: 10,
    paddingBottom: 24,
    backgroundColor: '#000', // Ensure opacity doesn't bleed
    zIndex: 10,
  },
  title: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 32,
    color: '#FFF',
    lineHeight: 38,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
    color: '#888',
  },
  listContainer: {
    flex: 1, // Only scrollable region
  },
  flatListContent: {
    paddingHorizontal: HPAD,
    paddingTop: 12,
    paddingBottom: FOOTER_HEIGHT + 24, // Prevent hidden behind footer
  },
  columnWrapper: {
    gap: GAP, // Use gap for uniform horizontal spacing
  },
  // Item Styles
  genreItem: {
    width: CARD_W,
    height: 70, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A', 
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
    // marginBottom is handled in inline style or gap if vertical gap supported
    // But FlatList doesn't support vertical 'gap' easily in all versions for columns
    // We added marginBottom: GAP in renderItem
  },
  genreItemActive: {
    backgroundColor: '#333',
    borderColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  genreText: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 18, 
    color: '#888',
    textAlign: 'center',
  },
  genreTextActive: {
    color: '#FFF',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.l,
    backgroundColor: '#000', // Solid background
    paddingBottom: Platform.OS === 'ios' ? 0 : 20, // Adjust for safe area if needed
  },
  continueButtonWrapper: {
    marginBottom: 20,
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    fontFamily: FONT_FAMILY.header,
    color: '#FFF',
    fontSize: 16,
  },
  skipButton: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  skipText: {
    fontFamily: FONT_FAMILY.bodyBold,
    color: '#FFF',
    fontSize: 14,
  },
});
