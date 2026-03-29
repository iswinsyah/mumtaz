import { useState, useEffect, useRef } from 'react';

export const useQuranSpeech = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  const isManualStopRef = useRef(false); // Deteksi apakah user menekan tombol Berhenti
  const previousTranscriptRef = useRef(''); // Teks dari sesi-sesi mic sebelumnya
  const currentTranscriptRef = useRef('');  // Teks dari sesi mic yang sedang berjalan

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Browser tidak mendukung fitur pengenalan suara. Gunakan Google Chrome/Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; 
    // Nyalakan kembali interim agar UI terasa responsif, logika baru kita kebal terhadap stuttering
    recognition.interimResults = true; 
    recognition.lang = 'ar-SA'; // Bahasa Arab

    recognition.onresult = (event) => {
      let currentSessionText = '';
      // Selalu susun ulang dari 0 untuk menghindari bug duplikasi di browser HP
      for (let i = 0; i < event.results.length; i++) {
        currentSessionText += event.results[i][0].transcript + ' ';
      }
      currentTranscriptRef.current = currentSessionText;
      
      // Gabungkan memori teks lama dengan yang baru
      setTranscript((previousTranscriptRef.current + ' ' + currentTranscriptRef.current).trim());
    };

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') {
        console.error('Speech recognition error', event.error);
        setError(event.error);
      }
    };

    recognition.onend = () => {
      // Jika mic mati sendiri (karena jeda napas) padahal user belum tekan "Berhenti", hidupkan lagi!
      if (!isManualStopRef.current) {
        // Simpan hasil tangkapan sesi ini ke memori permanen sebelum restart
        if (currentTranscriptRef.current.trim() !== '') {
          previousTranscriptRef.current += ' ' + currentTranscriptRef.current.trim();
        }
        currentTranscriptRef.current = ''; // Kosongkan sesi saat ini
        
        try {
          recognition.start();
        } catch(e) {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    setTranscript('');
    previousTranscriptRef.current = '';
    currentTranscriptRef.current = '';
    setError(null);
    isManualStopRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Mic sudah aktif atau error:", e);
      }
    }
  };

  const stopListening = () => {
    isManualStopRef.current = true;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { transcript, isListening, startListening, stopListening, error };
};