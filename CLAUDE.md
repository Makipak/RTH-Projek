@AGENTS.md
# CLAUDE.md

Project: RTH Monitor — Analisis monitoring berbasis mobile untuk mengukur
tingkat hospitalisasi pasien pada sebaran Ruang Terbuka Hijau (RTH).

## Stack
- Expo SDK 56 + TypeScript
- expo-router (file-based routing)
- Firebase: Auth (email/password) + Firestore
- Charts: react-native-gifted-charts + react-native-svg
- Export: expo-print, expo-sharing, expo-file-system (CSV — lihat
  §Pola Export). **Import dari `expo-file-system/legacy`**, BUKAN
  `expo-file-system` langsung — SDK 56 punya API baru (class
  `File`/`Directory`) yang beda, `writeAsStringAsync`/`cacheDirectory`
  ada di entry point `/legacy`
- UI: expo-linear-gradient (header gradient, login & screen lain
  yang butuh efek serupa — sudah terpasang via `expo install`)

## ATURAN WAJIB — Platform Target

⚠️ Ini React Native (Expo), BUKAN web.

- Gunakan komponen React Native saja: `View`, `Text`, `ScrollView`,
  `Pressable`, `TextInput`, `FlatList`.
- JANGAN gunakan `<div>`, `<span>`, `<button>`, atau elemen HTML lainnya.
- JANGAN gunakan Tailwind/`className`. Styling HARUS pakai
  `StyleSheet.create({...})`.
- Kalau ada handoff bundle dari Claude Design berbentuk HTML/CSS, itu
  HARUS di-convert penuh ke React Native — bukan ditempel apa adanya
  dan bukan dibungkus WebView.

## Pola Kode yang Harus Diikuti

Referensi utama: `src/app/nurse/dashboard.tsx` untuk struktur file (akan
di-retrofit, lihat §Dark Mode di bawah).

- Semua type/interface didefinisikan eksplisit (tidak pakai `any`)
- `StyleSheet.create` selalu di bagian paling bawah file
- Helper function (format tanggal, kalkulasi skor, dll) dipisah di
  bagian atas sebelum komponen utama
- Loading state pakai `ActivityIndicator`, bukan custom spinner

## Dark Mode — WAJIB

Project ini sudah punya infrastruktur theming bawaan template Expo:
`src/hooks/use-color-scheme.ts`, `use-color-scheme.web.ts`,
`src/hooks/use-theme.ts`, dan `src/constants/theme.ts`.

**Gunakan infrastruktur ini, JANGAN bikin `const COLORS` statis baru
per file.**

- Tiap screen ambil warna lewat `useTheme()`, BUKAN hardcode hex
  langsung di komponen — dan BUKAN `Colors.light.*` langsung (itu pola
  lama placeholder, sudah tidak dipakai)
- Dark mode mengikuti **system color scheme otomatis** (via
  `useColorScheme`) — tidak perlu toggle manual di UI untuk MVP ini
- Background card gelap: `#152019`–`#1A2A1E` (bukan hitam pekat).
  Primary di dark mode pakai tone lebih terang: `#2D6A4F`–`#52B788`
  supaya kontras cukup di atas background gelap

### Nama variabel resmi (SUDAH diimplementasikan — pakai persis ini)

Field `useTheme()` yang sudah ada dan WAJIB dipakai konsisten di
semua screen — jangan bikin nama baru untuk hal yang sama:

| Field | Sumber | Keterangan |
|---|---|---|
| `theme.rthPrimary` | `useTheme()` | Primary, light/dark otomatis |
| `theme.rthPrimaryMid` | `useTheme()` | Primary mid |
| `theme.rthBackground` | `useTheme()` | Background screen |
| `theme.rthCardBackground` | `useTheme()` | Background card |
| `theme.rthBorder` | `useTheme()` | Border |
| `theme.rthTextMuted` | `useTheme()` | Text muted di atas header gelap |
| `theme.rthTextSubtle` | `useTheme()` | Text muted di body (subtitle, label baris info) di atas background layar — beda dari `rthTextMuted` yang khusus header gelap |
| `theme.rthTextFaint` | `useTheme()` | Text pudar untuk angka pilihan belum-terpilih & label progress ("Pertanyaan X dari N") |
| `theme.rthTextCaption` | `useTheme()` | Text paling pudar untuk caption kecil (label ujung skala) & teks tombol disabled |
| `theme.text` | `useTheme()` | Token generic bawaan template — teks utama |
| `theme.textSecondary` | `useTheme()` | Token generic bawaan template — teks sekunder |
| `RthCategoryColors` | import dari `src/constants/theme.ts` | Object warna kategori (Sangat Rendah → Sangat Tinggi), SAMA di light & dark — jangan dimasukkan ke `useTheme()` |
| `RthCategoryTextColors` | import dari `src/constants/theme.ts` | Warna teks untuk badge kategori (kontras terbaca di atas background pastel/soft dari `RthCategoryColors`) — dipakai berpasangan dengan `RthCategoryColors` di semua badge kategori |

