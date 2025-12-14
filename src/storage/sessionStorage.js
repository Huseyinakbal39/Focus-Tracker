import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@focus_sessions';

export async function addSession(session) {
  // session: { id, date, durationMinutes, category, distractions }
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const list = existing ? JSON.parse(existing) : [];
    list.push(session);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Seans kaydedilirken hata:', e);
  }
}

export async function getAllSessions() {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (e) {
    console.error('Seanslar okunurken hata:', e);
    return [];
  }
}

export async function clearAllSessions() {
  // İstersen debug için kullanırız
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Seanslar silinirken hata:', e);
  }
}
