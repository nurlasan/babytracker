// ─────────────────────────────────────────────────────────────────────────────
// src/modals/ModalBase.js
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { C } from '../theme';

export function ModalBase({ title, emoji, onClose, children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backBtn}>
          <Text style={{ fontSize:18, color:C.text }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{emoji} {title}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>{children}</ScrollView>
    </SafeAreaView>
  );
}

export function SectionLabel({ children }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function BtnGroup({ options, value, onChange, color, light }) {
  return (
    <View style={styles.btnGroup}>
      {options.map(o => (
        <TouchableOpacity key={o.value} onPress={() => onChange(o.value)}
          style={[styles.groupBtn, { borderColor: value===o.value ? color : C.border, backgroundColor: value===o.value ? light : 'transparent' }]}>
          <Text style={{ fontWeight:'700', fontSize:13, color: value===o.value ? color : C.textMuted }}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function SaveBtn({ label, color, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.saveBtn, { backgroundColor: color }]}>
      <Text style={styles.saveBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function PreviewBox({ color, light, children }) {
  return <View style={[styles.preview, { backgroundColor: light }]}>{children}</View>;
}

const styles = StyleSheet.create({
  safe: { flex:1, backgroundColor:C.bg },
  header: { flexDirection:'row', alignItems:'center', gap:14, padding:18, paddingTop: Platform.OS==='ios' ? 18 : 18, backgroundColor:C.surface, borderBottomWidth:1, borderBottomColor:C.border },
  backBtn: { width:36, height:36, borderRadius:18, backgroundColor:C.border, alignItems:'center', justifyContent:'center' },
  title: { fontSize:22, fontWeight:'900', color:C.text },
  body: { padding:20, gap:20, paddingBottom:40 },
  label: { fontSize:11, fontWeight:'700', color:C.textMuted, textTransform:'uppercase', letterSpacing:0.8, marginBottom:10 },
  btnGroup: { flexDirection:'row', gap:8 },
  groupBtn: { flex:1, paddingVertical:11, borderRadius:14, borderWidth:2, alignItems:'center' },
  saveBtn: { borderRadius:20, padding:16, alignItems:'center', marginTop:8 },
  saveBtnText: { color:'#fff', fontSize:16, fontWeight:'800' },
  preview: { borderRadius:16, padding:14 },
});
