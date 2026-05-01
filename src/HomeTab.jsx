import React from 'react';
import { Bell, Settings, Share2, ChevronRight, Heart, DollarSign, ExternalLink, Award, MessageCircle } from 'lucide-react';

export default function HomeTab({ setActiveTab, handleShareApp }) {
  return (
    <div className="space-y-4 p-4 pb-24 lg:pb-12 lg:pt-8">
      <div className="flex justify-between items-center px-2 lg:mb-2">
        <div className="flex items-center gap-3 lg:hidden">
          <img src="/logo.png" alt="Logo Mumtaz App" className="w-10 h-10 rounded-xl shadow-sm object-cover border border-green-100 bg-white" />
          <h1 className="text-2xl font-bold text-green-800">Mumtaz App</h1>
        </div>
        <div className="flex gap-3 ml-auto">
          <button className="p-2 bg-white rounded-full shadow-sm text-gray-600"><Bell size={20} /></button>
          <button className="p-2 bg-white rounded-full shadow-sm text-gray-600"><Settings size={20} /></button>
        </div>
      </div>

      {/* Tombol Share Viral (Mencolok) */}
      <button onClick={handleShareApp} className="w-full bg-gradient-to-r from-blue-600 to-blue-400 p-4 rounded-2xl shadow-lg shadow-blue-200 text-white flex items-center justify-between group active:scale-95 transition-all overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="text-left relative z-10">
          <h3 className="font-black text-lg flex items-center gap-2"><Share2 size={18} className="animate-bounce" /> Ajak Teman</h3>
          <p className="text-[10px] text-blue-50 mt-1 opacity-90 font-medium leading-relaxed">Bagikan ke grup WA. Raih pahala jariyah dari setiap huruf yang mereka baca.</p>
        </div>
        <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors relative z-10 shrink-0">
          <ChevronRight size={20} />
        </div>
      </button>

      {/* Promosi Web Yayasan / Sekolah */}
      <a href="https://villaquranbaronmalang.com" target="_blank" rel="noreferrer" className="block bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:border-green-300 transition-all group relative overflow-hidden cursor-pointer active:scale-95">
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 shrink-0 relative">
            <img src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=300&q=80" alt="Villa Quran" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="bg-green-100 text-green-700 w-fit px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">Penerimaan Santri Baru</div>
            <h3 className="font-bold text-sm text-gray-800 leading-tight">Pesantren Villa Quran Baron Malang</h3>
            <p className="text-[10px] text-gray-500 leading-tight line-clamp-2">Cetak generasi Qur'ani berakhlak mulia dan bersanad. Klik untuk info selengkapnya.</p>
          </div>
          <div className="shrink-0 text-gray-300 group-hover:text-green-500 transition-colors pr-2">
            <ExternalLink size={20} />
          </div>
        </div>
      </a>

      {/* Social Proof / Smart Threshold Banner */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-green-100 flex items-center gap-3">
        <div className="flex -space-x-3 shrink-0">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Umar" className="w-8 h-8 rounded-full border-2 border-white bg-blue-100" alt="user"/>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ali" className="w-8 h-8 rounded-full border-2 border-white bg-green-100" alt="user"/>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aisyah" className="w-8 h-8 rounded-full border-2 border-white bg-yellow-100" alt="user"/>
          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400">+</div>
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-800 leading-tight">
            {(() => {
              const simulatedUserCount = 45; // TODO: Ganti dengan data real dari API database nanti
              if (simulatedUserCount < 1000) return "Jadilah pelopor! Bergabung bersama angkatan pertama Hufadz digital.";
              if (simulatedUserCount <= 5000) return `Telah dipercaya oleh ${(Math.floor(simulatedUserCount / 100) * 100).toLocaleString('id-ID')}+ pejuang Al-Qur'an.`;
              return `Bergabunglah bersama ${(Math.floor(simulatedUserCount / 1000) * 1000).toLocaleString('id-ID')}+ Hufadz lainnya!`;
            })()}
          </p>
        </div>
      </div>

      {/* Social Media Feed for Hufadz (24 Hours Ephemeral) */}
      <div className="flex justify-between items-center px-2 pt-2">
        <h2 className="font-bold text-gray-700">Kabar Hufadz</h2>
        <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-1">⏳ Live 24 Jam</span>
      </div>
      
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest flex items-center gap-1"><Award size={10}/> Mumtaz</div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-800 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad" alt="avatar" />
          </div>
          <div className="flex-1 mt-1">
            <p className="font-bold text-sm leading-tight">Ahmad (Karyawan) <span className="text-xs">✨</span></p>
            <p className="text-[10px] text-green-600 font-bold mt-0.5">Berhasil lulus Tahfidz Juz 30</p>
          </div>
          <div className="text-[9px] text-gray-400 font-medium text-right leading-tight">2 jam lalu<br/><span className="text-red-400 font-bold">Hilang: 22j lagi</span></div>
        </div>
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
          "Alhamdulillah akhirnya bisa lulus Juz 30 setelah diulang 3x. Semangat terus buat teman-teman yang lagi ngafal di sela-sela jam kerja! 🔥🚀"
        </p>
        <div className="flex gap-5 pt-2">
          <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors"><Heart size={16} /> 42</button>
          <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-500 transition-colors"><MessageCircle size={16} /> 12 Komentar</button>
        </div>
      </div>
    </div>
  );
}