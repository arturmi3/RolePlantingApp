import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useUser, useRealm, useEmailPasswordAuth } from "@realm/react";
import { Person } from "../models/Person";

const UserScreen = () => {
  const user = useUser();
  const realm = useRealm();
  const { sendResetPasswordEmail } = useEmailPasswordAuth();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [nick, setNick] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    const userData = realm
      .objects(Person)
      .filtered(`email == "${user.profile.email}"`);
    if (userData.length > 0) {
      const { name, surname, nick, age } = userData[0];
      setName(name);
      setSurname(surname);
      setNick(nick);
      setAge(age.toString());
    }
  }, [realm, user.profile.email]);

  const handleLogout = () => {
    user.logOut();
  };

  const handlePasswordReset = () => {
    try {
      sendResetPasswordEmail({
        email: user.profile.email,
      });
      Alert.alert("Passwd reset email sent!", "check your email");
    } catch (e) {
      console.log(e);
    }
  };

  const saveUserData = () => {
    try {
      realm.write(() => {
        realm.create(
          Person,
          {
            _id: new Realm.BSON.ObjectId(),
            email: user.profile.email,
            name,
            surname,
            nick,
            age: parseInt(age),
          },
          true
        );
      });
      Alert.alert("Data Saved!", "Your information has been updated.");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: "https://freepngimg.com/save/144814-small-pot-flower-hd-image-free/1200x1200",
            }}
            style={styles.profileImage}
          />
          <Text>Email 🌻: </Text>
          <Text style={styles.email}>{user.profile.email}</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Surname"
            value={surname}
            onChangeText={(text) => setSurname(text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Nickname"
            value={nick}
            onChangeText={(text) => setNick(text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Age"
            keyboardType="numeric"
            value={age}
            onChangeText={(text) => setAge(text)}
          />
          <TouchableOpacity onPress={saveUserData} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handlePasswordReset}
          style={styles.resetButton}
        >
          <Text style={styles.resetText}>Reset Password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  resetText: {
    color: "#fff",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "pink",
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

export default UserScreen;
