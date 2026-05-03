import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import Card from "../../components/Card";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { colors, spacing } from "../../constants/theme";

type Checkin = {
  id: string;
  habitName?: string;
  date: string;
  userId: string;
};

export default function History() {
  const { user } = useAuth();

  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // ✅ NEW

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "checkins"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Checkin[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Checkin, "id">),
      }));

      setCheckins(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // ✅ Pull-to-refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);

    // just UX delay since Firestore is real-time
    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={checkins}
        keyExtractor={(item) => item.id}
        refreshing={refreshing} // ✅ ADDED
        onRefresh={handleRefresh} // ✅ ADDED
        ListHeaderComponent={
          <>
            <Text style={styles.headerTitle}>History</Text>
            <Text style={styles.headerSubtitle}>
              Your completed habits
            </Text>

            {loading && (
              <ActivityIndicator
                size="large"
                color={colors.black}
                style={{ marginVertical: spacing.md }}
              />
            )}
          </>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.subtitle}>
              {item.habitName || "Habit completed"}
            </Text>
          </Card>
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>No history yet.</Text>
          ) : null
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.lg,
  },

  headerTitle: {
    fontSize: 18,
    color: colors.text,
    fontWeight: "600",
  },

  headerSubtitle: {
    fontSize: 13,
    color: colors.subtext,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },

  card: {
    marginBottom: spacing.md,
  },

  date: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },

  subtitle: {
    fontSize: 13,
    color: colors.subtext,
    marginTop: spacing.xs,
  },

  emptyText: {
    textAlign: "center",
    color: colors.subtext,
    marginTop: spacing.lg,
  },
});