import { useAuth } from "@/context/AuthContext";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { Calendar } from "react-native-calendars";


export default function Home() {
  const {BACKEND_URL}=useAuth()
  useEffect(()=>{
const callRecipes = async() =>{
  const response = await fetch(`${BACKEND_URL}/auth/getRecents`,{
    method:"GET"
  })
  const data = response.json()
}
callRecipes()
  },[])
  return (
    <SafeAreaView>
      <Text style={styles.blue}>Whatever I Want</Text>
      <View><Text>Hi</Text></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  red:{color:"red"},
  blue:{color:"blue"}
})

