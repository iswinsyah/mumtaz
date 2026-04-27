import React from 'react';
import { Star, Award, CheckCircle, User } from 'lucide-react';

export default function RapotTab({ setActiveTab, riwayatSetoran }) {
  return (
    <div className="p-4 pb-24 space-y-4 animate-in fade-in duration-300">
       <div className="flex items-center justify-between mb-2">
         <h1 className="text-2xl font-black text-gray-800 tracking-tight">Rapot & Riwayat</h1>
         <button onClick={() => setActiveTab('profile')} className="text-sm font-bold text-green-600 px-4 py-1.5 bg-green-50 rounded-full hover:bg-green-100 transition-colors">Kembali</button>
       </div>
       
       {/* Banner Info Sanad */}
       <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-1.5">
            <div className="bg-yellow-500 text-green-900 w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1"><Star size={10}/> Jalur Sanad</div>
            <h3 className="font-bold text-lg leading-tight">Ujian Ustadz Bersanad</h3>
            <p className="text-xs text-green-100 leading-relaxed max-w-[90%]">
              Untuk membuka kesempatan ujian langsung dengan Ustadz Manusia, Anda wajib mendapatkan predikat <b className="text-yellow-400">Mumtaz (Skor ≥ 95)</b> secara kumulatif pada Juz tersebut dari evaluasi AI.
            </p>
          </div>
          <Award className="absolute -right-4 -bottom-4 opacity-10 rotate-12" size={120} />
       </div>

       <div className="flex justify-between items-center px-1 pt-3">
          <h2 className="font-bold text-gray-700">Riwayat Setoran (Mumtaz)</h2>
       </div>
       
       <div className="space-y-3">
         {!riwayatSetoran || riwayatSetoran.length === 0 ? (
           <p className="text-center text-xs text-gray-500 py-10">Belum ada riwayat setoran Mumtaz yang tercatat.</p>
         ) : (
           riwayatSetoran.map(item => (
             <div key={item.id} className="p-4 rounded-2xl border flex flex-col gap-3 group transition-colors shadow-sm bg-yellow-50/50 border-yellow-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner bg-green-600 text-white">
                       <CheckCircle size={24} />
                  </div>
                  <div>
                      <p className="font-black text-gray-800">{item.surah}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold">{item.mode}</span>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.ayat}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                     <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-1 rounded font-black uppercase tracking-wider flex items-center gap-1"><CheckCircle size={10}/> {item.score}</span>
                     <span className="text-[9px] text-gray-400 mt-1">{new Date(item.date).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
             </div>
           ))
         )}
       </div>
    </div>
  );
}