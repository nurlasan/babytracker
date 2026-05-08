import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, SafeAreaView,
} from 'react-native';
import { useApp } from '../context';
import { C, ECFG } from '../theme';
import { fmt } from '../utils';
import EventRow from '../components/EventRow';
import FeedingModal from '../modals/FeedingModal';
import DiaperModal from '../modals/DiaperModal';
import SleepModal from '../modals/SleepModal';
import BathModal from '../modals/BathModal';
import WarmupModal from '../modals/WarmupModal';
import PumpModal from '../modals/PumpModal';
import MedicineModal from '../modals/MedicineModal';
import { greeting } from '../utils';

const MODALS = { FeedingModal, DiaperModal, SleepModal, BathModal, WarmupModal, PumpModal, MedicineModal };

export default function HomeScreen() {
  const { events, addEvent } = useApp();
  const [openModal, setOpenModal] = useState(null);
  const [sleepActive, setSleepActive] = useState(false);
  const [sleepStart, setSleepStart] = useState(null);
  const [sleepElapsed, setSleepElapsed] = useState(0);

  React.useEffect(() => {
    if (!sleepActive || !sleepStart) return;
    const t = setInterval(() => setSleepElapsed(Math.floor((Date.now() - sleepStart) / 1000)), 1000);
    return () => clearInterval(t);
  }, [sleepActive, sleepStart]);

  const today = new Date().toDateString();
  const todayEvts = events.filter(e => e.time.toDateString() === today);
  const stats = {
    feedings:  todayEvts.filter(e => e.type === 'feeding').length,
    diapers:   todayEvts.filter(e => e.type === 'diaper').length,
    sleepMins: todayEvts.filter(e => e.type === 'sleep').reduce((s, e) => s + (e.details.duration || 0), 0),
    baths:     todayEvts.filter(e => e.type === 'bath').length,
  };
  const lastOf = type => events.find(e => e.type === type);

  const BABY_BTNS = [
    { type: 'feeding',  modal: 'FeedingModal',  sub: lastOf('feeding') ? fmt.ago(lastOf('feeding').time) : 'нет записей' },
    { type: 'diaper',   modal: 'DiaperModal',   sub: lastOf('diaper') ? fmt.ago(lastOf('diaper').time) : 'нет записей' },
    { type: 'sleep',    modal: 'SleepModal',    sub: sleepActive ? '⏱ ' + fmt.clock(sleepElapsed) : lastOf('sleep') ? fmt.ago(lastOf('sleep').time) : 'нет записей' },
    { type: 'warmup',   modal: 'WarmupModal',   sub: lastOf('warmup') ? fmt.ago(lastOf('warmup').time) : 'нет записей' },
    { type: 'bath',     modal: 'BathModal',     sub: lastOf('bath') ? fmt.ago(lastOf('bath').time) : 'нет записей' },
  ];
  const MAMA_BTNS = [
    { type: 'pump',     modal: 'PumpModal',     sub: stats.pumpMl > 0 ? `Сегодня` : 'нет записей' },
    { type: 'medicine', modal: 'MedicineModal', sub: lastOf('medicine') ? fmt.ago(lastOf('medicine').time) : 'нет записей' },
  ];

  const ModalComp = openModal ? MODALS[openModal] : null;

  const handleSave = (ev) => {
    addEvent(ev);
    setOpenModal(null);
  };

  const Divider = ({ label }) => (
    <View style={styles.divider}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greet}>{greeting()}</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
            <Text style={styles.title}>Малыш 👶</Text>
          </View>
          <View style={styles.avatar}><Text style={{ fontSize: 26 }}>🌸</Text></View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { cfg: ECFG.feeding, val: stats.feedings,             sub: 'корм.' },
            { cfg: ECFG.diaper,  val: stats.diapers,              sub: 'подг.' },
            { cfg: ECFG.sleep,   val: fmt.dur(stats.sleepMins),   sub: 'сон' },
            { cfg: ECFG.bath,    val: stats.baths || '—',         sub: 'купание' },
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: s.cfg.light }]}>
              <Text style={styles.statEmoji}>{s.cfg.emoji}</Text>
              <Text style={[styles.statVal, { color: s.cfg.color }]}>{s.val}</Text>
              <Text style={styles.statSub}>{s.sub}</Text>
            </View>
          ))}
        </View>

        {/* Baby buttons */}
        <Divider label="👶 Малыш" />
        <View style={styles.btnGrid}>
          {BABY_BTNS.map(btn => {
            const cfg = ECFG[btn.type];
            return (
              <TouchableOpacity key={btn.type} style={[styles.actionBtn, { backgroundColor: cfg.light, borderColor: btn.type === 'sleep' && sleepActive ? cfg.color : 'transparent' }]}
                onPress={() => setOpenModal(btn.modal)} activeOpacity={0.7}>
                <Text style={styles.actionEmoji}>{cfg.emoji}</Text>
                <Text style={[styles.actionLabel, { color: cfg.color }]}>{cfg.label}</Text>
                <Text style={styles.actionSub} numberOfLines={1}>{btn.sub}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Mama buttons */}
        <Divider label="🌸 Мама" />
        <View style={styles.btnGrid}>
          {MAMA_BTNS.map(btn => {
            const cfg = ECFG[btn.type];
            return (
              <TouchableOpacity key={btn.type} style={[styles.actionBtn, { backgroundColor: cfg.light }]}
                onPress={() => setOpenModal(btn.modal)} activeOpacity={0.7}>
                <Text style={styles.actionEmoji}>{cfg.emoji}</Text>
                <Text style={[styles.actionLabel, { color: cfg.color }]}>{cfg.label}</Text>
                <Text style={styles.actionSub}>{btn.sub}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recent */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Недавно</Text>
          {events.slice(0, 6).map(ev => (
            <EventRow key={ev.id} event={ev} />
          ))}
          {events.length === 0 && (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48 }}>📝</Text>
              <Text style={styles.emptyText}>Нет записей</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      {ModalComp && (
        <Modal visible animationType="slide" presentationStyle="pageSheet">
          <ModalComp
            onSave={handleSave}
            onClose={() => setOpenModal(null)}
            sleepActive={openModal === 'SleepModal' ? sleepActive : undefined}
            sleepElapsed={openModal === 'SleepModal' ? sleepElapsed : undefined}
            onSleepStart={openModal === 'SleepModal' ? () => { setSleepActive(true); setSleepStart(Date.now()); setSleepElapsed(0); } : undefined}
            onSleepStop={openModal === 'SleepModal' ? () => setSleepActive(false) : undefined}
          />
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, paddingBottom: 14 },
  greet: { fontSize: 12, fontWeight: '600', color: C.textMuted, marginBottom: 2 },
  dateText: { fontSize: 11, color: C.textLight, marginBottom: 3 },
  title: { fontSize: 26, fontWeight: '900', color: C.text },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFE4DC', alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 18, padding: 12, alignItems: 'center' },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statVal: { fontSize: 17, fontWeight: '900', lineHeight: 20 },
  statSub: { fontSize: 9, color: C.textMuted, marginTop: 3, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, marginBottom: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { fontSize: 13, fontWeight: '800', color: C.textMuted },
  btnGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  actionBtn: { width: '48%', padding: 16, borderRadius: 20, borderWidth: 2 },
  actionEmoji: { fontSize: 26, marginBottom: 6 },
  actionLabel: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  actionSub: { fontSize: 10, color: C.textMuted },
  section: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 8 },
  empty: { alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 15, fontWeight: '700', color: C.textMuted, marginTop: 8 },
});
