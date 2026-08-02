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
  // Konten berita/artikel lengkap dalam format HTML (opsional).
  // Jika diisi, akan ditampilkan di halaman detail menggantikan
  // description + highlights standar.
  content?: string
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
    tagline: 'Pembelajaran by Media Real Aksi SMP Wolu.',
    description:
      'PAMER SI WOLU adalah program inovasi yang menjadi wadah bagi siswa SMP Negeri 8 Probolinggo untuk menampilkan karya dan prestasi terbaiknya.',
    highlights: [
      'Menampilkan karya & prestasi siswa',
      'Memacu semangat berkarya',
      'Menjadi ajang apresiasi sekolah',
    ],
    content: `
<p><strong>PROBOLINGGO</strong> — Dalam upaya tiada henti meningkatkan mutu dan kualitas pendidikan, sebuah inovasi pembelajaran kreatif berbasis media kini hadir membawa perubahan positif di lingkungan sekolah. Melalui program bertajuk <strong>"Pamer Si Wolu" (Pembelajaran by Media Real Aksi SMP Wolu)</strong> yang digagas oleh <strong>Bu Nurul Istifadah</strong>, proses belajar mengajar kini tidak lagi terkurung dalam sekat-sekat ruang kelas yang kaku, melainkan menjadi pengalaman yang menyegarkan bagi para siswa.</p>
<p>Dalam kegiatan pembelajaran sehari-hari, pengkajian terhadap media merupakan hal yang sangat krusial. Seorang guru dituntut untuk dapat meningkatkan mutu pendidikan dengan mulai menerapkan penggunaan media interaktif. Melalui media tersebut, guru dapat menuangkan pesan-pesan edukatif ke dalam bentuk simbol-simbol visual maupun tekstual yang intuitif, sehingga pesan pembelajaran dapat ditafsirkan dan diserap dengan lebih mudah oleh peserta didik.</p>
<figure style="display:block;margin:1.75rem auto;width:50%;text-align:center;"><img src="https://xgbrgzpojexzuuxulljj.supabase.co/storage/v1/object/public/media/posts/inline/1785673293747-WhatsApp%20Image%202026-08-02%20at%2015.06.23.jpeg" alt="" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" /></figure>
<p>Menariknya, inovasi yang dikembangkan oleh Bu Nurul Istifadah ini tidak membatasi penerapannya hanya di dalam area kelas. Media pembelajaran juga sengaja ditempatkan di luar ruangan, seperti di koridor, taman, dan area santai sekolah. Tujuan utamanya adalah memberikan peluang emas bagi peserta didik untuk memanfaatkan waktu beristirahat mereka sambil berliterasi secara santai, menyenangkan, dan sepenuhnya bebas dari rasa tertekan.</p>
<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
    "Media tidak hanya terbatas ditempatkan di dalam kelas, tetapi beberapa akan diletakkan di luar ruang dengan tujuan memberi peluang bagi peserta didik untuk beristirahat dan berliterasi secara santai, tanpa ada tekanan untuk berliterasi," ujar Bu Nurul Istifadah, inovator di balik program Pamer Si Wolu.
</blockquote>
<p>Materi yang ditampilkan pada media-media tersebut tidak sembarangan. Seluruh konten diangkat dari fenomena dan kehidupan sehari-hari yang dikorelasikan langsung dengan materi pembelajaran di sekolah. Agar tidak terkesan kaku dan menjenuhkan, seluruh materi dikemas secara menarik dengan visual yang memikat serta penggunaan bahasa yang sederhana. Dengan cara ini, para siswa dapat menyerap pengetahuan secara tidak sadar (<em>effortless learning</em>) tanpa merasa sedang dituntut untuk belajar keras.</p>
<p>Melalui terobosan Pamer Si Wolu ini, Bu Nurul Istifadah berharap dapat membangun budaya literasi yang kuat dan natural di kalangan siswa. Inovasi ini membuktikan bahwa dengan pendekatan media yang tepat, kegiatan belajar dapat berlangsung kapan saja dan di mana saja tanpa menghilangkan kebahagiaan masa sekolah peserta didik.</p>
    `,
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