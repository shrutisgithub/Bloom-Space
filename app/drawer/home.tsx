import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import Card from "../../components/Card";
import { db } from "../../firebase/firebaseConfig";
import { colors, spacing } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { getQuote } from "../../services/quoteApi";

type Habit = {
  id: string;
  name: string;
  userId: string;
};

type Checkin = {
  id: string;
  habitId: string;
  habitName?: string;
  userId: string;
  date: string;
};

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getPreviousDate(dateString: string) {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
}

function calculateStreak(checkins: Checkin[]) {
  const dates = new Set(checkins.map((item) => item.date));
  let streak = 0;
  let currentDate = getTodayDate();

  while (dates.has(currentDate)) {
    streak++;
    currentDate = getPreviousDate(currentDate);
  }

  return streak;
}

const HabitCard = React.memo(function HabitCard({
  item,
  onComplete,
}: {
  item: Habit;
  onComplete: (habit: Habit) => void;
}) {
  return (
    <Card style={styles.taskCard}>
      <View style={styles.taskRow}>
        <TouchableOpacity style={styles.radioCircle} onPress={() => onComplete(item)} />

        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{item.name}</Text>
          <Text style={styles.taskSubtitle}>Tap circle to complete today</Text>
        </View>

        <View style={styles.pinkDot} />
      </View>
    </Card>
  );
});

export default function Home() {
  const { user } = useAuth();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [quote, setQuote] = useState({ content: "", author: "" });
  const [loading, setLoading] = useState(true);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const today = getTodayDate();

  useEffect(() => {
    fetchQuote();

    if (!user) return;

    const habitsQuery = query(
      collection(db, "habits"),
      where("userId", "==", user.uid)
    );

    const unsubscribeHabits = onSnapshot(habitsQuery, (snapshot) => {
      const data: Habit[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Habit, "id">),
      }));

      setHabits(data);
      setLoading(false);
    });

    const checkinsQuery = query(
      collection(db, "checkins"),
      where("userId", "==", user.uid)
    );

    const unsubscribeCheckins = onSnapshot(checkinsQuery, (snapshot) => {
      const data: Checkin[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Checkin, "id">),
      }));

      setCheckins(data);
    });

    return () => {
      unsubscribeHabits();
      unsubscribeCheckins();
    };
  }, [user]);

  const fetchQuote = async () => {
    const result = await getQuote();
    setQuote(result);
  };

  const todayCheckins = useMemo(() => {
    return checkins.filter((item) => item.date === today);
  }, [checkins, today]);

  const completedCount = todayCheckins.length;

  const pendingHabits = useMemo(() => {
    return habits.filter(
      (habit) => !todayCheckins.some((checkin) => checkin.habitId === habit.id)
    );
  }, [habits, todayCheckins]);

  const streak = useMemo(() => {
    return calculateStreak(checkins);
  }, [checkins]);

  const progressPercent = useMemo(() => {
    if (habits.length === 0) return 0;
    return completedCount / habits.length;
  }, [completedCount, habits.length]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progressPercent]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const handleCompleteHabit = useCallback(
    async (habit: Habit) => {
      if (!user) return;

      try {
        await addDoc(collection(db, "checkins"), {
          habitId: habit.id,
          habitName: habit.name,
          userId: user.uid,
          date: today,
          createdAt: serverTimestamp(),
        });
      } catch (error: any) {
        Alert.alert("Error", error.message);
      }
    },
    [user, today]
  );

  const renderItem = useCallback(
    ({ item }: { item: Habit }) => (
      <HabitCard item={item} onComplete={handleCompleteHabit} />
    ),
    [handleCompleteHabit]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pendingHabits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>My Habits</Text>
                <Text style={styles.headerSubtitle}>
                  {pendingHabits.length} active today
                </Text>
              </View>

              <TouchableOpacity style={styles.themeButton}>
                <Text style={styles.themeIcon}>☾</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <View style={styles.statIconBlue}>
                  <Text style={styles.statIconText}>☀️</Text>
                </View>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>{habits.length}</Text>
              </Card>

              <Card style={styles.statCard}>
                <View style={styles.statIconGreen}>
                  <Text style={styles.statIconText}>✓</Text>
                </View>
                <Text style={styles.statLabel}>Done</Text>
                <Text style={styles.statValue}>{completedCount}</Text>
              </Card>

              <Card style={styles.statCard}>
                <View style={styles.statIconPink}>
                  <Text style={styles.statIconText}>🔥</Text>
                </View>
                <Text style={styles.statLabel}>Streak</Text>
                <Text style={styles.statValue}>{streak}</Text>
              </Card>
            </View>

            <Card style={styles.quoteCard}>
              <Text style={styles.quoteText}>“{quote.content}”</Text>
              <Text style={styles.quoteAuthor}>— {quote.author}</Text>
            </Card>

            <Card style={styles.progressCard}>
              <Text style={styles.progressLabel}>Daily Progress</Text>

              <View style={styles.progressBackground}>
                <Animated.View
                  style={[styles.progressFill, { width: progressWidth }]}
                />
              </View>

              <Text style={styles.progressText}>
                {Math.round(progressPercent * 100)}%
              </Text>
            </Card>

            <Text style={styles.sectionTitle}>Today</Text>

            {loading && (
              <ActivityIndicator
                size="large"
                color={colors.black}
                style={{ marginVertical: spacing.md }}
              />
            )}
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>
              All habits completed for today 🎉
            </Text>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/drawer/add-habit")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  listContent: {
    padding: spacing.lg,
    paddingBottom: 110,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
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
  },

  themeButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  themeIcon: {
    fontSize: 20,
  },

  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  statCard: {
    flex: 1,
    minHeight: 104,
  },

  statIconBlue: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  statIconGreen: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  statIconPink: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: "#FCE7F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  statIconText: {
    fontSize: 13,
  },

  statLabel: {
    fontSize: 12,
    color: colors.subtext,
  },

  statValue: {
    fontSize: 24,
    color: colors.text,
    fontWeight: "400",
    marginTop: spacing.xs,
  },

  quoteCard: {
    marginBottom: spacing.md,
  },

  quoteText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
  },

  quoteAuthor: {
    marginTop: spacing.sm,
    color: colors.subtext,
    fontSize: 12,
  },

  progressCard: {
    marginBottom: spacing.lg,
  },

  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: spacing.sm,
  },

  progressBackground: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: colors.black,
    borderRadius: 10,
  },

  progressText: {
    marginTop: spacing.sm,
    color: colors.subtext,
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },

  taskCard: {
    marginBottom: spacing.md,
  },

  taskRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.muted,
    marginTop: 3,
    marginRight: spacing.sm,
  },

  taskContent: {
    flex: 1,
  },

  taskTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },

  taskSubtitle: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing.xs,
  },

  pinkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.pink,
    marginTop: 8,
    marginLeft: spacing.sm,
  },

  emptyText: {
    textAlign: "center",
    color: colors.subtext,
    marginTop: spacing.lg,
  },

  fab: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: colors.black,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  fabText: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "300",
    marginTop: -2,
  },
});