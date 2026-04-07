import { useAuth } from "@/context/AuthContext";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const { userInfo } = useAuth();
  const router = useRouter();

  const renderRecipe = ({ item }: { item: Created }) => (
    <View style={styles.recipeCard}>
      <Text style={styles.recipeTitle}>{item.recipeTitle}</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          {/* Settings Button */}
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => router.push("/profile/settings")}
          >
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>

          {/* Avatar + Info */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userInfo?.userName?.charAt(0).toUpperCase()}
              </Text>
            </View>

            <Text style={styles.username}>{userInfo?.userName}</Text>
            <Text style={styles.name}>
              {userInfo?.firstName} {userInfo?.lastName}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {userInfo?.createdRecipes?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Recipes</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {userInfo?.favoritedRecipes?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          {userInfo?.height && <Text>Height: {userInfo.height}</Text>}
          {userInfo?.weight && <Text>Weight: {userInfo.weight}</Text>}
          {userInfo?.gender && <Text>Gender: {userInfo.gender}</Text>}
        </View>

        {/* Created Recipes */}
        <Text style={styles.sectionTitle}>Your Recipes</Text>

        {userInfo?.createdRecipes?.length > 0 ? (
          <FlatList
            data={userInfo?.createdRecipes || []}
            keyExtractor={(item) => item.recipeId}
            renderItem={renderRecipe}
            contentContainerStyle={styles.list}
          />
        ) : (
          <View style={styles.list}>
            <Text>No Created Recipes Yet</Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerContainer: {
    position: "relative",
    marginBottom: 20,
  },

  settingsBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
  },

  username: {
    fontSize: 20,
    fontWeight: "bold",
  },

  name: {
    color: "gray",
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },

  statBox: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },

  statLabel: {
    color: "gray",
  },

  infoSection: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  list: {
    gap: 10,
  },

  recipeCard: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
  },

  recipeTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
});
