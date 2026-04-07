import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";

export default function Recipe() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View>
          <Text></Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
