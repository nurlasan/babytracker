import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useApp } from '../context';
import { C, ECFG } from '../theme';
import { fmt, eventDetail } from '../utils';
import EventRow from '../components/EventRow';

export default function HistoryScreen() {
  const { events, deleteEvent } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDay, setSelectedDay] = useState(todayStr);
  const [filter, setFilter] = useState('all');

  // Build marked dates for calendar dots
  const markedDates = {};
  events.forEach(ev => {
    const key = ev.time.toISOString().split('T')[0];
    if (!markedDates[key]) markedDates[key] = { dots: [], selected: key === selectedDay };
    const cfg = ECFG[ev.type];
    if (cfg && !markedDates[key].dots.find(d => d.color === cfg.color) && markedDates[key].dots.length < 4) {
      markedDates[key].dots.push({ color: cfg.color, selectedDotColor: '#fff' });
    }
  });
  // Ensure selected day styling
  if (!markedDates[selectedDay]) markedDates[selectedDay] = { dots: [] };
  markedDates[selectedDay] = {
    ...markedDates[selectedDay],
    selected: true,
    selectedColor: C.blue,
  };

  // Filter events for selected day
  const dayEvts = events
    .filter(e => e.time.toISOString().split('T')[0] === selectedDay)
    .filter(e => filter === 'all' || e.type === filter)
    .sort((a, b) => a.time - b.time);

  const allDayEvts = events.filter(e => e.time.toISOString().split('T')[0] === selectedDay);

  const dayStats = {
    feedings: allDayEvts.filter(e => e.type === 'feeding').length,
    diapers:  allDayEvts.filter(e => e.type === 'diaper').length,
    sleep:    allDayEvts.filter(e => e.type === 'sleep').reduce((s, e) => s + (e.details?.duration || 0), 0),
  };

  const typesInDay = ['all', ...Object.keys(ECFG).filter(t => allDayEvts.some(e => e.type === t))];
  const countFor   = t => t === 'all' ? allDayEvts.length : allDayEvts.filter(e => e.type === t).length;

  const selDate = new Date(selectedDay + 'T12:00:00');
  const selLabel = selDate.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView stickyHeaderIndices={[0]}>
        {/* Calendar sticky header */}
        <View style={styles.calendarWrap}>
          <Calendar
            current={selectedDay}
            onDayPress={day => { setSelectedDay(day.dateString); setFilter('all'); }}
            markingType="multi-dot"
            markedDates={markedDates}
            theme={{
              backgroundColor: C.surface,
              calendarBackground: C.surface,
              selectedDayBackgroundColor: C.blue,
              selectedDayTextColor: '#fff',
              todayTextColor: C.blue,
              dayTextColor: C.text,
              textDisabledColor: C.textLight,
              dotColor: C.coral,
              arrowColor: C.blue,
              monthTextColor: C.text,
              textMonthFontWeight: '800',
              textDayFontWeight: '600',
              textDayHeaderFontWeight: '700',
              textSectionTitleColor: C.textMuted,
            }}
          />
        </View>

        {/* Selected day content */}
        <View style={styles.content}>
          {/* Day header */}
          <View style={styles.dayHeader}>
            <View>
              <Text style={styles.dayLabel}>{selLabel}</Text>
              <Text style={styles.dayCount}>{allDayEvts.length} записей</Text>
            </View>
            {allDayEvts.length > 0 && (
              <View style={styles.miniStats}>
                {dayStats.feedings > 0 && <Text style={[styles.miniStat, { color: C.coral }]}>🍼 {dayStats.feedings}</Text>}
                {dayStats.diapers  > 0 && <Text style={[styles.miniStat, { color: C.amber }]}>🌸 {dayStats.diapers}</Text>}
                {dayStats.sleep    > 0 && <Text style={[styles.miniStat, { color: C.blue  }]}>🌙 {fmt.dur(dayStats.sleep)}</Text>}
              </View>
            )}
          </View>

          {/* Filter chips */}
          {allDayEvts.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={{ gap: 8, paddingRight: 8 }}>
              {typesInDay.map(t => {
                const cfg = t === 'all' ? null : ECFG[t];
                const active = filter === t;
                return (
                  <TouchableOpacity key={t} onPress={() => setFilter(t)}
                    style={[styles.chip, { borderColor: active ? (cfg?.color || C.text) : C.border, backgroundColor: active ? (cfg?.light || '#F5F0EC') : 'transparent' }]}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: active ? (cfg?.color || C.text) : C.textMuted }}>
                      {t === 'all' ? 'Все' : cfg.emoji + ' ' + cfg.label}
                    </Text>
                    <View style={[styles.chipBadge, { backgroundColor: active ? (cfg?.color || C.text) : C.border }]}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: active ? '#fff' : C.textMuted }}>{countFor(t)}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Events */}
          {allDayEvts.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48 }}>📭</Text>
              <Text style={styles.emptyTitle}>Нет записей</Text>
              <Text style={styles.emptyText}>В этот день ничего не записано</Text>
            </View>
          ) : dayEvts.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 36 }}>🔍</Text>
              <Text style={styles.emptyTitle}>Нет событий этого типа</Text>
            </View>
          ) : (
            dayEvts.map(ev => <EventRow key={ev.id} event={ev} onDelete={deleteEvent} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  calendarWrap: { backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  content: { padding: 16 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 },
  dayLabel: { fontSize: 15, fontWeight: '800', color: C.text, textTransform: 'capitalize' },
  dayCount: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  miniStats: { flexDirection: 'row', gap: 8 },
  miniStat: { fontSize: 12, fontWeight: '700' },
  chips: { marginBottom: 14 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, borderWidth: 1.5 },
  chipBadge: { borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: C.textMuted, marginTop: 10 },
  emptyText: { fontSize: 13, color: C.textLight, marginTop: 4 },
});
