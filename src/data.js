export const DEFAULT_SOUND_SETTINGS = {
  soundEnabled: true,
  soundType: 'chime',
  volume: 0.7,
  vibrationEnabled: true,
  vibrationPattern: 'double',
};

export const VIBRATION_PATTERNS = [
  { value: 'short',  label: 'Короткая',  desc: '200 мс' },
  { value: 'double', label: 'Двойная',   desc: '150+150 мс' },
  { value: 'triple', label: 'Тройная',   desc: '3×100 мс' },
  { value: 'long',   label: 'Длинная',   desc: '600 мс' },
  { value: 'pulse',  label: 'Пульс',     desc: 'Акцентная' },
];

export const SOUND_TYPES = [
  { value: 'chime',   label: 'Колокольчик', emoji: '🔔' },
  { value: 'bell',    label: 'Колокол',     emoji: '🎐' },
  { value: 'lullaby', label: 'Колыбельная', emoji: '🎵' },
  { value: 'beep',    label: 'Сигнал',      emoji: '📳' },
  { value: 'soft',    label: 'Мягкий',      emoji: '🌊' },
];

export const DEFAULT_REMINDERS = [
  { id: 1,  type: 'sleep',    label: '☀️ Подъём',                           time: '07:00', enabled: true  },
  { id: 2,  type: 'diaper',   label: 'Подгузник + подмывка',                time: '07:10', enabled: true  },
  { id: 3,  type: 'medicine', label: 'Аквадетрим',                          time: '07:10', enabled: true  },
  { id: 4,  type: 'feeding',  label: 'Кормление 1',                         time: '07:30', enabled: true  },
  { id: 5,  type: 'warmup',   label: 'Столбик, бодрствование',              time: '08:00', enabled: true  },
  { id: 6,  type: 'warmup',   label: '5 мин на животике',                   time: '08:25', enabled: true  },
  { id: 7,  type: 'sleep',    label: 'Сон 1 (1.5 ч)',                       time: '08:30', enabled: true  },
  { id: 8,  type: 'warmup',   label: 'Разминка — 5 мин на животике',        time: '10:35', enabled: true  },
  { id: 9,  type: 'feeding',  label: 'Кормление 2',                         time: '11:00', enabled: true  },
  { id: 10, type: 'warmup',   label: 'Столбик, бодрствование',              time: '11:30', enabled: true  },
  { id: 11, type: 'diaper',   label: 'Подгузник',                           time: '12:00', enabled: true  },
  { id: 12, type: 'sleep',    label: 'Сон 2 — Прогулка (1.5 ч)',            time: '12:00', enabled: true  },
  { id: 13, type: 'warmup',   label: '5 мин на животике',                   time: '13:35', enabled: true  },
  { id: 14, type: 'feeding',  label: 'Кормление 3',                         time: '13:45', enabled: true  },
  { id: 15, type: 'warmup',   label: 'Столбик — Тигр на ветке, карточки',   time: '14:16', enabled: true  },
  { id: 16, type: 'sleep',    label: 'Сон 3 (1.5 ч)',                       time: '15:00', enabled: true  },
  { id: 17, type: 'warmup',   label: '5 мин на животике',                   time: '16:30', enabled: true  },
  { id: 18, type: 'feeding',  label: 'Кормление 4',                         time: '16:35', enabled: true  },
  { id: 19, type: 'warmup',   label: 'Столбик, бодрствование',              time: '17:05', enabled: true  },
  { id: 20, type: 'sleep',    label: 'Сон 4 (1 ч)',                         time: '18:00', enabled: true  },
  { id: 21, type: 'bath',     label: 'Купание + подгузник',                 time: '19:30', enabled: true  },
  { id: 22, type: 'feeding',  label: 'Кормление 5',                         time: '20:00', enabled: true  },
  { id: 23, type: 'sleep',    label: 'Ночной сон (до 08:00)',                time: '21:00', enabled: true  },
  { id: 24, type: 'feeding',  label: 'Ночное кормление',                    time: '00:00', enabled: true  },
  { id: 25, type: 'feeding',  label: 'Ночное кормление',                    time: '03:00', enabled: true  },
  { id: 26, type: 'feeding',  label: 'Ночное кормление',                    time: '06:00', enabled: true  },
];

export const SAMPLE_EVENTS = [
  { id: 1,  type: 'feeding',  time: new Date(Date.now() -  90*60000), details: { method: 'breast', side: 'L', duration: 12 } },
  { id: 2,  type: 'diaper',   time: new Date(Date.now() - 135*60000), details: { kind: 'wet' } },
  { id: 3,  type: 'bath',     time: new Date(Date.now() - 200*60000), details: { temp: 37, duration: 10 } },
  { id: 4,  type: 'warmup',   time: new Date(Date.now() - 260*60000), details: { duration: 10, kind: 'Гимнастика' } },
  { id: 5,  type: 'sleep',    time: new Date(Date.now() - 300*60000), details: { duration: 95 } },
  { id: 6,  type: 'feeding',  time: new Date(Date.now() - 240*60000), details: { method: 'bottle', amount: 80 } },
  { id: 7,  type: 'diaper',   time: new Date(Date.now() - 360*60000), details: { kind: 'dirty' } },
  { id: 8,  type: 'pump',     time: new Date(Date.now() - 420*60000), details: { amount: 90, side: 'L' } },
  { id: 9,  type: 'medicine', time: new Date(Date.now() - 480*60000), details: { name: 'Витамин D3', dose: 1, unit: 'кап', who: 'baby' } },
];
