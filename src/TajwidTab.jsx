import React, { useState } from 'react';
import { ChevronRight, Volume2, Play } from 'lucide-react';

const TAJWID_LESSONS = [
  {
    id: 'nun_mati',
    title: 'Hukum Nun Mati & Tanwin',
    desc: 'Aturan baca Nun Sukun (نْ) atau Tanwin (ـً ـٍ ـٌ)',
    content: "1. Izhar Halqi: Dibaca jelas (ء, ه, ع, ح, غ, خ)\n2. Idgham Bighunnah: Masuk dengan dengung (ي, ن, م, و)\n3. Idgham Bilaghunnah: Masuk tanpa dengung (ل, ر)\n4. Iqlab: Berubah jadi suara Mim (ب)\n5. Ikhfa Haqiqi: Samar & mendengung (15 huruf sisanya)",
    examples: [
      { id: 'nun_1', text: "كُفُوًا أَحَدٌ", type: "Izhar Halqi (Tanwin + Alif)", surah: 112, ayah: 4, label: "Al-Ikhlas: 4" },
      { id: 'nun_2', text: "مِن شَرِّ", type: "Ikhfa Haqiqi (Nun Sukun + Syin)", surah: 113, ayah: 2, label: "Al-Falaq: 2" }
    ]
  },
  {
    id: 'mim_mati',
    title: 'Hukum Mim Mati',
    desc: 'Aturan baca Mim Sukun (مْ) bertemu huruf hijaiyah',
    content: "1. Ikhfa Syafawi: Dibaca samar berdengung di bibir (ب)\n2. Idgham Mimi: Masuk berdengung (م)\n3. Izhar Syafawi: Dibaca jelas di bibir (Selain م dan ب)",
    examples: [
      { id: 'mim_1', text: "تَرْمِيهِم بِحِجَارَةٍ", type: "Ikhfa Syafawi", surah: 105, ayah: 4, label: "Al-Fil: 4" },
      { id: 'mim_2', text: "أَطْعَمَهُم مِّن جُوعٍ", type: "Idgham Mimi", surah: 106, ayah: 4, label: "Quraish: 4" },
      { id: 'mim_3', text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", type: "Izhar Syafawi", surah: 112, ayah: 3, label: "Al-Ikhlas: 3" }
    ]
  },
  {
    id: 'mad',
    title: 'Hukum Mad (Panjang)',
    desc: 'Aturan memanjangkan suara pada huruf-huruf tertentu',
    content: "1. Mad Thabi'i: Panjang 2 harakat (Huruf Alif, Wawu sukun, Ya' sukun).\n2. Mad Wajib Muttasil: Mad Thabi'i bertemu hamzah dalam 1 kata (4-5 harakat).\n3. Mad Jaiz Munfasil: Mad Thabi'i bertemu hamzah beda kata (2-5 harakat).\n4. Mad Aridh Lissukun: Mad dibaca saat waqaf/berhenti (2, 4, 6 harakat).\n5. Mad Lazim: Mad bertemu huruf bertasydid (6 harakat).",
    examples: [
      { id: 'mad_1', text: "إِذَا جَآءَ", type: "Mad Wajib Muttasil", surah: 110, ayah: 1, label: "An-Nasr: 1" },
      { id: 'mad_2', text: "فِى عَمَدٍ", type: "Mad Thabi'i (Ya Sukun)", surah: 104, ayah: 9, label: "Al-Humazah: 9" }
    ]
  },
  {
    id: 'makhraj',
    title: 'Makharijul Huruf',
    desc: 'Tempat keluarnya huruf-huruf hijaiyah',
    content: "1. Al-Jauf (Rongga Mulut): Tempat keluarnya huruf Mad.\n2. Al-Halq (Tenggorokan): Bawah (ء, ه), Tengah (ع, ح), Atas (غ, خ).\n3. Al-Lisan (Lidah): Terbanyak, 18 huruf (Qof, Kaf, Jim, dll).\n4. Asy-Syafatain (Bibir): Fa, Wawu, Ba, Mim.\n5. Al-Khaisyum (Hidung): Tempat keluarnya suara Ghunnah/Dengung.",
    examples: [
      { id: 'makh_1', text: "خَلَقَ", type: "Tenggorokan Atas (Kha)", surah: 113, ayah: 2, label: "Al-Falaq: 2" },
      { id: 'makh_2', text: "قُلْ أَعُوذُ", type: "Pangkal Lidah (Qof)", surah: 114, ayah: 1, label: "An-Nas: 1" }
    ]
  },
  {
    id: 'qalqalah',
    title: 'Hukum Qalqalah',
    desc: 'Pantulan suara saat huruf tertentu disukunkan',
    content: "Huruf Qalqalah: ق, ط, ب, ج, د (Baju Ditoko)\n\n1. Qalqalah Sugra (Kecil): Huruf mati di tengah kalimat. Pantulan ringan.\n2. Qalqalah Kubra (Besar): Huruf mati karena diwaqafkan (berhenti) di akhir ayat. Pantulan lebih kuat.",
    examples: [
      { id: 'qal_1', text: "ٱلْأَبْتَرُ", type: "Qalqalah Sugra (Ba Sukun)", surah: 108, ayah: 3, label: "Al-Kautsar: 3" },
      { id: 'qal_2', text: "ٱلْفَلَقِ", type: "Qalqalah Kubra (Qof Waqaf)", surah: 113, ayah: 1, label: "Al-Falaq: 1" }
    ]
  }
];

export default function TajwidTab({ handlePlayTajwid, playingAyah }) {
  const [expandedTajwid, setExpandedTajwid] = useState(null); // State accordion tajwid dipindah ke sini

  return (
    <div className="p-4 pb-24 space-y-4 animate-in fade-in duration-300">
      <h1 className="text-2xl font-black text-gray-800 tracking-tight">Ilmu Tajwid</h1>
      <p className="text-sm text-gray-500">Pelajari ringkasan dasar ilmu tajwid sebelum mulai menyetorkan hafalan Anda.</p>
      
      <div className="space-y-3 mt-4">
        {TAJWID_LESSONS.map(lesson => (
          <div key={lesson.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-all">
            <button onClick={() => setExpandedTajwid(expandedTajwid === lesson.id ? null : lesson.id)} className="w-full p-4 flex justify-between items-center text-left bg-white hover:bg-green-50 transition-colors">
              <div>
                <h3 className="font-bold text-green-800">{lesson.title}</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">{lesson.desc}</p>
              </div>
              <ChevronRight className={`text-green-600 transition-transform duration-300 ${expandedTajwid === lesson.id ? 'rotate-90' : ''}`} size={20} />
            </button>
            {expandedTajwid === lesson.id && (
              <div className="p-4 pt-0 border-t border-gray-100 bg-green-50/30">
                <div className="text-[12px] text-gray-700 leading-loose whitespace-pre-line font-medium mb-3">{lesson.content}</div>
                {lesson.examples && (
                  <div className="space-y-2 mt-3 pt-3 border-t border-green-100">
                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest flex items-center gap-1"><Volume2 size={12}/> Dengarkan Contoh Ayat</p>
                    {lesson.examples.map(ex => (
                      <button key={ex.id} onClick={() => handlePlayTajwid(ex.surah, ex.ayah, ex.id)} className="w-full flex items-center justify-between p-3 bg-white border border-green-200 rounded-xl hover:bg-green-100 active:scale-95 transition-all group shadow-sm">
                        <div className="flex items-center gap-3 text-left">
                          <div className={`p-2.5 rounded-full shadow-sm transition-colors ${playingAyah === ex.id ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600 group-hover:bg-green-200'}`}>
                            {playingAyah === ex.id ? <Volume2 size={16} className="animate-pulse" /> : <Play size={16} />}
                          </div>
                          <div><p className="font-bold text-gray-800 text-xs">{ex.type}</p><p className="text-[10px] text-gray-500 mt-0.5">{ex.label} <span className="font-serif text-sm ml-1.5 text-green-700">{ex.text}</span></p></div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}