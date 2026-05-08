export const fmt = {
  time: d => d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  date: d => d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
  ago: d => {
    const m = Math.floor((Date.now() - d) / 60000);
    if (m < 1) return 'только что';
    if (m < 60) return `${m} мин назад`;
    const h = Math.floor(m / 60);
    if (h < 24) { const r = m % 60; return `${h}ч${r > 0 ? ' ' + r + 'м' : ''} назад`; }
    return `${Math.floor(h / 24)} дн назад`;
  },
  dur: m => {
    if (!m || m === 0) return '—';
    if (m < 60) return `${m} мин`;
    const r = m % 60;
    return `${Math.floor(m / 60)} ч${r > 0 ? ' ' + r + ' мин' : ''}`;
  },
  clock: s => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`,
  hhmm: d => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
};

export function eventDetail(ev) {
  const d = ev.details;
  const side = { L: 'лев', R: 'прав', LR: 'обе' };
  if (ev.type === 'feeding') {
    if (d.method === 'breast') return `🤱 Грудь (${side[d.side]}) · ${fmt.dur(d.duration)}`;
    return `🍼 Бутылочка · ${d.amount} мл`;
  }
  if (ev.type === 'diaper')   return { wet: '💧 Мокрый', dirty: '💩 Грязный', mixed: '💧💩 Смешанный', dry: '✨ Сухой' }[d.kind];
  if (ev.type === 'sleep')    return `🌙 ${fmt.dur(d.duration)}`;
  if (ev.type === 'pump')     return `💧 ${d.amount} мл · ${side[d.side]}`;
  if (ev.type === 'bath')     return `🛁 ${d.duration} мин · вода ${d.temp}°C`;
  if (ev.type === 'warmup')   return `🤸 ${fmt.dur(d.duration)} · ${d.kind}`;
  if (ev.type === 'medicine') return `💊 ${d.name} · ${d.dose} ${d.unit}`;
  return '';
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 6)  return 'Ночное дежурство 🌃';
  if (h < 12) return 'Доброе утро ☀️';
  if (h < 17) return 'Добрый день 🌤';
  if (h < 21) return 'Добрый вечер 🌆';
  return 'Спокойной ночи 🌙';
}
