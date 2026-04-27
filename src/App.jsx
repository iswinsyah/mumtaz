/* eslint-disable no-unused-vars */
// Komponen Utama Aplikasi At Tahfidz
import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, BookOpen, Mic, Award, User, Heart, Share2, Play, Pause, Search, Download, Copy, Check,
  CheckCircle, AlertCircle, Star, Bell, Settings, DollarSign, CreditCard, QrCode, Landmark,
  ChevronRight, Volume2, MessageCircle, X, List,
  LogOut, LogIn, Lock, FileText, Eye, EyeOff, Users, ExternalLink, Book
} from 'lucide-react';
import { useQuranSpeech } from './hooks/useQuranSpeech';
import { calculateTajwidScore } from './utils/scoring';
import { quranData } from './data/QuranData';
import { iqraData } from './data/IqraData';
import HomeTab from './HomeTab';
import TajwidTab from './TajwidTab';
import LevelTab from './LevelTab';
import ProfileTab from './ProfileTab';
import RapotTab from './RapotTab';
import AdminTab from './AdminTab';
import QuranTab from './QuranTab';
import LearnTab from './LearnTab';
import SetorTab from './SetorTab';
import AuthModal from './AuthModal';

const MOCK_QURAN = {
  surah: "Al-Mulk",
  surahNumber: 67,
  ayat_range: "1-2",
  verses: 2,
  text: [
    { id: 1, arabic: "تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ", indo: "Mahasuci Allah yang menguasai kerajaan..." },
    { id: 2, arabic: "ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ", indo: "yang menciptakan mati dan hidup..." }
  ]
};

const APP_VERSION = "1.3.0"; // Versi Premium Voice (WaveNet)

