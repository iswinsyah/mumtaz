import React from 'react';
import { User, LogIn, LogOut, Star, Award, BookOpen, Settings, Book } from 'lucide-react';

export default function ProfileTab({ 
  currentUser, setCurrentUser, setAuthMode, setShowAuthModal, 
  fileInputRef, handleAvatarChange, setActiveTab, targetData, setShowTargetModal, riwayatSetoran 
}) {
  if (!currentUser) {
    return (
      <div className="p-4 pb-24 flex flex-col items-center justify-center h-full min-h-[500px] space-y-6">
         <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-2">
            <User size={48} />
         </div>
         <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-gray-800">Tamu / Guest</h2>
            <p className="text-sm text-gray-500 max-w-[280px] mx-auto leading-relaxed">
              Anda sedang menggunakan <b>Mode Demo Premium</b>. Akses fitur AI dibuka tanpa batas (Unlimited).
            </p>
         </div>
         <div className="w-full max-w-[280px] space-y-3 mt-4">
            <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
              <LogIn size={18} /> Masuk Akun
            </button>
            <button onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }} className="w-full bg-white text-green-700 border-2 border-green-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
              Daftar Akun Baru
            </button>
         </div>
      </div>
    );
  }

  // Hitung jumlah ayat yang berhasil Mumtaz pada hari ini
  const today = new Date().toDateString();
  const ayatHariIni = (riwayatSetoran || [])
    .filter(r => new Date(r.date).toDateString() === today)
    .reduce((sum, r) => sum + (r.jumlahAyat || 0), 0);
    
  const progressPercent = Math.min(Math.round((ayatHariIni / targetData.ayatPerHari) * 100), 100);

  return (
    <div className="p-4 pb-24 text-center space-y-6">
       <div className="flex justify-end pt-2">
          <button onClick={() => setCurrentUser(null)} className="text-red-500 bg-red-50 p-2.5 rounded-full hover:bg-red-100 transition-colors" title="Keluar">
             <LogOut size={18} />
          </button>
       </div>
       <div className="relative mx-auto w-32 h-32">
          <div 
            className="w-24 h-24 bg-green-200 rounded-[2rem] mx-auto overflow-hidden border-4 border-white shadow-lg cursor-pointer group relative"
            onClick={() => fileInputRef.current?.click()}
            title="Klik untuk ubah foto"
          >
             <img 
               src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`} 
               alt="profile" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-[10px] font-bold tracking-widest uppercase">Ubah Foto</span>
             </div>
          </div>
          {/* Input file disembunyikan, dipanggil via onClick di atas */}
          <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
          
          {currentUser.isPremium && (
            <div className="absolute bottom-2 right-4 bg-yellow-500 text-white p-1.5 rounded-full border-4 border-white shadow-sm pointer-events-none">
               <Star size={16} fill="currentColor" />
            </div>
          )}
       </div>
       
       <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-800">{currentUser.name}</h2>
          <p className="text-sm text-gray-500 font-medium">
            @{currentUser.username} • {currentUser.isAdmin ? '👑 Super Admin' : (currentUser.isPremium ? 'Member Aktif' : 'Free Member')}
          </p>
       </div>

       {currentUser.isAdmin && (
         <div className="mt-4">
            <button onClick={() => setActiveTab('admin')} className="w-full bg-gray-900 text-yellow-500 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:bg-gray-800 active:scale-95 transition-all">
              👑 Buka Dashboard Admin
            </button>
         </div>
       )}

       <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-gray-100">
             <p className="text-xl font-black text-green-700">12</p>
             <p className="text-[10px] font-bold text-gray-400 uppercase">Streak</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-100">
             <p className="text-xl font-black text-green-700">4.8</p>
             <p className="text-[10px] font-bold text-gray-400 uppercase">Avg Score</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-100">
             <p className="text-xl font-black text-green-700">2</p>
             <p className="text-[10px] font-bold text-gray-400 uppercase">Juz Mutqin</p>
          </div>
       </div>

       {/* Perencanaan Target Belajar */}
       <div className="mt-4 text-left space-y-3">
          <div className="flex justify-between items-end px-1">
            <h3 className="font-bold text-gray-800">Perencanaan Belajar</h3>
          </div>
          <div onClick={() => setShowTargetModal(true)} className="bg-gradient-to-br from-green-700 to-green-900 p-5 rounded-2xl shadow-lg shadow-green-200/50 text-white flex justify-between items-center relative overflow-hidden group cursor-pointer active:scale-95 transition-all">
             <div className="relative z-10 space-y-1.5">
                <p className="text-[10px] text-green-200 font-bold uppercase tracking-widest flex items-center gap-1.5"><BookOpen size={12} /> Target Harian Saya</p>
                <p className="font-black text-xl">{targetData.ayatPerHari} Ayat / Hari</p>
                <p className="text-xs text-green-100 font-medium">Estimasi Khatam Juz {targetData.juzTarget}: <b className="text-yellow-400">{new Date(targetData.targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</b></p>
             </div>
             <div className="relative z-10 bg-white/20 p-2.5 rounded-xl group-hover:bg-white/30 transition-colors shadow-sm">
                <Settings size={20} className="text-white" />
             </div>
             <Book className="absolute -right-6 -bottom-6 opacity-10 rotate-12" size={110} />
          </div>
       </div>
    </div>
  );
}