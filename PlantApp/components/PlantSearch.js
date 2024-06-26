import { useNavigationState } from "@react-navigation/native";
import { StyleSheet, View, Image, Button } from "react-native";
import React from "react";
import { useUser, useRealm } from "@realm/react";
import { Plant } from "../models/Plant";
import Animated, {
  FadeOutDown,
  FadeInUp,
  runOnJS,
} from "react-native-reanimated";

import DropDownPicker from "react-native-dropdown-picker";
import appConst from "../Resources";

const PlantSearch = ({ route, navigation }) => {
  const user = useUser();
  const realm = useRealm();
  const plants = realm.objects(Plant);
  const userPlant = plants.filtered("realm_id == $0", user.id);
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
  const dropDownItems = plantsToDropDownItems(userPlant);

  const dropDrown = () => (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutDown}
      style={styles.animatedContainer}
    >
      <DropDownPicker
        maxHeight={500}
        dropDownDirection={"AUTO"}
        theme="LIGHT"
        stickyHeader={true}
        disableBorderRadius={true}
        searchPlaceholder={"Search..."}
        placeholder={"select the Plant"}
        open={true}
        searchable={true}
        items={dropDownItems}
        onSelectItem={(item) => {
          const plantName = item.plant.common_name;
          runOnJS(navigation.navigate)(appConst.SCREEN_NAMES.PLANTINFO, {
            plantName,
          });
        }}
      />
    </Animated.View>
  );
  return <View style={styles.container}>{dropDrown()}</View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdown: {
    backgroundColor: "white",
    search: {
      backgroundColor: "#fcacc1",
    },
  },
  animatedContainer: {
    zIndex: 2,
  },
  icon: {
    width: 30,
    height: 30,
  },
});
export default PlantSearch;
