import { StyleSheet, Image, View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { FadeOutDown, FadeInUp } from "react-native-reanimated";
import React, { useState, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import appConst from "../Resources";
import { useUser, useRealm } from "@realm/react";
import { Plant } from "../models/Plant";

const PlantInfo = ({ route }) => {
  const [data, setData] = useState({});
  const plantName = route.params?.plantName;
  const user = useUser();
  const realm = useRealm();
  const plants = realm.objects(Plant);
  const userPlant = plants.filtered(
    "realm_id == $0 && common_name == $1 && id != $2",
    user.id,
    plantName,
    user.id
  )?.[0];

  const dataAdress = `https://perenual.com/api/species/details/${userPlant.id}?key=${appConst.APIKEY}`;
  const fetchPlantDataJsonAsync = async () =>
    await (await fetch(dataAdress)).json();
  const loadData = async () => await fetchPlantDataJsonAsync();
  useEffect(() => {
    loadData().then((newData) => setData(newData));
  }, []);

  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutDown}>
      <ScrollView style={styles.container}>
        <View style={styles.iconImage}>
          <Image
            style={styles.images}
            source={{ uri: userPlant.default_image }}
          />
          <Ionicons
            name={userPlant.favorite ? "ios-star" : "ios-star-outline"}
            size={23}
            color={"#fcacc1"}
          />
        </View>
        {Object.keys(data).map((key) =>
          typeof data[key] == "string" &&
          data[key] != "Coming Soon" &&
          data[key] != "Coming" ? (
            <View style={styles.card}>
              <Text>
                {key.charAt(0).toUpperCase() + key.slice(1)} :{" "}
                {data[key] ? data[key] : "n/a"}
              </Text>
            </View>
          ) : null
        )}
      </ScrollView>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  iconImage: {
    justifyContent: "center",
    flexDirection: "row",
    padding: 30,
  },
  card: {
    width: "90%",
    padding: 30,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#c5d2ed",
  },
  images: {
    width: 120,
    height: 120,
    padding: 30,
  },
});
export default PlantInfo;
