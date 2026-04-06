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
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={[styles.container, { width: "100%" }]}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text>Login</Text>
          <TextInput
            placeholder="Username..."
            style={styles.input}
            value={userName}
            onChangeText={(text) => setUserName(text)}
          />
          <TextInput
            placeholder="Password..."
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            onPress={() => login(userName, password)}
          ><Text>Login</Text></TouchableOpacity>
          <Link href="/signup">
            <Text>New? Signup</Text>
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
});
