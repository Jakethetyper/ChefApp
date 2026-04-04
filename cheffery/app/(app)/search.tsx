import { View, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput placeholder="Search..." style={styles.input} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "row",
  },
  input: {
    padding: 10,
    borderRadius: 20,
    borderBlockColor: "black",
    borderWidth: 1,
  },
});
