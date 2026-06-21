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
