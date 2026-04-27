import React from 'react';
import { Search, X } from 'lucide-react';
import { quranData } from './data/QuranData';

export default function QuranTab({ quranView, setQuranView, searchQuery, setSearchQuery, handleSelectSurah, handleSelectJuz }) {
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
                  <div key={nomorSurah} onClick={() => handleSelectSurah(surah)} className="flex justify-between items-center p-3 rounded-xl hover:bg-green-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4"><div className="w-8 h-8 flex items-center justify-center bg-gray-100 group-hover:bg-green-100 text-gray-500 group-hover:text-green-700 font-bold rounded-lg text-xs transition-colors">{nomorSurah}</div><div><p className="font-bold text-gray-800 group-hover:text-green-800 transition-colors">{namaSurah}</p><p className="text-[10px] text-gray-400 font-medium">{juzSurah ? `Juz ${juzSurah} • ` : ''}{jumlahAyat} Ayat</p></div></div>
                    <div className="flex items-center gap-3"><span className="text-sm font-black text-green-700">{pageSurah}</span></div>
                  </div>
                );
              })
            ) : (<div className="text-center py-10 text-gray-400 text-sm font-medium">Surah tidak ditemukan</div>)
          ) : (
            filteredJuz.length > 0 ? (
              filteredJuz.map((juz) => (<div key={juz.id} onClick={() => handleSelectJuz(juz)} className="flex justify-between items-center p-3 rounded-xl hover:bg-green-50 transition-colors cursor-pointer group"><div className="flex items-center gap-4"><div className="w-8 h-8 flex items-center justify-center bg-gray-100 group-hover:bg-green-100 text-gray-500 group-hover:text-green-700 font-bold rounded-lg text-xs transition-colors">{juz.id}</div><div><p className="font-bold text-gray-800 group-hover:text-green-800 transition-colors">{juz.title}</p>{juz.subtitle && <p className="text-[10px] text-gray-400 font-medium">{juz.subtitle}</p>}</div></div><div className="flex items-center gap-3"><span className="text-sm font-black text-green-700">{juz.page}</span></div></div>))
            ) : (<div className="text-center py-10 text-gray-400 text-sm font-medium">Juz tidak ditemukan</div>)
          )}
        </div>
      </div>
    </div>
  );
}