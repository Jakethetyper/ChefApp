import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { userInfo, BACKEND_URL, logout } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    height: "",
    weight: "",
  });

  useEffect(() => {
    if (userInfo) {
      setForm({
        userName: userInfo.userName || "",
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        height: "",
        weight: "",
      });
    }
  }, [userInfo]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/auth/updateUser`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        console.log(text);
        Alert.alert("Error", "Failed to update profile");
        return;
      }

      Alert.alert("Success", "Profile updated!");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header */}
          <Text style={styles.header}>Settings</Text>

          {/* Profile Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Profile</Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              value={form.userName}
              onChangeText={(text) => handleChange("userName", text)}
            />

            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={form.firstName}
              onChangeText={(text) => handleChange("firstName", text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={form.lastName}
              onChangeText={(text) => handleChange("lastName", text)}
            />
          </View>

          {/* Physical Info */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Physical Info</Text>

            <TextInput
              style={styles.input}
              placeholder="Height (e.g. 5'10)"
              value={form.height}
              onChangeText={(text) => handleChange("height", text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Weight"
              keyboardType="numeric"
              value={form.weight}
              onChangeText={(text) => handleChange("weight", text)}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          {/* Extra Section (Nice Touch) */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>App</Text>
            <Text style={styles.meta}>Version 1.0</Text>
            <Text style={styles.meta}>Built by you 🔥</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    padding: 16,
    gap: 16,
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 14,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  saveBtn: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "600",
  },

  logoutBtn: {
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "red",
  },

  logoutText: {
    color: "red",
    fontWeight: "600",
  },

  meta: {
    color: "gray",
    marginTop: 4,
  },
});
