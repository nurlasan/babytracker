import { StyleSheet, Platform } from 'react-native';

export const C = {
  bg:          '#FFF9F5',
  surface:     '#FFFFFF',
  coral:       '#FF6B4A',
  coralLight:  '#FFF1EC',
  amber:       '#F5A623',
  amberLight:  '#FFF8E8',
  blue:        '#4A9BE8',
  blueLight:   '#EDF5FF',
  purple:      '#9B6FD6',
  purpleLight: '#F3EEFF',
  teal:        '#1BBFA4',
  tealLight:   '#E8FAF7',
  green:       '#52C07A',
  greenLight:  '#EDFBF3',
  rose:        '#E0467A',
  roseLight:   '#FEE8F0',
  text:        '#2A1F16',
  textMuted:   '#9B8E82',
  textLight:   '#C8BDB5',
  border:      '#EDE5DC',
};

export const ECFG = {
  feeding:  { emoji: '🍼', color: C.coral,  light: C.coralLight,  label: 'Кормление',  group: 'baby' },
  diaper:   { emoji: '🌸', color: C.amber,  light: C.amberLight,  label: 'Подгузник',  group: 'baby' },
  sleep:    { emoji: '🌙', color: C.blue,   light: C.blueLight,   label: 'Сон',         group: 'baby' },
  warmup:   { emoji: '🤸', color: C.green,  light: C.greenLight,  label: 'Разминка',   group: 'baby' },
  bath:     { emoji: '🛁', color: C.teal,   light: C.tealLight,   label: 'Купание',    group: 'baby' },
  pump:     { emoji: '💧', color: C.purple, light: C.purpleLight, label: 'Сцеживание', group: 'mama' },
  medicine: { emoji: '💊', color: C.rose,   light: C.roseLight,   label: 'Лекарства',  group: 'mama' },
};

export const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  card: {
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  h1: {
    fontSize: 26,
    fontWeight: '900',
    color: C.text,
    lineHeight: 30,
  },
  h2: {
    fontSize: 18,
    fontWeight: '800',
    color: C.text,
  },
  h3: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
  },
  body: {
    fontSize: 14,
    color: C.text,
  },
  muted: {
    fontSize: 12,
    color: C.textMuted,
  },
  btn: {
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: C.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    paddingTop: Platform.OS === 'ios' ? 54 : 18,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
  },
});