## Design System (jangan menyimpang dari ini)

**Light mode:**
| Token | Hex |
|---|---|
| Primary | `#1B4332` |
| Primary mid | `#2D6A4F` |
| Background screen | `#EEF5EE` |
| Background card | `#FFFFFF` |
| Border | `#CDE5CD` |
| Text muted (on dark header) | `#9DD4A0` |
| Text muted (body) | `#6B8F6B` |

**Dark mode:**
| Token | Hex |
|---|---|
| Primary | `#52B788` |
| Primary mid | `#2D6A4F` |
| Background screen | `#0F1A12` |
| Background card | `#152019`–`#1A2A1E` |
| Border | `#2A3D2E` |
| Text muted (on dark header) | `#9DD4A0` |
| Text muted (body) | `#5A9060` |

Kategori skor (sama di light & dark — sudah cukup kontras di kedua mode):
| Kategori | Hex |
|---|---|
| Sangat Rendah | `#ef4444` |
| Rendah | `#f97316` |
| Sedang | `#eab308` |
| Tinggi | `#22c55e` |
| Sangat Tinggi | `#10b981` |

Card: radius 12px, border 0.5px `#CDE5CD`, elevated shadow halus.
Button primary: filled `#1B4332`, radius 10px.
Bottom tab: 4 item (Dashboard, Responden, Laporan, Profil).

## Firebase & Environment Setup

- `src/lib/firebase.ts` — modul inisialisasi Firebase, export `auth`
  (dan WAJIB juga `db`/Firestore — semua screen yang query Firestore
  pakai `import { db } from '@/lib/firebase'`, bukan inisialisasi
  sendiri-sendiri)
- Kredensial di `.env` (prefix `EXPO_PUBLIC_FIREBASE_*`), template
  kosong di `.env.example`. `.env` dan `google-services.json`
  di-gitignore — kalau clone repo baru, copy `.env.example` →
  `.env` dan isi manual sebelum run
- Auth pakai `initializeAuth` + `getReactNativePersistence`
  (AsyncStorage) di native, `getAuth` biasa di web — sesi login
  persist antar restart app

## Pola Export (Laporan)

- **"Ekspor Excel" = CSV** (keputusan final, BUKAN file .xlsx asli) —
  tetap bisa dibuka normal di Excel/Sheets, tanpa nambah library baru
- CSV: tulis string CSV manual (header + 1 baris per response: tanggal,
  waktu, totalScore, average, category, lalu Q1-Q15 dari `answers`),
  simpan via `expo-file-system` (`writeAsStringAsync`), share via
  `expo-sharing` (`shareAsync`)
- PDF: generate HTML string sederhana (judul, periode, tabel ringkasan
  4 angka) lewat `expo-print` (`printToFileAsync`), share via
  `expo-sharing` — tidak perlu sertakan chart visual, cukup angka
- Kedua export HARUS mengikuti filter periode yang aktif (date range
  yang dipilih user), bukan seluruh data

## Pola Fetch Data Firestore (referensi: `dashboard.tsx`)

Screen lain yang query Firestore (`responses.tsx`, `reports.tsx`)
WAJIB ikuti pola yang sudah established di `dashboard.tsx`, jangan
bikin pola baru:

- `getDocs(collection(db, "responses"))` di `useEffect` saat mount,
  dibungkus function reusable (mis. `fetchResponses()`) supaya bisa
  dipanggil ulang
- Loading state: `ActivityIndicator` full-screen, HANYA saat fetch
  pertama kali (bukan saat refresh)
- Pull-to-refresh: `RefreshControl` di `ScrollView`/`FlatList`,
  panggil ulang function fetch yang sama
- Error handling NON-BLOCKING: kalau fetch gagal, tampilkan teks
  error kecil, data lama (kalau ada) tetap ditampilkan — JANGAN
  sampai crash atau blank screen
- Hitung tanggal pakai local date (`.toDate()` lalu bandingkan
  field lokal: tahun/bulan/tanggal), BUKAN UTC langsung — supaya
  tidak salah hari di sekitar tengah malam

## Struktur Data Firestore

```
/responses/{docId}
  ├── answers: number[15]
  ├── totalScore: number
  ├── average: number
  ├── category: string
  └── createdAt: Timestamp

/nurses/{uid}
  ├── name: string
  └── email: string
```

## Data Pertanyaan Kuesioner (15 butir, final — bukan placeholder)

Simpan di `src/constants/questions.ts`, import dari situ di
`form.tsx` (jangan hardcode array pertanyaan langsung di dalam
komponen form).

