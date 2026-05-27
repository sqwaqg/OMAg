import { useCallback } from 'react'

function useSpeech() {
  const speak = useCallback((text, options = {}) => {
    if (!text) return
    
    // Останавливаем предыдущую речь
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = options.lang || 'ru-RU'
    utterance.rate = options.rate || 0.95  // Быстро, но понятно
    utterance.pitch = options.pitch || 1.0
    
    // Пытаемся найти женский голос
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      // Ищем русский женский голос
      const russianVoice = voices.find(voice => 
        voice.lang === 'ru-RU' && (voice.name.includes('Google') || voice.name.includes('Female'))
      )
      if (russianVoice) {
        utterance.voice = russianVoice
      }
    }
    
    setVoice()
    // Некоторые браузеры загружают голоса асинхронно
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoice
    }
    
    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
  }, [])

  return { speak, stop }
}

export default useSpeech