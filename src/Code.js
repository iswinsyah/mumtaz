function doPost(e) {
  try {
    const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
       throw new Error("API Key Gemini tidak ditemukan di Properties!");
    }

    const requestData = JSON.parse(e.postData.contents);
    const targetText = requestData.targetText;
    const audioData = requestData.audio; // File Voice Note (Base64)
    
    const ustadzName = requestData.ustadz || "Hamzah"; 
    const panggilan = ustadzName === "Hamzah" ? "antum" : "anti";
    const namaPenguji = ustadzName === "Hamzah" ? "Ustadz Hamzah (Laki-laki)" : "Ustadzah Humairah (Perempuan)";

    const prompt = `Anda adalah ${namaPenguji}, seorang penguji hafalan Al-Qur'an (Tahfidz) yang sangat teliti, tegas, namun penyayang.
    Tugas Anda mendengarkan rekaman suara murid secara langsung dan membandingkannya dengan teks bacaan asli Al-Qur'an.

    ATURAN SANGAT PENTING (WAJIB DITAATI 100%):
    1. DILARANG KERAS MENULIS HURUF ARAB/HIJAIYAH: Seluruh teks evaluasi, ayat, dan koreksi WAJIB ditulis menggunakan huruf Latin (Transliterasi). Mesin suara (TTS) akan error jika membaca huruf Arab.
    2. KATA GANTI MURID: Kata "${panggilan}" adalah kata ganti orang (artinya "Anda" atau "kamu"), BUKAN nama orang. Gunakan kata "${panggilan}" secara natural dalam tata bahasa. Contoh benar: "Coba ${panggilan} perhatikan lagi tajwidnya." Contoh SALAH: "Terima kasih ya antum."
    3. KATA GANTI ANDA: Gunakan kata "saya" untuk menyebut diri Anda sendiri. DILARANG KERAS menyebut diri Anda "Ustadz" atau "Ustadzah" dalam kalimat.
    4. EVALUASI JUJUR DAN DETAIL: Jika bacaannya buruk/salah/banyak lupa, katakan salah secara spesifik di bagian/kata mana letak kesalahannya dalam huruf latin, dan beritahu yang benarnya seperti apa. Jika sempurna, puji dengan tulus. Evaluasi harus mewakili sosok guru yang sesungguhnya!
    5. AYAT BERULANG BUKAN KESALAHAN: Hati-hati dengan kalimat yang memang diulang dalam Al-Qur'an (seperti di Ar-Rahman). 

    Teks Asli (Target): "${targetText}"

    Lakukan evaluasi dengan langkah berikut:
    1. Dengarkan rekaman audio murid dari awal sampai akhir. Tuliskan transkrip apa yang Anda dengar.
    2. Bandingkan transkrip tersebut dengan Teks Asli dengan sangat cermat.
    3. Identifikasi setiap letak kesalahan makhraj, tajwid, atau hafalan yang terlewat. 
    4. Susun ulasan (feedback) mendalam dalam paragraf yang rapi dan bahasa Indonesia yang baik.
    5. Berikan skor objektif dari 0 sampai 100.

    Berikan hasil evaluasi dalam format JSON murni tanpa markdown (tanpa awalan \`\`\`json) dengan struktur berikut:
    {
      "ai_heard": "[Tuliskan kata demi kata apa yang Anda dengar dari audio. Jika hening/noise, tulis 'Saya tidak mendengar suara bacaan']",
      "score": [angka 0 sampai 100],
      "note": "[Ulasan lengkap dan jujur Anda sebagai guru pembimbing. Gunakan kata '${panggilan}' sebagai kata ganti murid. Puji poin positifnya, namun jelaskan letak rinci kesalahannya jika ada, dan beri koreksi pembenarannya.]"
    }`;

    // Menggunakan Model Gemini 2.5 Flash (Generasi Terbaru untuk API Premium)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // PENTING: File Audio harus diletakkan SEBELUM teks instruksi agar AI mendengarkannya terlebih dahulu
    let parts = [];

    // Sisipkan file audio langsung ke AI Google
    if (audioData && audioData.base64) {
       parts.push({
         "inlineData": {
           "mimeType": audioData.mimeType || "audio/webm",
           "data": audioData.base64
         }
       });
    }
    
    parts.push({ "text": prompt });

    const payload = {
      "contents": [{ "parts": parts }],
      "generationConfig": {
        "temperature": 0.2,
        "responseMimeType": "application/json",
        "responseSchema": {
          "type": "OBJECT",
          "properties": {
            "ai_heard": { "type": "STRING", "description": "Tuliskan persis apa yang Anda dengar dari audio. Jika hening/kosong tulis 'Kosong'." },
            "score": { "type": "INTEGER" },
            "note": { "type": "STRING" }
          },
          "required": ["ai_heard", "score", "note"]
        }
      }
    };

    const options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };

    const response = UrlFetchApp.fetch(geminiUrl, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (responseCode !== 200) {
       throw new Error("Ditolak oleh Gemini: " + responseText);
    }

    const responseJson = JSON.parse(responseText);
    
    // Validasi apakah AI memblokir karena alasan keamanan (Safety Ratings)
    if (!responseJson.candidates || responseJson.candidates.length === 0) {
       throw new Error("Respon diblokir oleh AI (Safety). Cek log: " + responseText);
    }
    
    // Pastikan konten teks berhasil diekstrak
    let geminiText = "";
    try {
      geminiText = responseJson.candidates[0].content.parts[0].text;
    } catch (e) {
       throw new Error("Format balasan AI tidak sesuai: " + responseText);
    }

    // --- MENGUBAH TEKS MENJADI SUARA MANUSIA (GOOGLE CLOUD TTS WAVENET) ---
    let finalResponseObj;
    try {
      finalResponseObj = JSON.parse(geminiText); // Parse JSON dari Gemini
      
      const ttsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GEMINI_API_KEY}`;
      // Wavenet-B = Pria Dewasa (Hamzah), Wavenet-A = Wanita (Humairah)
      const voiceName = ustadzName === "Hamzah" ? "id-ID-Wavenet-B" : "id-ID-Wavenet-A"; 
      
      const ttsPayload = {
        "input": { "text": finalResponseObj.note },
        "voice": { "languageCode": "id-ID", "name": voiceName },
        "audioConfig": { "audioEncoding": "MP3", "speakingRate": 0.95 } // Intonasi diperlambat agar berwibawa
      };
      
      const ttsOptions = { "method": "post", "contentType": "application/json", "payload": JSON.stringify(ttsPayload), "muteHttpExceptions": true };
      const ttsRes = UrlFetchApp.fetch(ttsUrl, ttsOptions);
      
      if (ttsRes.getResponseCode() === 200) {
         finalResponseObj.audio_base64 = JSON.parse(ttsRes.getContentText()).audioContent;
      }
    } catch(e) {
      // Jika Cloud TTS belum diaktifkan/gagal, abaikan. Aplikasi akan pakai suara robot otomatis.
      if (!finalResponseObj) return ContentService.createTextOutput(geminiText).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify(finalResponseObj))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    const errorRes = {
      "ai_heard": "[Sistem Gagal Memproses]",
      "score": 0,
      "note": "Maaf, saya sedang mengalami kendala teknis. Detail: " + error.message
    };
    return ContentService.createTextOutput(JSON.stringify(errorRes))
      .setMimeType(ContentService.MimeType.JSON);
  }
}