```typescript
export interface Question {
  id: number;
  text: string;
  dimension: string;
}

export const QUESTIONS: Question[] = [
  { id: 1,  text: "Suhu udara di ruang terbuka hijau ini terasa sejuk dan nyaman bagi saya", dimension: "Kenyamanan Fisik" },
  { id: 2,  text: "Saya merasa udara di area ini bersih dan segar", dimension: "Kenyamanan Fisik" },
  { id: 3,  text: "Tingkat kebisingan di area ini cukup tenang untuk beristirahat", dimension: "Kenyamanan Fisik" },
  { id: 4,  text: "Tempat duduk dan fasilitas yang tersedia nyaman untuk saya gunakan", dimension: "Kenyamanan Fisik" },
  { id: 5,  text: "Pemandangan tanaman hijau di sekitar membuat suasana hati saya lebih baik", dimension: "Estetika & Sensori" },
  { id: 6,  text: "Suasana alami di area ini (suara angin, dedaunan, dll) membuat saya merasa nyaman", dimension: "Estetika & Sensori" },
  { id: 7,  text: "Saya merasa lebih rileks setelah berada di ruang terbuka hijau ini", dimension: "Psikologis" },
  { id: 8,  text: "Berada di area ini membantu mengurangi rasa cemas atau khawatir saya", dimension: "Psikologis" },
  { id: 9,  text: "Pikiran saya terasa lebih tenang saat berada di tempat ini", dimension: "Psikologis" },
  { id: 10, text: "Saya merasa lebih semangat setelah menghabiskan waktu di area ini", dimension: "Psikologis" },
  { id: 11, text: "Saya merasa nyaman dan aman berada di area ini", dimension: "Keamanan & Akses" },
  { id: 12, text: "Akses menuju ruang terbuka hijau ini mudah saya jangkau", dimension: "Keamanan & Akses" },
  { id: 13, text: "Saya bisa beristirahat dengan tenang tanpa merasa terganggu di area ini", dimension: "Restoratif" },
  { id: 14, text: "Saya merasa area ini mendukung proses pemulihan saya selama dirawat", dimension: "Restoratif" },
  { id: 15, text: "Saya ingin kembali menghabiskan waktu di ruang terbuka hijau ini", dimension: "Restoratif" },
];
```

`dimension` cuma metadata (untuk analisis skripsi nanti), tidak
dipakai di logika skor atau ditampilkan ke pasien saat ini.

Gunakan `QUESTIONS.length` di kode (bukan angka `15` hardcoded) untuk
progress bar dan logika "pertanyaan terakhir", supaya tetap benar
kalau jumlah pertanyaan berubah di kemudian hari.

## Logika Skoring
```
total = Σ(jawaban 1..15)
average = total / 15
kategori:
  < 1.8  → "Sangat Rendah"
  < 2.6  → "Rendah"
  < 3.4  → "Sedang"
  < 4.2  → "Tinggi"
  else   → "Sangat Tinggi"
```

## Struktur Navigator Perawat (PENTING — route group)

Bottom tab navigator perawat WAJIB pakai folder grup Expo Router:

```
src/app/nurse/
  ├── login.tsx              ← di LUAR (tabs), pre-auth screen
  └── (tabs)/
      ├── _layout.tsx        ← berisi <Tabs> navigator, 4 screen
      ├── dashboard.tsx
      ├── responses.tsx
      ├── reports.tsx
      └── profile.tsx
```

Semua handoff screen perawat (Responden, Laporan, Profil) HARUS masuk
ke `src/app/nurse/(tabs)/`, bukan langsung di `src/app/nurse/`.

## Screen yang Perlu Diimplementasikan (dari handoff Claude Design)

- [x] `src/app/index.tsx` — Landing, dark mode, useTheme() ✅
- [x] `src/app/questionnaire/intro.tsx` — sudah ada, dark mode ✅
- [x] `src/app/questionnaire/form.tsx` — UI, navigasi, dark mode, dan
      simpan jawaban ke Firestore ✅
- [x] `src/app/questionnaire/result.tsx` — sudah overwrite, dark mode ✅
- [x] `src/app/nurse/login.tsx` — sudah ada, dark mode ✅ (perlu setup
      Firebase Console: enable Email/Password + buat user manual)
- [x] `src/app/nurse/(tabs)/dashboard.tsx` — UI, dark mode, dan query
      Firestore asli (real-data) ✅
- [x] `src/app/nurse/(tabs)/responses.tsx` — UI, dark mode, dan query
      Firestore asli (real-data) ✅
- [x] `src/app/nurse/(tabs)/reports.tsx` — UI, dark mode, query Firestore
      asli, filter periode client-side (custom date picker, tanpa
      library baru), ekspor PDF/CSV ✅
- [x] `src/app/nurse/(tabs)/profile.tsx` — UI dan dark mode ✅ (identitas
      dari Firebase Auth langsung, tidak pakai Firestore)

## Jangan Lakukan
- Jangan tambah library baru tanpa konfirmasi (deadline ketat)
- Jangan ubah struktur folder yang sudah ada
- Retrofit dark mode ke `dashboard.tsx` & `intro.tsx` DIIZINKAN secara
  eksplisit (lihat §Dark Mode) — selain itu jangan refactor file yang
  sudah ada tanpa diminta