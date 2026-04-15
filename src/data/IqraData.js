export const iqraData = [
  {
    jilid: 1,
    title: "Tilawah Tahap 1",
    description: "Pengenalan Huruf Tunggal berharakat Fathah (A, Ba, Ta, dst). Dibaca pendek.",
    lessons: [
      { id: "1_1", columns: 4, text: "أَ بَ تَ ثَ أَ بَ تَ ثَ بَ أَ ثَ تَ تَ بَ أَ ثَ ثَ تَ بَ أَ", note: "Buka mulut. Dibaca pendek dan cepat. (Teks diacak otomatis)" },
      { id: "1_2", columns: 4, text: "جَ حَ خَ أَ جَ حَ خَ بَ جَ حَ خَ تَ جَ حَ خَ ثَ خَ حَ جَ", note: "Bedakan makhraj Ha (bersih) dan Kho (ngorok)." },
      { id: "1_3", columns: 4, dynamicType: 'fathah', wordLength: 2, text: "بَتَ حَسَ دَرَ صَعَ فَقَ غَمَ", note: "Latihan huruf dinamis. Teks akan di-generate mesin secara acak setiap kali dibuka." },
      { id: "1_4", columns: 4, dynamicType: 'fathah', wordLength: 3, text: "خَلَقَ بَعَثَ شَرَحَ كَتَبَ نَظَرَ", note: "Latihan 3 huruf dinamis berharakat Fathah (Acak mesin, tidak bermakna)." },
      { id: "1_5", columns: 4, text: "ضَرَبَ صَدَقَ شَرَحَ كَتَبَ نَظَرَ بَعَثَ حَسَدَ خَلَقَ رَزَقَ قَرَأَ دَخَلَ جَلَسَ ذَهَبَ سَأَلَ طَلَبَ غَسَلَ", note: "Kata bermakna. Harakat Fathah mengikuti lazimnya kalimat tersebut." }
    ]
  },
  {
    jilid: 2,
    title: "Tilawah Tahap 2",
    description: "Huruf Bersambung & Pengenalan Mad (Panjang 2 Harakat).",
    lessons: [
      { id: "2_2", columns: 4, text: "بَا تَا ثَا جَا حَا خَا دَا ذَا رَا زَا سَا شَا صَا ضَا طَا ظَا عَا غَا فَا قَا", note: "Bila ada Alif setelah Fathah, dibaca panjang 2 ayunan." },
      { id: "2_3", columns: 4, text: "بَتَا بَاتَ جَحَا جَاحَ سَشَا سَاشَ صَضَا صَاضَ طَظَا طَاظَ عَغَا عَاغَ فَقَا فَاقَ كَلَا كَالَ مَنَا مَانَ وَهَا وَاهَ", note: "Bedakan yang dibaca pendek dan panjang. Jangan tertukar!" },
      { id: "2_3", columns: 4, text: "بَاتَثَ بَتَاثَ جَاحَخَ جَحَاخَ دَاذَرَ دَذَارَ زَاسَشَ زَسَاشَ صَاضَطَ صَضَاطَ ظَاعَغَ ظَعَاغَ فَاقَكَ فَقَاكَ لَامَنَ لَمَانَ وَاهَيَ وَهَايَ", note: "Sambung 3 huruf. Awas huruf pendek jangan ikut memanjang." },
      { id: "2_4", columns: 4, text: "خَادَعَ جَاهَدَ قَاتَلَ هَاجَرَ صَابَرَ عَانَدَ نَافَقَ سَامَحَ دَافَعَ طَالَبَ بَارَكَ شَارَكَ ضَاعَفَ خَالَفَ حَافَظَ سَابَقَ", note: "Kata bermakna. Huruf pertama dibaca panjang." },
      { id: "2_5", columns: 4, text: "ضَرَبَا خَرَجَا دَخَلَا قَرَءَا كَتَبَا نَظَرَا بَعَثَا حَسَدَا خَلَقَا رَزَقَا وَجَدَا سَجَدَا طَلَبَا غَسَلَا جَلَسَا ذَهَبَا", note: "Kata bermakna. Huruf di akhir kalimat dibaca panjang." }
    ]
  },
  {
    jilid: 3,
    title: "Tilawah Tahap 3",
    description: "Pengenalan Harakat Kasrah (i) dan Dhammah (u).",
    lessons: [
      { id: "3_1", columns: 4, text: "بِ تِ ثِ جِ حِ خِ دِ ذِ رِ زِ سِ شِ صِ ضِ طِ ظِ عِ غِ فِ قِ", note: "Kasrah dibaca 'i'. Bibir agak meringis ke bawah." },
      { id: "3_2", columns: 4, dynamicType: 'fathah-kasrah', wordLength: 3, text: "بِتَ فَحِ ضَغِ زِسَ خَدِ", note: "Mesin Acak Dinamis: Campuran Fathah dan Kasrah (Tidak bermakna)." },
      { id: "3_3", columns: 4, text: "بُ تُ ثُ جُ حُ خُ دُ ذُ رُ زُ سُ شُ صُ ضُ طُ ظُ عُ غُ فُ قُ", note: "Dhammah dibaca 'u'. Bibir dimonyongkan ke depan." },
      { id: "3_4", columns: 4, dynamicType: 'mixed', wordLength: 3, text: "بُتِثَ كُظِمَ هُجِشُ ظُعِ", note: "Mesin Acak Dinamis: Campuran penuh Fathah, Kasrah & Dhammah!" },
      { id: "3_5", columns: 4, text: "كُتِبَ قُرِئَ شُرِحَ نُظِرَ صُدِقَ ضُرِبَ غُلِبَ خُلِقَ رُزِقَ جُعِلَ ذُكِرَ حُشِرَ طُبِعَ عُرِفَ لُعِنَ سُئِلَ", note: "Kata bermakna. Harakat mengikuti lazimnya kata/kalimat tersebut." }
    ]
  },
  {
    jilid: 4,
    title: "Tilawah Tahap 4",
    description: "Pengenalan Tanwin (an, in, un), Sukun (mati), dan Qalqalah (pantulan).",
    lessons: [
      { id: "4_1", columns: 4, text: "بًا تًا ثًا جًا حًا خًا دًا ذًا رًا زًا بٍِ تٍ ثٍ جٍ حٍ خٍ دٍ ذٍ رٍ زٍ", note: "Ini adalah Tanwin Fathah dan Kasrah. Suaranya berakhiran 'n'." },
      { id: "4_2", columns: 4, text: "بٌ تٌُ ثٌ جٌ حٌ خٌ دٌ ذٌ رٌ زٌ سٌ شٌ صٌ ضٌ طٌ ظٌ عٌ غٌ فٌ قٌ", note: "Tanwin Dhammah (un). Mulut monyong lalu kembali netral." },
      { id: "4_3", columns: 4, text: "أَتْ أَثْ أَحْ أَخْ أَذْ أَرْ أَزْ أَسْ أَشْ أَصْ أَضْ أَظْ أَعْ أَغْ أَفْ أَكْ أَلْ أَمْ أَنْ أَهْ", note: "Huruf mati (Sukun). Tahan suaranya, jangan dipantulkan." },
      { id: "4_4", columns: 4, text: "أَبْ إِبْ أُبْ أَجْ إِجْ أُجْ أَدْ إِدْ أُدْ أَطْ إِطْ أُطْ أَقْ إِقْ أُقْ يَبْ يَقْ يَدْ يَجْ يَطْ", note: "Qalqalah (Baju Ditoko). Pantulkan dengan jelas!" },
      { id: "4_5", columns: 4, text: "يَلْعَبُ يَشْرَبُ يَقْرَأُ يَكْتُبُ يَنْظُرُ يَسْمَعُ يَعْمَلُ يَحْفَظُ يَرْجِعُ يَفْهَمُ يَدْخُلُ يَخْرُجُ مَسْجِدٌ عَيْنٌ شَيْءٌ يَوْمٌ", note: "Kata bermakna. Gabungan sukun, qalqalah, dan tanwin." }
    ]
  },
  {
    jilid: 5,
    title: "Tilawah Tahap 5",
    description: "Pengenalan Tasydid (ditekan), Alif Lam Qamariyah, dan cara Waqaf (berhenti).",
    lessons: [
      { id: "5_1", columns: 3, text: "إِنَّ أَنَّ كَأَنَّ لَكِنَّ رَبَّ صَبَّ حَبَّ دَبَّ تَبَّ مَدَّ شَدَّ عَدَّ حَدَّ سَدَّ رَدَّ", note: "Tasydid (Syaddah). Ditekan. Jika pada Nun/Mim ditahan (dengung)." },
      { id: "5_2", columns: 3, text: "وَالْقَمَرِ وَالْأَرْضِ وَالْبَحْرِ وَالْجَبَلِ وَالْحَمْدُ وَالْخَيْرِ وَالْفَجْرِ وَالْقَلْبِ وَالْكِتَابِ وَالْمَاءِ وَالْوَلَدِ وَالْهَوَاءِ وَالْيَوْمِ بِالْقَمَرِ كَالْقَمَرِ", note: "Alif Lam Qamariyah. Huruf Lam dibaca tegagas dan jelas." },
      { id: "5_3", columns: 3, text: "عَلِيمًا حَكِيمًا رَحِيمًا غَفُورًا شَكُورًا خَبِيرًا بَصِيرًا سَمِيعًا نَذِيرًا بَشِيرًا كَبِيرًا صَغِيرًا جَمِيلًا كَثِيرًا قَلِيلًا", note: "Waqaf. Saat kalimat ini berhenti di akhir, baca panjang (Mad Iwad)." },
      { id: "5_4", columns: 3, text: "جَنَّةٌ نِعْمَةٌ رَحْمَةٌ حِكْمَةٌ قُوَّةٌ نَظْرَةٌ شَجَرَةٌ ثَمَرَةٌ زَهْرَةٌ وَرْدَةٌ حَدِيقَةٌ مَدِينَةٌ قَرْيَةٌ دَوْلَةٌ سَنَةٌ", note: "Ta Marbuthoh jika diwaqafkan (di akhir kalimat) berubah menjadi bunyi 'H'." },
      { id: "5_5", columns: 3, text: "الْحَقُّ الْحَيُّ الْقَيُّومُ الْأَوَّلُ الْآخِرُ الْعَلِيُّ الْعَظِيمُ الْكَبِيرُ الْبَرُّ الْبَحْرُ الْوَرْدُ الْيَوْمُ الْيَقِينُ الْخَيْرُ الْقَلَمُ", note: "Campuran Tasydid dan Qamariyah. Perhatikan penekanannya." }
    ]
  },
  {
    jilid: 6,
    title: "Tilawah Tahap 6",
    description: "Alif Lam Syamsiyah, Ikhfa, Idgham, dan pengenalan awal ayat Al-Qur'an.",
    lessons: [
      { id: "6_1", columns: 2, splitChar: "|", text: "وَالشَّمْسِ | وَالرَّحْمَنِ | وَالرَّحِيمِ | وَالدِّينِ | وَالصِّرَاطِ | وَالضُّحَى | وَاللَّيْلِ | وَالنَّهَارِ | وَالنَّجْمِ | وَالسَّمَاءِ", note: "Alif Lam Syamsiyah. Huruf Lam langsung lebur masuk ke huruf berikutnya." },
      { id: "6_2", columns: 2, splitChar: "|", text: "مِنْ شَرِّ | عَنْ صَلَاتِهِمْ | أَنْ كَذَّبُوا | مَنْ جَاءَ | كِتَابٌ كَرِيمٌ | وُجُوهٌ يَوْمَئِذٍ | مِنْ وَالٍ | عَنْ نَفْسٍ | مِنْ مَاءٍ | أَنْ يَشَاءَ", note: "Ikhfa. Nun sukun atau Tanwin dibaca SAMAR dan MENDENGUNG lama ke hidung." },
      { id: "6_3", columns: 2, splitChar: "|", text: "مِنْ رَبِّهِمْ | مِنْ لَدُنْهُ | رَؤُوفٌ رَحِيمٌ | غَفُورٌ رَحِيمٌ | وَيْلٌ لِلْمُطَفِّفِينَ | سَمِيعٌ بَصِيرٌ | أَنْبِئْهُمْ | مِنْ بَعْدِ | لَنَسْفَعًا بِالنَّاصِيَةِ | يَوْمَئِذٍ بِمَا", note: "Idgham Bilaghunnah (lebur tanpa dengung) & Iqlab (berubah suara mim)." },
      { id: "6_4", columns: 1, splitChar: "|", randomize: false, text: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ | الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ | الرَّحْمَنِ الرَّحِيمِ | مَالِكِ يَوْمِ الدِّينِ | إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", note: "Latihan membaca Surah Al-Fatihah. (Teks tidak diacak)." },
      { id: "6_5", columns: 1, splitChar: "|", randomize: false, text: "قُلْ هُوَ اللَّهُ أَحَدٌ | اللَّهُ الصَّمَدُ | لَمْ يَلِدْ وَلَمْ يُولَدْ | وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ | صَدَقَ اللَّهُ الْعَظِيمُ", note: "Latihan membaca Surah Al-Ikhlas. (Teks tidak diacak)." }
    ]
  }
];