function App() {
  const [activeTab, setActiveTab] = useState('home'); // Kembali ke beranda
  const [sessionState, setSessionState] = useState('idle');
  const [score, setScore] = useState(null);
  const [showSedekah, setShowSedekah] = useState(false);
  const [selectedUstadz, setSelectedUstadz] = useState('Hamzah');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [quranView, setQuranView] = useState('surah'); // 'surah' atau 'juz'
  const [searchQuery, setSearchQuery] = useState(''); // State pencarian
  const [selectedQari, setSelectedQari] = useState('Husary_128kbps'); // Qari default untuk pemula
  const [playingAyah, setPlayingAyah] = useState(null); // Ayat yang sedang diputar
  const [selectedLearnItem, setSelectedLearnItem] = useState(null); // Menyimpan surah/juz yang dipilih
  const [isLoadingLearnData, setIsLoadingLearnData] = useState(false); // Indikator loading saat ambil data
  const [ayahStart, setAyahStart] = useState(1); // Filter ayat awal
  const [ayahEnd, setAyahEnd] = useState(2); // Filter ayat akhir
  const [aiNote, setAiNote] = useState(''); // Catatan dari AI
  const [aiAudio, setAiAudio] = useState(null); // Audio Premium dari AI
  const [isSpeakingNote, setIsSpeakingNote] = useState(false); // Indikator TTS Ustadz sedang bicara
  const [setoranMode, setSetoranMode] = useState('tahsin'); // Mode: 'tahfidz' (Blind) atau 'tahsin' (Baca)
  const [isCopied, setIsCopied] = useState(false); // Indikator copy hasil
  const [isAutoplay, setIsAutoplay] = useState(false); // Indikator putar berurutan
  const [isMushafMode, setIsMushafMode] = useState(false); // Toggle mode mushaf
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null); // URL untuk memutar rekaman sendiri
  const [selectedIqraJilid, setSelectedIqraJilid] = useState(null); // State penyimpan pilihan Jilid Iqra
  const [selectedIqraLesson, setSelectedIqraLesson] = useState(null); // State penyimpan pilihan Latihan Iqra
  const [showPaymentGateway, setShowPaymentGateway] = useState(false); // Menampilkan payment gateway dummy
  const [paymentStep, setPaymentStep] = useState('form'); // 'form', 'processing', 'success'
  const [paymentAmount, setPaymentAmount] = useState(50000);
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [iqraSteps, setIqraSteps] = useState([]); // State untuk memecah kata step-by-step
  const [currentIqraStep, setCurrentIqraStep] = useState(0); // State penunjuk step aktif
  const [targetData, setTargetData] = useState({ ayatPerHari: 5, juzTarget: 30, targetDate: '2026-12-24' }); // State Target Belajar
  const [showTargetModal, setShowTargetModal] = useState(false); // State Modal Edit Target
  const [riwayatSetoran, setRiwayatSetoran] = useState(() => JSON.parse(localStorage.getItem('riwayatSetoran') || '[]')); // State Rapot
  const playlistRef = useRef([]); // Ref untuk menyimpan daftar putar

  // --- STATE OTENTIKASI & LIMITASI ---
  const [currentUser, setCurrentUser] = useState(null); // Menyimpan data user yg login
  const [freeUsageCount, setFreeUsageCount] = useState(() => parseInt(localStorage.getItem('freeUsageCount') || '0'));
  const [showAuthModal, setShowAuthModal] = useState(false); // Menampilkan layar login/daftar
  const [authMode, setAuthMode] = useState('login'); // 'login' atau 'signup'
  const [showPassword, setShowPassword] = useState(false); // Toggle lihat password
  const [adminUsers, setAdminUsers] = useState([]); // Data user untuk dashboard admin
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false); // Loading dashboard admin

  const { transcript, isListening, startListening, stopListening, error } = useQuranSpeech();

  const audioRef = useRef(null);
  const ustadzAudioRef = useRef(null);
  const fileInputRef = useRef(null); // Ref untuk elemen upload foto

  // Bersihkan audio saat komponen tertutup atau pindah tab
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (ustadzAudioRef.current) ustadzAudioRef.current.pause();
      if (window.speechSynthesis) window.speechSynthesis.cancel(); // Hentikan suara AI jika ganti tab
    };
  }, [activeTab]);
  
  // Simpan riwayat setoran otomatis ke penyimpanan HP (localStorage) setiap ada perubahan
  useEffect(() => {
    localStorage.setItem('riwayatSetoran', JSON.stringify(riwayatSetoran));
  }, [riwayatSetoran]);

  // Handler untuk fitur Share (Viral / Growth)
  const handleShareApp = async () => {
    const shareData = {
      title: 'At Tahfidz - AI Al-Qur\'an',
      text: 'Assalamu\'alaikum! Yuk pakai aplikasi At Tahfidz untuk belajar membaca dan setoran hafalan Al-Qur\'an dengan bantuan AI (Ustadz Virtual). Canggih dan praktis lho!',
      url: 'https://villaquranbaronmalang.com' // Ganti dengan domain asli aplikasi bos nantinya
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { console.log('Share dibatalkan oleh user'); }
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n\nLink: ${shareData.url}`);
      alert('Teks ajakan dan link berhasil disalin! Silakan paste di WhatsApp atau Grup Anda.');
    }
  };

  // Simpan riwayat hitungan pemakaian gratis ke penyimpanan browser (localStorage)
  useEffect(() => {
    localStorage.setItem('freeUsageCount', freeUsageCount.toString());
  }, [freeUsageCount]);

  // Ambil data user untuk Dashboard Admin
  useEffect(() => {
    if (activeTab === 'admin') {
      setIsLoadingAdmin(true);
      fetch('/api/get_users.php')
        .then(res => res.json())
        .then(result => {
          if (result.status === 'success') setAdminUsers(result.data);
          setIsLoadingAdmin(false);
        })
        .catch(err => {
          console.error("Gagal load data admin:", err);
          setIsLoadingAdmin(false);
        });
    }
  }, [activeTab]);

  // Handler untuk memproses foto yang diupload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setCurrentUser(prev => ({ ...prev, avatar: base64String }));
        
        // Simpan permanen ke database jika bukan guest/admin lokal
        if (currentUser && !currentUser.isAdmin) {
          try {
            await fetch('/api/update_avatar.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: currentUser.username, avatar: base64String })
            });
          } catch (err) {
            console.error("Gagal menyimpan foto ke server:", err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler khusus untuk memutar ayat contoh Tajwid
  const handlePlayTajwid = (surahNum, ayahNum, id) => {
    if (playingAyah === id && isPlayingAudio) {
      audioRef.current?.pause();
      setIsPlayingAudio(false);
      setPlayingAyah(null);
      return;
    }

    if (audioRef.current) audioRef.current.pause(); // Hentikan audio sebelumnya

    const surahStr = String(surahNum).padStart(3, '0');
    const ayahStr = String(ayahNum).padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/${selectedQari}/${surahStr}${ayahStr}.mp3`;

    const newAudio = new Audio(audioUrl);
    audioRef.current = newAudio;
    
    newAudio.onplay = () => { setIsPlayingAudio(true); setPlayingAyah(id); };
    newAudio.onended = () => { setIsPlayingAudio(false); setPlayingAyah(null); };
    newAudio.onerror = () => { alert("Maaf, audio belum tersedia untuk ayat ini."); setIsPlayingAudio(false); setPlayingAyah(null); };
    
    newAudio.play();
  };

  const handlePlayAyah = (surahNum, ayahNum, listId = null, autoNext = false) => {
    const targetId = listId || ayahNum;

    // Jika ayat yang sama diklik saat sedang play, maka pause
    if (playingAyah === targetId && isPlayingAudio) {
      audioRef.current?.pause();
      setIsPlayingAudio(false);
      setPlayingAyah(null);
      setIsAutoplay(false);
      return;
    }

    if (audioRef.current) audioRef.current.pause(); // Hentikan audio sebelumnya

    setIsAutoplay(autoNext);

    // Format nomor menjadi 3 digit (contoh: Surah 1, Ayat 2 => 001002.mp3)
    const surahStr = String(surahNum).padStart(3, '0');
    const ayahStr = String(ayahNum).padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/${selectedQari}/${surahStr}${ayahStr}.mp3`;

    const newAudio = new Audio(audioUrl);
    audioRef.current = newAudio;
    
    newAudio.onplay = () => { setIsPlayingAudio(true); setPlayingAyah(targetId); };
    newAudio.onended = () => { 
      if (autoNext) {
        const currentList = playlistRef.current;
        const currentIndex = currentList.findIndex(a => a.id === targetId);
        if (currentIndex !== -1 && currentIndex + 1 < currentList.length) {
          // Jika masih ada ayat selanjutnya, putar otomatis
          const nextItem = currentList[currentIndex + 1];
          handlePlayAyah(nextItem.surahNumber || surahNum, nextItem.ayahNumber || nextItem.id, nextItem.id, true);
        } else {
          setIsPlayingAudio(false);
          setPlayingAyah(null);
          setIsAutoplay(false);
        }
      } else {
        setIsPlayingAudio(false); 
        setPlayingAyah(null); 
        setIsAutoplay(false);
      }
    };
    newAudio.onerror = () => { alert("Maaf, audio belum tersedia untuk ayat ini."); setIsPlayingAudio(false); setPlayingAyah(null); setIsAutoplay(false); };
    
    newAudio.play();
  };

  const handlePlayUstadzVoice = (text, base64) => {
    // Jika sedang bicara, matikan
    if (isSpeakingNote) {
      if (ustadzAudioRef.current) {
        ustadzAudioRef.current.pause();
        ustadzAudioRef.current.currentTime = 0;
      }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeakingNote(false);
      return;
    }

    // Jika ada audio premium (WaveNet)
    if (base64) {
      const audio = new Audio("data:audio/mp3;base64," + base64);
      ustadzAudioRef.current = audio;
      audio.onplay = () => setIsSpeakingNote(true);
      audio.onended = () => setIsSpeakingNote(false);
      audio.onerror = () => {
        setIsSpeakingNote(false);
        handleSpeakNote(text); // Fallback ke robot
      };
      audio.play().catch(() => handleSpeakNote(text));
    } else {
      // Fallback ke robot bawaan browser
      handleSpeakNote(text);
    }
  };

  const handleDownloadAyah = async (surahNum, ayahNum, e) => {
    e.stopPropagation(); // Mencegah ayat ter-play saat tombol download diklik
    
    const surahStr = String(surahNum).padStart(3, '0');
    const ayahStr = String(ayahNum).padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/${selectedQari}/${surahStr}${ayahStr}.mp3`;

    try {
      // Menggunakan fetch untuk memaksa browser mendownload file mp3 (bukan sekedar membuka tab)
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Surah_${surahStr}_Ayat_${ayahStr}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback: Jika terblokir oleh keamanan browser, buka di tab baru agar bisa disave manual
      window.open(audioUrl, '_blank');
    }
  };

  // Fungsi untuk mengubah teks Saran Ustadz menjadi Suara (Gratis bawaan browser)
  const handleSpeakNote = (text) => {
    if (!window.speechSynthesis) {
      alert("Maaf, browser perangkat ini belum mendukung fitur Suara AI.");
      return;
    }

    if (isSpeakingNote) {
      window.speechSynthesis.cancel(); // Stop jika sedang bicara
      setIsSpeakingNote(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; // Bahasa Indonesia
    utterance.rate = 0.9; // Diperlambat sedikit agar terdengar lebih jelas dan berwibawa

    // Logika pemilihan suara Laki-laki (Hamzah) / Perempuan (Humairah)
    const voices = window.speechSynthesis.getVoices();
    const idVoices = voices.filter(v => v.lang.includes('id'));
    
    if (idVoices.length > 0) {
      if (selectedUstadz === 'Hamzah') {
        // Suara Laki-laki: Cari voice laki-laki OS, atau akali dengan pitch (nada) lebih rendah
        utterance.voice = idVoices.find(v => v.name.toLowerCase().includes('male')) || idVoices[0];
        utterance.pitch = 0.8; // Nada lebih berat dan berwibawa
      } else {
        // Suara Perempuan: Cari voice perempuan OS, atau akali dengan pitch (nada) lebih tinggi
        utterance.voice = idVoices.find(v => v.name.toLowerCase().includes('female')) || idVoices[idVoices.length - 1];
        utterance.pitch = 1.2; // Nada lebih lembut
      }
    }

    utterance.onstart = () => setIsSpeakingNote(true);
    utterance.onend = () => setIsSpeakingNote(false);
    utterance.onerror = () => setIsSpeakingNote(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyResult = () => {
    const predicate = getPredicate(score);
    const noteText = aiNote || predicate.note;
    const targetSurah = selectedLearnItem ? selectedLearnItem.data.surah : MOCK_QURAN.surah;
    const targetAyah = selectedLearnItem?.type === 'juz' ? selectedLearnItem.data.ayat_range : `Ayat ${ayahStart}-${ayahEnd}`;
    
    const textToCopy = `📋 *Evaluasi Setoran At Tahfidz*\n📖 Surah: ${targetSurah} (${targetAyah})\n⭐ Nilai: ${score}/100 (${predicate.label})\n\n💡 *Saran Ustadz AI:*\n${noteText}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Kembali ke ikon semula setelah 2 detik
    });
  };

  const handleStartSetoran = () => {
    // Cek Limit Penggunaan Gratis [DIMATIKAN SEMENTARA UNTUK DEMO]
    // if (!currentUser && freeUsageCount >= 3) {
    //   setAuthMode('signup');
    //   setShowAuthModal(true);
    //   return; // Hentikan sebelum merekam
    // }
    
    setSessionState('recording');
    setRecordedAudioUrl(null);
    startListening();
  };

  const handleSelectSurah = async (surah) => {
    setActiveTab('learn');
    setIsLoadingLearnData(true);
    
    try {
      // Deteksi pintar untuk struktur data JSON yang berbeda-beda
      const nomor = surah.surahNumber || surah.nomor || surah.id || surah.number;
      const nama = surah.surahName || surah.namaLatin || surah.nama || surah.name;
      const jumlahAyat = surah.verses || surah.jumlahAyat || surah.numberOfAyahs || 0;

      let formattedText = [];
      
      try {
        // Prioritas 1: Coba server utama (EQuran Kemenag)
        const response = await fetch(`https://equran.id/api/v2/surat/${nomor}`);
        if (!response.ok) throw new Error("API EQuran bermasalah");
        const result = await response.json();
        formattedText = (result.data?.ayat || []).map(a => ({
          id: a.nomorAyat,
          arabic: a.teksArab,
          indo: a.teksIndonesia
        }));
        if (formattedText.length === 0) throw new Error("Data ayat kosong");
      } catch (err1) {
        // Prioritas 2: Server Cadangan jika Kemenag error/diblokir CORS Hostinger
        const response2 = await fetch(`https://quran-api.santrikoding.com/api/surah/${nomor}`);
        if (!response2.ok) throw new Error("API Cadangan bermasalah");
        const result2 = await response2.json();
        formattedText = (result2.ayat || []).map(a => ({
          id: a.nomor,
          arabic: a.ar,
          indo: a.idn
        }));
      }

      if (formattedText.length === 0) throw new Error("Semua server gagal memuat ayat");

      setSelectedLearnItem({
        type: 'surah',
        data: {
          surah: nama,
          surahNumber: nomor,
          ayat_range: `1-${formattedText.length}`,
          verses: formattedText.length,
          text: formattedText
        }
      });
      
      // Set rentang ayat bawaan ke seluruh isi surah tersebut
      setAyahStart(1);
      // Default saat baru dipilih: maksimal 10 ayat pertama saja
      setAyahEnd(Math.min(formattedText.length, 10));
    } catch (err) {
      console.error("Error Detail:", err);
      alert("Gagal mengambil data surah dari server utama maupun cadangan. Coba lagi nanti.");
      setActiveTab('quran'); // Kembalikan ke halaman daftar surah jika gagal
    } finally {
      setIsLoadingLearnData(false);
    }
  };

  const handleSelectJuz = async (juz) => {
    setActiveTab('learn');
    setIsLoadingLearnData(true);
    
    try {
      const resAr = await fetch(`https://api.alquran.cloud/v1/juz/${juz.id}/quran-uthmani`);
      if (!resAr.ok) throw new Error("Gagal mengambil data Arab Juz");
      const dataAr = await resAr.json();

      const resId = await fetch(`https://api.alquran.cloud/v1/juz/${juz.id}/id.indonesian`);
      if (!resId.ok) throw new Error("Gagal mengambil data Terjemahan Juz");
      const dataId = await resId.json();

      const ayahsAr = dataAr.data.ayahs;
      const ayahsId = dataId.data.ayahs;

      const formattedText = ayahsAr.map((a, index) => ({
        id: index + 1, // ID unik global 1 s/d N untuk list
        ayahNumber: a.numberInSurah, // Nomor asli ayat
        surahNumber: a.surah.number, // Nomor asli surah
        surahName: a.surah.englishName,
        arabic: a.text,
        indo: ayahsId[index].text
      }));

      setSelectedLearnItem({
        type: 'juz',
        data: {
          surah: juz.title,
          surahNumber: 1, // Placeholder
          ayat_range: `Total ${formattedText.length} Ayat`,
          verses: formattedText.length,
          text: formattedText
        }
      });
      
      setAyahStart(1);
      setAyahEnd(Math.min(formattedText.length, 10));
    } catch (err) {
      console.error("Error Detail:", err);
      alert("Gagal mengambil data Juz. Coba lagi nanti.");
      setActiveTab('quran');
    } finally {
      setIsLoadingLearnData(false);
    }
  };

  const handleStopSetoran = async () => {
    setSessionState('processing');
    setAiNote('');

    // Hentikan rekaman dan tunggu proses konversi audio selesai
    const audioData = await stopListening();

    // Gunakan data dari surah/juz yang sedang dipelajari
    const currentLearnData = selectedLearnItem ? selectedLearnItem.data : MOCK_QURAN;
    const targetText = currentLearnData.text
      .filter(t => t.id >= ayahStart && t.id <= ayahEnd)
      .map(t => t.arabic).join(" ");

    // Jika mic batal/gagal menangkap suara, atau file rekaman kosong/terlalu kecil (< 3000 bytes)
    if (!audioData || !audioData.audioBase64 || audioData.size < 3000) {
      setSessionState('idle');
      alert(`Rekaman gagal (Ukuran audio: ${audioData.size || 0} bytes). Pastikan mikrofon HP Anda tidak dibisukan oleh browser dan Anda berbicara cukup keras.`);
      return;
    }

    // Buat URL audio agar bos bisa putar sendiri
    const audioUrl = `data:${audioData.audioMimeType};base64,${audioData.audioBase64}`;
    setRecordedAudioUrl(audioUrl);

    try {
      const BACKEND_URL = "https://script.google.com/macros/s/AKfycbwsVzY1fpf6jgP9K1Vet5SyWBYdq8Ger69XexOoiD_gtG8eJrzcEWO-uU7cOGr9pWnS/exec";

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        // Hapus headers sama sekali agar browser otomatis memakai standard text/plain murni
        // Ini ampuh 100% untuk menghindari blokir Preflight CORS
        // Kirim juga data ustadz yang terpilih ke Backend
        body: JSON.stringify({ 
          targetText, 
          ustadz: selectedUstadz,
          audio: {
            base64: audioData.audioBase64,
            mimeType: audioData.audioMimeType
          }
        })
      });

      const textResponse = await response.text();
      let result;
      try {
        result = JSON.parse(textResponse);
      } catch (e) {
        throw new Error(`Server GAS memberikan balasan yang tidak valid (bukan JSON). Ini isi balasannya: "${textResponse.substring(0, 200)}..."`);
      }

      setScore(result.score);
      
      // JIKA MUMTAZ (>= 95), OTOMATIS CATAT KE RAPOT DAN CAPAIAN TARGET
      if (result.score >= 95) {
        setRiwayatSetoran(prev => [{
           id: Date.now(),
           surah: currentLearnData.surah,
           ayat: selectedLearnItem?.type === 'juz' ? currentLearnData.ayat_range : `Ayat ${ayahStart}-${ayahEnd}`,
           jumlahAyat: (ayahEnd - ayahStart) + 1,
           score: result.score,
           mode: setoranMode === 'tahfidz' ? 'Tahfidz' : 'Tahsin',
           date: new Date().toISOString()
        }, ...prev]);
      }
      
      // Tampilkan apa yang sebenarnya didengar AI untuk evaluasi kita
      const aiHeardText = result.ai_heard !== undefined ? `[AI Mendengar: "${result.ai_heard}"]\n\n` : `[⚠️ PERINGATAN BUGS: Server yang merespon ini adalah server versi lama! Coba periksa URL GAS bos.]\n\n`;
      setAiNote(aiHeardText + result.note);
      setAiAudio(result.audio_base64 || null);
      setSessionState('result');

      // Panggil fitur suara otomatis menggunakan jeda waktu agar transisi UI mulus
      if (result.note) {
         setTimeout(() => {
           handlePlayUstadzVoice(result.note, result.audio_base64);
         }, 800);
      }

      // Tambahkan hitungan pemakaian jika belum login
      if (!currentUser) {
        setFreeUsageCount(prev => prev + 1);
      }
    } catch (err) {
      // Tampilkan pesan error aslinya agar kita tahu penyebab pastinya
      setScore(0);
      setAiNote("Error Sistem: " + err.message + " | Cek setingan Backend bos.");
      setSessionState('result');
    }
  };

  // --- HANDLER KHUSUS UNTUK SETORAN IQRA ---
  const handleStartSetoranIqra = () => {
    // [DIMATIKAN SEMENTARA UNTUK DEMO]
    // if (!currentUser && freeUsageCount >= 3) {
    //   setAuthMode('signup');
    //   setShowAuthModal(true);
    //   return;
    // }
    setSessionState('recording');
    setRecordedAudioUrl(null);
    startListening();
  };

  const handleStopSetoranIqra = async () => {
    setSessionState('processing');
    setAiNote('');
    const audioData = await stopListening();

    if (!audioData || !audioData.audioBase64 || audioData.size < 3000) {
      setSessionState('idle');
      alert(`Rekaman gagal (Ukuran audio: ${audioData?.size || 0} bytes). Pastikan mikrofon tidak dibisukan.`);
      return;
    }

    const audioUrl = `data:${audioData.audioMimeType};base64,${audioData.audioBase64}`;
    setRecordedAudioUrl(audioUrl);

    try {
      const BACKEND_URL = "https://script.google.com/macros/s/AKfycbwsVzY1fpf6jgP9K1Vet5SyWBYdq8Ger69XexOoiD_gtG8eJrzcEWO-uU7cOGr9pWnS/exec";
      
      // Ambil seluruh kata dalam 1 baris
      const currentRowWords = iqraSteps[currentIqraStep]?.words?.join(' ') || "";
      const iqraPromptText = currentRowWords;

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: JSON.stringify({ 
          targetText: iqraPromptText, 
          ustadz: selectedUstadz,
          mode: 'tilawah',
          audio: { base64: audioData.audioBase64, mimeType: audioData.audioMimeType }
        })
      });

      const textResponse = await response.text();
      const result = JSON.parse(textResponse);

      const isCorrect = result.score >= 70; // Syarat lulus diturunkan ke 70 (Lebih toleran untuk pemula Iqra)
      
      setScore(result.score);
      setAiAudio(result.audio_base64 || null);
      setAiNote(result.note || "");

      setIqraSteps(prev => {
        const newSteps = [...prev];
        newSteps[currentIqraStep].status = isCorrect ? 'correct' : 'wrong';
        newSteps[currentIqraStep].correctionNote = result.note || `Cara baca: ${currentRowWords}`;
        newSteps[currentIqraStep].correctionAudio = result.audio_base64 || null;
        return newSteps;
      });

      if (isCorrect) {
        // Jika benar, ulasan positif diputar cepat, lalu otomatis buka kunci kata berikutnya
        if (result.note) setTimeout(() => handlePlayUstadzVoice(result.note, result.audio_base64), 300);
        
        if (currentIqraStep + 1 < iqraSteps.length) {
           setCurrentIqraStep(prev => prev + 1);
           setSessionState('idle'); // Kembali siap di huruf berikutnya
        } else {
           setSessionState('result'); // Lulus semuanya
        }
      } else {
        setSessionState('wrong_feedback'); // Tampilkan UI peringatan (Merah)
        if (result.note) setTimeout(() => handlePlayUstadzVoice(result.note, result.audio_base64), 300);
        setSessionState('idle'); // Tetap di baris ini, UI otomatis merah karena status 'wrong'
      }

      if (!currentUser) setFreeUsageCount(prev => prev + 1);
    } catch (err) {
      setScore(0);
      setAiNote("Error Sistem: " + err.message);
      setSessionState('wrong_feedback');
      alert("Error Sistem AI: " + err.message);
      setSessionState('idle');
    }
  };

  const getPredicate = (s) => {
    if (!s) return { label: '', color: '', bg: '', note: '' };
    if (s >= 95) return { label: 'Mumtaz', color: 'text-green-600', bg: 'bg-green-100', note: 'Masya Allah! Hafalanmu sangat kuat dan lancar.' };
    if (s >= 85) return { label: 'Jayyid Jiddan', color: 'text-blue-600', bg: 'bg-blue-100', note: 'Bagus sekali! Perhatikan kembali tajwid di beberapa bagian ya.' };
    if (s >= 75) return { label: 'Jayyid', color: 'text-yellow-600', bg: 'bg-yellow-100', note: 'Cukup lancar, namun masih ada beberapa keraguan di makhraj.' };
    return { label: 'Aslaha', color: 'text-red-600', bg: 'bg-red-100', note: 'Ayo semangat murajaah lagi sebelum setor kembali.' };
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab setActiveTab={setActiveTab} setPaymentStep={setPaymentStep} setShowPaymentGateway={setShowPaymentGateway} handleShareApp={handleShareApp} />;
        
      case 'tajwid':
        return <TajwidTab handlePlayTajwid={handlePlayTajwid} playingAyah={playingAyah} />;

      case 'learn': {
        // Tampilkan loading spinner saat data sedang diambil dari API
        if (isLoadingLearnData) {
          return (
             <div className="p-4 pb-24 flex items-center justify-center h-full min-h-[400px]">
               <div className="flex flex-col items-center space-y-4">
                 <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
                 <p className="text-gray-500 font-bold text-sm">Mengunduh ayat dari Kemenag...</p>
               </div>
             </div>
          );
        }

        const currentLearnData = selectedLearnItem ? selectedLearnItem.data : MOCK_QURAN;
        const { surah, surahNumber = 1, text, verses = 2 } = currentLearnData;
        const displayedText = text.filter(item => item.id >= ayahStart && item.id <= ayahEnd);
        playlistRef.current = displayedText; // Simpan ke ref agar bisa dibaca saat putar otomatis

        return (
          <div className="p-4 pb-24 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-800">Mode Talaqqi</h1>
              <div className="flex gap-2">
                 <select 
                   value={selectedQari}
                   onChange={(e) => setSelectedQari(e.target.value)}
                   className="text-xs bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-full font-bold outline-none shadow-sm"
                 >
                   <option value="Husary_128kbps">Tartil Lambat (Al-Husary)</option>
                   <option value="Alafasy_128kbps">Irama Sedang (Mishary)</option>
                   <option value="Abdul_Basit_Murattal_192kbps">Irama Klasik (Abdul Basit)</option>
                 </select>
                 <button 
                   onClick={() => setActiveTab('quran')}
                   className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold flex items-center gap-1"
                 >
                   <List size={14} /> Ganti Surah/Juz
                 </button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-6">
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-2xl font-black text-green-800">{surah}</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {selectedLearnItem?.type === 'juz' ? currentLearnData.ayat_range : `Target: Ayat ${ayahStart}-${ayahEnd}`}
                  </p>
                </div>
                <button 
                  onClick={() => displayedText.length > 0 && handlePlayAyah(displayedText[0].surahNumber || surahNumber, displayedText[0].ayahNumber || displayedText[0].id, displayedText[0].id, true)}
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${isAutoplay && isPlayingAudio ? 'bg-red-100 text-red-600 scale-105' : 'bg-green-600 text-white shadow-md hover:bg-green-700'}`}
                >
                  {isAutoplay && isPlayingAudio ? <Pause size={18} /> : <Play size={18} />}
                  {isAutoplay && isPlayingAudio ? 'Jeda' : 'Putar Semua'}
                </button>
              </div>
              
              <div className="flex justify-center mb-2 mt-4">
                <div className="flex bg-gray-100 p-1 rounded-xl w-full">
                  <button 
                    onClick={() => setIsMushafMode(false)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isMushafMode ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Mode Terjemah
                  </button>
                  <button 
                    onClick={() => setIsMushafMode(true)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isMushafMode ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Mode Mushaf
                  </button>
                </div>
              </div>

              {/* Filter Rentang Ayat (Khusus Mode Surah) */}
              {(!selectedLearnItem || selectedLearnItem.type === 'surah') && (
                <div className="flex items-center justify-between bg-green-50/50 p-3 rounded-xl border border-green-100 mb-2">
                  <span className="text-xs font-bold text-green-700 uppercase">Tampilkan Ayat:</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={ayahStart} 
                      onChange={(e) => setAyahStart(e.target.value === '' ? '' : Number(e.target.value))}
                      onBlur={() => {
                        let val = Number(ayahStart);
                        if (val < 1 || isNaN(val)) val = 1;
                        if (val > verses) val = verses;
                        setAyahStart(val);
                        
                        // Pastikan batas maksimal tetap 10 ayat
                        let currentEnd = Number(ayahEnd);
                        if (currentEnd < val) setAyahEnd(val);
                        else if (currentEnd - val >= 10) {
                          setAyahEnd(val + 9);
                          alert("Maksimal setoran dibatasi 10 ayat sekaligus agar AI dapat mengoreksi tajwid dengan sangat detail dan akurat.");
                        }
                      }}
                      className="w-14 text-center text-sm font-bold text-green-800 bg-white border border-green-200 rounded-lg p-1 outline-none focus:border-green-500 shadow-sm"
                    />
                    <span className="text-xs text-green-600 font-bold">s/d</span>
                    <input 
                      type="number" 
                      value={ayahEnd} 
                      onChange={(e) => setAyahEnd(e.target.value === '' ? '' : Number(e.target.value))}
                      onBlur={() => {
                        let val = Number(ayahEnd);
                        if (val > verses || isNaN(val)) val = verses;
                        if (val < Number(ayahStart)) val = Number(ayahStart) || 1;
                        
                        // Batasi agar tidak melampaui 10 ayat
                        if (val - Number(ayahStart) >= 10) {
                          val = Number(ayahStart) + 9;
                          alert("Maksimal setoran dibatasi 10 ayat sekaligus agar AI dapat mengoreksi tajwid dengan sangat detail dan akurat.");
                        }
                        setAyahEnd(val);
                      }}
                      className="w-14 text-center text-sm font-bold text-green-800 bg-white border border-green-200 rounded-lg p-1 outline-none focus:border-green-500 shadow-sm"
                    />
                  </div>
                </div>
              )}

              {isMushafMode ? (
                <div className="py-4 px-2" dir="rtl">
                  <p className="text-[28px] leading-[2.5] font-serif text-gray-800 text-right" style={{ wordSpacing: '2px' }}>
                    {displayedText.map(item => (
                      <span 
                        key={item.id} 
                        onClick={() => handlePlayAyah(item.surahNumber || surahNumber, item.ayahNumber || item.id, item.id)}
                        className={`cursor-pointer transition-colors p-1 rounded-lg ${playingAyah === item.id ? 'bg-green-100 text-green-800 shadow-sm' : 'hover:bg-gray-50'}`}
                      >
                        {item.arabic} <span className="text-green-600 font-sans text-xl mx-1 select-none">﴿{item.ayahNumber || item.id}﴾</span>
                      </span>
                    ))}
                  </p>
                </div>
              ) : (
                <div className="space-y-8 py-2">
                  {displayedText.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => handlePlayAyah(item.surahNumber || surahNumber, item.ayahNumber || item.id, item.id)}
                      className={`space-y-3 p-4 rounded-2xl cursor-pointer transition-all border ${playingAyah === item.id ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-50'}`}
                    >
                      <div className="flex items-start gap-4 justify-between">
                        <div className="flex flex-col gap-2 mt-2 shrink-0">
                          <button className={`p-2 rounded-full ${playingAyah === item.id ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:text-green-600'}`}>
                             {playingAyah === item.id ? <Volume2 size={16} className="animate-pulse" /> : <Play size={16} />}
                          </button>
                          <button onClick={(e) => handleDownloadAyah(item.surahNumber || surahNumber, item.ayahNumber || item.id, e)} className="p-2 rounded-full bg-blue-50 text-blue-500 hover:text-blue-700 hover:bg-blue-100 transition-colors shadow-sm" title="Download MP3">
                             <Download size={14} />
                          </button>
                        </div>
                        <p className="text-right text-3xl leading-loose font-serif text-gray-800" dir="rtl">
                          {item.arabic} <span className="text-green-600 font-sans text-xl">﴿{item.ayahNumber || item.id}﴾</span>
                        </p>
                      </div>
                      <div>
                        {item.surahName && (
                          <span className="text-[9px] font-black text-green-700 bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">
                            {item.surahName} : {item.ayahNumber}
                          </span>
                        )}
                        <p className="text-xs text-gray-500 leading-relaxed font-medium italic bg-white p-3 rounded-xl border border-gray-100">{item.indo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
              <AlertCircle className="text-blue-600 shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed">
                <b>Tips At Tahfidz:</b> Dengarkan audio Qari sebelum mulai. Maksimal setoran <b>10 ayat</b> per sesi agar evaluasi Ustadz AI sangat akurat.
              </p>
            </div>

            <button 
              onClick={() => setActiveTab('setor')}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Mic size={20} /> {setoranMode === 'tahfidz' ? 'Lanjut ke Setoran Hafalan' : 'Lanjut ke Tes Bacaan (Tahsin)'}
            </button>
          </div>
        );
      }

      case 'rapot':
        return <RapotTab setActiveTab={setActiveTab} />;

      case 'quran': {
        const juzList = Array.from({ length: 30 }, (_, i) => {
          const juzNum = i + 1;
          // Rumus standar halaman awal juz pada Al-Qur'an Pojok (Kemenag/Madinah)
          const page = juzNum === 1 ? 1 : (juzNum - 1) * 20 + 2;
          return {
            id: juzNum,
            title: `Juz ${juzNum}`,
            subtitle: juzNum === 30 ? 'Juz Amma' : '',
            page: page
          };
        });

        // Filter data berdasarkan input pencarian
        const filteredSurah = (quranData || []).filter(s => {
          const nama = s.surahName || s.namaLatin || s.nama || s.name || '';
          return nama.toLowerCase().includes(searchQuery.toLowerCase());
        });
        const filteredJuz = juzList.filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase()) || (j.subtitle && j.subtitle.toLowerCase().includes(searchQuery.toLowerCase())));

        return (
          <div className="p-4 pb-24 space-y-4 flex flex-col h-full">
            <h1 className="text-xl font-bold text-gray-800">Al-Qur'an</h1>
            
            {/* Kotak Pencarian */}
            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 flex items-center gap-2 transition-all">
              <div className="pl-2 text-gray-400"><Search size={18} /></div>
              <input 
                type="text" 
                placeholder={quranView === 'surah' ? "Cari nama surah..." : "Cari juz..."}
                className="w-full bg-transparent border-none outline-none text-sm py-1 text-gray-800 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="pr-2 text-gray-400 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Toggle Switch */}
            <div className="flex bg-gray-200 p-1 rounded-xl">
              <button 
                onClick={() => { setQuranView('surah'); setSearchQuery(''); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${quranView === 'surah' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'}`}
              >
                Surah
              </button>
              <button 
                onClick={() => { setQuranView('juz'); setSearchQuery(''); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${quranView === 'juz' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'}`}
              >
                Juz
              </button>
            </div>

            {/* List Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1 min-h-[400px]">
              {/* Header List */}
              <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100 bg-gray-50">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{quranView === 'surah' ? 'Nama Surah' : 'Daftar Juz'}</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Hal</span>
              </div>
              
              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {quranView === 'surah' ? (
                filteredSurah.length > 0 ? (
                  filteredSurah.map((surah) => {
                    const nomorSurah = surah.surahNumber || surah.nomor || surah.id || surah.number;
                    const namaSurah = surah.surahName || surah.namaLatin || surah.nama || surah.name;
                    const jumlahAyat = surah.verses || surah.jumlahAyat || surah.numberOfAyahs;
                    const juzSurah = surah.juz || ''; 
                    const pageSurah = surah.page || (juzSurah === 1 ? 1 : (juzSurah ? (juzSurah - 1) * 20 + 2 : ''));
                    
                    return (
                    <div 
                      key={nomorSurah} 
                      onClick={() => handleSelectSurah(surah)}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-green-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 group-hover:bg-green-100 text-gray-500 group-hover:text-green-700 font-bold rounded-lg text-xs transition-colors">
                          {nomorSurah}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 group-hover:text-green-800 transition-colors">{namaSurah}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{juzSurah ? `Juz ${juzSurah} • ` : ''}{jumlahAyat} Ayat</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-green-700">{pageSurah}</span>
                      </div>
                    </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 text-gray-400 text-sm font-medium">Surah tidak ditemukan</div>
                )
                ) : (
                filteredJuz.length > 0 ? (
                  filteredJuz.map((juz) => (
                    <div 
                      key={juz.id} 
                      onClick={() => handleSelectJuz(juz)}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-green-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 group-hover:bg-green-100 text-gray-500 group-hover:text-green-700 font-bold rounded-lg text-xs transition-colors">
                          {juz.id}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 group-hover:text-green-800 transition-colors">{juz.title}</p>
                          {juz.subtitle && <p className="text-[10px] text-gray-400 font-medium">{juz.subtitle}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-green-700">{juz.page}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400 text-sm font-medium">Juz tidak ditemukan</div>
                )
                )}
              </div>
            </div>
          </div>
        );
      }

  case 'level':
    return <LevelTab setActiveTab={setActiveTab} setSelectedIqraJilid={setSelectedIqraJilid} setSelectedIqraLesson={setSelectedIqraLesson} setSetoranMode={setSetoranMode} />;

  case 'tilawah':
        if (selectedIqraLesson) {
          // TAMPILAN 3: MODE FLASHCARD (LAYAR SETORAN IQRA)
          return (
            <div className="p-4 pb-24 flex flex-col h-full animate-in slide-in-from-right duration-300">
               <div className="flex items-center gap-3 mb-6">
                 <button onClick={() => { setSelectedIqraLesson(null); stopListening(); setSessionState('idle'); }} className="p-2 bg-white rounded-full shadow-sm text-gray-600 hover:text-green-600"><ChevronRight className="rotate-180" size={20}/></button>
                 <h1 className="text-lg font-black text-gray-800">Flashcard Tilawah</h1>
               </div>
               <div className="flex-1 flex flex-col items-center justify-center space-y-8 mt-4">
                 <div className="bg-white w-full rounded-3xl p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Baca Teks Yang Menyala</p>
                    
                    {/* GRID STEP BY STEP (ROWS & COLUMNS) */}
                    <div className="flex flex-col gap-3 w-full mb-6" dir="rtl">
                      {iqraSteps.map((row, idx) => {
                        const isActive = idx === currentIqraStep;
                        let colorClass = "text-gray-400 bg-gray-50 border-gray-100 opacity-60"; // Terkunci
                        if (row.status === 'correct') colorClass = "text-blue-600 bg-blue-50 border-blue-200";
                        else if (row.status === 'wrong' && isActive) colorClass = "text-red-500 bg-red-50 border-red-200 animate-pulse";
                        else if (isActive) colorClass = "text-gray-900 bg-white border-green-400 shadow-md ring-4 ring-green-50 transform scale-[1.02] z-10";

                        const gridColsClass = selectedIqraLesson?.columns === 1 ? 'grid-cols-1' :
                                              selectedIqraLesson?.columns === 2 ? 'grid-cols-2' :
                                              selectedIqraLesson?.columns === 3 ? 'grid-cols-3' : 'grid-cols-4';

                        return (
                          <div key={idx} className={`flex items-center justify-between p-2 sm:p-3 rounded-2xl border-2 transition-all duration-300 ${colorClass}`}>
                            {/* Kolom Kata (Maks 4 per baris) */}
                            <div className={`flex-1 grid ${gridColsClass} gap-2 text-center`}>
                              {row.words && row.words.map((word, wIdx) => (
                                <div key={wIdx} className="text-2xl sm:text-3xl font-serif py-2 drop-shadow-sm leading-relaxed">
                                  {word}
                                </div>
                              ))}
                            </div>

                            {/* Tombol Aksi per Baris */}
                            <div className="flex flex-col items-center justify-center shrink-0 w-14 sm:w-16 border-r-2 border-gray-200/40 pr-2 mr-2 h-full min-h-[3rem]">
                               {isActive && sessionState === 'idle' && row.status !== 'wrong' && (
                                 <button onClick={handleStartSetoranIqra} className="w-10 h-10 rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 active:scale-90 transition-all flex items-center justify-center">
                                   <Mic size={20} />
                                 </button>
                               )}
                               {isActive && sessionState === 'idle' && row.status === 'wrong' && (
                                 <div className="flex flex-col gap-1.5 items-center">
                                   <button onClick={handleStartSetoranIqra} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 active:scale-90 transition-all flex items-center justify-center" title="Ulangi Rekaman">
                                     <Mic size={18} />
                                   </button>
                                   <button onClick={() => handlePlayUstadzVoice(row.correctionNote, row.correctionAudio)} className="text-[10px] sm:text-xs flex items-center gap-1 font-bold text-red-600 bg-red-100 hover:bg-red-200 px-2 py-1 rounded-lg transition-colors shadow-sm" title="Koreksi Bacaan">
                                     <Volume2 size={12} /> Cek
                                   </button>
                                 </div>
                               )}
                               {isActive && sessionState === 'recording' && (
                                 <button onClick={handleStopSetoranIqra} className="w-10 h-10 rounded-full bg-red-500 text-white shadow-md animate-pulse active:scale-90 transition-all flex items-center justify-center">
                                   <div className="w-4 h-4 bg-white rounded-sm"></div>
                                 </button>
                               )}
                               {isActive && sessionState === 'processing' && (
                                 <div className="w-6 h-6 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                               )}
                               {isActive && sessionState === 'wrong_feedback' && (
                                 <button onClick={() => {
                                     if (isSpeakingNote) { window.speechSynthesis.cancel(); if(ustadzAudioRef.current) ustadzAudioRef.current.pause(); setIsSpeakingNote(false); }
                                     setSessionState('idle');
                                 }} className="w-10 h-10 rounded-full bg-red-100 text-red-600 shadow-sm hover:bg-red-200 active:scale-90 transition-all flex items-center justify-center">
                                   <Mic size={20} />
                                 </button>
                               )}
                               {row.status === 'correct' && (
                                 <CheckCircle size={28} className="text-blue-500 drop-shadow-sm" />
                               )}
                               {!isActive && row.status !== 'correct' && (
                                 <Lock size={20} className="text-gray-300" />
                               )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-6 bg-blue-50 p-4 rounded-2xl border border-blue-100 text-left flex gap-3">
                       <AlertCircle className="text-blue-500 shrink-0" size={20} />
                       <p className="text-xs text-blue-700 leading-relaxed"><b>Tips Ustadz:</b> {selectedIqraLesson.note}</p>
                    </div>
                 </div>
                 {sessionState === 'wrong_feedback' && (
                   <div className="w-full bg-red-50 rounded-3xl p-6 border border-red-100 text-center space-y-4 animate-in zoom-in-95 duration-300">
                     <h3 className="text-lg font-black text-red-600">Skor: {score} - Belum Tepat</h3>
                     <p className="text-xs font-medium text-gray-700 italic text-left bg-white p-3 rounded-xl border border-red-100">"{aiNote}"</p>
                     
                     {aiAudio && (
                        <button onClick={() => handlePlayUstadzVoice(aiNote, aiAudio)} className="w-full py-3 bg-white text-red-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-red-200 hover:bg-red-100 transition-colors">
                          {isSpeakingNote ? <Volume2 size={16} className="animate-pulse"/> : <Play size={16}/>}
                          {isSpeakingNote ? 'Memutar Suara...' : 'Dengarkan Koreksi'}
                        </button>
                     )}

                     <button onClick={() => { 
                         if (isSpeakingNote) { window.speechSynthesis.cancel(); if(ustadzAudioRef.current) ustadzAudioRef.current.pause(); setIsSpeakingNote(false); }
                         setSessionState('idle'); 
                       }} 
                       className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                       <Mic size={18} /> Coba Ulangi Kata Ini
                     </button>
                   </div>
                 )}
                 {sessionState === 'result' && (
                   <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center space-y-4 animate-in zoom-in-95 duration-300">
                     <div className="text-6xl mb-2">🎉</div>
                     <h3 className="text-3xl font-black text-blue-600">Mumtaz!</h3>
                     <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Latihan Selesai</p>
                     <p className="text-sm text-gray-700">Masya Allah, bacaanmu sudah tepat semua!</p>
                     <button onClick={() => { setSessionState('idle'); setScore(null); setAiNote(''); setSelectedIqraLesson(null); }} className="w-full py-4 mt-2 bg-blue-600 text-white font-bold text-sm rounded-2xl shadow-md hover:bg-blue-700 transition-colors">Lanjut Materi Berikutnya</button>
                   </div>
                 )}
               </div>
            </div>
          );
        }
        if (selectedIqraJilid) {
          // TAMPILAN 2: DAFTAR LATIHAN DI DALAM JILID
          return (
            <div className="p-4 pb-24 space-y-4 animate-in fade-in duration-300">
               <div className="flex items-center gap-3 mb-4">
                 <button onClick={() => setSelectedIqraJilid(null)} className="p-2 bg-white rounded-full shadow-sm text-gray-600 hover:text-green-600"><ChevronRight className="rotate-180" size={20}/></button>
                 <div><h1 className="text-xl font-black text-gray-800">{selectedIqraJilid.title}</h1><p className="text-xs text-gray-500 line-clamp-1">{selectedIqraJilid.description}</p></div>
               </div>
               <div className="space-y-3">
                 {selectedIqraJilid.lessons.map((lesson, idx) => (
                   <button key={lesson.id} onClick={() => { 
                     setSelectedIqraLesson(lesson); 
                     
                     let words = [];
                     if (lesson.dynamicType) {
                       // Generator Acak Penuh (Huruf & Harakat) untuk Kata Tidak Bermakna
                       const ARABIC_LETTERS = ['ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','و','ه','ي'];
                       const vowels = {
                         'fathah': ['\u064E'],
                         'kasrah': ['\u0650'],
                         'dhammah': ['\u064F'],
                         'fathah-kasrah': ['\u064E', '\u0650'],
                         'mixed': ['\u064E', '\u0650', '\u064F']
                       }[lesson.dynamicType] || ['\u064E'];

                       const wordCount = (lesson.columns || 4) * 5; // Konsisten 5 baris
                       for (let i = 0; i < wordCount; i++) {
                          let word = '';
                          const wordLength = lesson.wordLength || 3;
                          for (let j = 0; j < wordLength; j++) {
                             const l = ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];
                             const v = vowels[Math.floor(Math.random() * vowels.length)];
                             word += l + v;
                          }
                          words.push(word);
                       }
                     } else {
                       // Pecah kata bermakna (lazimnya) berdasarkan splitChar
                       const delimiter = lesson.splitChar || ' ';
                       words = lesson.text.split(delimiter).map(w => w.trim()).filter(w => w !== '');
                       
                       // Fitur Acak Posisi Kata agar pemahaman murni, bukan hafalan urutan
                       if (lesson.randomize !== false) {
                         words = words.sort(() => Math.random() - 0.5);
                       }
                     }

                     const cols = lesson.columns || 4;
                     const rows = [];
                     for (let i = 0; i < words.length; i += cols) {
                       rows.push({ words: words.slice(i, i + cols), status: 'idle', correctionNote: '', correctionAudio: null });
                     }
                     setIqraSteps(rows);
                     setCurrentIqraStep(0);
                     setSessionState('idle'); 
                     setAiNote(''); 
                     setScore(null); 
                   }} className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-green-300 hover:shadow-md transition-all flex items-center justify-between group">
                     <div className="text-left flex-1 pr-4"><span className="text-[10px] font-black text-green-700 bg-green-100 px-2.5 py-1 rounded-md uppercase tracking-widest">Latihan {idx + 1}</span><p className="text-xs text-gray-500 mt-2.5 line-clamp-2 font-medium">{lesson.note}</p></div>
                     <div className="text-4xl font-serif text-green-800 group-hover:text-green-600 transition-colors" dir="rtl">{lesson.text}</div>
                   </button>
                 ))}
               </div>
            </div>
          );
        }
        // TAMPILAN 1: DAFTAR JILID IQRA
        return (
          <div className="p-4 pb-24 space-y-4 animate-in fade-in duration-300">
             <h1 className="text-2xl font-black text-gray-800 tracking-tight">Belajar Tilawah Dasar</h1>
             <p className="text-sm text-gray-500">Mulai belajar membaca huruf hijaiyah dari dasar hingga lancar membaca Al-Qur'an.</p>
             <div className="grid grid-cols-2 gap-4 mt-4">
               {iqraData.map(jilid => (
                 <button key={jilid.jilid} onClick={() => setSelectedIqraJilid(jilid)} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-green-300 hover:shadow-md transition-all group flex flex-col items-center text-center">
                   <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 text-green-700 rounded-full flex items-center justify-center font-black text-2xl mb-3 group-hover:scale-110 transition-transform">{jilid.jilid}</div>
                   <h3 className="font-black text-gray-800 mb-1">{jilid.title}</h3>
                   <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{jilid.description}</p>
                 </button>
               ))}
             </div>
          </div>
        );

      case 'profile':
        return <ProfileTab currentUser={currentUser} setCurrentUser={setCurrentUser} setAuthMode={setAuthMode} setShowAuthModal={setShowAuthModal} fileInputRef={fileInputRef} handleAvatarChange={handleAvatarChange} setActiveTab={setActiveTab} targetData={targetData} setShowTargetModal={setShowTargetModal} riwayatSetoran={riwayatSetoran} />;

      case 'admin':
        return <AdminTab currentUser={currentUser} setActiveTab={setActiveTab} adminUsers={adminUsers} isLoadingAdmin={isLoadingAdmin} />;

      case 'setor':
        return (
          <div className="flex flex-col h-full bg-white p-6 pb-24">
            {sessionState === 'idle' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                    <Mic size={40} />
                  </div>
                </div>
                
                <div className="space-y-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">Siap Mulai?</h2>
                  <p className="text-sm text-gray-500 max-w-xs px-4">
                    {setoranMode === 'tahfidz' 
                      ? 'AI akan menyimak hafalanmu (teks disembunyikan). Fokus pada makhraj dan kelancaran.' 
                      : 'AI akan menyimak bacaanmu (teks ditampilkan). Fokus pada makhraj dan tajwid.'}
                  </p>
                </div>

                <div className="flex bg-green-50 p-1.5 rounded-2xl w-full max-w-[300px] border-2 border-green-100 shadow-inner">
                  <button 
                    onClick={() => setSetoranMode('tahfidz')}
                    className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${setoranMode === 'tahfidz' ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-105' : 'text-green-700 hover:bg-green-200/50'}`}
                  >
                    Tahfidz (Hafalan)
                  </button>
                  <button 
                    onClick={() => setSetoranMode('tahsin')}
                    className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${setoranMode === 'tahsin' ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-105' : 'text-green-700 hover:bg-green-200/50'}`}
                  >
                    Tahsin (Baca)
                  </button>
                </div>

                <button 
                  onClick={handleStartSetoran}
                  className="w-full bg-green-800 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-100 active:scale-95 transition-all"
                >
                  {setoranMode === 'tahfidz' ? 'Mulai Setoran Sekarang' : 'Mulai Tahsin Sekarang'}
                </button>
              </div>
            )}

            {sessionState === 'recording' && (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 rounded-[2.5rem] text-white p-8 relative overflow-hidden">
                <div className="absolute top-12 flex flex-col items-center gap-2">
                   <div className="flex gap-1.5">
                      {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>)}
                   </div>
                   <p className="text-[10px] tracking-widest uppercase font-black text-gray-500">
                     {setoranMode === 'tahfidz' ? 'Layar Blind Mode Aktif' : 'Layar Tahsin Aktif'}
                   </p>
                </div>
                
                {setoranMode === 'tahsin' ? (
                  <div className="w-full mt-20 mb-6 flex-1 overflow-y-auto pr-2">
                    <p className="text-[26px] leading-[2.2] font-serif text-gray-100 text-right" dir="rtl">
                      {(() => {
                        const currentLearnData = selectedLearnItem ? selectedLearnItem.data : MOCK_QURAN;
                        return currentLearnData.text
                          .filter(t => t.id >= ayahStart && t.id <= ayahEnd)
                          .map(item => (
                            <span key={item.id}>
                              {item.arabic} <span className="text-green-400 font-sans text-xl mx-1 select-none">﴿{item.ayahNumber || item.id}﴾</span>
                            </span>
                          ));
                      })()}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 h-32 mt-12">
                    {[...Array(14)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 bg-green-400 rounded-full animate-bounce"
                        style={{ height: `${30 + Math.random() * 70}%`, animationDuration: `${0.4 + Math.random()}s` }}
                      ></div>
                    ))}
                  </div>
                )}
                
                <div className={`text-center ${setoranMode === 'tahsin' ? 'mt-0' : 'mt-12'} space-y-1 mb-16`}>
                  {setoranMode === 'tahsin' && (
                    <div className="flex justify-center items-center gap-1.5 h-8 mb-4">
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1 bg-green-400 rounded-full animate-bounce"
                          style={{ height: `${30 + Math.random() * 70}%`, animationDuration: `${0.4 + Math.random()}s` }}
                        ></div>
                      ))}
                    </div>
                  )}
                  <p className="text-xl font-bold tracking-tight">AI Sedang Menyimak...</p>
                  <p className="text-xs text-gray-400">
                    Lantunkan {selectedLearnItem ? selectedLearnItem.data.surah : MOCK_QURAN.surah}: 
                    {selectedLearnItem?.type === 'juz' ? selectedLearnItem.data.ayat_range : `Ayat ${ayahStart}-${ayahEnd}`}
                  </p>
                  <p className="text-xs text-green-300 mt-2 truncate max-w-xs px-4 h-4 mx-auto">{transcript || "Menunggu suara..."}</p>
                </div>

                <div className="absolute bottom-12 w-full px-8">
                   <button 
                    onClick={handleStopSetoran}
                    className="w-full py-4 border border-white/20 rounded-2xl text-xs font-bold uppercase tracking-widest text-white bg-red-600/20 hover:bg-red-600/40 backdrop-blur-sm"
                   >
                     Berhenti {setoranMode === 'tahfidz' ? 'Setoran' : 'Tahsin'}
                   </button>
                </div>
              </div>
            )}

            {sessionState === 'processing' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-center">
                  <p className="font-black text-green-800 uppercase tracking-widest text-xs">Processing</p>
                  <p className="text-sm text-gray-500">AI At Tahfidz sedang menganalisis hafalan...</p>
                </div>
              </div>
            )}

            {sessionState === 'result' && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="bg-white w-full rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 text-center space-y-6">
                  <div className="mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                    <Award size={48} />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Predikat Hafalan</p>
                    <h2 className={`text-4xl font-black ${getPredicate(score).color}`}>{getPredicate(score).label}</h2>
                    <div className="flex justify-center items-end gap-1 pt-2">
                       <span className="text-5xl font-black text-gray-800 leading-none">{score}</span>
                       <span className="text-gray-300 font-bold mb-1">/ 100</span>
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl ${getPredicate(score).bg} border border-white/50 space-y-2`}>
                    <button 
                      onClick={() => {
                        const cleanNote = aiNote ? aiNote.replace(/\[.*?\]\n\n/g, '') : '';
                        handlePlayUstadzVoice(cleanNote || getPredicate(score).note, aiAudio);
                      }}
                      className={`mx-auto flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all bg-white/50 px-4 py-2 rounded-full shadow-sm ${isSpeakingNote ? 'text-green-700' : 'text-gray-600'}`}
                    >
                       {isSpeakingNote ? <Volume2 size={14} className="animate-pulse" /> : <Volume2 size={14} />} 
                       {isSpeakingNote ? 'Ustadz Sedang Berbicara...' : `Dengarkan Saran ${selectedUstadz}`}
                    </button>
                    <p className="text-sm italic font-medium text-gray-700 leading-relaxed select-text cursor-text">
                      "{aiNote || getPredicate(score).note}"
                    </p>
                  </div>

                  {/* Audio Player Debug */}
                  {recordedAudioUrl && (
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cek Rekaman Anda (Debug)</p>
                      <audio controls src={recordedAudioUrl} className="w-full h-10" />
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleCopyResult} 
                      className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${isCopied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {isCopied ? <Check size={18} /> : <Copy size={18} />}
                      {isCopied ? 'Tersalin ke Clipboard!' : 'Salin Hasil Evaluasi'}
                    </button>
                    <button onClick={() => setSessionState('idle')} className="w-full py-4 text-gray-400 font-bold text-sm">
                      Ulangi Setoran Ini
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <div className="p-4">Pilih tab 'Setor' untuk memulai.</div>;
    }
  };

  return (
    <div className="w-full h-[100dvh] lg:h-screen bg-gray-50 overflow-hidden relative font-sans flex flex-col lg:flex-row text-gray-800 select-none">
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 order-first lg:order-last flex justify-center w-full">
         <div className="w-full max-w-md lg:max-w-2xl relative bg-white lg:shadow-sm lg:border-x border-gray-100 min-h-full">
           {renderTabContent()}
         </div>
      </div>

      {/* Auth Modal (Login / Signup) */}
      <AuthModal 
        showAuthModal={showAuthModal} 
        setShowAuthModal={setShowAuthModal} 
        authMode={authMode} 
        setAuthMode={setAuthMode} 
        showPassword={showPassword} 
        setShowPassword={setShowPassword} 
        setCurrentUser={setCurrentUser} 
        paymentMethod={paymentMethod} 
        setPaymentMethod={setPaymentMethod} 
      />

      {/* Payment Gateway Modal (Dummy / Demo Investor) */}
      {showPaymentGateway && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-[160] flex flex-col justify-end animate-in fade-in duration-300">
          <div className="bg-gray-50 w-full sm:max-w-md mx-auto max-h-[90%] sm:rounded-3xl rounded-t-[2.5rem] flex flex-col shadow-2xl relative animate-in slide-in-from-bottom duration-500 overflow-hidden">
            <div className="flex justify-center pt-4 pb-2 shrink-0 bg-white border-b border-gray-100">
               <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
            </div>
            <button onClick={() => setShowPaymentGateway(false)} className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 bg-gray-100 p-1.5 rounded-full z-10"><X size={20} /></button>
            
            <div className="overflow-y-auto flex-1 p-6 pb-12">
              {paymentStep === 'form' && (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-black text-gray-800">Pilih Nominal Wakaf</h3>
                    <p className="text-xs text-gray-500">Pahala jariyah mengalir dari setiap huruf yang dibaca.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[25000, 50000, 100000, 500000].map(amt => (
                      <button 
                        key={amt} 
                        onClick={() => setPaymentAmount(amt)}
                        className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${paymentAmount === amt ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-green-300'}`}
                      >
                        Rp {amt.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-bold text-gray-700">Metode Pembayaran</h4>
                    
                    <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'qris' ? 'border-green-500 bg-green-50/50' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><QrCode size={20}/></div>
                        <div>
                          <p className="font-bold text-sm text-gray-800">QRIS (Otomatis)</p>
                          <p className="text-[10px] text-gray-500">Gopay, OVO, Dana, LinkAja, m-BCA</p>
                        </div>
                      </div>
                      <input type="radio" name="method" value="qris" checked={paymentMethod === 'qris'} onChange={() => setPaymentMethod('qris')} className="w-4 h-4 accent-green-600" />
                    </label>

                    <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'va' ? 'border-green-500 bg-green-50/50' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center"><CreditCard size={20}/></div>
                        <div>
                          <p className="font-bold text-sm text-gray-800">Virtual Account</p>
                          <p className="text-[10px] text-gray-500">BSI, Mandiri, BCA, BNI, BRI</p>
                        </div>
                      </div>
                      <input type="radio" name="method" value="va" checked={paymentMethod === 'va'} onChange={() => setPaymentMethod('va')} className="w-4 h-4 accent-green-600" />
                    </label>
                  </div>

                  <button 
                    onClick={() => {
                      setPaymentStep('processing');
                      setTimeout(() => setPaymentStep('success'), 1500);
                    }} 
                    className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 active:scale-95 transition-all flex justify-between items-center px-6 mt-4"
                  >
                    <span>Bayar Sekarang</span>
                    <span>Rp {paymentAmount.toLocaleString('id-ID')} <ChevronRight size={18} className="inline ml-1"/></span>
                  </button>
                </div>
              )}

              {paymentStep === 'processing' && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                  <p className="font-bold text-gray-600">Menghubungkan ke Payment Gateway...</p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-5 animate-in zoom-in-95 duration-300">
                  <div className="w-full bg-yellow-100 text-yellow-800 p-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-yellow-200">
                     MODE DEMO / SIMULASI INVESTOR
                  </div>
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                     <CheckCircle size={40} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-gray-800">Pembayaran Berhasil!</h3>
                     <p className="text-sm text-gray-500 mt-2 leading-relaxed px-4">Alhamdulillah, simulasi donasi sebesar <b>Rp {paymentAmount.toLocaleString('id-ID')}</b> telah berhasil diproses oleh sistem.</p>
                  </div>
                  
                  <div className="w-full bg-white p-4 rounded-2xl border border-gray-200 shadow-sm text-left space-y-2 mt-4">
                     <div className="flex justify-between text-xs border-b border-gray-100 pb-2">
                       <span className="text-gray-500">Nomor Referensi</span>
                       <span className="font-mono font-bold text-gray-800">INV-{Math.floor(Math.random() * 1000000)}</span>
                     </div>
                     <div className="flex justify-between text-xs pt-1">
                       <span className="text-gray-500">Metode</span>
                       <span className="font-bold text-gray-800 uppercase">{paymentMethod}</span>
                     </div>
                  </div>

                  <button onClick={() => setShowPaymentGateway(false)} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-md hover:bg-gray-800 active:scale-95 transition-all mt-4">
                    Selesai & Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Syukur/Sedekah Modal */}
      {showSedekah && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end justify-center animate-in fade-in duration-300">
          <div className="bg-white w-full sm:max-w-md mx-auto sm:rounded-3xl rounded-t-[3rem] p-8 pb-12 space-y-4 animate-in slide-in-from-bottom duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.2)] relative">
             <div className="flex justify-center">
                <div className="w-16 h-1.5 bg-gray-100 rounded-full"></div>
             </div>
             <button onClick={() => setShowSedekah(false)} className="absolute top-6 right-6 bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-600"><X size={20} /></button>
             <div className="text-center space-y-3">
                <div className="mx-auto w-24 h-24 bg-yellow-50 rounded-[2.5rem] flex items-center justify-center text-yellow-500 mb-2 rotate-3"><Heart size={48} fill="currentColor" /></div>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">Wujudkan Rasa Syukur</h3>
                <p className="text-sm text-gray-500 leading-relaxed px-4">Alhamdulillah, hafalan <b>{selectedLearnItem ? selectedLearnItem.data.surah : MOCK_QURAN.surah}</b> sangat lancar. Mari sempurnakan dengan berwakaf untuk Pesantren Villa Quran.</p>
             </div>
             
             <div className="bg-green-50 rounded-2xl p-4 border border-green-100 text-left mt-4 mb-2">
               <p className="text-[11px] font-black text-green-800 mb-2 uppercase tracking-wider">💳 Transfer Rekening Resmi Yayasan</p>
               <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-green-200 shadow-sm">
                 <div>
                   <p className="text-sm font-black text-gray-800">BSI (Bank Syariah Indonesia)</p>
                   <p className="text-lg font-mono font-bold text-green-700 tracking-widest mt-0.5">7123456789</p>
                   <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">a.n. Yayasan Pesantren Villa Quran</p>
                 </div>
                 <button onClick={() => { navigator.clipboard.writeText('7123456789'); alert('Nomor Rekening Yayasan berhasil disalin!'); }} className="p-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 active:scale-95 transition-all" title="Salin Rekening">
                   <Copy size={20} />
                 </button>
               </div>
             </div>
             <div className="pt-2">
                <a href="https://wa.me/6281234567890?text=Assalamu'alaikum,%20saya%20ingin%20konfirmasi%20transfer%20infaq/wakaf%20dari%20Aplikasi%20At%20Tahfidz." target="_blank" rel="noreferrer" className="w-full bg-green-600 text-white py-4 rounded-xl font-black text-sm shadow-md flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all"><MessageCircle size={18} /> Konfirmasi Transfer via WA</a>
             </div>
          </div>
        </div>
      )}

      {/* Modal Pengaturan Target Belajar */}
      {showTargetModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[160] flex items-end justify-center animate-in fade-in duration-300">
          <div className="bg-white w-full sm:max-w-md mx-auto sm:rounded-3xl rounded-t-[2.5rem] p-6 pb-10 space-y-4 animate-in slide-in-from-bottom duration-500 shadow-2xl relative">
             <div className="flex justify-center mb-2">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
             </div>
             <button onClick={() => setShowTargetModal(false)} className="absolute top-6 right-6 bg-gray-50 p-2 rounded-full text-gray-400 hover:text-gray-600"><X size={20} /></button>
             
             <div>
               <h3 className="text-xl font-black text-gray-800">Atur Target Belajar</h3>
               <p className="text-xs text-gray-500 mt-1">Sesuaikan target hafalan harian agar sistem dapat memantau progres Anda secara otomatis.</p>
             </div>
             
             <form onSubmit={(e) => {
                 e.preventDefault();
                 const fd = new FormData(e.target);
                 setTargetData({ ayatPerHari: Number(fd.get('ayatPerHari')), juzTarget: Number(fd.get('juzTarget')), targetDate: fd.get('targetDate') });
                 setShowTargetModal(false);
             }} className="space-y-4 pt-2">
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-600 ml-1">Target Hafalan / Hari</label>
                   <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                     <input name="ayatPerHari" type="number" min="1" max="100" defaultValue={targetData.ayatPerHari} required className="w-full bg-transparent text-lg font-bold outline-none text-green-700" />
                     <span className="text-sm font-bold text-gray-400">Ayat</span>
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-600 ml-1">Fokus Hafalan Juz</label>
                   <select name="juzTarget" defaultValue={targetData.juzTarget} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:border-green-500 transition-all">
                     {[...Array(30)].map((_, i) => <option key={i+1} value={i+1}>Juz {i+1} {i+1 === 30 ? '(Juz Amma)' : ''}</option>)}
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-600 ml-1">Target Waktu Selesai</label>
                   <input name="targetDate" type="date" defaultValue={targetData.targetDate} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:border-green-500 transition-all" />
                 </div>
                 <button type="submit" className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-green-700 active:scale-95 transition-all mt-4">Simpan Target Baru</button>
             </form>
          </div>
        </div>
      )}

      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <div className="lg:w-72 lg:h-full lg:flex-col lg:justify-start lg:pt-8 lg:border-r lg:border-t-0 h-[76px] bg-white/90 backdrop-blur-md border-t border-gray-100 flex justify-around items-center px-2 lg:px-5 pb-2 lg:pb-0 pt-2 lg:pt-8 relative z-50 order-last lg:order-first shrink-0 shadow-sm lg:shadow-none">
        
        {/* Header Sidebar Desktop */}
        <div className="hidden lg:flex items-center gap-3 mb-10 px-2 w-full">
           <img src="https://raw.githubusercontent.com/iswinsyah/Gambar/refs/heads/main/logo%20Tahfidz.jfif" alt="Logo" className="w-10 h-10 rounded-xl shadow-sm object-cover border border-green-100" />
           <div>
             <h1 className="text-xl font-black text-green-800 tracking-tight leading-none">At Tahfidz</h1>
             <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1.5 inline-block">v{APP_VERSION} Premium</span>
           </div>
        </div>

        <button onClick={() => setActiveTab('home')} className={`flex lg:flex-row flex-col items-center lg:w-full lg:px-4 lg:py-3.5 lg:mb-2 lg:rounded-2xl lg:justify-start transition-all ${activeTab === 'home' ? 'text-green-700 lg:bg-green-50 scale-110 lg:scale-100 drop-shadow-sm' : 'text-gray-400 hover:text-green-600 lg:hover:bg-gray-50'}`}>
          <Home size={22} fill={activeTab === 'home' ? "currentColor" : "none"} className="lg:mr-4 shrink-0" />
          <span className="text-[10px] lg:text-sm font-black lg:font-bold mt-1 lg:mt-0 uppercase lg:capitalize tracking-tighter">Sosial</span>
        </button>
        <button onClick={() => setActiveTab('tajwid')} className={`flex lg:flex-row flex-col items-center lg:w-full lg:px-4 lg:py-3.5 lg:mb-2 lg:rounded-2xl lg:justify-start transition-all ${activeTab === 'tajwid' ? 'text-green-700 lg:bg-green-50 scale-110 lg:scale-100 drop-shadow-sm' : 'text-gray-400 hover:text-green-600 lg:hover:bg-gray-50'}`}>
          <BookOpen size={22} fill={activeTab === 'tajwid' ? "currentColor" : "none"} className="lg:mr-4 shrink-0" />
          <span className="text-[10px] lg:text-sm font-black lg:font-bold mt-1 lg:mt-0 uppercase lg:capitalize tracking-tighter">Tajwid</span>
        </button>
        <button onClick={() => setActiveTab('level')} className={`flex lg:flex-row flex-col items-center lg:w-full lg:px-4 lg:py-3.5 lg:mb-2 lg:rounded-2xl lg:justify-start transition-all ${activeTab === 'level' || activeTab === 'tilawah' ? 'text-green-700 lg:bg-green-50 scale-110 lg:scale-100 drop-shadow-sm' : 'text-gray-400 hover:text-green-600 lg:hover:bg-gray-50'}`}>
          <Star size={22} fill={activeTab === 'level' || activeTab === 'tilawah' ? "currentColor" : "none"} className="lg:mr-4 shrink-0" />
          <span className="text-[10px] lg:text-sm font-black lg:font-bold mt-1 lg:mt-0 uppercase lg:capitalize tracking-tighter">Level</span>
        </button>
        <button onClick={() => setActiveTab('quran')} className={`flex lg:flex-row flex-col items-center lg:w-full lg:px-4 lg:py-3.5 lg:mb-2 lg:rounded-2xl lg:justify-start transition-all ${activeTab === 'quran' || activeTab === 'learn' ? 'text-green-700 lg:bg-green-50 scale-110 lg:scale-100 drop-shadow-sm' : 'text-gray-400 hover:text-green-600 lg:hover:bg-gray-50'}`}>
          <List size={22} fill={activeTab === 'quran' || activeTab === 'learn' ? "currentColor" : "none"} className="lg:mr-4 shrink-0" />
          <span className="text-[10px] lg:text-sm font-black lg:font-bold mt-1 lg:mt-0 uppercase lg:capitalize tracking-tighter">Al-Qur'an</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex lg:flex-row flex-col items-center lg:w-full lg:px-4 lg:py-3.5 lg:mb-2 lg:rounded-2xl lg:justify-start transition-all ${activeTab === 'profile' ? 'text-green-700 lg:bg-green-50 scale-110 lg:scale-100 drop-shadow-sm' : 'text-gray-400 hover:text-green-600 lg:hover:bg-gray-50'}`}>
          <User size={22} fill={activeTab === 'profile' ? "currentColor" : "none"} className="lg:mr-4 shrink-0" />
          <span className="text-[10px] lg:text-sm font-black lg:font-bold mt-1 lg:mt-0 uppercase lg:capitalize tracking-tighter">Profil</span>
        </button>
      </div>
    </div>
  )
}

export default App
