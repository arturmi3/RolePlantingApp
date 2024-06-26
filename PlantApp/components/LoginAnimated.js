import React, { useState, useEffect } from "react";
import {
  StatusBar,
  Easing,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Text,
  View,
  StyleSheet,
} from "react-native";
import Constants from "expo-constants";
import appConst from "./../Resources";
import Login from "./Login";
import Register from "./Register";

const { width, height } = Dimensions.get("window");
const DURATION = 400;
const LOGO_SIZE = 130;
const ICON_SIZE = 30;
const CLOSE_MODE = 200;
const ICON_LINE_HEIGHT = 2;

const closeItems = [0, 1];
const burgerItems = [0, 1, 2];

export default LoginAnimated = () => {
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);
  const [animateStripe] = useState(new Animated.Value(height));
  const [animateBg] = useState(new Animated.Value(0));
  const [animateOpacity] = useState(new Animated.Value(1));
  const [finished, setFinished] = useState(false);
  const [closeFinished, setCloseFinished] = useState(false);

  const closeAnimations = closeItems.map(
    (i) => new Animated.Value(i === 0 ? -CLOSE_MODE : CLOSE_MODE)
  );
  const burgerAnimations = burgerItems.map(() => new Animated.Value(0));

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);
  const reset = () => {
    setLogin(false)
    setRegister(false)
  }
  const goToLogin = () => {
    _closeDrawer();
    closeAnimation();
    setLogin(true);
  };
  const goToRegister = () => {
    _closeDrawer();
    closeAnimation();
    setRegister(true);
  };

  const _closeDrawer = () => {
    setFinished(false);
    startAnimation();
  };

  const animateClose = () => {
    const animations = closeItems.map((i) => {
      if (!closeFinished) {
        return Animated.timing(closeAnimations[i], {
          toValue: i === 0 ? -CLOSE_MODE : CLOSE_MODE,
          duraction: DURATION,
        });
      } else {
        return Animated.sequence([
          Animated.delay(DURATION / 2),
          Animated.timing(closeAnimations[i], {
            toValue: 0,
            duraction: DURATION,
          }),
        ]);
      }
    });

    return Animated.stagger(150, animations);
  };


  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(animateOpacity, {
        toValue: 0,
        duration: DURATION,
      }),
      animateClose(),
      Animated.sequence([
        Animated.delay(DURATION - 150),
        Animated.timing(animateStripe, {
          toValue: 0,
          duration: DURATION,
          easing: Easing.Out,
        }),
      ]),
    ]).start(() => {
      animateOpacity.setValue(0);
    });
  };

  const closeAnimation = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(animateBg, {
          toValue: 1,
          duration: DURATION / 10,
        }),
        Animated.timing(animateStripe, {
          toValue: height,
          duration: DURATION,
          easing: Easing.Out,
        }),
      ]),
      animateClose(),
      Animated.sequence([
        Animated.delay(DURATION - 150),
        Animated.timing(animateOpacity, {
          toValue: 1,
          duration: DURATION,
        }),
      ]),
    ]).start(() => {
      animateBg.setValue(0);
    });
  };

  const top = animateStripe.interpolate({
    inputRange: [0, height],
    outputRange: [-height / 4, 0],
    extrapolate: "clamp",
  });

  const bottom = animateStripe.interpolate({
    inputRange: [0, height],
    outputRange: [height / 4, 0],
    extrapolate: "clamp",
  });

  const opacity = animateStripe.interpolate({
    inputRange: [0, height / 1.5, height],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });

  const translateContent = animateStripe.interpolate({
    inputRange: [0, height],
    outputRange: [0, 30],
    extrapolate: "clamp",
  });

  const bgColor = animateBg.interpolate({
    inputRange: [0, 0.002, 1],
    outputRange: ["transparent", "#2F8BE6", "#2F8BE6"],
  });

  const scaleLogo = animateOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <>
      <View style={styles.container}>
        {login ? (
          <View
            style={[styles.loginContainer, login ? styles.loginVisible : null]}
          >
            <Login restart={reset} />
          </View>
        ): null}
        {register ? (
          <View
            style={[
              styles.loginContainer,
              register ? styles.loginVisible : null,
            ]}
          >
            <Register restart={reset} />
          </View>
        ): null }
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: bgColor }]}
        ></Animated.View>
        <Animated.View
          style={[
            styles.menuContainer,
            StyleSheet.absoluteFill,
            {
              backgroundColor: "transparent",
              opacity: opacity,
              transform: [{ translateY: translateContent }],
            },
          ]}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "space-around",
              backgroundColor: "transparent",
            }}
          >
            <TouchableWithoutFeedback onPress={goToLogin}>
              <Text style={styles.buttonStyle}>Login</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={goToRegister}>
              <Text style={styles.buttonStyle}>Create account</Text>
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>
        <View
          style={{
            backgroundColor: "transparent",
            position: "absolute",
            transform: [
              {
                rotate: "-35deg",
              },
            ],
          }}
        >
          <Animated.View
            style={[
              styles.strip,
              styles.top,
              {
                height: animateStripe,
                transform: [
                  {
                    translateY: top,
                  },
                ],
              },
            ]}
          ></Animated.View>
          <Animated.View
            style={[
              styles.strip,
              styles.bottom,
              {
                height: animateStripe,
                transform: [
                  {
                    translateY: bottom,
                  },
                ],
              },
            ]}
          ></Animated.View>
        </View>
        {startAnimation()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  closeContainer: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 40,
    right: 40,
  },
  line: {
    height: ICON_LINE_HEIGHT,
    width: ICON_SIZE,
    backgroundColor: "#aaa",
  },
  burgerContainer: {
    justifyContent: "space-around",
  },
  lineMedium: {
    width: ICON_SIZE * 0.67,
    alignSelf: "flex-start",
  },
  lineSmall: {
    width: ICON_SIZE * 0.45,
    alignSelf: "flex-end",
  },
  image: {
    resizeMode: "contain",
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    top: height / 2 - LOGO_SIZE / 2,
    left: width / 2 - LOGO_SIZE / 2,
  },
  menuContainer: {
    flex: 1,
    justifyContent: "space-around",
    paddingVertical: height / 5,
    backgroundColor: "white",
  },
  buttonStyle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#353535",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
  },
  strip: {
    backgroundColor: "#353535",
    height: height,
    width: width * 3,
  },
  top: {
    // backgroundColor: 'green'
  },
  bottom: {
    // backgroundColor: 'red',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
  loginContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white", // Adjust styles as needed
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1, // Initially hide it behind other content
    // Other styles for the login section...
  },
  loginVisible: {
    zIndex: 1, // Bring it to the front when visible
  },
});
