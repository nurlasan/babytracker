import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

// ── Haptic vibration patterns ──────────────────────────────────────────────────
export async function vibrateDevice(pattern) {
  try {
    switch (pattern) {
      case 'short':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'double':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await new Promise(r => setTimeout(r, 120));
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'triple':
        for (let i = 0; i < 3; i++) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (i < 2) await new Promise(r => setTimeout(r, 100));
        }
        break;
      case 'long':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'pulse':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await new Promise(r => setTimeout(r, 80));
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await new Promise(r => setTimeout(r, 80));
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      default:
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  } catch (e) {
    // Haptics not available on simulator
  }
}

// ── Sound files (place .mp3 in assets/sounds/) ────────────────────────────────
const SOUNDS = {
  chime:   require('../assets/sounds/chime.mp3'),
  bell:    require('../assets/sounds/bell.mp3'),
  lullaby: require('../assets/sounds/lullaby.mp3'),
  beep:    require('../assets/sounds/beep.mp3'),
  soft:    require('../assets/sounds/soft.mp3'),
};

let currentSound = null;

export async function playSoundEffect(type = 'chime', volume = 0.7) {
  try {
    // Unload previous sound
    if (currentSound) {
      await currentSound.unloadAsync();
      currentSound = null;
    }

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true, // plays even when iPhone is on silent
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
    });

    const { sound } = await Audio.Sound.createAsync(
      SOUNDS[type] || SOUNDS.chime,
      { volume: Math.min(1, Math.max(0, volume)) }
    );
    currentSound = sound;
    await sound.playAsync();

    // Auto-unload after playback
    sound.setOnPlaybackStatusUpdate(status => {
      if (status.didJustFinish) {
        sound.unloadAsync();
        currentSound = null;
      }
    });
  } catch (e) {
    // Sound file missing — fall back to haptic only
    await vibrateDevice('double');
  }
}
