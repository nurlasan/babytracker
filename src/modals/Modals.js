// ─────────────────────────────────────────────────────────────────────────────
// FeedingModal
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { ModalBase, SectionLabel, BtnGroup, SaveBtn, PreviewBox } from './ModalBase';
import { C } from '../theme';
import { fmt } from '../utils';

export function FeedingModal({ onSave, onClose }) {
  const [method,   setMethod]   = useState('breast');
  const [side,     setSide]     = useState('L');
  const [duration, setDuration] = useState(12);
  const [amount,   setAmount]   = useState(80);

  return (
    <ModalBase title="Кормление" emoji="🍼" onClose={onClose}>
      <View><SectionLabel>Способ</SectionLabel>
        <BtnGroup options={[{value:'breast',label:'🤱 Грудь'},{value:'bottle',label:'🍼 Бутылочка'}]}
          value={method} onChange={setMethod} color={C.coral} light={C.coralLight}/>
      </View>
      {method==='breast' && <>
        <View><SectionLabel>Грудь</SectionLabel>
          <BtnGroup options={[{value:'L',label:'← Левая'},{value:'R',label:'Правая →'},{value:'LR',label:'↔ Обе'}]}
            value={side} onChange={setSide} color={C.coral} light={C.coralLight}/>
        </View>
        <View>
          <View style={styles.sliderRow}><Text style={styles.sliderLabel}>Длительность</Text><Text style={[styles.sliderVal,{color:C.coral}]}>{fmt.dur(duration)}</Text></View>
          <Slider minimumValue={1} maximumValue={60} step={1} value={duration} onValueChange={setDuration} minimumTrackTintColor={C.coral} maximumTrackTintColor={C.border} thumbTintColor={C.coral}/>
        </View>
      </>}
      {method==='bottle' && <View>
        <View style={styles.sliderRow}><Text style={styles.sliderLabel}>Объём</Text><Text style={[styles.sliderVal,{color:C.coral}]}>{amount} мл</Text></View>
        <Slider minimumValue={10} maximumValue={250} step={5} value={amount} onValueChange={setAmount} minimumTrackTintColor={C.coral} maximumTrackTintColor={C.border} thumbTintColor={C.coral}/>
      </View>}
      <SaveBtn label="✓ Сохранить кормление" color={C.coral}
        onPress={() => onSave({ type:'feeding', details: method==='breast' ? {method,side,duration} : {method,amount} })}/>
    </ModalBase>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DiaperModal
// ─────────────────────────────────────────────────────────────────────────────
import { TouchableOpacity } from 'react-native';

export function DiaperModal({ onSave, onClose }) {
  const [kind, setKind] = useState('wet');
  const types = [{v:'wet',e:'💧',l:'Мокрый'},{v:'dirty',e:'💩',l:'Грязный'},{v:'mixed',e:'🌊',l:'Смешанный'},{v:'dry',e:'✨',l:'Сухой'}];
  return (
    <ModalBase title="Подгузник" emoji="🌸" onClose={onClose}>
      <View style={styles.diaperGrid}>
        {types.map(t => (
          <TouchableOpacity key={t.v} onPress={() => setKind(t.v)} activeOpacity={0.7}
            style={[styles.diaperCard, { borderColor: kind===t.v ? C.amber : C.border, backgroundColor: kind===t.v ? C.amberLight : '#fff' }]}>
            <Text style={{ fontSize:34, marginBottom:8 }}>{t.e}</Text>
            <Text style={{ fontWeight:'700', fontSize:14, color: kind===t.v ? C.amber : C.textMuted }}>{t.l}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <SaveBtn label="✓ Сохранить подгузник" color={C.amber} onPress={() => onSave({type:'diaper',details:{kind}})}/>
    </ModalBase>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SleepModal
// ─────────────────────────────────────────────────────────────────────────────
export function SleepModal({ onSave, onClose, sleepActive, sleepElapsed, onSleepStart, onSleepStop }) {
  const [mode, setMode]         = useState('timer');
  const [duration, setDuration] = useState(60);
  return (
    <ModalBase title="Сон" emoji="🌙" onClose={onClose}>
      <BtnGroup options={[{value:'timer',label:'⏱ Таймер'},{value:'manual',label:'✏️ Вручную'}]}
        value={mode} onChange={setMode} color={C.blue} light={C.blueLight}/>
      {mode==='timer' && (
        <View style={{ alignItems:'center', paddingVertical:20, gap:16 }}>
          <Text style={[styles.clockText, { color: sleepActive ? C.blue : C.textLight }]}>
            {fmt.clock(sleepElapsed||0)}
          </Text>
          {sleepActive && <Text style={{ fontSize:13, color:C.blue, fontWeight:'700' }}>● Идёт запись сна...</Text>}
          {!sleepActive
            ? <TouchableOpacity onPress={onSleepStart} style={[styles.bigBtn,{backgroundColor:C.blue}]}><Text style={styles.bigBtnText}>▶ Начать</Text></TouchableOpacity>
            : <TouchableOpacity onPress={() => { onSleepStop(); onSave({type:'sleep',details:{duration:Math.max(1,Math.ceil((sleepElapsed||0)/60))}}); }} style={[styles.bigBtn,{backgroundColor:C.coral}]}><Text style={styles.bigBtnText}>⏹ Стоп и сохранить</Text></TouchableOpacity>
          }
        </View>
      )}
      {mode==='manual' && <>
        <View>
          <View style={styles.sliderRow}><Text style={styles.sliderLabel}>Длительность</Text><Text style={[styles.sliderVal,{color:C.blue}]}>{fmt.dur(duration)}</Text></View>
          <Slider minimumValue={5} maximumValue={360} step={5} value={duration} onValueChange={setDuration} minimumTrackTintColor={C.blue} maximumTrackTintColor={C.border} thumbTintColor={C.blue}/>
        </View>
        <SaveBtn label="✓ Сохранить сон" color={C.blue} onPress={() => onSave({type:'sleep',details:{duration}})}/>
      </>}
    </ModalBase>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BathModal
// ─────────────────────────────────────────────────────────────────────────────
export function BathModal({ onSave, onClose }) {
  const [temp, setTemp]         = useState(37);
  const [duration, setDuration] = useState(10);
  const [mode, setMode]         = useState('timer');
  const [active, setActive]     = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const [startTime, setStartTime]= useState(null);

  useEffect(() => {
    if (!active||!startTime) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now()-startTime)/1000)), 1000);
    return () => clearInterval(t);
  }, [active, startTime]);

  const tempStatus = temp<36 ? {label:'❄️ Прохладно',color:C.blue}
    : temp<=37.5 ? {label:'✅ Оптимально',color:C.teal}
    : temp<=38.5 ? {label:'🌡️ Тепло',color:C.amber}
    : {label:'🔥 Горячо',color:C.coral};

  return (
    <ModalBase title="Купание" emoji="🛁" onClose={onClose}>
      <BtnGroup options={[{value:'timer',label:'⏱ Таймер'},{value:'manual',label:'✏️ Вручную'}]}
        value={mode} onChange={setMode} color={C.teal} light={C.tealLight}/>
      <View>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Температура воды</Text>
          <Text style={[styles.sliderVal,{color:tempStatus.color}]}>{temp}°C</Text>
        </View>
        <Slider minimumValue={34} maximumValue={42} step={0.5} value={temp} onValueChange={setTemp} minimumTrackTintColor={tempStatus.color} maximumTrackTintColor={C.border} thumbTintColor={tempStatus.color}/>
        <View style={{ flexDirection:'row', gap:8, marginTop:10 }}>
          {[36,37,37.5,38].map(t => (
            <TouchableOpacity key={t} onPress={() => setTemp(t)} style={[styles.quickTemp, { borderColor: temp===t ? C.teal : C.border, backgroundColor: temp===t ? C.tealLight : 'transparent' }]}>
              <Text style={{ fontSize:12, fontWeight:'700', color: temp===t ? C.teal : C.textMuted }}>{t}°</Text>
            </TouchableOpacity>
          ))}
          <View style={[styles.quickTemp,{flex:1,backgroundColor:tempStatus.color+'20',borderColor:'transparent'}]}>
            <Text style={{ fontSize:11, color:tempStatus.color, fontWeight:'700' }}>{tempStatus.label}</Text>
          </View>
        </View>
        <View style={[styles.tip,{backgroundColor:C.tealLight}]}><Text style={{ fontSize:12, color:C.teal }}>💡 Оптимальная температура для новорождённого: 36–37°C</Text></View>
      </View>
      {mode==='timer' && (
        <View style={{ alignItems:'center', paddingVertical:16, gap:12 }}>
          <Text style={[styles.clockText, { color: active ? C.teal : C.textLight }]}>{fmt.clock(elapsed)}</Text>
          {active && <Text style={{ fontSize:13, color:C.teal, fontWeight:'700' }}>🛁 Купание идёт...</Text>}
          {!active
            ? <TouchableOpacity onPress={() => { setActive(true); setStartTime(Date.now()); setElapsed(0); }} style={[styles.bigBtn,{backgroundColor:C.teal}]}><Text style={styles.bigBtnText}>▶ Начать</Text></TouchableOpacity>
            : <TouchableOpacity onPress={() => { setActive(false); onSave({type:'bath',details:{temp,duration:Math.max(1,Math.ceil(elapsed/60))}}); }} style={[styles.bigBtn,{backgroundColor:C.coral}]}><Text style={styles.bigBtnText}>⏹ Стоп и сохранить</Text></TouchableOpacity>
          }
        </View>
      )}
      {mode==='manual' && <>
        <View>
          <View style={styles.sliderRow}><Text style={styles.sliderLabel}>Длительность</Text><Text style={[styles.sliderVal,{color:C.teal}]}>{duration} мин</Text></View>
          <Slider minimumValue={3} maximumValue={45} step={1} value={duration} onValueChange={setDuration} minimumTrackTintColor={C.teal} maximumTrackTintColor={C.border} thumbTintColor={C.teal}/>
        </View>
        <SaveBtn label="✓ Сохранить купание" color={C.teal} onPress={() => onSave({type:'bath',details:{temp,duration}})}/>
      </>}
    </ModalBase>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WarmupModal
// ─────────────────────────────────────────────────────────────────────────────
export function WarmupModal({ onSave, onClose }) {
  const [duration, setDuration] = useState(10);
  const [kind, setKind]         = useState('Гимнастика');
  const types = [{v:'Гимнастика',e:'🤸'},{v:'Массаж',e:'🙌'},{v:'Плавание',e:'🏊'},{v:'Гимн. + Масс.',e:'✨'}];
  return (
    <ModalBase title="Разминка" emoji="🤸" onClose={onClose}>
      <View>
        <SectionLabel>Вид</SectionLabel>
        <View style={styles.warmupGrid}>
          {types.map(t => (
            <TouchableOpacity key={t.v} onPress={() => setKind(t.v)} activeOpacity={0.7}
              style={[styles.warmupCard, { borderColor: kind===t.v ? C.green : C.border, backgroundColor: kind===t.v ? C.greenLight : '#fff' }]}>
              <Text style={{ fontSize:28, marginBottom:6 }}>{t.e}</Text>
              <Text style={{ fontWeight:'700', fontSize:12, color: kind===t.v ? C.green : C.textMuted }}>{t.v}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View>
        <View style={styles.sliderRow}><Text style={styles.sliderLabel}>Длительность</Text><Text style={[styles.sliderVal,{color:C.green}]}>{fmt.dur(duration)}</Text></View>
        <Slider minimumValue={3} maximumValue={60} step={1} value={duration} onValueChange={setDuration} minimumTrackTintColor={C.green} maximumTrackTintColor={C.border} thumbTintColor={C.green}/>
      </View>
      <SaveBtn label="✓ Сохранить разминку" color={C.green} onPress={() => onSave({type:'warmup',details:{duration,kind}})}/>
    </ModalBase>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PumpModal
// ─────────────────────────────────────────────────────────────────────────────
export function PumpModal({ onSave, onClose }) {
  const [amount, setAmount] = useState(80);
  const [side, setSide]     = useState('L');
  return (
    <ModalBase title="Сцеживание" emoji="💧" onClose={onClose}>
      <View><SectionLabel>Грудь</SectionLabel>
        <BtnGroup options={[{value:'L',label:'← Левая'},{value:'R',label:'Правая →'},{value:'LR',label:'↔ Обе'}]}
          value={side} onChange={setSide} color={C.purple} light={C.purpleLight}/>
      </View>
      <View>
        <View style={styles.sliderRow}><Text style={styles.sliderLabel}>Объём</Text><Text style={[styles.sliderVal,{color:C.purple}]}>{amount} мл</Text></View>
        <Slider minimumValue={10} maximumValue={350} step={5} value={amount} onValueChange={setAmount} minimumTrackTintColor={C.purple} maximumTrackTintColor={C.border} thumbTintColor={C.purple}/>
      </View>
      <SaveBtn label="✓ Сохранить сцеживание" color={C.purple} onPress={() => onSave({type:'pump',details:{amount,side}})}/>
    </ModalBase>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MedicineModal
// ─────────────────────────────────────────────────────────────────────────────
import { TextInput } from 'react-native';

export function MedicineModal({ onSave, onClose }) {
  const [name, setName]   = useState('');
  const [dose, setDose]   = useState(1);
  const [unit, setUnit]   = useState('мл');
  const [who, setWho]     = useState('baby');
  return (
    <ModalBase title="Лекарства" emoji="💊" onClose={onClose}>
      <View><SectionLabel>Для кого</SectionLabel>
        <BtnGroup options={[{value:'baby',label:'👶 Малыш'},{value:'mama',label:'🌸 Мама'}]}
          value={who} onChange={setWho} color={C.rose} light={C.roseLight}/>
      </View>
      <View><SectionLabel>Название препарата</SectionLabel>
        <TextInput value={name} onChangeText={setName} placeholder="Введите название..." placeholderTextColor={C.textLight}
          style={[styles.input, { borderColor: name ? C.rose : C.border }]}/>
      </View>
      <View><SectionLabel>Доза</SectionLabel>
        <View style={{ flexDirection:'row', gap:10, alignItems:'center' }}>
          <View style={[styles.doseControl, { backgroundColor: C.roseLight }]}>
            <TouchableOpacity onPress={() => setDose(d => Math.max(0.5, Math.round((d-0.5)*10)/10))} style={styles.doseBtn}>
              <Text style={{ fontSize:22, color:C.rose }}>−</Text>
            </TouchableOpacity>
            <Text style={[styles.doseVal, { color:C.rose }]}>{dose}</Text>
            <TouchableOpacity onPress={() => setDose(d => Math.round((d+0.5)*10)/10)} style={styles.doseBtn}>
              <Text style={{ fontSize:22, color:C.rose }}>+</Text>
            </TouchableOpacity>
          </View>
          <BtnGroup options={[{value:'мл',label:'мл'},{value:'мг',label:'мг'},{value:'кап',label:'кап'},{value:'шт',label:'шт'}]}
            value={unit} onChange={setUnit} color={C.rose} light={C.roseLight}/>
        </View>
      </View>
      <View style={[styles.previewRow, { backgroundColor: C.roseLight }]}>
        <Text style={{ fontSize:15, fontWeight:'700', color:C.rose }}>
          💊 {name||'?'} · {dose} {unit} · {who==='baby' ? 'Малыш' : 'Мама'}
        </Text>
      </View>
      <SaveBtn label="✓ Сохранить" color={C.rose}
        onPress={() => { if(name.trim()) onSave({type:'medicine',details:{name:name.trim(),dose,unit,who}}); }}/>
    </ModalBase>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  sliderRow: { flexDirection:'row', justifyContent:'space-between', marginBottom:8 },
  sliderLabel: { fontSize:11, fontWeight:'700', color:C.textMuted, textTransform:'uppercase', letterSpacing:0.8 },
  sliderVal: { fontSize:18, fontWeight:'800' },
  clockText: { fontSize:56, fontWeight:'900', letterSpacing:2 },
  bigBtn: { paddingHorizontal:44, paddingVertical:14, borderRadius:20 },
  bigBtnText: { color:'#fff', fontWeight:'800', fontSize:16 },
  diaperGrid: { flexDirection:'row', flexWrap:'wrap', gap:12 },
  diaperCard: { width:'47%', padding:20, borderRadius:20, borderWidth:2.5, alignItems:'center' },
  warmupGrid: { flexDirection:'row', flexWrap:'wrap', gap:10 },
  warmupCard: { width:'47%', padding:16, borderRadius:18, borderWidth:2, alignItems:'center' },
  quickTemp: { flex:1, padding:8, borderRadius:10, borderWidth:1.5, alignItems:'center', justifyContent:'center' },
  tip: { borderRadius:12, padding:10, marginTop:10 },
  input: { backgroundColor:C.bg, borderRadius:12, padding:14, fontSize:15, color:C.text, borderWidth:1.5 },
  doseControl: { flexDirection:'row', alignItems:'center', gap:10, borderRadius:14, paddingHorizontal:14, paddingVertical:8 },
  doseBtn: { width:32, height:32, alignItems:'center', justifyContent:'center' },
  doseVal: { fontSize:24, fontWeight:'900', minWidth:44, textAlign:'center' },
  previewRow: { borderRadius:16, padding:14 },
});
