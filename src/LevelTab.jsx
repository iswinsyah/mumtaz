import React from 'react';

export default function LevelTab({ setActiveTab, setSelectedIqraJilid, setSelectedIqraLesson, setSetoranMode }) {
  return (
    <div className="p-4 pb-24 space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-black text-gray-800 tracking-tight">Pilih Level Belajar</h1>
      <p className="text-sm text-gray-500">Tentukan target belajar Anda hari ini sesuai dengan kemampuan bacaan.</p>

      <div className="space-y-4">
        <button onClick={() => { setActiveTab('tilawah'); setSelectedIqraJilid(null); setSelectedIqraLesson(null); }} className="w-full bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-green-300 hover:shadow-md transition-all text-left flex gap-4 items-center group">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shrink-0">1</div>
          <div>
            <h3 className="font-black text-gray-800 text-lg">Tilawah (Dasar)</h3>
            <p className="text-xs text-gray-500 mt-1">Untuk pemula yang belum bisa membaca huruf Al-Qur'an.</p>
          </div>
        </button>

        <button onClick={() => { setActiveTab('quran'); setSetoranMode('tahsin'); }} className="w-full bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-green-300 hover:shadow-md transition-all text-left flex gap-4 items-center group">
          <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shrink-0">2</div>
          <div>
            <h3 className="font-black text-gray-800 text-lg">Tahsin (Perbaikan)</h3>
            <p className="text-xs text-gray-500 mt-1">Fokus memperbaiki panjang pendek & makhraj (tajwid).</p>
          </div>
        </button>

        <button onClick={() => { setActiveTab('quran'); setSetoranMode('tahfidz'); }} className="w-full bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-green-300 hover:shadow-md transition-all text-left flex gap-4 items-center group">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shrink-0">3</div>
          <div>
            <h3 className="font-black text-gray-800 text-lg">Tahfidz (Hafalan)</h3>
            <p className="text-xs text-gray-500 mt-1">Bacaan standar, lanjut menghafal mandiri (Setoran Buta).</p>
          </div>
        </button>
      </div>
    </div>
  );
}