import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { useEmailPasswordAuth, AuthOperationName } from "@realm/react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

export default Register = ({ restart }) => {
  const { register, result, logIn } = useEmailPasswordAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (result.success && result.operation === AuthOperationName.Register) {
      logIn({ email, password });
    } else if (result.error) {
      Alert.alert("Wrong Credential", result.error.message);
    }
  }, [result, logIn]);

  const performRegistration = () => {
    register({ email, password });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.formContainer}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            inputMode="email"
            placeholder="Email"
            placeholderTextColor="#005500"
            onChangeText={(email) => setEmail(email)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor="#005500"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={performRegistration}>
          <Text style={styles.loginText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={restart}>
          <Text style={styles.loginText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0ffe0",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  formContainer: {
    width: "80%",
  },
  inputView: {
    backgroundColor: "#c0ffc0",
    height: 80,
    marginBottom: 20,
    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  textInput: {
    height: 50,
    fontSize: 16,
    color: "#005500",
  },
  loginBtn: {
    backgroundColor: "#008000",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  loginText: {
    color: "white",
    fontSize: 18,
  },
  forgotButton: {
    color: "#008000",
    fontSize: 16,
  },
  createAccount: {
    color: "#008000",
    fontSize: 16,
    marginTop: 10,
  },
});
