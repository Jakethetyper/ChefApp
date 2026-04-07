import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type Created = {
  recipeId: string;
  recipeTitle: string;
};

type User = {
  userName: string;
  firstName: string;
  lastName: string;
  height?: string;
  weight?: number;
  gender?: string;
  favoritedRecipes: any[];
  createdRecipes: Created[];
};

export default function Profile() {
  const { userInfo, BACKEND_URL } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInformation = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/getMyself`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: userInfo?.userName,
          }),
        });

        const data = await res.json();
        setUser(data.person);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getUserInformation();
  }, []);

  const renderRecipe = ({ item }: { item: Created }) => (
    <View style={styles.recipeCard}>
      <Text style={styles.recipeTitle}>{item.recipeTitle}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.center}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userInfo?.userName?.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.username}>{userInfo?.userName}</Text>
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {user?.createdRecipes?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Recipes</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {user?.favoritedRecipes?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          {user?.height && <Text>Height: {user.height}</Text>}
          {user?.weight && <Text>Weight: {user.weight}</Text>}
          {user?.gender && <Text>Gender: {user.gender}</Text>}
        </View>

        {/* Created Recipes */}
        <Text style={styles.sectionTitle}>Your Recipes</Text>

        <FlatList
          data={user?.createdRecipes || []}
          keyExtractor={(item) => item.recipeId}
          renderItem={renderRecipe}
          contentContainerStyle={styles.list}
        />
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
