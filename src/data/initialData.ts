import { EventDetails, Speaker, AgendaItem } from '../types';

// Helper to set a default time 45 minutes from now so the live countdown is instantly active
const getDefaultTargetDate = (): string => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 45);
  return d.toISOString();
};

export const INITIAL_SPEAKERS: Speaker[] = [
  {
    id: "spk-1",
    name: "Dr. Anindya Prameswari, M.Ed., Ph.D.",
    title: "Guru Besar Teknologi Pendidikan & Peneliti Kurikulum Adaptif",
    role: "Pembicara Utama (Keynote)",
    institution: "Institut Riset & Inovasi Pendidikan Nusantara",
    photoUrl: "/src/assets/images/speaker_keynote_portrait_1794272857445.jpg",
    topic: "Pedagogi AI: Personalisasi Pembelajaran & Literasi Digital Tanpa Batas"
  },
  {
    id: "spk-2",
    name: "Prof. Ir. Hendra Wicaksono, M.Kom., Ph.D.",
    title: "Kepala Laboratorium Kecerdasan Komputasi & Sains Data",
    role: "Narasumber Ahli",
    institution: "Pusat Riset Kecerdasan Buatan Nasional",
    photoUrl: "",
    topic: "Etika, Privasi Data, dan Implementasi Tools AI untuk Asesmen Otentik"
  },
  {
    id: "spk-3",
    name: "Ratna Kusuma Dewi, S.Pd., M.Sc.",
    title: "Inovator Pembelajaran Digital & Penggerak Komunitas Guru",
    role: "Moderator Acara",
    institution: "Ikatan Pendidik Transformatif Indonesia",
    photoUrl: "",
    topic: "Pemandu Diskusi Interaktif, Live Q&A, dan Kurasi Praktik Baik di Kelas"
  }
];

export const INITIAL_EVENT_DETAILS: EventDetails = {
  logoUrl: "",
  institutionName: "Kementerian Republik Indonesia",
  institutionSubtitle: "Direktorat Jenderal Guru dan Tenaga Kependidikan",
  title: "Transformasi Digital & Integrasi AI dalam Pendidikan Masa Depan",
  subTitle: "Strategi Inovatif Membangun Ruang Kelas Cerdas, Adaptif, dan Inklusif Menuju Generasi Emas Indonesia",
  welcomeMessage: "Selamat Datang Para Guru, Dosen, Mahasiswa, dan Pemerhati Pendidikan Se-Nusantara",
  targetDateTime: getDefaultTargetDate(),
  eventDateText: "Sabtu, 14 November 2026",
  eventTimeText: "09.00 - 12.00 WIB",
  meetingPlatform: "Zoom Meeting",
  meetingUrl: "https://zoom.us",
  meetingId: "889 2109 4832",
  passcode: "EDUKASI2026",
  certificateInfo: "E-Sertifikat 32 JP Resmi Bernomor Nasional",
  slidoCode: "#EDUKASI-AI-2026"
};

export const INITIAL_AGENDA: AgendaItem[] = [
  {
    id: "ag-1",
    time: "08.30 - 09.00 WIB",
    title: "Registrasi Digital & Sound Check",
    speaker: "Panitia Pelaksana",
    description: "Uji koneksi audio, video, dan presensi awal kehadiran seluruh peserta dari berbagai penjuru tanah air."
  },
  {
    id: "ag-2",
    time: "09.00 - 09.15 WIB",
    title: "Pembukaan Resmi & Lagu Indonesia Raya",
    speaker: "Master of Ceremony & Tim Protokoler",
    description: "Pembacaan tata tertib acara, doa bersama untuk kemajuan pendidikan, dan lagu kebangsaan 3 stanza."
  },
  {
    id: "ag-3",
    time: "09.15 - 09.30 WIB",
    title: "Sambutan Pengantar & Arah Kebijakan",
    speaker: "Pimpinan Ditjen GTK Kemendikbudristek",
    description: "Paparan Roadmap Transformasi Digital Sekolah dan Kesiapan Guru Indonesia Menghadapi Abad 21."
  },
  {
    id: "ag-4",
    time: "09.30 - 10.45 WIB",
    title: "Pemaparan Materi Utama: Pedagogi Cerdas Berbasis AI",
    speaker: "Dr. Anindya Prameswari & Prof. Hendra Wicaksono",
    description: "Demonstrasi live prompt engineering untuk pendidik, pembuatan modul ajar adaptif, dan asesmen berbasis data."
  },
  {
    id: "ag-5",
    time: "10.45 - 11.30 WIB",
    title: "Sesi Diskusi Panel & Tanya Jawab Interaktif",
    speaker: "Dipandu oleh Ratna Kusuma Dewi, S.Pd., M.Sc.",
    description: "Bedah kasus dari pertanyaan peserta yang masuk melalui portal Slido dan pemilihan pertanyaan terbaik."
  },
  {
    id: "ag-6",
    time: "11.30 - 12.00 WIB",
    title: "Doorprize, Informasi E-Sertifikat 32 JP & Penutupan",
    speaker: "Panitia Pelaksana",
    description: "Pengumuman 10 pemenang beasiswa pelatihan lanjutan, petunjuk klaim sertifikat resmi, dan sesi foto virtual."
  }
];
