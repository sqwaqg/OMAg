import { useRef, useEffect, useState } from 'react';

export const useSound = () => {
  const [isSfxEnabled, setIsSfxEnabled] = useState(true);
  const sfxCache = useRef({
    sound: null,
    fail: null,
    ring: null,
    win: null,
  });

  useEffect(() => {
    // Создаём аудио и проверяем, что они загрузились
    sfxCache.current.sound = new Audio('/sounds/sound.mp3');
    sfxCache.current.fail = new Audio('/sounds/fail.mp3');
    sfxCache.current.ring = new Audio('/sounds/ring.mp3');
    sfxCache.current.win = new Audio('/sounds/win.mp3');

    // Устанавливаем громкость (опционально)
    if (sfxCache.current.ring) sfxCache.current.ring.volume = 0.5;
    if (sfxCache.current.win) sfxCache.current.win.volume = 0.5;
    // Проверка загрузки (для отладки)
    const checkAudio = (name, audio) => {
      audio.addEventListener('canplaythrough', () => console.log(`${name} загружен`));
      audio.addEventListener('error', (e) => console.error(`Ошибка загрузки ${name}:`, e));
    };
    checkAudio('sound', sfxCache.current.sound);
    checkAudio('fail', sfxCache.current.fail);
    checkAudio('ring', sfxCache.current.ring);
    checkAudio('win', sfxCache.current.win);

    return () => {
      Object.values(sfxCache.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  const playSfx = (type) => {
    if (!isSfxEnabled) {
      console.warn(`SFX отключены, звук "${type}" не играет`);
      return;
    }
    const audio = sfxCache.current[type];
    if (!audio) {
      console.warn(`Звук "${type}" не найден`);
      return;
    }
    audio.currentTime = 0;
    audio.play().catch(e => console.warn(`Ошибка воспроизведения "${type}":`, e));
  };

  const toggleSfx = () => setIsSfxEnabled(prev => !prev);

  return { playSfx, toggleSfx, isSfxEnabled };
};