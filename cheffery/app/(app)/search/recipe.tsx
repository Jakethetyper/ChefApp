import { useAuth } from "@/context/AuthContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

type RatingsData = {
  ratingsAmount: number;
  ratingsAveraged: number;
};

type Rating = {
  user: string;
  name: string;
  comment: string;
  rating: number;
};

type Ingredient = {
  quantity: string;
  unit: string;
  ingredient: string;
};

type Recipes = {
  _id: string;
  title: string;
  description?: string;
  cuisine?: string;
  categories?: string[];
  prepTime?: string;
  cookTime?: string;
  ingredients?: Ingredient[];
  instructions: string[];
  tasteRating?: number;
  difficultyRating?: number;
  chefName?: string;
  avgRating: RatingsData;
  ratings: Rating[];
};

export default function Recipe() {
  const { data } = useLocalSearchParams();
  const { theme, BACKEND_URL, userInfo } = useAuth();
  const styles = createStyles(theme);

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [inGroceries, setInGroceries] = useState(false);

  const recipeData: Recipes | null = data ? JSON.parse(data as string) : null;

  useEffect(() => {
    userInfo?.groceryList.recipes.map((item) => {
      if (item.recipe === recipeData?.title) {
        setInGroceries(true);
      }
    });
  }, [recipeData?.title, userInfo]);

  const totalTime =
    (recipeData?.prepTime ? Number(recipeData?.prepTime) : 0) +
    (recipeData?.cookTime ? Number(recipeData?.cookTime) : 0);

  const addToShoppingList = async () => {
    if (inGroceries) {
      return;
    }

    try {
      await fetch(`${BACKEND_URL}/auth/addGroceries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: recipeData?.ingredients,
          userName: userInfo?.userName,
          recipeName: recipeData?.title,
          recipeId: recipeData?._id,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addReview = async () => {
    try {
      await fetch(`${BACKEND_URL}/auth/addReview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userInfo?.userId,
          name: userInfo?.userName,
          comment: newComment,
          rating: newRating,
          recipe: recipeData?._id,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={[{ width: "100%" }]}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <Text style={styles.title}>{recipeData?.title}</Text>

            {recipeData?.description && (
              <Text style={styles.description}>{recipeData?.description}</Text>
            )}

            {/* Tags */}
            <View style={styles.tagContainer}>
              {recipeData?.cuisine && (
                <View style={styles.tagPrimary}>
                  <Text style={styles.tagText}>{recipeData?.cuisine}</Text>
                </View>
              )}

              {recipeData?.categories?.map((cat, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{cat}</Text>
                </View>
              ))}
            </View>

            {/* Meta */}
            <View style={styles.metaRow}>
              <Text style={styles.meta}>⏱ {totalTime} min</Text>
              <Text style={styles.meta}>👨‍🍳 {recipeData?.chefName}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.rating}>⭐ {recipeData?.tasteRating}</Text>
              <Text style={styles.difficulty}>
                ⚙️ {recipeData?.difficultyRating}
              </Text>
            </View>

            {/* Ingredients */}
            <Text style={styles.sectionTitle}>Ingredients</Text>

            <View style={styles.card}>
              {recipeData?.ingredients?.map((ing, i) => (
                <Text key={i} style={styles.listText}>
                  • {ing.quantity} {ing.unit} {ing.ingredient}
                </Text>
              ))}
            </View>

            {/* Instructions */}
            <Text style={styles.sectionTitle}>Instructions</Text>

            <View style={styles.card}>
              {recipeData?.instructions.map((step, i) => (
                <Text key={i} style={styles.stepText}>
                  {i + 1}. {step}
                </Text>
              ))}
            </View>

            {/* Reviews */}
            {showComments ? (
              <View style={styles.commentsContainer}>
                <View style={styles.ratingHeader}>
                  <Text style={styles.sectionRatingTitle}>Ratings</Text>

                  <TouchableOpacity onPress={() => setShowComments(false)}>
                    <Text style={styles.closeText}>Hide</Text>
                  </TouchableOpacity>
                </View>

                {/* Existing Reviews */}
                {recipeData && recipeData.ratings.length > 0 ? (
                  recipeData?.ratings.map((item, index) => (
                    <View key={index} style={styles.ratingCard}>
                      <View style={styles.reviewTopRow}>
                        <Text style={styles.ratingName}>{item.name}</Text>
                        <Text style={styles.starText}>
                          {"⭐".repeat(item.rating || 0)}
                        </Text>
                      </View>

                      {item.comment ? (
                        <Text style={styles.reviewComment}>{item.comment}</Text>
                      ) : null}
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>No Ratings Yet</Text>
                  </View>
                )}

                {/* Add Review */}
                {userInfo?.userName === recipeData?.chefName && (
                  <View style={styles.addReviewBox}>
                    <Text style={styles.addReviewTitle}>Your Rating</Text>

                    {/* Stars */}
                    <View style={styles.starRow}>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <TouchableOpacity
                          key={num}
                          onPress={() => setNewRating(num)}
                        >
                          <Text style={styles.starPicker}>
                            {num <= newRating ? "⭐" : "☆"}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Comment */}
                    <View style={styles.commentBar}>
                      <TextInput
                        value={newComment}
                        onChangeText={setNewComment}
                        style={styles.input}
                        placeholder="Write a comment..."
                        placeholderTextColor={theme.textMuted}
                      />

                      <TouchableOpacity
                        style={styles.sendButton}
                        onPress={addReview}
                      >
                        <Text style={styles.sendText}>Post</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <TouchableOpacity
                style={styles.commentsContainer}
                onPress={() => setShowComments(true)}
              >
                <Text style={styles.sectionRatingTitle}>Ratings</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* 🔥 Floating Action Button */}
          <TouchableOpacity
            style={[
              styles.fab,
              inGroceries && { backgroundColor: theme.success },
            ]}
            onPress={addToShoppingList}
            activeOpacity={0.85}
          >
            <Text style={styles.fabText}>🛒</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 16,
    },

    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 6,
    },

    description: {
      color: theme.textSecondary,
      marginBottom: 10,
      lineHeight: 18,
    },

    tagContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 10,
    },

    tagPrimary: {
      backgroundColor: theme.primary + "20",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },

    tag: {
      backgroundColor: theme.surface,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },

    tagText: {
      fontSize: 12,
      color: theme.text,
      fontWeight: "500",
    },

    metaRow: {
      flexDirection: "row",
      gap: 16,
      marginBottom: 8,
    },

    meta: {
      fontSize: 13,
      color: theme.textSecondary,
    },

    rating: {
      fontSize: 14,
      color: theme.rating,
      fontWeight: "600",
    },

    difficulty: {
      fontSize: 14,
      color: theme.warning,
      fontWeight: "600",
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      marginTop: 16,
      marginBottom: 8,
    },

    card: {
      backgroundColor: theme.card,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },

    listText: {
      color: theme.text,
      marginBottom: 6,
    },

    stepText: {
      color: theme.text,
      marginBottom: 10,
      lineHeight: 18,
    },

    fab: {
      position: "absolute",
      top: 0,
      right: 0,
      backgroundColor: theme.primary,
      padding: 14,
      borderRadius: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowOffset: { height: 4, width: 0 },
      shadowRadius: 6,
      elevation: 5,
    },
    fabText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "600",
    },

    commentsContainer: {
      marginTop: 16,
      backgroundColor: theme.card,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    ratingHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    sectionRatingTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },
    closeText: {
      color: theme.primary,
      fontWeight: "600",
    },
    ratingCard: {
      backgroundColor: theme.surface,
      padding: 12,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    ratingName: {
      color: theme.text,
      fontSize: 15,
    },
    emptyCard: {
      paddingVertical: 14,
      alignItems: "center",
    },
    emptyText: {
      color: theme.textMuted,
    },
    commentBar: {
      flexDirection: "row",
      alignItems: "center",
    },
    input: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 14,
      paddingVertical: 10,
      color: theme.text,
      marginRight: 10,
    },
    sendButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
    },
    sendText: {
      color: "#fff",
      fontWeight: "700",
    },

    reviewTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    reviewComment: {
      marginTop: 6,
      color: theme.textMuted,
      lineHeight: 20,
    },

    starText: {
      fontSize: 14,
    },

    addReviewBox: {
      marginTop: 14,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },

    addReviewTitle: {
      color: theme.text,
      fontWeight: "700",
      marginBottom: 10,
    },

    starRow: {
      flexDirection: "row",
      marginBottom: 12,
    },

    starPicker: {
      fontSize: 30,
      marginRight: 8,
    },
  });
