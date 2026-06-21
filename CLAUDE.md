@AGENTS.md
# CLAUDE.md

Project: RTH Monitor — Analisis monitoring berbasis mobile untuk mengukur
tingkat hospitalisasi pasien pada sebaran Ruang Terbuka Hijau (RTH).

## Stack
- Expo SDK 56 + TypeScript
- expo-router (file-based routing)
- Firebase: Auth (email/password) + Firestore
- Charts: react-native-gifted-charts + react-native-svg
- Export: expo-print, expo-sharing

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

Referensi utama: `src/app/nurse/dashboard.tsx` (sudah dibuat manual,
ikuti pola ini persis untuk semua screen baru).

- Const `COLORS` di bagian atas file (jangan hardcode hex berulang di
  tengah JSX)
- Semua type/interface didefinisikan eksplisit (tidak pakai `any`)
- `StyleSheet.create` selalu di bagian paling bawah file
- Helper function (format tanggal, kalkulasi skor, dll) dipisah di
  bagian atas sebelum komponen utama
- Loading state pakai `ActivityIndicator`, bukan custom spinner

## Design System (jangan menyimpang dari ini)

| Token | Hex |
|---|---|
| Primary | `#1B4332` |
| Primary mid | `#2D6A4F` |
| Background screen | `#EEF5EE` |
| Background card | `#FFFFFF` |
| Border | `#CDE5CD` |
| Text muted (on dark) | `#9DD4A0` |

Kategori skor:
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

## Screen yang Perlu Diimplementasikan (dari handoff Claude Design)

- [ ] `src/app/index.tsx` — Landing (2 tombol)
- [ ] `src/app/questionnaire/intro.tsx` — Kuesioner intro
- [ ] `src/app/questionnaire/form.tsx` — Form swipe/next 15 pertanyaan
- [ ] `src/app/questionnaire/result.tsx` — Hasil skor
- [ ] `src/app/nurse/login.tsx` — Login perawat
- [x] `src/app/nurse/dashboard.tsx` — sudah ada, jadi referensi pola
- [ ] `src/app/nurse/responses.tsx` — List responden
- [ ] `src/app/nurse/report.tsx` — Laporan & ekspor
- [ ] `src/app/nurse/profile.tsx` — Profil perawat

## Jangan Lakukan
- Jangan tambah library baru tanpa konfirmasi (deadline ketat)
- Jangan ubah struktur folder yang sudah ada
- Jangan refactor `dashboard.tsx` kecuali diminta eksplisit