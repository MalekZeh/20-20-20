import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const REMINDER_INTERVAL = 20 * 60 * 1000; // 20 دقيقة

export default function App() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(REMINDER_INTERVAL / 1000);
  const intervalRef = useRef(null);

  useEffect(() => {
    registerForNotifications();
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            triggerReminder();
            return REMINDER_INTERVAL / 1000;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  async function registerForNotifications() {
    await Notifications.requestPermissionsAsync();
  }

  async function triggerReminder() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '👁️ وقت راحة العين',
        body: 'انظر لمسافة 6 أمتار لمدة 20 ثانية',
        sound: true,
      },
      trigger: null,
    });
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>20-20-20</Text>
      <Text style={styles.subtitle}>تذكير راحة العين</Text>

      <View style={styles.timerBox}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>
          {isActive ? 'التذكير مفعّل' : 'التذكير متوقف'}
        </Text>
        <Switch
          value={isActive}
          onValueChange={setIsActive}
          trackColor={{ false: '#ccc', true: '#4A90D9' }}
        />
      </View>

      <TouchableOpacity style={styles.testButton} onPress={triggerReminder}>
        <Text style={styles.testButtonText}>تجربة التذكير الآن</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A90D9',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  timerBox: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: '#4A90D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  switchLabel: {
    fontSize: 18,
    marginRight: 12,
    color: '#333',
  },
  testButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4A90D9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  testButtonText: {
    color: '#4A90D9',
    fontSize: 14,
  },
});
