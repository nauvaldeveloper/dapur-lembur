/**
 * DATA — Dapur Lembur (rumah makan Sunda fiktif, untuk portfolio Nauval Dev).
 * Menu, harga, meja, dan jadwal hanya contoh.
 */
window.RESTO = {
  name: 'Dapur Lembur',
  address: 'Jl. Cigadung Raya Timur No. 21, Bandung (alamat contoh)',
  hours: 'Setiap hari 10.00–21.00 · dapur tutup 20.30',
  DEMO: true,
  WA_NUMBER: '',
  DEV_CONTACT_URL: 'https://ig.me/m/nauval_dev',

  TAX_PCT: 10,            // PB1 restoran
  DELIVERY_FEE: 12000,    // kurir resto, radius 5 km
  TABLES_MAX: 30,         // nomor meja yang valid untuk ?meja=

  CATEGORIES: [
    { id: 'lauk', label: 'Nasi & Lauk' },
    { id: 'sayur', label: 'Sayur & Sambal' },
    { id: 'gorengan', label: 'Teman Makan' },
    { id: 'liwet', label: 'Paket Liwet' },
    { id: 'minum', label: 'Minuman' },
    { id: 'kopi', label: 'Kopi' },
  ],

  // spicy: 0–3 · veg: tanpa daging/ikan · best: paling laris · note: keterangan singkat
  MENU: [
    { id: 'ayam-goreng', cat: 'lauk', name: 'Ayam Goreng Lengkuas', price: 26000, spicy: 0, best: true, note: 'Paha atau dada, taburan serundeng lengkuas' },
    { id: 'ayam-bakar', cat: 'lauk', name: 'Ayam Bakar Kecap', price: 28000, spicy: 0, note: 'Dibakar arang, olesan kecap & bawang' },
    { id: 'gurame', cat: 'lauk', name: 'Gurame Goreng Garing', price: 68000, spicy: 0, note: '± 600 g, cukup untuk 3 orang' },
    { id: 'pepes-ikan', cat: 'lauk', name: 'Pepes Ikan Mas', price: 32000, spicy: 2, best: true, note: 'Bumbu kemangi & tomat, dikukus dalam daun pisang' },
    { id: 'pepes-tahu', cat: 'lauk', name: 'Pepes Tahu Jamur', price: 15000, spicy: 1, veg: true, note: 'Tahu, jamur tiram, daun kemangi' },
    { id: 'empal', cat: 'lauk', name: 'Empal Gepuk', price: 30000, spicy: 0, note: 'Daging sapi bumbu manis, digoreng kering' },
    { id: 'nasi-putih', cat: 'lauk', name: 'Nasi Putih', price: 6000, spicy: 0, veg: true, note: 'Satu bakul kecil' },
    { id: 'nasi-timbel', cat: 'lauk', name: 'Nasi Timbel', price: 9000, spicy: 0, veg: true, note: 'Nasi dibungkus daun pisang' },

    { id: 'karedok', cat: 'sayur', name: 'Karedok', price: 15000, spicy: 2, veg: true, best: true, note: 'Sayur mentah segar, bumbu kacang kencur' },
    { id: 'sayur-asem', cat: 'sayur', name: 'Sayur Asem', price: 12000, spicy: 0, veg: true, note: 'Semangkuk untuk 2 orang' },
    { id: 'tumis-kangkung', cat: 'sayur', name: 'Tumis Kangkung Terasi', price: 14000, spicy: 1, note: 'Pakai terasi udang' },
    { id: 'lalapan', cat: 'sayur', name: 'Lalapan', price: 6000, spicy: 0, veg: true, note: 'Timun, kol, leunca, kemangi, selada' },
    { id: 'sambal-dadak', cat: 'sayur', name: 'Sambal Dadak', price: 7000, spicy: 3, veg: true, best: true, note: 'Diulek saat dipesan, cabai rawit & tomat' },
    { id: 'sambal-terasi', cat: 'sayur', name: 'Sambal Terasi', price: 6000, spicy: 2, note: 'Terasi bakar' },

    { id: 'tahu-tempe', cat: 'gorengan', name: 'Tahu & Tempe Goreng', price: 8000, spicy: 0, veg: true, note: '2 tahu, 2 tempe' },
    { id: 'perkedel', cat: 'gorengan', name: 'Perkedel Kentang', price: 6000, spicy: 0, veg: true, note: 'Per buah' },
    { id: 'jengkol', cat: 'gorengan', name: 'Semur Jengkol', price: 18000, spicy: 1, veg: true, note: 'Dimasak empuk, kuah manis' },
    { id: 'kerupuk', cat: 'gorengan', name: 'Kerupuk Kulit', price: 7000, spicy: 0, note: 'Rambak sapi' },

    { id: 'liwet-4', cat: 'liwet', name: 'Liwet Kastrol untuk 4', price: 195000, spicy: 1, best: true, serves: 4,
      note: 'Nasi liwet teri, ayam goreng 4, pepes tahu 2, tahu tempe, lalapan, sambal dadak, kerupuk' },
    { id: 'liwet-8', cat: 'liwet', name: 'Liwet Kastrol untuk 8', price: 375000, spicy: 1, serves: 8,
      note: 'Isi dua kali lipat paket 4, ditambah gurame goreng 1 ekor' },

    { id: 'es-teh', cat: 'minum', name: 'Es Teh Tawar / Manis', price: 6000, spicy: 0, veg: true, note: 'Teh poci' },
    { id: 'bajigur', cat: 'minum', name: 'Bajigur Hangat', price: 12000, spicy: 0, veg: true, note: 'Santan, gula aren, jahe' },
    { id: 'es-cendol', cat: 'minum', name: 'Es Cendol Elizabeth Style', price: 14000, spicy: 0, veg: true, note: 'Cendol hijau, santan, gula aren cair' },
    { id: 'jeruk', cat: 'minum', name: 'Es Jeruk Peras', price: 12000, spicy: 0, veg: true, note: 'Jeruk lokal' },

    { id: 'kopi-tubruk', cat: 'kopi', name: 'Kopi Tubruk Malabar', price: 12000, spicy: 0, veg: true, note: 'Robusta Gunung Malabar' },
    { id: 'kopi-susu', cat: 'kopi', name: 'Es Kopi Susu Aren', price: 20000, spicy: 0, veg: true, best: true, note: 'Espresso, susu segar, gula aren' },
    { id: 'v60', cat: 'kopi', name: 'V60 Arabika Preanger', price: 25000, spicy: 0, veg: true, note: 'Manual brew, rasa gula aren & jeruk' },
  ],

  AREAS: [
    { id: 'saung', label: 'Saung lesehan', note: 'Di atas kolam, duduk lesehan', tables: 6, seats: 6 },
    { id: 'dalam', label: 'Ruang dalam', note: 'Kursi & meja, ber-AC', tables: 10, seats: 4 },
    { id: 'teras', label: 'Teras kebun', note: 'Semi terbuka, boleh merokok', tables: 6, seats: 4 },
    { id: 'aula', label: 'Ruang rombongan', note: 'Sampai 30 orang, untuk arisan & acara', tables: 1, seats: 30 },
  ],
  SESSIONS: [
    { id: 'siang', label: 'Makan siang', times: ['11.00', '11.30', '12.00', '12.30', '13.00', '13.30'] },
    { id: 'sore', label: 'Sore', times: ['15.00', '15.30', '16.00', '16.30'] },
    { id: 'malam', label: 'Makan malam', times: ['18.00', '18.30', '19.00', '19.30', '20.00'] },
  ],
  OCCASIONS: ['Makan biasa', 'Ulang tahun', 'Arisan / kumpul keluarga', 'Rapat / acara kantor'],

  FAQ: [
    ['Apakah perlu reservasi?', 'Hari kerja biasanya tidak perlu. Untuk akhir pekan, saung lesehan, dan rombongan di atas 8 orang, sebaiknya reservasi dulu.'],
    ['Apakah halal?', 'Semua menu tanpa babi dan tanpa alkohol. Daging dibeli dari pemasok bersertifikat halal.'],
    ['Pesan dari meja bagaimana caranya?', 'Scan QR di meja, pilih menu, lalu kirim. Pesananmu masuk ke kasir dengan nomor meja; bayar di kasir setelah makan.'],
    ['Ada fasilitas apa saja?', 'Parkir mobil 20 kendaraan, musala, area bermain anak kecil di dekat teras, dan Wi-Fi.'],
  ],
};
