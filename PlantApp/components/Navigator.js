import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { StyleSheet, useColorScheme } from "react-native";
import App from "../App";
import appConst from "../Resources";
import Register from "./Register";

export default function Navigator() {
  const Tab = createBottomTabNavigator();
  const scheme = useColorScheme();

  return (
    <AppProvider id={"application-0-jhwbd"}>
      <UserProvider fallback={LoginAnimated}>
        <NavigationContainer
          theme={scheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Tab.Navigator
            backBehavior={"history"}
            screenOptions={({ navigation, route }) => {}}
          >
            <Tab.Screen
              name={appConst.SCREEN_NAMES.APP}
              component={App}
              options={{ tabBarButton: () => null }}
            />
            <Tab.Screen
              name={appConst.SCREEN_NAMES.LOGIN}
              component={Login}
              options={{ tabBarButton: () => null }} // temp hack
            />
            <Tab.Screen
              name={appConst.SCREEN_NAMES.REGISTER}
              component={Register}
              options={{ tabBarButton: () => null }} // temp hack
            />
          </Tab.Navigator>
        </NavigationContainer>
      </UserProvider>
    </AppProvider>
  );
}
const styles = StyleSheet.create({
  icon: { padding: 10 },
});
