export const iqraData = [
  {
    jilid: 1,
    title: "Iqra Jilid 1",
    description: "Pengenalan Huruf Tunggal berharakat Fathah (A, Ba, Ta, dst). Dibaca pendek.",
    lessons: [
      { id: "1_1", text: "أَ بَ تَ ثَ بَ أَ تَ ثَ ثَ تَ بَ أَ أَ تَ ثَ بَ أَ بَ تَ ثَ بَ أَ تَ ثَ", read: "a ba ta tsa", note: "Buka mulut. Dibaca pendek dan cepat berurutan." },
      { id: "1_2", text: "جَ حَ خَ جَ حَ جَ خَ حَ خَ حَ جَ خَ جَ حَ خَ جَ حَ جَ خَ حَ خَ حَ جَ خَ", read: "ja ha kho", note: "Bedakan makhraj Ha (bersih) dan Kho (ngorok)." },
      { id: "1_3", text: "دَ ذَ رَ زَ ذَ دَ زَ رَ رَ زَ دَ ذَ زَ رَ ذَ دَ دَ ذَ رَ زَ ذَ دَ زَ رَ", read: "da dza ro za", note: "Bedakan ujung lidah Dza dan desis Zai." },
      { id: "1_4", text: "سَ شَ صَ ضَ شَ سَ ضَ صَ صَ ضَ سَ شَ ضَ صَ شَ سَ سَ شَ صَ ضَ شَ سَ ضَ صَ", read: "sa sya sho dho", note: "Perhatikan ketebalan suara Sho dan Dho." },
      { id: "1_5", text: "طَ ظَ عَ غَ ظَ طَ غَ عَ عَ غَ طَ ظَ غَ عَ ظَ طَ طَ ظَ عَ غَ ظَ طَ غَ عَ", read: "tho dzo 'a gho", note: "Huruf Tho dan Dzo dibaca tebal dan ngangkat lidah." }
    ]
  },
  {
    jilid: 2,
    title: "Iqra Jilid 2",
    description: "Huruf Bersambung & Pengenalan Mad (Panjang 2 Harakat).",
    lessons: [
      { id: "2_1", text: "بَا تَا", read: "baa taa", note: "Bila ada Alif setelah Fathah, dibaca panjang 2 ayunan." },
      { id: "2_2", text: "بَتَ بَاتَا", read: "bata baataa", note: "Bedakan yang dibaca pendek dan panjang." },
      { id: "2_3", text: "جَا حَا", read: "jaa haa", note: "Awas jangan tertukar antara pendek dan panjang." }
    ]
  },
  {
    jilid: 3,
    title: "Iqra Jilid 3",
    description: "Pengenalan Harakat Kasrah (i) dan Dhammah (u).",
    lessons: [
      { id: "3_1", text: "بِ تِ ثِ", read: "bi ti tsi", note: "Kasrah dibaca 'i'. Meringis." },
      { id: "3_2", text: "بُ تُ ثُ", read: "bu tu tsu", note: "Dhammah dibaca 'u'. Bibir monyong." },
      { id: "3_3", text: "بِي تِي", read: "bii tii", note: "Kasrah bertemu Ya Sukun dibaca panjang (Mad)." },
      { id: "3_4", text: "بُو تُو", read: "buu tuu", note: "Dhammah bertemu Wawu Sukun dibaca panjang." }
    ]
  },
  {
    jilid: 4,
    title: "Iqra Jilid 4",
    description: "Pengenalan Tanwin (an, in, un), Sukun (mati), dan Qalqalah (pantulan).",
    lessons: [
      { id: "4_1", text: "بً بٍ بٌ", read: "ban bin bun", note: "Ini adalah Tanwin. Suaranya berakhiran 'n'." },
      { id: "4_2", text: "أَبْ أَتْ", read: "ab at", note: "Huruf mati (Sukun). Tahan suaranya." },
      { id: "4_3", text: "يَقْرَأُ", read: "yaq-ra-u", note: "Qalqalah. Huruf Qof sukun memantul: yaq (jeplak)." }
    ]
  },
  {
    jilid: 5,
    title: "Iqra Jilid 5",
    description: "Pengenalan Tasydid (ditekan), Alif Lam Qamariyah, dan cara Waqaf (berhenti).",
    lessons: [
      { id: "5_1", text: "إِنَّ", read: "in-na", note: "Tasydid (Syaddah). Ditekan dan ditahan (dengung)." },
      { id: "5_2", text: "وَالْقَمَرِ", read: "wal-qamari", note: "Alif Lam Qamariyah. Huruf Lam dibaca jelas." },
      { id: "5_3", text: "عَلِيمًا", read: "aliimaa", note: "Waqaf. Jika berhenti di akhir kalimat ber-tanwin Fathah, dibaca panjang (Mad Iwad)." }
    ]
  },
  {
    jilid: 6,
    title: "Iqra Jilid 6",
    description: "Alif Lam Syamsiyah, Ikhfa, Idgham, dan pengenalan awal ayat Al-Qur'an.",
    lessons: [
      { id: "6_1", text: "وَالشَّمْسِ", read: "wasy-syamsi", note: "Alif Lam Syamsiyah. Huruf Lam lebur ke huruf Syin." },
      { id: "6_2", text: "مِنْ شَرِّ", read: "minn-syarri", note: "Ikhfa. Nun mati bertemu Syin dibaca samar dan dengung." },
      { id: "6_3", text: "مِنْ وَرَائِهِمْ", read: "miww-waraa-ihim", note: "Idgham Bighunnah. Nun lebur ke Wawu dengan dengung." },
      { id: "6_4", text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", read: "Alhamdulillahi rabbil 'aalamiin", note: "Latihan membaca ayat Al-Qur'an utuh." }
    ]
  }
];