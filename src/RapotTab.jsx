import React from 'react';
import { Star, Award, CheckCircle, User } from 'lucide-react';

export default function RapotTab({ setActiveTab }) {
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
          <h2 className="font-bold text-gray-700">Riwayat Setoran Per Juz</h2>
       </div>
       
       <div className="space-y-3">
         {[
           { juz: 30, score: 96, label: 'Mumtaz', status: 'Lulus', mode: 'Tahfidz' },
           { juz: 29, score: 88, label: 'Jayyid Jiddan', status: 'Lulus', mode: 'Tahsin' },
           { juz: 28, score: 0, status: 'Berjalan', progress: '45%', mode: 'Tahsin' },
           { juz: 27, score: 0, status: 'Belum', mode: '-' },
         ].map(item => (
           <div key={item.juz} className={`p-4 rounded-2xl border flex flex-col gap-3 group transition-colors shadow-sm ${item.score >= 95 ? 'bg-yellow-50/50 border-yellow-200' : 'bg-white border-gray-100'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner ${item.score >= 95 ? 'bg-green-600 text-white' : (item.score > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400')}`}>
                     {item.juz}
                  </div>
                  <div>
                    <p className="font-black text-gray-800">Juz {item.juz}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {item.mode !== '-' && <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold">{item.mode}</span>}
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        {item.status === 'Lulus' ? `Skor AI: ${item.score}` : (item.status === 'Berjalan' ? `Progres: ${item.progress}` : 'Belum Mulai')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                   {item.score >= 95 ? <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-1 rounded font-black uppercase tracking-wider flex items-center gap-1"><CheckCircle size={10}/> Mumtaz</span> : (item.score > 0 ? <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">{item.label}</span> : null)}
                </div>
              </div>
           </div>
         ))}
       </div>
    </div>
  );
}