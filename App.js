import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from '@expo-google-fonts/nunito';

import { AppContext } from './src/context';
import { Storage } from './src/storage';
import { playSoundEffect, vibrateDevice } from './src/sounds';
import { DEFAULT_REMINDERS, DEFAULT_SOUND_SETTINGS, SAMPLE_EVENTS } from './src/data';
import { ECFG, C } from './src/theme';

import HomeScreen     from './src/screens/HomeScreen';
import HistoryScreen  from './src/screens/HistoryScreen';
import StatsScreen    from './src/screens/StatsScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false, // We handle sound ourselves
    shouldSetBadge: true,
  }),
});

const Tab = createBottomTabNavigator();

const TAB_ICON = { Главная: '🏠', История: '📋', Итоги: '📊', Режим: '🔔' };

export default function App() {
  const [events,       setEvents]       = useState([]);
  const [reminders,    setReminders]    = useState(DEFAULT_REMINDERS);
  const [soundSettings,setSoundSettings]= useState(DEFAULT_SOUND_SETTINGS);
  const [isReady,      setIsReady]      = useState(false);
  const timerRefs     = useRef([]);
  const soundRef      = useRef(soundSettings);
  const isFirstLoad   = useRef(true);

  const [fontsLoaded] = useFonts({
    Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black,
  });

  // ── Load data on mount ────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const [ev, rem, ss] = await Promise.all([
        Storage.loadEvents(),
        Storage.loadReminders(),
        Storage.loadSoundSettings(),
      ]);
      setEvents(ev   || SAMPLE_EVENTS);
      setReminders(rem || DEFAULT_REMINDERS);
      setSoundSettings(ss || DEFAULT_SOUND_SETTINGS);
      setIsReady(true);
    })();
  }, []);

  // ── Auto-save ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return;
    if (isFirstLoad.current) { isFirstLoad.current = false; return; }
    Storage.saveEvents(events);
  }, [events, isReady]);

  useEffect(() => { if (isReady) Storage.saveReminders(reminders); }, [reminders, isReady]);
  useEffect(() => { if (isReady) Storage.saveSoundSettings(soundSettings); soundRef.current = soundSettings; }, [soundSettings, isReady]);

  // ── Request notification permission ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') console.log('Notification permission denied');
    })();
  }, []);

  // ── Schedule reminders ───────────────────────────────────────────────────
  useEffect(() => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
    const now = new Date();
    const active = reminders.filter(r => r.enabled);
    active.forEach(r => {
      const [h, m] = r.time.split(':').map(Number);
      const target = new Date(); target.setHours(h, m, 0, 0);
      let delay = target - now;
      if (delay < 0) delay += 86400000;
      if (delay > 43200000) return; // skip >12h away

      const tid = setTimeout(async () => {
        const ss = soundRef.current;
        const cfg = ECFG[r.type] || { emoji: '⏰' };
        if (ss.soundEnabled)     playSoundEffect(ss.soundType, ss.volume);
        if (ss.vibrationEnabled) vibrateDevice(ss.vibrationPattern);
        await Notifications.scheduleNotificationAsync({
          content: { title: `${cfg.emoji} Baby Tracker`, body: `${r.label} · ${r.time}`, sound: false },
          trigger: null,
        });
      }, delay);
      timerRefs.current.push(tid);
    });
    return () => timerRefs.current.forEach(clearTimeout);
  }, [reminders]);

  // ── Hide splash when ready ────────────────────────────────────────────────
  useEffect(() => {
    if (isReady && fontsLoaded) SplashScreen.hideAsync();
  }, [isReady, fontsLoaded]);

  if (!isReady || !fontsLoaded) {
    return (
      <View style={styles.loading}>
        <Text style={{ fontSize: 64 }}>👶</Text>
        <Text style={styles.loadingTitle}>Baby Tracker</Text>
        <ActivityIndicator color={C.blue} style={{ marginTop: 16 }} />
        <Text style={styles.loadingText}>Загрузка данных...</Text>
      </View>
    );
  }

  // ── CRUD helpers ──────────────────────────────────────────────────────────
  const addEvent    = ev => setEvents(p => [{ ...ev, id: Date.now(), time: new Date() }, ...p]);
  const deleteEvent = id => setEvents(p => p.filter(e => e.id !== id));
  const clearAll    = async () => { await Storage.clearAll(); setEvents([]); setReminders(DEFAULT_REMINDERS); setSoundSettings(DEFAULT_SOUND_SETTINGS); };

  const ctx = { events, addEvent, deleteEvent, reminders, setReminders, soundSettings, setSoundSettings, clearAll };

  return (
    <AppContext.Provider value={ctx}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: () => <Text style={{ fontSize: 22 }}>{TAB_ICON[route.name]}</Text>,
              tabBarStyle: { backgroundColor: C.surface, borderTopColor: C.border, height: 82, paddingBottom: 16 },
              tabBarActiveTintColor: C.coral,
              tabBarInactiveTintColor: C.textMuted,
              tabBarLabelStyle: { fontSize: 11, fontFamily: 'Nunito_700Bold', marginTop: -4 },
            })}
          >
            <Tab.Screen name="Главная"  component={HomeScreen}     />
            <Tab.Screen name="История"  component={HistoryScreen}  />
            <Tab.Screen name="Итоги"    component={StatsScreen}    />
            <Tab.Screen name="Режим"    component={ScheduleScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 8 },
  loadingTitle: { fontSize: 24, fontWeight: '900', color: C.text, marginTop: 12 },
  loadingText: { fontSize: 13, color: C.textMuted, marginTop: 4 },
});
