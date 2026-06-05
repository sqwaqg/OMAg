import { useCallback } from 'react';

function useSpeech() {
  const speak = useCallback((text, options = {}) => {
    if (!text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'ru-RU';
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const russianVoices = voices.filter(v => v.lang.includes('ru'));
      if (russianVoices.length > 0) {
        if (options.speaker === 'father') {
          const maleVoice = russianVoices.find(v => v.name.includes('Microsoft Pavel') || v.name.includes('Pavel'));
          if (maleVoice) utterance.voice = maleVoice;
          else utterance.voice = russianVoices[0];
        } else if (options.speaker === 'girl' || options.speaker === 'child') {
          const femaleVoice = russianVoices.find(v => v.name.includes('Microsoft Irina') || v.name.includes('Irina') || v.name.includes('Dariya'));
          if (femaleVoice) utterance.voice = femaleVoice;
          else utterance.voice = russianVoices[0];
        } else if (options.speaker === 'mother') {
          const femaleVoice = russianVoices.find(v => v.name.includes('Microsoft Irina') || v.name.includes('Irina'));
          if (femaleVoice) utterance.voice = femaleVoice;
          else utterance.voice = russianVoices[0];
        } else {
          utterance.voice = russianVoices[0];
        }
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