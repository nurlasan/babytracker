import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useApp } from '../context';
import { C, ECFG } from '../theme';
import { fmt } from '../utils';
import EventRow from '../components/EventRow';

export default function StatsScreen() {
  const { events } = useApp();
  const today = new Date().toDateString();
  const todayEvts = events.filter(e => e.time.toDateString() === today);
  const lastOf = type => events.find(e => e.type === type);

  const baths   = todayEvts.filter(e => e.type === 'bath');
  const warmups = todayEvts.filter(e => e.type === 'warmup');
  const meds    = todayEvts.filter(e => e.type === 'medicine');
  const feedBreast = todayEvts.filter(e => e.type === 'feeding' && e.details.method === 'breast').length;
  const feedBottle = todayEvts.filter(e => e.type === 'feeding' && e.details.method === 'bottle').length;
  const bottleMl   = todayEvts.filter(e => e.type === 'feeding' && e.details.method === 'bottle')
    .reduce((s, e) => s + (e.details.amount || 0), 0);
  const pumpMl     = todayEvts.filter(e => e.type === 'pump').reduce((s, e) => s + (e.details.amount || 0), 0);
  const sleepMins  = todayEvts.filter(e => e.type === 'sleep').reduce((s, e) => s + (e.details.duration || 0), 0);

  const rows = [
    { cfg: ECFG.feeding,  val: `${todayEvts.filter(e=>e.type==='feeding').length} раз`,   note: lastOf('feeding')  ? fmt.ago(lastOf('feeding').time)  : 'Нет сегодня' },
    { cfg: ECFG.diaper,   val: `${todayEvts.filter(e=>e.type==='diaper').length} шт`,     note: lastOf('diaper')   ? fmt.ago(lastOf('diaper').time)   : 'Нет сегодня' },
    { cfg: ECFG.sleep,    val: fmt.dur(sleepMins),                                         note: 'Суммарный сон' },
    { cfg: ECFG.bath,     val: `${baths.length} раз`,
      note: baths.length > 0 ? `Ср. темп: ${(baths.reduce((s,e)=>s+e.details.temp,0)/baths.length).toFixed(1)}°C` : 'Нет сегодня' },
    { cfg: ECFG.warmup,   val: `${warmups.length} раз`,
      note: warmups.length > 0 ? fmt.dur(warmups.reduce((s,e)=>s+e.details.duration,0)) : 'Нет сегодня' },
    { cfg: ECFG.pump,     val: pumpMl > 0 ? `${pumpMl} мл` : '—',  note: 'Сцежено сегодня' },
    { cfg: ECFG.medicine, val: `${meds.length} раз`,
      note: meds.length > 0 ? meds.map(m=>m.details.name).join(', ') : 'Нет сегодня' },
  ];

  const lastFeedings = events.filter(e => e.type === 'feeding').slice(0, 8);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={styles.sectionTitle}>Сегодня</Text>
        {rows.map((r, i) => (
          <View key={i} style={[styles.statRow, { backgroundColor: r.cfg.light }]}>
            <Text style={{ fontSize: 28 }}>{r.cfg.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.statLabel, { color: r.cfg.color }]}>{r.cfg.label}</Text>
              <Text style={styles.statNote}>{r.note}</Text>
            </View>
            <Text style={[styles.statVal, { color: r.cfg.color }]}>{r.val}</Text>
          </View>
        ))}

        {(feedBreast > 0 || feedBottle > 0) && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Кормления</Text>
            <View style={styles.feedRow}>
              {feedBreast > 0 && <View style={[styles.feedCard, { backgroundColor: C.coralLight }]}>
                <Text style={{ fontSize: 24, marginBottom: 4 }}>🤱</Text>
                <Text style={[styles.feedNum, { color: C.coral }]}>{feedBreast}</Text>
                <Text style={styles.feedSub}>Грудь</Text>
              </View>}
              {feedBottle > 0 && <View style={[styles.feedCard, { backgroundColor: C.coralLight }]}>
                <Text style={{ fontSize: 24, marginBottom: 4 }}>🍼</Text>
                <Text style={[styles.feedNum, { color: C.coral }]}>{feedBottle}</Text>
                <Text style={styles.feedSub}>Бутылочка</Text>
              </View>}
              {bottleMl > 0 && <View style={[styles.feedCard, { backgroundColor: C.coralLight }]}>
                <Text style={{ fontSize: 24, marginBottom: 4 }}>📏</Text>
                <Text style={[styles.feedNum, { color: C.coral }]}>{bottleMl}</Text>
                <Text style={styles.feedSub}>мл всего</Text>
              </View>}
            </View>
          </>
        )}

        {lastFeedings.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Последние кормления</Text>
            {lastFeedings.map(ev => <EventRow key={ev.id} event={ev} />)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 12 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 14, marginBottom: 8 },
  statLabel: { fontSize: 13, fontWeight: '800' },
  statNote: { fontSize: 11, color: C.textMuted, marginTop: 2 },
  statVal: { fontSize: 18, fontWeight: '900' },
  feedRow: { flexDirection: 'row', gap: 10 },
  feedCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center' },
  feedNum: { fontSize: 22, fontWeight: '900' },
  feedSub: { fontSize: 11, color: C.textMuted, fontWeight: '600', marginTop: 2 },
});
