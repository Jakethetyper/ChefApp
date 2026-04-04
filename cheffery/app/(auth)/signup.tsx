import {
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={[styles.container, { width: "100%" }]}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text>Signup</Text>
          <TextInput
            placeholder="Username..."
            style={styles.input}
            value={userName}
            onChangeText={(text) => setUserName(text)}
          />
          <TextInput
            placeholder="First Name..."
            style={styles.input}
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
          <TextInput
            placeholder="Last Name..."
            style={styles.input}
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
          <TextInput
            placeholder="Password..."
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <TouchableOpacity
            onPress={() => signup(firstName, lastName, userName, password)}
            style={styles.btn}
          >
            <Text>SignUp</Text>
          </TouchableOpacity>
          <Link href="/login">
            <Text>Have an Account? Login</Text>
          </Link>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 20,
    width: "90%",
    borderBlockColor: "black",
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "purple",
    marginBottom: 10,
    width: "80%",
    borderRadius: 20,
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
