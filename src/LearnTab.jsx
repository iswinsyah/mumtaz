import React from 'react';
import { List, Play, Pause, Volume2, Download, AlertCircle, Mic } from 'lucide-react';

export default function LearnTab({
  isLoadingLearnData, selectedLearnItem, MOCK_QURAN, ayahStart, setAyahStart, ayahEnd, setAyahEnd,
  selectedQari, setSelectedQari, setActiveTab, isAutoplay, isPlayingAudio,
  handlePlayAyah, handleDownloadAyah, isMushafMode, setIsMushafMode, playingAyah,
  setoranMode, playlistRef
}) {
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
  const displayedText = text; // Tampilkan seluruh ayat tanpa dipotong
  playlistRef.current = displayedText;

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
              {selectedLearnItem?.type === 'juz' ? currentLearnData.ayat_range : `Total: ${verses} Ayat`}
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
            <button onClick={() => setIsMushafMode(false)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isMushafMode ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Mode Terjemah</button>
            <button onClick={() => setIsMushafMode(true)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isMushafMode ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Mode Mushaf</button>
          </div>
        </div>

        {isMushafMode ? (
          <div className="py-6 px-2 sm:px-6 flex justify-center bg-gray-900 rounded-3xl overflow-hidden my-4 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]" dir="rtl">
             <div className="bg-[#fdf6e3] w-full max-w-4xl border-[10px] border-double border-[#d4b872] p-5 sm:p-10 rounded-sm shadow-2xl relative flex flex-col justify-between min-h-[60vh]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>
                <div className="flex justify-between items-center border-b-[3px] border-[#c3a45a] pb-3 mb-6 px-2">
                   <p className="font-bold text-[#8b6b22] text-xs sm:text-base tracking-widest uppercase">{selectedLearnItem?.type === 'juz' ? currentLearnData.surah : 'Surah'}</p>
                   <p className="font-bold text-[#8b6b22] text-xs sm:text-base tracking-widest">{surah}</p>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-[28px] sm:text-[36px] md:text-[44px] leading-[2.2] sm:leading-[2.4] font-serif text-black text-justify" style={{ textJustify: 'inter-word', wordSpacing: '4px' }}>
                    {displayedText.map(item => (
                      <span key={item.id} onClick={() => handlePlayAyah(item.surahNumber || surahNumber, item.ayahNumber || item.id, item.id)} className={`cursor-pointer transition-colors p-1 sm:p-2 rounded-lg ${playingAyah === item.id ? 'bg-[#c3a45a]/30 shadow-sm' : 'hover:bg-black/5'}`}>
                        {item.arabic} <span className="text-[#a48032] font-sans text-xl sm:text-2xl mx-1 select-none">﴿{item.ayahNumber || item.id}﴾</span>
                      </span>
                    ))}
                  </p>
                </div>
                <div className="text-center pt-4 border-t-[3px] border-[#c3a45a] mt-8">
                   <p className="font-bold text-[#8b6b22] text-[10px] sm:text-xs tracking-widest uppercase">At Tahfidz - Mushaf Hafalan</p>
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-8 py-2">
            {displayedText.map(item => (
              <div key={item.id} onClick={() => handlePlayAyah(item.surahNumber || surahNumber, item.ayahNumber || item.id, item.id)} className={`space-y-3 p-4 rounded-2xl cursor-pointer transition-all border ${playingAyah === item.id ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-50'}`}>
                <div className="flex items-start gap-4 justify-between">
                  <div className="flex flex-col gap-2 mt-2 shrink-0">
                    <button className={`p-2 rounded-full ${playingAyah === item.id ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:text-green-600'}`}>{playingAyah === item.id ? <Volume2 size={16} className="animate-pulse" /> : <Play size={16} />}</button>
                    <button onClick={(e) => handleDownloadAyah(item.surahNumber || surahNumber, item.ayahNumber || item.id, e)} className="p-2 rounded-full bg-blue-50 text-blue-500 hover:text-blue-700 hover:bg-blue-100 transition-colors shadow-sm" title="Download MP3"><Download size={14} /></button>
                  </div>
                  <p className="text-right text-3xl leading-loose font-serif text-gray-800" dir="rtl">{item.arabic} <span className="text-green-600 font-sans text-xl">﴿{item.ayahNumber || item.id}﴾</span></p>
                </div>
                <div>
                  {item.surahName && <span className="text-[9px] font-black text-green-700 bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">{item.surahName} : {item.ayahNumber}</span>}
                  <p className="text-xs text-gray-500 leading-relaxed font-medium italic bg-white p-3 rounded-xl border border-gray-100">{item.indo}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
        <AlertCircle className="text-blue-600 shrink-0" />
        <p className="text-xs text-blue-700 leading-relaxed"><b>Tips At Tahfidz:</b> Dengarkan audio Qari sebelum mulai. Maksimal setoran <b>10 ayat</b> per sesi agar evaluasi Ustadz AI sangat akurat.</p>
      </div>

      {/* Spacer agar tombol melayang tidak menutupi teks terakhir */}
      <div className="h-16"></div>

    </div>
  );
}