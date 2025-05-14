import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Image, Video } from '../../features';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Slide = ({ slides }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef(null);

  const toggleFullScreenMode = () => {
    setFullScreen((prev) => !prev);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: currentSlide, animated: false });
    }, 0);
  };

  const prev = () => {
    const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    setCurrentSlide(newIndex);
    flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
  };

  const next = () => {
    const newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(newIndex);
    flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentSlide(viewableItems[0].index);
    }
  }).current;

  const getItemLayout = (_, index) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  return (
    <View
      style={[
        styles.container,
        fullScreen ? styles.fullScreenContainer : styles.defaultContainer,
      ]}
    >
      <View style={styles.slideshowContainer}>
        <FlatList
          ref={flatListRef}
          data={slides}
          keyExtractor={(item) => item?.id?.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              {item?.mime_type?.startsWith('image') ? (
                <Image
                  src={item?.media_file}
                  fullScreen={fullScreen}
                  alt={item?.id}
                  resizeMode={fullScreen ? 'cover' : 'contain'}
                />
              ) : item?.mime_type?.startsWith('video') ? (
                <Video
                  src={item?.media_file}
                  fullScreen={fullScreen}
                  alt={item?.id}
                  resizeMode={fullScreen ? 'cover' : 'contain'}
                />
              ) : (
                <Text style={styles.fallbackText}>{item?.name}</Text>
              )}
            </View>
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          getItemLayout={getItemLayout}
          extraData={fullScreen}
        />

        <View style={styles.navigationContainer}>
          <TouchableOpacity onPress={prev} style={styles.navButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={next} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.positionContainer}>
          <View style={styles.positionIndicators}>
            {slides?.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.positionDot,
                  currentSlide === index
                    ? styles.activeDot
                    : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={toggleFullScreenMode}
        style={styles.fullScreenButton}
      >
        <Feather name="eye" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  defaultContainer: {
    width: SCREEN_WIDTH * 0.9,
  },
  fullScreenContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideshowContainer: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  slide: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  positionContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  positionIndicators: {
    flexDirection: 'row',
    gap: 8,
  },
  positionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  activeDot: {
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
  inactiveDot: {
    opacity: 0.5,
  },
  fullScreenButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 9999,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  fallbackText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default Slide;