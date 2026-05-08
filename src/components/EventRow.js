import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C, ECFG } from '../theme';
import { fmt, eventDetail } from '../utils';

export default function EventRow({ event, onDelete, showDate = false }) {
  const cfg = ECFG[event.type] || { emoji: '📋', color: C.textMuted, light: C.border, label: event.type };
  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: cfg.light }]}>
        <Text style={styles.emoji}>{cfg.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>{cfg.label}</Text>
        <Text style={styles.detail}>{eventDetail(event)}</Text>
        {showDate && <Text style={styles.date}>{fmt.date(event.time)}</Text>}
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>{fmt.time(event.time)}</Text>
        <Text style={styles.ago}>{fmt.ago(event.time)}</Text>
      </View>
      {onDelete && (
        <TouchableOpacity onPress={() => onDelete(event.id)} style={styles.delBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.delText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 22 },
  info: { flex: 1 },
  label: { fontSize: 14, fontWeight: '700', color: C.text },
  detail: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  date: { fontSize: 10, color: C.textLight, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  time: { fontSize: 13, fontWeight: '600', color: C.text },
  ago: { fontSize: 10, color: C.textLight, marginTop: 2 },
  delBtn: { padding: 4, marginLeft: 4 },
  delText: { fontSize: 14, color: C.textLight },
});
