import { useCallback } from 'react';

let globalMuted = false;

export const setGlobalMuted = (muted) => {
  globalMuted = muted;
  if (globalMuted) {
    window.speechSynthesis.cancel();
  }
};

function useSpeech() {
  const speak = useCallback((text, options = {}) => {
    if (globalMuted) return;
    if (!text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'ru-RU';
    utterance.rate = options.rate ?? 0.95;
    utterance.pitch = options.pitch ?? 1.0;

    // Определяем пол по pitch
    let gender = 'female';
    if (options.pitch !== undefined) {
      if (options.pitch < 0.9) gender = 'male';
      else if (options.pitch > 1.1) gender = 'female';
      else gender = 'neutral';
    }

    const getBestVoice = (gender) => {
      const voices = window.speechSynthesis.getVoices();
      const preferredFemale = ['Google русский', 'Microsoft Irina', 'Microsoft Anna', 'Yandex Russian', 'русский'];
      const preferredMale = ['Google русский', 'Microsoft Pavel', 'Yandex Russian', 'русский'];
      const preferredList = gender === 'female' ? preferredFemale : preferredMale;
      let voice = voices.find(v => preferredList.some(p => v.name.includes(p)));
      if (!voice) {
        voice = voices.find(v => v.lang === 'ru-RU' &&
          (gender === 'female' ? v.name.includes('Irina') || v.name.includes('Anna') || v.name.includes('Google')
                              : v.name.includes('Pavel') || v.name.includes('Google')));
      }
      if (!voice) voice = voices.find(v => v.lang === 'ru-RU');
      return voice;
    };

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (options.voiceName) {
        const namedVoice = voices.find(v => v.name === options.voiceName);
        if (namedVoice) utterance.voice = namedVoice;
      } else {
        const voice = getBestVoice(gender);
        if (voice) utterance.voice = voice;
      }
    };

    setVoice();
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
}

export default useSpeech;