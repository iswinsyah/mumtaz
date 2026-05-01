import React from 'react';
import { X, Eye, EyeOff, Lock, Heart, Landmark } from 'lucide-react';

export default function AuthModal({
  showAuthModal, setShowAuthModal,
  authMode, setAuthMode,
  showPassword, setShowPassword,
  setCurrentUser
}) {
  if (!showAuthModal) return null;

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-[150] flex flex-col justify-end sm:justify-center animate-in fade-in duration-300">
      <div className="bg-white w-full sm:max-w-md mx-auto max-h-[90%] sm:rounded-3xl rounded-t-[2.5rem] flex flex-col shadow-2xl relative animate-in slide-in-from-bottom duration-500">
        
        <div className="flex justify-center pt-4 pb-2 shrink-0">
           <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
        </div>
        <button onClick={() => {setShowAuthModal(false); setShowPassword(false);}} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-100 p-1.5 rounded-full"><X size={20} /></button>

        <div className="px-6 pb-2 shrink-0">
          <h3 className="text-2xl font-black text-gray-800 tracking-tight">
            {authMode === 'login' ? 'Selamat Datang' : 'Gabung At Tahfidz'}
          </h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            {authMode === 'login' 
              ? 'Lanjutkan perjalanan menghafalmu hari ini.' 
              : 'Daftar sekarang untuk buka akses evaluasi AI tanpa batas.'}
          </p>
        </div>

        <div className="overflow-y-auto px-6 pb-8 pt-4 flex-1">
          {authMode === 'login' ? (
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const inputUsername = fd.get('username');
              const inputCredential = fd.get('password');
              
              // Jalur Khusus Super Admin
              if (inputUsername === 'winsyah' && inputCredential === 'Khilafet@1924') {
                setCurrentUser({ name: "Iswinsyah", username: "winsyah", isPremium: true, isAdmin: true });
                setShowAuthModal(false);
              } else {
                const submitBtn = e.target.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                submitBtn.innerText = "⏳ Sedang Masuk...";
                submitBtn.disabled = true;

                try {
                  const res = await fetch('/api/login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: inputUsername, password: inputCredential })
                  });
                  const result = await res.json();
                  
                  if (result.status === 'success') {
                    setCurrentUser({ 
                      name: result.user.name, 
                      username: result.user.username, 
                      isPremium: result.user.isPremium,
                      avatar: result.user.avatar
                    });
                    setShowAuthModal(false);
                  } else {
                    alert("Gagal masuk: " + result.message);
                  }
                } catch (err) {
                  alert("Gagal terhubung ke server database Hostinger. Pastikan Anda mengakses via website live.");
                } finally {
                  submitBtn.innerText = originalText;
                  submitBtn.disabled = false;
                }
              }
            }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1">Username</label>
                <input name="username" type="text" required placeholder="Masukkan username" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1">Password</label>
                <div className="relative">
                  <input name="password" type={showPassword ? "text" : "password"} required placeholder="Masukkan Password" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 p-1 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-green-700 active:scale-95 transition-all mt-4">
                Masuk Sekarang
              </button>
              <p className="text-center text-xs text-gray-500 pt-4">
                Belum punya akun? <button type="button" onClick={() => {setAuthMode('signup'); setShowPassword(false);}} className="font-bold text-green-600 underline">Daftar di sini</button>
              </p>
            </form>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const submitBtn = e.target.querySelector('button[type="submit"]');
              const originalText = submitBtn.innerText;
              submitBtn.innerText = "⏳ Sedang Mendaftar...";
              submitBtn.disabled = true;
              
              const userData = {
                fullname: fd.get('fullname'),
                username: fd.get('username'),
                password: fd.get('password'),
                whatsapp: fd.get('whatsapp'),
                email: fd.get('email'),
                gender: fd.get('gender'),
                dob: fd.get('dob'),
                domicile: fd.get('domicile')
              };

              try {
                const res = await fetch('/api/register.php', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(userData)
                });
                const result = await res.json();
                
                if (result.status === 'success') {
                  setCurrentUser({ name: userData.fullname, username: userData.username, isPremium: true });
                  setShowAuthModal(false);
                  alert("Alhamdulillah, pendaftaran berhasil! Data telah tersimpan di Database.");
                } else {
                  alert("Gagal mendaftar: " + result.message);
                }
              } catch (err) {
                alert("Gagal terhubung ke server database Hostinger. Pastikan Anda mencobanya di website live, bukan di lokal.");
              } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
              }
            }} className="space-y-4">
              <div className="space-y-1"><label className="text-xs font-bold text-gray-600 ml-1">Nama Lengkap</label><input name="fullname" type="text" required placeholder="Sesuai Tanda Pengenal" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" /></div>
              <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><label className="text-xs font-bold text-gray-600 ml-1">Username</label><input name="username" type="text" required placeholder="Panggilan" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" /></div><div className="space-y-1"><label className="text-xs font-bold text-gray-600 ml-1">Password</label><div className="relative"><input name="password" type={showPassword ? "text" : "password"} required placeholder="Katasandi" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 p-1 transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div></div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-600 ml-1">Nomor WhatsApp</label><input name="whatsapp" type="tel" required placeholder="Contoh: 08123456789" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" /></div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-600 ml-1">Email</label><input name="email" type="email" required placeholder="Alamat Email Aktif" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" /></div>
              <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><label className="text-xs font-bold text-gray-600 ml-1">Jenis Kelamin</label><select name="gender" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-green-500 transition-all"><option value="">Pilih...</option><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div><div className="space-y-1"><label className="text-xs font-bold text-gray-600 ml-1">Tanggal Lahir</label><input name="dob" type="date" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-green-500 transition-all" /></div></div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-600 ml-1">Domisili</label><input name="domicile" type="text" required placeholder="Contoh: Jakarta Selatan" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" /></div>

              <button type="submit" className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-green-700 active:scale-95 transition-all mt-4">Daftar & Lanjutkan</button>
              <p className="text-center text-xs text-gray-500 pt-3 pb-4">Sudah punya akun? <button type="button" onClick={() => {setAuthMode('login'); setShowPassword(false);}} className="font-bold text-green-600 underline">Masuk di sini</button></p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}