# Project Brief & Product Requirement Document (PRD)
## qwatur (Sakura Edition) — Personal Finance & Expense Tracker

---

### 1. Executive Summary & Project Overview
* **Nama Produk**: qwatur
* **Tagline**: *"Keuangan tenang, masa depan lapang"*
* **Kategori**: Personal Finance / Expense Tracking Mobile Application
* **Platform**: iOS & Android (Mobile Native / PWA)
* **Status Desain**: High-Fidelity Prototype Complete (Sakura Bloom Edition)
* **Visi Produk**: Membantu individu mengelola pengeluaran harian, mengalokasikan pos anggaran (*budget envelope*), dan memantau aset kekayaan secara intuitif tanpa stres finansial, dikemas dengan estetika menenangkan (*Sakura Bloom*).

---

### 2. Problem Statement & Target Audience

#### Permasalahan Pengguna (Pain Points)
1. **Pencatatan yang Melelahkan (Friction)**: Pengguna sering lupa atau malas mencatat pengeluaran kecil rutin (misal: kopi, bensin, parkir) karena proses input aplikasi konvensional terlalu panjang.
2. **Ketiadaan Visibilitas Multi-Akun**: Saldo tersebar di rekening bank, dompet digital (GoPay/OVO/ShopeePay), dan uang tunai tanpa rekapitulasi kekayaan bersih (*net worth*) yang akurat.
3. **Budget Bocor Tanpa Peringatan**: Pengeluaran melampaui batas tanpa disadari sebelum akhir bulan akibat ketiadaan indikator batas waspada (*budget warning threshold*).
4. **Desain Finansial yang Kaku dan Menegangkan**: Antarmuka aplikasi finansial umumnya kaku atau terkesan menakutkan, alih-alih memberikan rasa tenang dan kontrol.

#### Target Persona
* **Nama**: Sarah Pramudita (24–35 tahun, First Jobber / Professional / Freelancer)
* **Karakteristik**:
  * Menggunakan multi-rekening & e-wallet untuk transaksi harian.
  * Ingin disiplin menabung untuk *emergency fund* dan *bucket list* (liburan, upgrade gadget).
  * Menghargai kecepatan (1-tap interaction) dan estetika aplikasi yang bersih dan menenangkan.

---

### 3. Visual & Design System Guidelines
* **Design System**: *Sakura Bloom Financial*
* **Tipografi**: Plus Jakarta Sans (Modern, humanis, sangat terbaca di layar mobile)
* **Palet Warna**:
  * **Primary Rose / Plum** (`#be185d`, `#9d174d`): Kartu saldo utama, tombol CTA primer, sorotan prioritas.
  * **Sakura Petal Pastel** (`#f472b6`, `#fbcfe8`, `#fce7f3`): Indikator progress, bar chart tren mingguan, badge status.
  * **Warm Floral Surface** (`#fff7f9`, `#ffffff`, `#fdf2f4`): Latar belakang yang lembut dan ramah di mata.
  * **Accent Feedback**: Emerald Green (surplus/pemasukan/aman), Crimson Red (pengeluaran/overbudget).
* **Komponen & Radius**: Rounded corners modern (`16px`–`24px`), floating action button (FAB) terpusat, soft ambient shadows.

---

### 4. Core Features & Screen Specifications

#### A. Layar Beranda (Home / Dashboard)
* **Header**: Logo brand qwatur (wallet sakura), notifikasi transaksi, dan profil pengguna.
* **Arus Kas Bersih (Net Cashflow Card)**:
  * Total saldo surplus bulan berjalan dengan indikator persentase pertumbuhan (+14.2%).
  * Breakdown cepat Pemasukan vs Pengeluaran.
* **Tren Pengeluaran 7 Hari**: Grafik batang interaktif dari Senin hingga Minggu, otomatis menyorot hari pengeluaran tertinggi (*peak day*).
* **Pintasan Catat Cepat (1-Tap Quick-Log)**: Tombol instan untuk transaksi berulang (+Kopi 20rb, +Bensin 50rb, +Makan Siang 35rb, dan Kustom).
* **Breakdown Alokasi Kategori**: Donat ringkasan pos pengeluaran terbesar (Makanan, Transport, Tagihan, Belanja).
* **Riwayat Hari Ini**: Feed transaksi terurut kronologis dengan metode pembayaran (QRIS, Kartu, Tunai).

