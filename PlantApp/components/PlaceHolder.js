import { Image } from "expo-image";
import { StyleSheet, Text } from "react-native";
import Animated, {
  FadeOutDown,
  FadeInUp,
  useAnimatedSensor,
  SensorType,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import appConst from "../Resources";
const PlaceHolder = ({ text }) => {
  const adress = appConst.Adresses.PLANTPLACEHOLDERIMAGE;
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 10,
  });
  const Animatedstyles = useAnimatedStyle(() => {
    const rotationDeg = interpolate(
      animatedSensor.sensor.value.qy,
      [0, 1],
      [0, 240]
    );
    return {
      transform: [{ rotate: rotationDeg + "deg" }],
    };
  });
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutDown}
      style={[styles.listElement, Animatedstyles]}
    >
      <Text>{text}</Text>
      <Image
        style={styles.images}
        source={{
          uri: adress,
        }}
      />
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  listElement: {
    flex: 1,
    padding: 30,
    margin: 10,
  },
  images: {
    padding: 30,
    width: 150,
    height: 150,
  },
});
export default PlaceHolder;
