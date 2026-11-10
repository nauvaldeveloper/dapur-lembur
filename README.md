# Dapur Lembur — Website Rumah Makan (Portfolio Nauval Dev)

Contoh website **Restaurant**: rumah makan Sunda fiktif di Bandung.
HTML/CSS/JS biasa, tanpa build tool. Buka `index.html` langsung di browser.

## Fitur
- Menu bergaya kertas menu cetak (nama · titik-titik · harga), dua kolom di desktop
- Cari menu, saring "paling laris", "tanpa daging", "tidak pedas"; tanda level pedas per menu
- **Pesan dari meja lewat QR**: buka `index.html?meja=12` → pesanan terkirim ke kasir dengan nomor meja
- Bawa pulang atau pesan antar (ongkir kurir resto), PB1 10% dihitung otomatis
- Reservasi: tanggal, jam per sesi, jumlah orang, area (saung, ruang dalam, teras, ruang rombongan)
  dengan sisa meja per jam, acara, dan opsi menyiapkan paket liwet
- Status "buka sekarang / dapur sudah tutup" mengikuti jam saat ini

## QR meja
Buat QR untuk tiap meja yang berisi `https://<domain>/?meja=<nomor>` (nomor 1–`TABLES_MAX`).

## Menyesuaikan
Menu, harga, area, sesi, dan FAQ ada di `assets/js/data.js`. Isi `WA_NUMBER` lalu set `DEMO: false`.

## Kredit foto
“Sambal Onion Spicy Chilli in Indonesia Restaurant” oleh Bajinra dan
“Nasi putih dengan sambal kerang…” oleh Wiki Farazi (CC0, Wikimedia Commons).
