# Cara Mengatasi Error ORIGIN_UNAUTHORIZED di Thirdweb

## Masalah
Error `ORIGIN_UNAUTHORIZED` muncul meskipun domain sudah ditambahkan di "Allowed redirect URIs".

## Solusi

### 1. Tambahkan Domain di "Allowed Domains" (BUKAN hanya "Allowed redirect URIs")

**Penting:** "Allowed redirect URIs" dan "Allowed Domains" adalah 2 setting yang berbeda!

#### Langkah-langkah:

1. **Buka Thirdweb Dashboard**
   - Login ke https://thirdweb.com/dashboard
   - Pilih project Anda

2. **Navigasi ke Settings > API Keys**
   - Klik pada API Key yang Anda gunakan
   - Atau buka: Settings > General > API Keys

3. **Tambahkan di "Allowed Domains"**
   - Cari section **"Allowed Domains"** (bukan "Allowed redirect URIs")
   - Tambahkan domain berikut (satu per satu atau dipisah koma):
     ```
     localhost:3000
     http://localhost:3000
     https://localhost:3000
     127.0.0.1:3000
     http://127.0.0.1:3000
     impact-chain-tan.vercel.app
     https://impact-chain-tan.vercel.app
     http://impact-chain-tan.vercel.app
     ```
   
   **Format yang benar:**
   - Bisa dengan atau tanpa `http://` / `https://`
   - Bisa dengan atau tanpa port (jika localhost)
   - Lebih baik tambahkan semua variasi untuk memastikan

4. **Tambahkan juga di "Allowed redirect URIs"** (untuk Google OAuth)
   - Di section **"Allowed redirect URIs"**
   - Tambahkan:
     ```
     http://localhost:3000
     https://impact-chain-tan.vercel.app
     ```

5. **Save Changes**
   - Klik "Save" atau "Update"
   - Tunggu beberapa detik untuk propagasi

### 2. Verifikasi Domain (Opsional tapi Recommended)

Jika ada opsi "Domain Verification":
1. Buka Settings > General > Domain Verification
2. Tambahkan domain `impact-chain-tan.vercel.app`
3. Ikuti instruksi untuk menambahkan DNS TXT record
4. Tunggu verifikasi selesai

### 3. Cek Environment Variables

Pastikan di `.env.local` (untuk local) dan di Vercel (untuk production):

```env
NEXT_PUBLIC_CLIENT_ID=your_client_id_here
```

**Jangan** tambahkan `clientSecret` di frontend!

### 4. Restart Aplikasi

Setelah mengubah settings:
- **Local:** Restart dev server (`npm run dev`)
- **Production:** Redeploy di Vercel atau tunggu beberapa menit

### 5. Test

1. Buka browser console (F12)
2. Cek log: `Current origin:` dan `Current hostname:`
3. Pastikan origin yang muncul sudah ada di "Allowed Domains"
4. Coba login dengan Google lagi

## Troubleshooting

### Masih Error?

1. **Cek Console Log**
   - Lihat origin yang sebenarnya digunakan
   - Pastikan formatnya sama persis dengan yang di "Allowed Domains"

2. **Cek API Key**
   - Pastikan menggunakan Client ID yang benar
   - Jangan gunakan Secret Key di frontend

3. **Clear Cache**
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

4. **Cek Network Tab**
   - Buka DevTools > Network
   - Lihat request yang error
   - Cek header `Origin` yang dikirim

5. **Contact Support**
   - Jika masih error, hubungi support@thirdweb.com
   - Sertakan screenshot error dan domain yang sudah ditambahkan

## Catatan Penting

- **Allowed Domains** = untuk validasi origin API requests
- **Allowed redirect URIs** = untuk OAuth redirect (Google login, dll)
- Keduanya perlu diisi untuk aplikasi yang menggunakan OAuth
- Perubahan bisa memakan waktu beberapa menit untuk propagasi

