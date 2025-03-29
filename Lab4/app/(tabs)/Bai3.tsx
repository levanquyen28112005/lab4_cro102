import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const playlist = [
  {
    title: "Bài Cua toi",
    uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    image: "https://picsum.photos/seed/song1/400/400",
  },
  {
    title: "Bài Cua Bạn",
    uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    image: "https://picsum.photos/seed/song2/400/400",
  },
  {
    title: "Bài Nay Nhe",
    uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    image: "https://picsum.photos/seed/song3/400/400",
  },
];
export default function Bai3() {
  const [sliderValue, setSliderValue] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<Audio.AVPlaybackStatus | null>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    loadTrack(currentTrack);
    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, [currentTrack]);

  const loadTrack = async (index: number) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current == null;
    }
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: playlist[index].uri,
      },
      { shouldPlay: true },
      (s) => setStatus(s)
    );
    soundRef.current = sound;
    setIsPlaying(true);
  };
  const handlePlayPause = async () => {
    if (!soundRef.current) return;

    const currentStatus = await soundRef.current.getStatusAsync();

    if (currentStatus.isLoaded) {
      if (currentStatus.isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const handleNext = () => {
    if (currentTrack < playlist.length - 1) {
      setCurrentTrack(currentTrack + 1);
    }
  };

  const handlePrevious = () => {
    if (currentTrack > 0) {
      setCurrentTrack(currentTrack - 1);
    }
  };
  const handleSeek = async (value: number) => {
    if (soundRef.current && status?.isLoaded) {
      await soundRef.current.setPositionAsync(value);
    }
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#222831" }}>
      <View
        style={{
          flex: 6,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: playlist[currentTrack].image,
          }}
          style={{ width: 200, height: 200 }}
        />
      </View>
      <View style={{ flex: 4 }}>
        <View style={styles.container}>
          <Text style={styles.title}>{playlist[currentTrack].title}</Text>

          {/* Thanh trượt thời gian */}
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={sliderValue}
            onValueChange={(value) => setSliderValue(value)}
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#666"
            thumbTintColor="#FFD369"
          />

          {/* Thời gian đã phát / tổng thời gian */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {formatTime(status?.positionMillis || 0)}
            </Text>
            <Text style={styles.timeText}>
              {formatTime(status?.durationMillis || 0)}
            </Text>
          </View>

          {/* Khu vực nút điều khiển */}
          <View style={styles.controlsContainer}>
            <MaterialIcons
              name="arrow-left"
              size={40}
              color="#FFD369"
              onPress={handlePrevious}
            />
            <MaterialIcons
              name="pause"
              size={50}
              style={styles.playIcon}
              color="#FFD369"
              onPress={handlePlayPause}
            />
            <MaterialIcons
              name="arrow-right"
              size={40}
              color="#FFD369"
              onPress={handleNext}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831", // Màu nền tối
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: "#EEEEEE",
    marginBottom: 4,
    textAlign: "center",
  },
  artist: {
    fontSize: 16,
    color: "#999",
    marginBottom: 20,
    textAlign: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeText: {
    color: "#EEEEEE",
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    width: "60%",
  },
  playIcon: {
    marginHorizontal: 30,
  },
});