#### B. Layar Catat Transaksi Cepat (Add Transaction)
* **Large Amount Display**: Display input angka nominal besar dengan shortcut penambahan instan (`+10rb`, `+25rb`, `+50rb`, `+100rb`).
* **Segmented Transaction Type**: Toggle antara *Pengeluaran*, *Pemasukan*, dan *Transfer*.
* **Sumber Kantong**: Pemilihan sumber rekening/e-wallet pengurang dana (BCA, GoPay, Tunai).
* **Grid Kategori Visual**: 8 kategori umum lengkap dengan sisa limit anggaran masing-masing.
* **Metadata Tambahan**: Timestamp otomatis, input catatan, lampiran foto struk/nota belanja.
* **Fitur Cerdas**: Toggle *"Simpan sebagai Catat Cepat"* untuk mendaftarkan transaksi ini ke widget 1-tap Beranda.

#### C. Layar Analisis & Laporan (Analytics & Insights)
* **Filter Waktu**: Tab fleksibel (*Pekan Ini*, *Bulan Ini*, *Tahun Ini*) dan pemilih kalender kustom.
* **Bagan Tren Harian & Peak Alert**: Visualisasi bar chart pengeluaran per hari dengan deteksi anomali/puncak belanja.
* **Alokasi & Manajemen Batas Anggaran**:
  * Donut chart distribusi persentase pengeluaran.
  * Status bar indikator batas anggaran: *Mendekati Limit (85%)* vs *Dalam Batas Aman*.
* **Saran Cerdas qwatur (AI Financial Advisor)**: Deteksi otomatis pola pemborosan (misal pengeluaran kopi mingguan) dan tombol aksi mitigasi (*Pasang Target Hemat*).
* **Laporan Keuangan**: Aksi 1-klik unduh rekapitulasi audit berformat PDF/CSV.

#### D. Layar Kantong & Tabungan (Wallets & Goals)
* **Total Kekayaan Bersih**: Akumulasi total saldo likuid + tabungan dengan indikator kesehatan finansial.
* **Rekening & E-Wallet Aktif**:
  * Integrasi saldo real-time (Bank BCA, Bank Mandiri, GoPay/QRIS, Uang Tunai).
  * Quick-action: Transfer gratis antar kantong, Top Up, dan penyesuaian saldo fisik.
* **Pos Tabungan & Impian (*Goal Saving Pockets*)**:
  * Tracking target terukur (misal Dana Darurat, Liburan Jepang, Upgrade Laptop).
  * Indikator progress bar persentase target, sisa nominal yang harus dikumpulkan, serta estimasi waktu tercapai.
* **Tips Alokasi Otomatis**: Rekomendasi nominal cicilan tabungan bulanan berbasis sisa pemasukan.

#### E. Layar Profil & Pengaturan (Settings & Security)
* **Identitas Pengguna**: Foto profil, status sinkronisasi cloud Google Drive, dan badge membership.
* **Disiplin & Siklus Finansial**:
  * Pilihan mata uang (IDR, USD, dll.).
  * Konfigurasi tanggal siklus reset anggaran (misal setiap tanggal gajian / tgl 25).
  * Pengaturan alarm batas waspada limit (default: 80%).
  * Pengingat harian pencatatan transaksi (default: 20:00 WIB).
* **Keamanan Finansial**: Kunci biometrik (Face ID / Fingerprint / PIN) dan sensor penyamar saldo otomatis saat di ruang publik.
* **Data, Ekspor & Kustomisasi**: Pengaturan kategori kustom dan panduan edukasi budgeting metode 50-30-20.

---

### 5. Technical & Non-Functional Requirements
1. **Kecepatan & Responsivitas**:
   * Latensi pembukaan layar Catat Cepat harus < 300ms untuk meminimalkan friksi pengguna.
   * Pencatatan 1-tap harus bisa bekerja secara *Offline-First* dan tersinkronisasi otomatis saat ada koneksi.
2. **Keamanan & Privasi**:
   * Enkripsi lokal AES-256 untuk data keuangan tersimpan di perangkat.
   * Tidak ada credential perbankan sensitif yang disimpan tanpa otentikasi biometrik.
3. **Aksesibilitas (a11y)**:
   * Kontras warna teks memenuhi standar WCAG AA (rasio kontras minimum 4.5:1 untuk teks normal).
   * Area sentuh (*touch target*) tombol dan icon minimum 44x44 pt.

---

### 6. Roadmap & Future Enhancements
* **Phase 1 (MVP - Current Scope)**: 5 Layar Utama (Beranda, Catat Transaksi, Analisis, Kantong, Profil) dengan tema Sakura Bloom.
* **Phase 2**: Otomasi pembacaan mutasi SMS/e-statement & OCR struk belanja dengan AI vision.
* **Phase 3**: Fitur Kantong Bersama (*Shared Pocket*) untuk pasangan atau keluarga kecil.
* **Phase 4**: Ekosistem investasi mikro (reksadana/emas) yang terhubung langsung dengan sisa uang kembalian.
