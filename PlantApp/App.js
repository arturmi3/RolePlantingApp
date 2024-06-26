import { LogBox } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { StyleSheet, useColorScheme } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import PlantMap from "./components/PlantMap";
import LoginAnimated from "./components/LoginAnimated";
import PlantInfo from "./components/PlantInfo";
import PlantList from "./components/PlantList";
import appConst from "./Resources";
import PlantSearch from "./components/PlantSearch";
import { AppProvider, UserProvider, RealmProvider } from "@realm/react";
import { Plant } from "./models/Plant";
import { Person } from "./models/Person";
import { Marker } from "./models/Marker";
import User from "./components/User";
LogBox.ignoreAllLogs();
export default function App() {
  SplashScreen.preventAutoHideAsync();
  const onReady = async () => await SplashScreen.hideAsync();

  const getIconName = (routeName, focused) => {
    switch (routeName) {
      case appConst.SCREEN_NAMES.ALLPLANT:
        return focused
          ? "ios-information-circle"
          : "ios-information-circle-outline";
      case appConst.SCREEN_NAMES.FAVORITES:
        return focused ? "ios-star" : "ios-star-outline";
      case appConst.SCREEN_NAMES.PLANTMAP:
        return focused ? "ios-map" : "ios-map-outline";
      case appConst.SCREEN_NAMES.PLANTSEARCH:
        return focused ? "ios-search" : "ios-search-outline";
      case appConst.SCREEN_NAMES.USER:
        return focused ? "person-circle" : "person-circle-outline";
    }
  };

  const Tab = createBottomTabNavigator();
  const scheme = useColorScheme();

  return (
    <AppProvider id={"application-0-jhwbd"}>
      <UserProvider fallback={LoginAnimated}>
        <RealmProvider
          schema={[Plant, Person, Marker]}
          sync={{
            flexible: true,
            initialSubscriptions: {
              update(subs, realm) {
                subs.add(realm.objects(Plant));
                subs.add(realm.objects(Marker));
                subs.add(realm.objects(Person));
              },
            },
            onError: (session, error) => {
              console.error(error.message);
            },
          }}
        >
          <NavigationContainer
            theme={scheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Tab.Navigator
              backBehavior={"history"}
              screenOptions={({ navigation, route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  const iconName = getIconName(route.name, focused);
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "pink",
                tabBarInactiveTintColor: "gray",
                headerLeft: () => {
                  if (route.name === appConst.SCREEN_NAMES.PLANTINFO)
                    return (
                      <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons
                          size={30}
                          name="ios-arrow-back"
                          color={"pink"}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    );
                },
              })}
            >
              <Tab.Screen
                onLayout={onReady()}
                name={appConst.SCREEN_NAMES.ALLPLANT}
                component={PlantList}
              />
              <Tab.Screen
                name={appConst.SCREEN_NAMES.PLANTSEARCH}
                component={PlantSearch}
              />
              <Tab.Screen
                name={appConst.SCREEN_NAMES.FAVORITES}
                component={PlantList}
              />
              <Tab.Screen
                name={appConst.SCREEN_NAMES.PLANTMAP}
                component={PlantMap}
              />
              <Tab.Screen name={appConst.SCREEN_NAMES.USER} component={User} />
              <Tab.Screen
                name={appConst.SCREEN_NAMES.PLANTINFO}
                component={PlantInfo}
                options={{ tabBarButton: () => null }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </RealmProvider>
      </UserProvider>
    </AppProvider>
  );
}
const styles = StyleSheet.create({
  icon: { padding: 10 },
});
