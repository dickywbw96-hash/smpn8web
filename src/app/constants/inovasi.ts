export interface InovasiItem {
  slug: string
  label: string
  shortLabel: string
  icon: string
  tagline: string
  // NOTE: Deskripsi di bawah masih placeholder umum karena detail resmi tiap
  // program belum tersedia. Silakan sesuaikan teksnya langsung di file ini
  // (tidak ada input dari halaman admin untuk konten inovasi ini).
  description: string
  highlights: string[]
}

export const INOVASI_LIST: InovasiItem[] = [
  {
    slug: '8lms',
    label: '8LMS',
    shortLabel: '8LMS',
    icon: '💻',
    tagline: 'Platform pembelajaran digital SMP Negeri 8 Probolinggo.',
    description:
      '8LMS adalah inovasi pembelajaran digital yang dikembangkan untuk mendukung proses belajar-mengajar di SMP Negeri 8 Probolinggo secara lebih fleksibel dan terarah.',
    highlights: [
      'Materi pembelajaran terstruktur',
      'Akses mudah bagi siswa dan guru',
      'Mendukung pembelajaran daring & luring',
    ],
  },
  {
    slug: 'batolu',
    label: 'BATOLU',
    shortLabel: 'BATOLU',
    icon: '🌱',
    tagline: 'Program inovasi unggulan SMP Negeri 8 Probolinggo.',
    description:
      'BATOLU merupakan salah satu program inovasi SMP Negeri 8 Probolinggo yang dirancang untuk menunjang kegiatan sekolah dan meningkatkan kualitas layanan pendidikan.',
    highlights: [
      'Berorientasi pada peningkatan mutu sekolah',
      'Melibatkan partisipasi warga sekolah',
      'Dikembangkan secara berkelanjutan',
    ],
  },
  {
    slug: 'remus',
    label: 'REMUS',
    shortLabel: 'REMUS',
    icon: '📚',
    tagline: 'Program inovasi unggulan SMP Negeri 8 Probolinggo.',
    description:
      'REMUS adalah program inovasi SMP Negeri 8 Probolinggo yang mendukung kegiatan akademik maupun non-akademik demi kemajuan sekolah.',
    highlights: [
      'Mendukung kegiatan sekolah',
      'Berbasis kebutuhan siswa dan guru',
      'Terus dikembangkan dari waktu ke waktu',
    ],
  },
  {
    slug: 'pamer-si-wolu',
    label: 'PAMER SI WOLU',
    shortLabel: 'PAMER SI WOLU',
    icon: '🏆',
    tagline: 'Wadah unjuk prestasi dan karya siswa SMP Negeri 8 Probolinggo.',
    description:
      'PAMER SI WOLU adalah program inovasi yang menjadi wadah bagi siswa SMP Negeri 8 Probolinggo untuk menampilkan karya dan prestasi terbaiknya.',
    highlights: [
      'Menampilkan karya & prestasi siswa',
      'Memacu semangat berkarya',
      'Menjadi ajang apresiasi sekolah',
    ],
  },
  {
    slug: 'inovasi-lima',
    label: 'INOVASI LIMA',
    shortLabel: 'INOVASI LIMA',
    icon: '✨',
    tagline: 'Program inovasi unggulan SMP Negeri 8 Probolinggo.',
    description:
      'INOVASI LIMA merupakan salah satu program unggulan SMP Negeri 8 Probolinggo dalam upaya terus berinovasi meningkatkan kualitas pendidikan.',
    highlights: [
      'Bagian dari komitmen sekolah berinovasi',
      'Mendukung visi & misi sekolah',
      'Dikembangkan bersama warga sekolah',
    ],
  },
]

export function getInovasiBySlug(slug: string): InovasiItem | undefined {
  return INOVASI_LIST.find((i) => i.slug === slug)
}
