import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Switch, TextInput, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { useApp } from '../context';
import { C, ECFG } from '../theme';
import { fmt } from '../utils';
import { eventDetail } from '../utils';
import { playSoundEffect, vibrateDevice } from '../sounds';
import { VIBRATION_PATTERNS, SOUND_TYPES } from '../data';

const GROUPS = [
  { key: 'morning', label: '🌅 Утро',   range: [5, 12]  },
  { key: 'day',     label: '☀️ День',    range: [12, 18] },
  { key: 'evening', label: '🌆 Вечер',   range: [18, 22] },
  { key: 'night',   label: '🌙 Ночь',    range: [22, 29] },
];
const getGroup = time => {
  const h = parseInt(time.split(':')[0], 10);
  const hh = h < 5 ? h + 24 : h;
  return GROUPS.find(g => hh >= g.range[0] && hh < g.range[1])?.key || 'night';
};
const toMins = t => { const [h, m] = t.split(':').map(Number); return h < 5 ? h*60+m+1440 : h*60+m; };

export default function ScheduleScreen() {
  const { events, reminders, setReminders, soundSettings, setSoundSettings, clearAll } = useApp();
  const [tab, setTab] = useState('timeline');
  const [showAdd, setShowAdd] = useState(false);
  const [newType, setNewType]   = useState('feeding');
  const [newLabel, setNewLabel] = useState('');
  const [newTime, setNewTime]   = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const today    = new Date().toDateString();
  const todayEvts= [...events.filter(e => e.time.toDateString() === today)].sort((a,b) => a.time - b.time);
  const nowMins  = new Date().getHours()*60 + new Date().getMinutes();

  // ── Timeline ──────────────────────────────────────────────────────────────
  const TimelineTab = () => (
    <View>
      <Text style={styles.subheader}>
        {new Date().toLocaleDateString('ru-RU', { weekday:'long', day:'numeric', month:'long' })} · {todayEvts.length} событий
      </Text>
      {todayEvts.length === 0 ? (
        <View style={styles.empty}><Text style={{fontSize:48}}>📋</Text><Text style={styles.emptyText}>Нет событий сегодня</Text></View>
      ) : (
        <View style={{ paddingLeft: 56 }}>
          {todayEvts.map((ev, i) => {
            const cfg  = ECFG[ev.type] || { emoji:'📋', color:C.textMuted, light:C.border };
            const past = ev.time.getHours()*60+ev.time.getMinutes() <= nowMins;
            return (
              <View key={ev.id} style={styles.tlItem}>
                <Text style={styles.tlTime}>{fmt.time(ev.time)}</Text>
                <View style={[styles.tlDot, { backgroundColor: past ? cfg.color : C.surface, borderColor: cfg.color }]} />
                <View style={[styles.tlCard, { backgroundColor: cfg.light }]}>
                  <Text style={[styles.tlType, {color: cfg.color}]}>{cfg.emoji} {cfg.label}</Text>
                  <Text style={styles.tlDetail}>{eventDetail(ev)}</Text>
                </View>
              </View>
            );
          })}
          {/* NOW marker */}
          <View style={styles.tlItem}>
            <Text style={[styles.tlTime, {color: C.coral, fontWeight:'800'}]}>{fmt.time(new Date())}</Text>
            <View style={[styles.tlDot, { backgroundColor: C.coral, borderColor: C.coral, width:14, height:14 }]} />
            <View style={[styles.tlNowLine]} />
          </View>
        </View>
      )}
    </View>
  );

  // ── Reminders ─────────────────────────────────────────────────────────────
  const addReminder = () => {
    if (!newLabel.trim()) return;
    const timeStr = fmt.hhmm(newTime);
    setReminders(p => [...p, { id: Date.now(), type: newType, label: newLabel.trim(), time: timeStr, enabled: true }]);
    setNewLabel(''); setShowAdd(false);
  };

  const RemindersTab = () => {
    const sorted = [...reminders].sort((a, b) => toMins(a.time) - toMins(b.time));
    let lastGroup = null;
    return (
      <View>
        {sorted.map(r => {
          const g = getGroup(r.time);
          const cfg = ECFG[r.type] || { emoji:'⏰', color:C.blue, light:C.blueLight };
          const rMins = toMins(r.time);
          const isNext = r.enabled && rMins > nowMins && rMins - nowMins < 120;
          const groupHeader = g !== lastGroup ? (lastGroup = g, GROUPS.find(x => x.key === g)?.label) : null;
          return (
            <View key={r.id}>
              {groupHeader && (
                <View style={styles.groupHeader}>
                  <Text style={styles.groupText}>{groupHeader}</Text>
                  <View style={styles.groupLine} />
                </View>
              )}
              <View style={[styles.reminderRow, { opacity: r.enabled ? 1 : 0.4 }]}>
                <View style={[styles.remIcon, { backgroundColor: cfg.light }]}>
                  <Text style={{ fontSize: 18 }}>{cfg.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.remLabel}>{r.label}</Text>
                    {isNext && <View style={[styles.badge, {backgroundColor: cfg.light}]}>
                      <Text style={[styles.badgeText, {color: cfg.color}]}>скоро</Text>
                    </View>}
                  </View>
                  <Text style={styles.remType}>{cfg.label}</Text>
                </View>
                <Text style={[styles.remTime, { color: r.enabled ? cfg.color : C.textMuted }]}>{r.time}</Text>
                <Switch
                  value={r.enabled}
                  onValueChange={v => setReminders(p => p.map(x => x.id === r.id ? {...x, enabled: v} : x))}
                  trackColor={{ false: C.border, true: cfg.color + '80' }}
                  thumbColor={r.enabled ? cfg.color : C.textLight}
                />
                <TouchableOpacity onPress={() => setReminders(p => p.filter(x => x.id !== r.id))} hitSlop={{top:8,bottom:8,left:8,right:8}}>
                  <Text style={{ fontSize: 16, color: C.textLight }}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Add form */}
        {showAdd && (
          <View style={styles.addForm}>
            <Text style={styles.addTitle}>Новое напоминание</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:12}}>
              <View style={{ flexDirection:'row', gap:6 }}>
                {Object.entries(ECFG).map(([k, v]) => (
                  <TouchableOpacity key={k} onPress={() => setNewType(k)}
                    style={[styles.typeChip, { borderColor: newType===k ? v.color : C.border, backgroundColor: newType===k ? v.light : 'transparent' }]}>
                    <Text style={{ fontSize:12, fontWeight:'700', color: newType===k ? v.color : C.textMuted }}>{v.emoji} {v.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TextInput value={newLabel} onChangeText={setNewLabel} placeholder="Название..."
              style={styles.textInput} placeholderTextColor={C.textLight} />
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.timePickerBtn}>
              <Text style={{ color: C.blue, fontWeight:'700', fontSize:15 }}>⏰ Время: {fmt.hhmm(newTime)}</Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker value={newTime} mode="time" is24Hour locale="ru"
                onChange={(_, d) => { setShowPicker(Platform.OS === 'ios'); if(d) setNewTime(d); }} />
            )}
            <TouchableOpacity onPress={addReminder} style={[styles.saveBtn, { backgroundColor: C.blue }]}>
              <Text style={styles.saveBtnText}>Добавить</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // ── Settings ──────────────────────────────────────────────────────────────
  const SettingsTab = () => {
    const ss = soundSettings;
    const set = (k, v) => setSoundSettings(p => ({ ...p, [k]: v }));
    return (
      <View style={{ gap: 16 }}>
        {/* Sound */}
        <View style={styles.settingsCard}>
          <View style={styles.settingsCardHeader}>
            <View>
              <Text style={styles.settingsCardTitle}>🔔 Звук</Text>
              <Text style={styles.settingsCardSub}>Звук при каждом напоминании</Text>
            </View>
            <Switch value={ss.soundEnabled} onValueChange={v => set('soundEnabled', v)}
              trackColor={{ false: C.border, true: C.blue+'80' }} thumbColor={ss.soundEnabled ? C.blue : C.textLight} />
          </View>
          <View style={{ opacity: ss.soundEnabled ? 1 : 0.4, gap:16 }}>
            <View>
              <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:8 }}>
                <Text style={styles.sliderLabel}>Громкость</Text>
                <Text style={[styles.sliderVal, {color:C.blue}]}>{Math.round(ss.volume*100)}%</Text>
              </View>
              <Slider minimumValue={0} maximumValue={1} step={0.05} value={ss.volume} onValueChange={v => set('volume', v)}
                minimumTrackTintColor={C.blue} maximumTrackTintColor={C.border} thumbTintColor={C.blue} />
            </View>
            <Text style={styles.sliderLabel}>Тип звука</Text>
            <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
              {SOUND_TYPES.map(s => (
                <TouchableOpacity key={s.value} onPress={() => set('soundType', s.value)}
                  style={[styles.soundChip, { borderColor: ss.soundType===s.value ? C.blue : C.border, backgroundColor: ss.soundType===s.value ? C.blueLight : 'transparent' }]}>
                  <Text style={{ fontSize:22, marginBottom:4 }}>{s.emoji}</Text>
                  <Text style={{ fontSize:11, fontWeight:'700', color: ss.soundType===s.value ? C.blue : C.textMuted }}>{s.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => playSoundEffect(ss.soundType, ss.volume)}
                style={[styles.soundChip, { borderColor: C.green, backgroundColor: C.greenLight }]}>
                <Text style={{ fontSize:22, marginBottom:4 }}>▶️</Text>
                <Text style={{ fontSize:11, fontWeight:'800', color:C.green }}>Тест</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Vibration */}
        <View style={styles.settingsCard}>
          <View style={styles.settingsCardHeader}>
            <View>
              <Text style={styles.settingsCardTitle}>📳 Вибрация</Text>
              <Text style={styles.settingsCardSub}>Тактильный отклик</Text>
            </View>
            <Switch value={ss.vibrationEnabled} onValueChange={v => set('vibrationEnabled', v)}
              trackColor={{ false: C.border, true: C.purple+'80' }} thumbColor={ss.vibrationEnabled ? C.purple : C.textLight} />
          </View>
          <View style={{ opacity: ss.vibrationEnabled ? 1 : 0.4, gap:8 }}>
            {VIBRATION_PATTERNS.map(p => (
              <TouchableOpacity key={p.value} onPress={() => { set('vibrationPattern', p.value); vibrateDevice(p.value); }}
                style={[styles.vibRow, { borderColor: ss.vibrationPattern===p.value ? C.purple : C.border, backgroundColor: ss.vibrationPattern===p.value ? C.purpleLight : 'transparent' }]}>
                <View style={{ flex:1 }}>
                  <Text style={{ fontWeight:'700', color: ss.vibrationPattern===p.value ? C.purple : C.text }}>{p.label}</Text>
                  <Text style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{p.desc}</Text>
                </View>
                {ss.vibrationPattern===p.value && <Text style={{ color:C.purple, fontWeight:'700' }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Test button */}
        <TouchableOpacity onPress={() => { if(ss.soundEnabled) playSoundEffect(ss.soundType, ss.volume); if(ss.vibrationEnabled) vibrateDevice(ss.vibrationPattern); }}
          style={[styles.saveBtn, { background: undefined, backgroundColor: C.blue }]}>
          <Text style={styles.saveBtnText}>🔔 Тест полного напоминания</Text>
        </TouchableOpacity>

        {/* Danger zone */}
        <View style={styles.settingsCard}>
          <Text style={styles.settingsCardTitle}>🗄️ Данные</Text>
          <Text style={[styles.settingsCardSub, { marginBottom:12, marginTop:4 }]}>
            {`${events.length} записей · данные хранятся в AsyncStorage`}
          </Text>
          <TouchableOpacity onPress={() => Alert.alert('Удалить все данные?', 'Это действие нельзя отменить', [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Удалить', style: 'destructive', onPress: clearAll },
          ])} style={[styles.saveBtn, { backgroundColor: 'transparent', borderWidth:1.5, borderColor:C.rose }]}>
            <Text style={{ color:C.rose, fontWeight:'800', fontSize:14 }}>🗑️ Очистить все данные</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Tab bar */}
      <View style={styles.tabs}>
        {[['timeline','📅 Сегодня'],['reminders','🔔 Режим'],['settings','⚙️ Настройки']].map(([v,l]) => (
          <TouchableOpacity key={v} onPress={() => setTab(v)}
            style={[styles.tabBtn, tab===v && styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab===v && styles.tabTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'timeline'  && <TimelineTab />}
        {tab === 'reminders' && (
          <>
            <View style={styles.remindersHeader}>
              <Text style={styles.subheader}>{reminders.filter(r=>r.enabled).length} активных напоминаний</Text>
              <TouchableOpacity onPress={() => setShowAdd(v => !v)}
                style={[styles.addBtn, { backgroundColor: showAdd ? C.border : C.blueLight }]}>
                <Text style={{ color: C.blue, fontWeight:'700', fontSize:13 }}>{showAdd ? '✕ Закрыть' : '+ Добавить'}</Text>
              </TouchableOpacity>
            </View>
            <RemindersTab />
          </>
        )}
        {tab === 'settings'  && <SettingsTab />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex:1, backgroundColor:C.bg },
  tabs: { flexDirection:'row', gap:0, margin:16, backgroundColor:C.border, borderRadius:14, padding:3 },
  tabBtn: { flex:1, paddingVertical:9, borderRadius:11, alignItems:'center' },
  tabBtnActive: { backgroundColor:C.surface, shadowColor:'#000', shadowOpacity:0.07, shadowRadius:4, elevation:2 },
  tabText: { fontSize:12, fontWeight:'500', color:C.textMuted },
  tabTextActive: { fontWeight:'800', color:C.text },
  content: { paddingHorizontal:16, paddingBottom:40 },
  subheader: { fontSize:13, color:C.textMuted, marginBottom:16 },
  // Timeline
  tlItem: { position:'relative', marginBottom:12 },
  tlTime: { position:'absolute', left:-56, width:48, textAlign:'right', fontSize:11, fontWeight:'700', color:C.textMuted, top:10 },
  tlDot:  { position:'absolute', left:-14, top:10, width:12, height:12, borderRadius:6, borderWidth:2.5, zIndex:1 },
  tlCard: { borderRadius:14, padding:10, marginLeft:6 },
  tlType: { fontSize:13, fontWeight:'800', marginBottom:2 },
  tlDetail: { fontSize:12, color:C.textMuted },
  tlNowLine: { flex:1, height:2, backgroundColor:C.coral, borderRadius:1, marginLeft:6, marginTop:6 },
  // Reminders
  remindersHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  addBtn: { paddingHorizontal:14, paddingVertical:8, borderRadius:12 },
  groupHeader: { flexDirection:'row', alignItems:'center', gap:8, marginTop:16, marginBottom:8 },
  groupText: { fontSize:12, fontWeight:'800', color:C.textMuted },
  groupLine: { flex:1, height:1, backgroundColor:C.border },
  reminderRow: { flexDirection:'row', alignItems:'center', gap:10, paddingVertical:11, borderBottomWidth:1, borderBottomColor:C.border },
  remIcon: { width:38, height:38, borderRadius:12, alignItems:'center', justifyContent:'center' },
  remLabel: { fontSize:13, fontWeight:'700', color:C.text },
  remType: { fontSize:11, color:C.textMuted, marginTop:1 },
  remTime: { fontSize:14, fontWeight:'800', minWidth:40 },
  badge: { paddingHorizontal:7, paddingVertical:2, borderRadius:8 },
  badgeText: { fontSize:9, fontWeight:'800' },
  // Add form
  addForm: { backgroundColor:C.surface, borderRadius:18, padding:16, marginTop:16, borderWidth:1, borderColor:C.border, gap:12 },
  addTitle: { fontSize:14, fontWeight:'800', color:C.text },
  typeChip: { paddingHorizontal:10, paddingVertical:6, borderRadius:10, borderWidth:1.5 },
  textInput: { backgroundColor:C.bg, borderRadius:12, padding:12, fontSize:14, color:C.text, borderWidth:1.5, borderColor:C.border },
  timePickerBtn: { backgroundColor:C.blueLight, borderRadius:12, padding:12, alignItems:'center', borderWidth:1.5, borderColor:C.blue },
  saveBtn: { borderRadius:18, padding:15, alignItems:'center' },
  saveBtnText: { color:'#fff', fontWeight:'800', fontSize:15 },
  // Settings
  settingsCard: { backgroundColor:C.surface, borderRadius:20, padding:16, borderWidth:1, borderColor:C.border, gap:12 },
  settingsCardHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  settingsCardTitle: { fontSize:16, fontWeight:'800', color:C.text },
  settingsCardSub: { fontSize:12, color:C.textMuted, marginTop:2 },
  sliderLabel: { fontSize:12, fontWeight:'600', color:C.textMuted, textTransform:'uppercase', letterSpacing:0.6 },
  sliderVal: { fontSize:16, fontWeight:'800' },
  soundChip: { width:'30%', padding:10, borderRadius:14, borderWidth:2, alignItems:'center' },
  vibRow: { flexDirection:'row', alignItems:'center', padding:12, borderRadius:12, borderWidth:1.5 },
});
