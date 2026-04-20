import { useAuth } from "@/context/AuthContext";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

import { seasonings } from "@/dataStorage/ingredients";

export default function Profile() {
  const { userInfo, theme, BACKEND_URL } = useAuth();
  const styles = createStyles(theme);
  const router = useRouter();

  const [seasoningActive, setSeasoningActive] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [recipeView, setRecipeView] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [arrangedIngredientsOwned, setArrangedIngredientsOwned] = useState<
    string[]
  >([]);
  const [arrangedIngredientsNeeded, setArrangedIngredientsNeeded] = useState<
    string[]
  >([]);

  const filteredSeasonings = seasonings
    .filter((item) => item.toLowerCase().includes(newIngredient.toLowerCase()))
    .slice(0, 6);

  useEffect(() => {
    const dataOwned = [...userInfo?.groceryList.seasonings.owned].sort();
    setArrangedIngredientsOwned(dataOwned);

    const dataNeeded = [...userInfo?.groceryList.seasonings.needed].sort();
    setArrangedIngredientsNeeded(dataNeeded);
  }, []);

  const renderRecipe = ({ item }: any) => (
    <View style={styles.recipeCard}>
      <Text style={styles.recipeTitle}>{item.recipeTitle}</Text>
    </View>
  );

  const renderIngredient = ({ item }: any) => (
    <View style={styles.seasoningCard}>
      <Text style={styles.seasoningTitle}>{item}</Text>
    </View>
  );

  const submitNewSeasoning = async () => {
    try {
      if (!seasonings.includes(newIngredient)) {
        Alert.alert("Seasoning not in Database");
        return;
      }

      const response = await fetch(`${BACKEND_URL}/auth/addSeasoning`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newIngredient,
          seasoningActive,
          userName: userInfo?.userName,
        }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaProvider>
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

        {/* Recipes */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.sectionTitle}>Your Recipes</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <TouchableOpacity onPress={() => setRecipeView(true)}>
              <Ionicons name="create-outline" size={24} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRecipeView(false)}>
              <Ionicons name="star" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
        {userInfo?.createdRecipes?.length > 0 ? (
          <FlatList
            data={userInfo?.createdRecipes}
            keyExtractor={(item) => item.recipeId}
            renderItem={renderRecipe}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recipes yet</Text>
          </View>
        )}

        {/*    Seasonings    */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Seasonings</Text>
            <Text style={styles.sectionSubtitle}>
              Manage what you own and what you need
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addIconButton}
            onPress={() => setAddingNew(!addingNew)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={addingNew ? "close-outline" : "add-outline"}
              size={22}
              color={theme.text}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.toggleWrapper}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              seasoningActive && styles.toggleButtonActive,
            ]}
            onPress={() => setSeasoningActive(true)}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.toggleText,
                seasoningActive && styles.toggleTextActive,
              ]}
            >
              Owned
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              !seasoningActive && styles.toggleButtonActive,
            ]}
            onPress={() => setSeasoningActive(false)}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.toggleText,
                !seasoningActive && styles.toggleTextActive,
              ]}
            >
              Need
            </Text>
          </TouchableOpacity>
        </View>

        <Modal visible={addingNew} transparent animationType="fade">
          <TouchableWithoutFeedback
            onPress={() => {
              setAddingNew(false);
              setShowSuggestions(false);
              setNewIngredient("");
            }}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.popupCard}>
                  <View style={styles.popupHeader}>
                    <Text style={styles.popupTitle}>Add Seasoning</Text>

                    <TouchableOpacity onPress={() => setAddingNew(false)}>
                      <Ionicons name="close" size={24} color={theme.text} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      autoFocus
                      placeholder={
                        seasoningActive ? "Seasoning Owned" : "Seasoning Needed"
                      }
                      placeholderTextColor={theme.textMuted}
                      value={newIngredient}
                      onChangeText={(text) => {
                        setNewIngredient(text);
                        setShowSuggestions(true);
                      }}
                      style={styles.popupInput}
                    />

                    <Ionicons
                      name="search"
                      size={18}
                      color={theme.textMuted}
                      style={styles.searchIcon}
                    />
                  </View>

                  {showSuggestions &&
                    newIngredient.trim().length > 0 &&
                    filteredSeasonings.length > 0 && (
                      <View style={styles.dropdown}>
                        <FlatList
                          keyboardShouldPersistTaps="handled"
                          data={filteredSeasonings}
                          keyExtractor={(item) => item}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              style={styles.dropdownRow}
                              onPress={() => {
                                setNewIngredient(item);
                                setShowSuggestions(false);
                              }}
                            >
                              <Text style={styles.dropdownText}>{item}</Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    )}

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => submitNewSeasoning()}
                  >
                    <Text style={styles.submitText}>Add Seasoning</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* ---------- List ---------- */}
        {seasoningActive ? (
          arrangedIngredientsOwned.length > 0 ? (
            <FlatList
              data={arrangedIngredientsOwned}
              keyExtractor={(item) => item}
              renderItem={renderIngredient}
              style={[styles.list, { maxHeight: 160 }]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={28} color={theme.textMuted} />
              <Text style={styles.emptyText}>No seasonings owned yet</Text>
            </View>
          )
        ) : arrangedIngredientsNeeded.length > 0 ? (
          <FlatList
            data={arrangedIngredientsNeeded}
            keyExtractor={(item) => item}
            renderItem={renderIngredient}
            style={[styles.list, { maxHeight: 180 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={28} color={theme.textMuted} />
            <Text style={styles.emptyText}>No seasonings needed</Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
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

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 10,
    },

    recipeCard: {
      backgroundColor: theme.card,
      padding: 14,
      borderRadius: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },

    recipeTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },

    emptyText: {
      color: theme.textMuted,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
      marginTop: 8,
    },

    sectionSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 3,
    },

    addIconButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: theme.card,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },

    toggleWrapper: {
      flexDirection: "row",
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 4,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },

    toggleButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: "center",
    },

    toggleButtonActive: {
      backgroundColor: theme.primary,
    },

    toggleText: {
      color: theme.textSecondary,
      fontWeight: "600",
      fontSize: 14,
    },

    toggleTextActive: {
      color: "#fff",
    },

    input: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    list: {
      maxHeight: 420,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 45,
      gap: 10,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      justifyContent: "flex-start",
      paddingTop: 80,
      paddingHorizontal: 16,
    },
    popupCard: {
      backgroundColor: theme.card,
      borderRadius: 22,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.border,
    },
    popupHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    popupTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
    },
    submitButton: {
      marginTop: 16,
      backgroundColor: theme.primary,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
    },
    submitText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 15,
    },
    inputWrapper: {
      position: "relative",
      marginTop: 4,
    },
    popupInput: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      paddingVertical: 14,
      paddingLeft: 42,
      paddingRight: 14,
      fontSize: 16,
      color: theme.text,
    },
    searchIcon: {
      position: "absolute",
      left: 14,
      top: 15,
    },
    dropdown: {
      marginTop: 10,
      backgroundColor: theme.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      maxHeight: 220,
      overflow: "hidden",
    },
    dropdownRow: {
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    dropdownText: {
      color: theme.text,
      fontSize: 15,
    },
    seasoningCard: {
      backgroundColor: theme.card,
      padding: 6,
      borderRadius: 14,
      marginBottom: 6,
      borderWidth: 1,
      borderColor: theme.border,
    },
    seasoningTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
    },
  });
