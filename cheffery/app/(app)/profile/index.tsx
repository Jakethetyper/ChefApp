import { useAuth } from "@/context/AuthContext";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const { userInfo, theme } = useAuth();
  const styles = createStyles(theme);
  const router = useRouter();

  const renderRecipe = ({ item }: any) => (
    <View style={styles.recipeCard}>
      <Text style={styles.recipeTitle}>{item.recipeTitle}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push("/profile/settings")}
        >
          <Ionicons name="settings-outline" size={22} color={theme.text} />
        </TouchableOpacity>

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
      {(userInfo?.height || userInfo?.weight || userInfo?.gender) && (
        <View style={styles.infoCard}>
          {userInfo?.height && (
            <Text style={styles.infoText}>Height: {userInfo.height}</Text>
          )}
          {userInfo?.weight && (
            <Text style={styles.infoText}>Weight: {userInfo.weight}</Text>
          )}
          {userInfo?.gender && (
            <Text style={styles.infoText}>Gender: {userInfo.gender}</Text>
          )}
        </View>
      )}

      {/* Recipes */}
      <Text style={styles.sectionTitle}>Your Recipes</Text>

      {userInfo?.createdRecipes?.length > 0 ? (
        <FlatList
          data={userInfo.createdRecipes}
          keyExtractor={(item) => item.recipeId}
          renderItem={renderRecipe}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recipes yet</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
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
      backgroundColor: theme.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },

    header: {
      alignItems: "center",
      marginTop: 10,
    },

    avatar: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: theme.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },

    avatarText: {
      fontSize: 32,
      fontWeight: "700",
      color: theme.primary,
    },

    username: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
    },

    name: {
      color: theme.textSecondary,
      marginTop: 2,
    },

    stats: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 20,
      backgroundColor: theme.card,
      paddingVertical: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },

    statBox: {
      alignItems: "center",
    },

    statNumber: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
    },

    statLabel: {
      color: theme.textSecondary,
      marginTop: 4,
      fontSize: 12,
    },

    infoCard: {
      backgroundColor: theme.card,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 16,
    },

    infoText: {
      color: theme.text,
      marginBottom: 4,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 10,
    },

    list: {
      paddingBottom: 20,
      gap: 12,
    },

    recipeCard: {
      backgroundColor: theme.card,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },

    recipeTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },

    emptyContainer: {
      marginTop: 40,
      alignItems: "center",
    },

    emptyText: {
      color: theme.textMuted,
    },
  });
