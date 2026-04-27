import React from 'react';
import { Mic, Award, Volume2, Play, Check, Copy } from 'lucide-react';

export default function SetorTab({
  sessionState, setSessionState, setoranMode, setSetoranMode, handleStartSetoran, handleStopSetoran,
  transcript, selectedLearnItem, ayahStart, ayahEnd, score, aiNote, aiAudio, recordedAudioUrl,
  isSpeakingNote, handlePlayUstadzVoice, selectedUstadz, handleCopyResult, isCopied, getPredicate, MOCK_QURAN
}) {
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
            <button onClick={() => setSetoranMode('tahfidz')} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${setoranMode === 'tahfidz' ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-105' : 'text-green-700 hover:bg-green-200/50'}`}>Tahfidz (Hafalan)</button>
            <button onClick={() => setSetoranMode('tahsin')} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${setoranMode === 'tahsin' ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-105' : 'text-green-700 hover:bg-green-200/50'}`}>Tahsin (Baca)</button>
          </div>

          <button onClick={handleStartSetoran} className="w-full bg-green-800 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-100 active:scale-95 transition-all">
            {setoranMode === 'tahfidz' ? 'Mulai Setoran Sekarang' : 'Mulai Tahsin Sekarang'}
          </button>
        </div>
      )}

      {sessionState === 'recording' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 rounded-[2.5rem] text-white p-8 relative overflow-hidden">
          <div className="absolute top-12 flex flex-col items-center gap-2">
             <div className="flex gap-1.5">{[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>)}</div>
             <p className="text-[10px] tracking-widest uppercase font-black text-gray-500">{setoranMode === 'tahfidz' ? 'Layar Blind Mode Aktif' : 'Layar Tahsin Aktif'}</p>
          </div>
          
          {setoranMode === 'tahsin' ? (
            <div className="w-full mt-20 mb-6 flex-1 overflow-y-auto pr-2">
              <p className="text-[26px] leading-[2.2] font-serif text-gray-100 text-right" dir="rtl">
                {(() => {
                  const currentLearnData = selectedLearnItem ? selectedLearnItem.data : MOCK_QURAN;
                  return currentLearnData.text.filter(t => t.id >= ayahStart && t.id <= ayahEnd).map(item => (
                    <span key={item.id}>{item.arabic} <span className="text-green-400 font-sans text-xl mx-1 select-none">﴿{item.ayahNumber || item.id}﴾</span></span>
                  ));
                })()}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 h-32 mt-12">
              {[...Array(14)].map((_, i) => (<div key={i} className="w-1.5 bg-green-400 rounded-full animate-bounce" style={{ height: `${30 + Math.random() * 70}%`, animationDuration: `${0.4 + Math.random()}s` }}></div>))}
            </div>
          )}
          
          <div className={`text-center ${setoranMode === 'tahsin' ? 'mt-0' : 'mt-12'} space-y-1 mb-16`}>
            {setoranMode === 'tahsin' && (
              <div className="flex justify-center items-center gap-1.5 h-8 mb-4">
                {[...Array(8)].map((_, i) => (<div key={i} className="w-1 bg-green-400 rounded-full animate-bounce" style={{ height: `${30 + Math.random() * 70}%`, animationDuration: `${0.4 + Math.random()}s` }}></div>))}
              </div>
            )}
            <p className="text-xl font-bold tracking-tight">AI Sedang Menyimak...</p>
            <p className="text-xs text-gray-400">Lantunkan {selectedLearnItem ? selectedLearnItem.data.surah : MOCK_QURAN.surah}: {selectedLearnItem?.type === 'juz' ? selectedLearnItem.data.ayat_range : `Ayat ${ayahStart}-${ayahEnd}`}</p>
            <p className="text-xs text-green-300 mt-2 truncate max-w-xs px-4 h-4 mx-auto">{transcript || "Menunggu suara..."}</p>
          </div>

          <div className="absolute bottom-12 w-full px-8">
             <button onClick={handleStopSetoran} className="w-full py-4 border border-white/20 rounded-2xl text-xs font-bold uppercase tracking-widest text-white bg-red-600/20 hover:bg-red-600/40 backdrop-blur-sm">
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
              <button onClick={() => {
                  const cleanNote = aiNote ? aiNote.replace(/\[.*?\]\n\n/g, '') : '';
                  handlePlayUstadzVoice(cleanNote || getPredicate(score).note, aiAudio);
                }}
                className={`mx-auto flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all bg-white/50 px-4 py-2 rounded-full shadow-sm ${isSpeakingNote ? 'text-green-700' : 'text-gray-600'}`}
              >
                 {isSpeakingNote ? <Volume2 size={14} className="animate-pulse" /> : <Volume2 size={14} />} 
                 {isSpeakingNote ? 'Ustadz Sedang Berbicara...' : `Dengarkan Saran ${selectedUstadz}`}
              </button>
              <p className="text-sm italic font-medium text-gray-700 leading-relaxed select-text cursor-text">"{aiNote || getPredicate(score).note}"</p>
            </div>

            {recordedAudioUrl && (
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cek Rekaman Anda (Debug)</p>
                <audio controls src={recordedAudioUrl} className="w-full h-10" />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button onClick={handleCopyResult} className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${isCopied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {isCopied ? <Check size={18} /> : <Copy size={18} />} {isCopied ? 'Tersalin ke Clipboard!' : 'Salin Hasil Evaluasi'}
              </button>
              <button onClick={() => setSessionState('idle')} className="w-full py-4 text-gray-400 font-bold text-sm">Ulangi Setoran Ini</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}