import React, { useState, useEffect } from "react";
import { useNavigationState, useTheme } from "@react-navigation/native";
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from "react-native";
import ListElement from "./ListElement";
import PlaceHolder from "./PlaceHolder";
import appConst from "../Resources";
import { useUser, useRealm } from "@realm/react";
import { Plant } from "../models/Plant";

const PlantList = ({ route, navigation }) => {
  const { colors } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [fetchPage, setFetchPage] = useState(0);
  const index = useNavigationState((state) => state.index);

  const realm = useRealm();
  const user = useUser();
  const UserPlants = realm.objects("Plant").filtered("realm_id == $0", user.id);
  const checkIfExistAlready = ({ name, id }) => {
    // change to user plants only
    const plant = realm
      .objects("Plant")
      .filtered(`common_name == $0 && id == $1`, name, id)?.[0];
    return Boolean(plant);
  };

  const addPlantToRealm = ({ name, data, image, favorite, marker, id }) => {
    if (checkIfExistAlready(name, id)) {
      return;
    }
    realm.write(() => {
      try {
        realm.create(Plant, {
          _id: new Realm.BSON.ObjectId(),
          common_name: name,
          data: data,
          id: id.toString(),
          realm_id: user.id,
          default_image: image,
          favorite: favorite,
          marker: marker,
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  const fetchJson = async () => {
    const adress = `${appConst.Adresses.PLANTAPI}?page=${fetchPage}&key=${appConst.APIKEY}`;
    const json = await (await fetch(adress)).json();
    setFetchPage(fetchPage + 1);
    return json;
  };

  const PlantJsonToArr = (json) =>
    json.data.map((plant) => ({
      name:
        plant.common_name.length > 10
          ? plant.common_name.substring(0, 10)
          : plant.common_name,
      data: `https://perenual.com/api/species/details/${plant.id}?key=sk-o6ra64946e01e92f41372`, // todo hide key
      id: plant.id,
      defaultImage: plant.default_image,
      favorite: false,
      marker: null,
    }));

  const loadMoreData = async () => {
    if (loading || allLoaded) return;
    setLoading(true);
    const plantData = PlantJsonToArr(await fetchJson());
    plantData.length === 0
      ? setAllLoaded(true)
      : plantData.map((plant) => {
        console.log(plant)
          addPlantToRealm({
            name: plant.name,
            data: plant.data,
            image: plant.defaultImage?.small_url.length > 0 
              ? plant?.defaultImage.small_url
              : "https://www.iconpacks.net/icons/2/free-plant-icon-1573-thumb.png",
            favorite: false,
            id: plant.id,
            marker: null,
          });
        });
    setLoading(false);
  };

  const initList = async () => {
    const onlyFavourites = route.name == appConst.SCREEN_NAMES.FAVORITES;
    if (onlyFavourites) {
      const favoritePlants = realm
        .objects("Plant")
        .filtered("realm_id == $0 && favorite == $1", user.id, true);
      setData(favoritePlants);
    } else {
      const allPlants = realm
        .objects("Plant")
        .filtered("realm_id == $0", user.id);
      setData(allPlants);
    }
  };
  useEffect(() => {
    setData(UserPlants);
  }, []);
  useEffect(() => {
    initList();
  }, [loading, index, fetchPage]);
  const setFavorite = async (plantName) => {
    const plants = realm.objects(Plant);
    const userPlant = plants.filtered(
      "realm_id == $0 && common_name == $1",
      user.id,
      plantName
    )?.[0];
    if (userPlant) {
      try {
        realm.write(() => {
          userPlant.favorite = !userPlant.favorite;
        });
      } catch (e) {
        console.log(e);
      }
    }
    initList();
  };
  return (
    <SafeAreaView style={styles.container(colors)}>
      <FlatList
        onEndReachedThreshold={0.4}
        scrollEventThrottle={16}
        onEndReached={async () => {
          if (route.name == appConst.SCREEN_NAMES.ALLPLANT)
            await loadMoreData();
        }}
        ListEmptyComponent={<PlaceHolder />}
        data={data}
        extraData={data.map(item => item.favorite)}
        keyExtractor={(item, index) => `${item.id}-${index}-${item.favorite}`}
        refreshing={(loading) => loading}
        numColumns={2}
        renderItem={({ item }) => (
          <ListElement
            navigation={navigation}
            plantName={item.common_name}
            setFavorite={setFavorite}
            favorite={item.favorite}
          />
        )}
      />
      {loading ? <ActivityIndicator style={styles.loading} /> : null}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: (colors) => ({
    flex: 1,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  }),
  loading: {
    padding: 30,
  },
});
export default PlantList;
