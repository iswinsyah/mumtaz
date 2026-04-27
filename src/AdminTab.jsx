import React from 'react';
import { AlertCircle, Users, MessageCircle } from 'lucide-react';

export default function AdminTab({ currentUser, setActiveTab, adminUsers, isLoadingAdmin }) {
  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-4">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="text-2xl font-black text-gray-800">Akses Ditolak</h2>
        <p className="text-sm text-gray-500">Anda tidak memiliki izin membuka halaman khusus Admin ini.</p>
        <button onClick={() => setActiveTab('home')} className="mt-4 px-6 py-3 bg-green-600 text-white rounded-xl font-bold shadow-md hover:bg-green-700">Kembali ke Beranda</button>
      </div>
    );
  }
  
  return (
    <div className="p-4 pb-24 space-y-4 animate-in fade-in duration-300">
       <div className="flex items-center justify-between mb-4">
         <h1 className="text-2xl font-black text-gray-800 tracking-tight">Dashboard Admin</h1>
         <button onClick={() => setActiveTab('profile')} className="text-sm font-bold text-gray-600 px-4 py-1.5 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">Tutup</button>
       </div>
       
       {(() => {
         const totalInfaq = adminUsers.reduce((sum, user) => sum + Number(user.infaq_choice || 0), 0);
         // Estimasi rata-rata tagihan API/Token per user (Misal Rp 3.000 per user)
         const estimasiToken = adminUsers.length * 3000; 
         const saldo = totalInfaq - estimasiToken;

         return (
           <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="bg-gray-900 col-span-2 rounded-2xl p-5 text-white shadow-lg flex justify-between items-center">
                 <div className="space-y-1">
                   <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Total Pendaftar</p>
                   <div className="flex items-center gap-3">
                     <Users size={24} className="text-yellow-500" />
                     <span className="text-3xl font-black text-yellow-500">{adminUsers.length}</span>
                   </div>
                 </div>
                 <div className="text-right space-y-1">
                   <p className="text-green-300 text-[10px] font-bold uppercase tracking-widest">Dana Infaq Masuk</p>
                   <p className="text-xl font-black text-green-400">Rp {totalInfaq.toLocaleString('id-ID')}</p>
                 </div>
              </div>
              
              <div className="bg-red-50 rounded-2xl p-4 border border-red-100 shadow-sm space-y-1">
                 <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest leading-tight">Estimasi Tagihan API</p>
                 <p className="text-lg font-black text-red-600">Rp {estimasiToken.toLocaleString('id-ID')}</p>
              </div>
              
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 shadow-sm space-y-1">
                 <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest leading-tight">Saldo Bersih Yayasan</p>
                 <p className="text-lg font-black text-blue-600">Rp {saldo.toLocaleString('id-ID')}</p>
              </div>
           </div>
         );
       })()}

       <div className="space-y-3 mt-4">
          <h2 className="font-bold text-gray-700">Daftar Pengguna</h2>
          {isLoadingAdmin ? (
            <p className="text-center text-sm text-gray-500 py-10">Memuat data pengguna...</p>
          ) : (
            adminUsers.map((u, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                 <div className="flex justify-between items-start"><div><p className="font-bold text-gray-800">{u.fullname}</p><p className="text-xs text-gray-500">@{u.username} • {u.domicile}</p></div><span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${u.infaq_choice > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{u.infaq_choice > 0 ? 'Premium' : 'Free'}</span></div>
                 <div className="pt-2 border-t border-gray-50 flex justify-between items-center mt-1"><a href={`https://wa.me/${(u.whatsapp || '').replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-green-600 flex items-center gap-1 hover:underline"><MessageCircle size={14}/> {u.whatsapp || 'Tidak ada WA'}</a><p className="text-[10px] text-gray-400">{new Date(u.created_at).toLocaleDateString('id-ID')}</p></div>
              </div>
            ))
          )}
       </div>
    </div>
  );
}