import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  LinearTransition,
  FadeInUp,
  useAnimatedSensor,
  SensorType,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { Image } from "expo-image";
import appConst from "./../Resources";
import { useUser, useRealm } from "@realm/react";
import { Plant } from "../models/Plant";

const ListElement = ({ plantName, navigation, setFavorite, favorite }) => {
  const [selected, setSelected] = useState(favorite);
  const user = useUser();
  const realm = useRealm();
  const plants = realm.objects(Plant);
  const userPlant = plants.filtered(
    "realm_id == $0 && common_name == $1",
    user.id,
    plantName
  )?.[0];
  const longPressGesture = Gesture.LongPress().onEnd((e, success) => {
    if (success) runOnJS(setFavorite)(userPlant.common_name);
  });
  const singleTap = Gesture.Tap()
    .maxDuration(150)
    .onStart(() => {
      runOnJS(navigation.navigate)(appConst.SCREEN_NAMES.PLANTINFO, {
        plantName,
      });
    });
  const composed = Gesture.Exclusive(singleTap, longPressGesture);
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 10,
  });
  const Animatedstyles = useAnimatedStyle(() => {
    const rotationDeg = interpolate(
      animatedSensor.sensor.value.qy,
      [0, 1],
      [0, 30]
    );
    return {
      transform: [{ rotate: rotationDeg + "deg" }],
    };
  });
  return (
    <Animated.View
      key={userPlant.id}
      entering={FadeInUp}
      layout={LinearTransition}
      style={Animatedstyles}
    >
      <GestureDetector gesture={composed}>
        <View style={styles.listElement(selected)}>
          <Text>{plantName}</Text>
          <Image
            style={styles.images}
            source={{ uri: userPlant.default_image }}
          />
        </View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  listElement: (selected) => ({
    width: 150,
    height: 180,
    flex: 1,
    padding: 30,
    margin: 10,
    borderRadius: 5,
    backgroundColor: selected ? "yellow" : "green",
  }),
  images: {
    width: 80,
    height: 80,
    marginTop: 20,
    borderRadius: 5,
  },
});
export default ListElement;
