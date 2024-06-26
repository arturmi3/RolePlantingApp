import { useNavigationState } from "@react-navigation/native";
import { StyleSheet, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Animated, { FadeOutDown, FadeInUp } from "react-native-reanimated";
import MapView, { Marker as MAPS_Marker } from "react-native-maps";
import DropDownPicker from "react-native-dropdown-picker";
import appConst from "../Resources";
import { useUser, useRealm } from "@realm/react";
import { Plant } from "../models/Plant";
import { Marker } from "../models/Marker";

const PlantMap = ({ route, navigation }) => {
  const user = useUser();
  const realm = useRealm();
  const [userPlants, setUserPLants] = useState([]);
  const [markedPlants, setMarkedPlants] = useState([]);
  const [dropDownActive, setDropDownActive] = useState(false);
  const [pressedCoordinate, setPressedCoordinate] = useState({});
  const index = useNavigationState((state) => state.index);

  const plantsToDropDownItems = (plants) => {
    return plants.map((plant) => ({
      plant: plant,
      label: plant.common_name,
      selectable: true,
      value: plant.common_name,
      icon: () => (
        <Image
          source={{
            uri: plant.default_image,
          }}
          style={styles.icon}
        />
      ),
    }));
  };

  const addMarkerToPlant = async (plantId, markerCordinates) => {
    realm.write(() => {
      const plants = realm.objects(Plant);
      const plant = plants.filtered(
        "realm_id == $0 && id == $1",
        user.id,
        plantId
      )[0];
      plant.marker = realm.create(Marker, {
        _id: new Realm.BSON.ObjectId(),
        plant: plant,
        coordinate: `${markerCordinates.latitude},${markerCordinates.longitude}`,
        realm_id: user.id,
      });
    });
  };
  const longPressHandler = (coordinate) => {
    setDropDownActive((dropDownActive) => !dropDownActive);
    setPressedCoordinate(coordinate);
  };
  const dropDownItems = plantsToDropDownItems(userPlants);

  const dropDrown = () => {
    if (!dropDownActive) return;
    return (
      <Animated.View
        entering={FadeInUp}
        exiting={FadeOutDown}
        style={styles.animatedContainer}
      >
        <DropDownPicker
          dropDownDirection={"AUTO"}
          dropDownContainerStyle={styles.dropdown}
          style={styles.dropdown.search}
          searchTextInputStyle={styles.dropdown.search}
          maxHeight={500}
          searchPlaceholder={"Search..."}
          placeholder={"select the Plant"}
          open={dropDownActive}
          searchable={true}
          items={dropDownItems}
          setDropDownActive={setDropDownActive}
          onSelectItem={(item) => {
            addMarkerToPlant(item.plant.id, pressedCoordinate).then(
              setDropDownActive((dropDownActive) => !dropDownActive)
            );
          }}
        />
      </Animated.View>
    );
  };

  useEffect(() => {
    const plants = realm.objects(Plant);
    const _userPlants = plants.filtered("realm_id == $0", user.id);
    const _markerPlants = plants.filtered(
      "realm_id == $0 && marker != NULL",
      user.id
    );
    setUserPLants(_userPlants);
    setMarkedPlants(_markerPlants);
  }, [dropDownActive, index]);

  return (
    <View style={styles.container}>
      {dropDrown()}
      <MapView
        style={styles.map}
        pitchEnabled={true}
        showsUserLocation={true}
        showsBuildings={true}
        followsUserLocation={true}
        onLongPress={(e) => longPressHandler(e.nativeEvent.coordinate)}
      >
        {markedPlants.map((plant, idx) => {
          const [latitude, longitude] = plant.marker.coordinate
            .split(",")
            .map(parseFloat);
          return (
            <MAPS_Marker
              key={`${plant.id}-${idx}-${plant.marker.coordinate}`}
              coordinate={{
                latitude,
                longitude,
              }}
              title={plant.name}
              onPress={() => {
                const plantName = plant.common_name;
                navigation.navigate(appConst.SCREEN_NAMES.PLANTINFO, {
                  plantName,
                });
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdown: {
    backgroundColor: "pink",
    height: 500,
    search: {
      backgroundColor: "#fcacc1",
      borderRadius: 5,
      height: 45,
    },
  },
  animatedContainer: {
    zIndex: 2,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  icon: {
    width: 30,
    height: 30,
  },
});
export default PlantMap;
