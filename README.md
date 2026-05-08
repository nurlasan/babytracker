# 👶 Baby Tracker — iOS App

Полноценное мобильное приложение для отслеживания режима новорождённого.

## Что нужно для запуска

| Что | Где взять | Бесплатно? |
|-----|-----------|-----------|
| Mac (для iOS) | — | — |
| Xcode 15+ | App Store на Mac | ✅ |
| Node.js 18+ | nodejs.org | ✅ |
| npm / yarn | вместе с Node.js | ✅ |
| Expo Go (на iPhone) | App Store на iPhone | ✅ |

---

## Быстрый запуск (тест на телефоне за 5 минут)

```bash
# 1. Установить зависимости
npm install

# 2. Запустить Expo
npx expo start

# 3. Открыть Expo Go на iPhone
# 4. Навести камеру на QR-код в терминале
```

Приложение откроется прямо на телефоне! 🎉

---

## Добавить звуки (обязательно!)

Положи `.mp3` файлы в папку `assets/sounds/`:

```
assets/sounds/
  chime.mp3     — колокольчик
  bell.mp3      — колокол
  lullaby.mp3   — колыбельная
  beep.mp3      — сигнал
  soft.mp3      — мягкий тон
```

**Где взять бесплатные звуки:**
- https://freesound.org (поиск: "chime", "bell", "notification")
- https://mixkit.co/free-sound-effects/
- https://pixabay.com/sound-effects/

> Если звуков нет — приложение автоматически использует только вибрацию.

---

## Сборка для App Store (публикация)

### 1. Установить EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 2. Настроить проект
```bash
eas build:configure
```

### 3. Обновить `app.json`
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.ИМЯ.babytracker"  ← поменяй на своё
    },
    "extra": {
      "eas": {
        "projectId": "ID из eas.expo.dev"
      }
    }
  }
}
```

### 4. Собрать IPA
```bash
eas build --platform ios
```

### 5. Отправить в App Store
```bash
eas submit --platform ios
```

---

## Структура проекта

```
baby-tracker/
├── App.js                    ← Главный файл, навигация, хранение данных
├── app.json                  ← Настройки Expo / iOS
├── assets/
│   └── sounds/               ← Звуковые файлы (.mp3)
└── src/
    ├── theme.js              ← Цвета и стили
    ├── utils.js              ← Форматирование дат, времени
    ├── storage.js            ← Сохранение в AsyncStorage
    ├── sounds.js             ← Воспроизведение звука и вибрация
    ├── data.js               ← Расписание по умолчанию, настройки
    ├── context.js            ← React Context (глобальное состояние)
    ├── screens/
    │   ├── HomeScreen.js     ← Главная (быстрые действия, статистика)
    │   ├── HistoryScreen.js  ← Календарь + история по датам
    │   ├── StatsScreen.js    ← Итоги дня
    │   └── ScheduleScreen.js ← Режим дня, уведомления, настройки
    ├── modals/
    │   ├── ModalBase.js      ← Базовый компонент модального окна
    │   ├── Modals.js         ← Все 7 модальных форм
    │   ├── FeedingModal.js   ← Кормление
    │   ├── DiaperModal.js    ← Подгузник
    │   ├── SleepModal.js     ← Сон (таймер + ручной)
    │   ├── BathModal.js      ← Купание (температура воды + таймер)
    │   ├── WarmupModal.js    ← Разминка / массаж
    │   ├── PumpModal.js      ← Сцеживание
    │   └── MedicineModal.js  ← Лекарства
    └── components/
        └── EventRow.js       ← Строка события в списке
```

---

## Хранение данных

Данные сохраняются в **AsyncStorage** — встроенное хранилище телефона.

| Ключ | Содержимое |
|------|-----------|
| `bt:events` | Все записи (JSON) |
| `bt:reminders` | Расписание напоминаний |
| `bt:sound` | Настройки звука и вибрации |

Данные **не удаляются** при закрытии приложения. Удаление только через меню «Очистить все данные».

---

## Уведомления

- На **реальном iPhone** — появляются в шторке, со звуком и вибрацией
- На **симуляторе** — только в приложении (симулятор не поддерживает уведомления)
- Настройка: Режим → ⚙️ Настройки → 🔔 Звук / 📳 Вибрация

---

## Вопросы и помощь

- Expo документация: https://docs.expo.dev
- React Native: https://reactnative.dev
- EAS Build: https://docs.expo.dev/build/introduction/
