import AsyncStorage from '@react-native-async-storage/async-storage';

const serialize = evts =>
  evts.map(e => ({ ...e, time: e.time instanceof Date ? e.time.toISOString() : e.time }));

const deserialize = evts =>
  evts.map(e => ({ ...e, time: new Date(e.time) }));

export const Storage = {
  async saveEvents(events) {
    try { await AsyncStorage.setItem('bt:events', JSON.stringify(serialize(events))); } catch (e) {}
  },
  async loadEvents() {
    try {
      const s = await AsyncStorage.getItem('bt:events');
      return s ? deserialize(JSON.parse(s)) : null;
    } catch { return null; }
  },
  async saveReminders(reminders) {
    try { await AsyncStorage.setItem('bt:reminders', JSON.stringify(reminders)); } catch (e) {}
  },
  async loadReminders() {
    try { const s = await AsyncStorage.getItem('bt:reminders'); return s ? JSON.parse(s) : null; } catch { return null; }
  },
  async saveSoundSettings(settings) {
    try { await AsyncStorage.setItem('bt:sound', JSON.stringify(settings)); } catch (e) {}
  },
  async loadSoundSettings() {
    try { const s = await AsyncStorage.getItem('bt:sound'); return s ? JSON.parse(s) : null; } catch { return null; }
  },
  async clearAll() {
    try { await AsyncStorage.multiRemove(['bt:events', 'bt:reminders', 'bt:sound']); } catch (e) {}
  },
  async getStats() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const btKeys = keys.filter(k => k.startsWith('bt:'));
      const pairs = await AsyncStorage.multiGet(btKeys);
      let totalBytes = 0;
      pairs.forEach(([, v]) => { if (v) totalBytes += v.length; });
      return { keys: btKeys.length, sizeKb: Math.round(totalBytes / 1024 * 10) / 10 };
    } catch { return { keys: 0, sizeKb: 0 }; }
  },
};
