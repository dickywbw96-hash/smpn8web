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
  // URL foto sampul (opsional). Jika diisi, dipakai sebagai background
  // hero halaman detail (menggantikan gradient biru polos).
  coverImage?: string
}

export const INOVASI_LIST: InovasiItem[] = [
  {
    slug: '8lms',
    label: '8LMS',
    shortLabel: '8LMS',
    icon: '💻',
    tagline: 'Sistem pembelajaran dan asesmen digital terintegrasi SMP Negeri 8 Probolinggo.',
    description:
      '8LMS (Wolu Learning Management System) adalah sistem pembelajaran daring sekaligus asesmen digital terintegrasi yang dikembangkan secara mandiri oleh guru SMP Negeri 8 Probolinggo untuk mendukung PTS, PAS, dan pembelajaran harian berbasis komputer.',
    highlights: [
      'Satu platform untuk materi, tugas, dan ujian',
      'PTS & PAS serentak berbasis komputer',
      'Rekap nilai dan analisis butir soal otomatis',
    ],
    coverImage:
      'https://res.cloudinary.com/dugvpuniy/image/upload/v1786416384/Screenshot_2026-08-11_094437_jm7jy0.png',
    content: `
<p><strong>PROBOLINGGO</strong> — SMP Negeri 8 Kota Probolinggo kini memiliki sistem pembelajaran dan asesmen digital terintegrasi bernama <strong>Wolu Learning Management System (8LMS)</strong>. Inovasi ini dikembangkan secara mandiri oleh salah satu guru sekolah tersebut untuk menjawab kebutuhan pembelajaran daring sekaligus pelaksanaan ujian berbasis komputer yang selama ini masih dilakukan secara konvensional.</p>

<figure style="display:block;margin:1.75rem auto;width:100%;text-align:center;">
  <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786416384/Screenshot_2026-08-11_094437_jm7jy0.png" alt="Siswa mengerjakan ujian berbasis komputer menggunakan 8LMS" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  <figcaption style="margin-top:.5rem;font-size:.875rem;color:#666;">Peserta didik SMP Negeri 8 Probolinggo mengerjakan asesmen secara serentak di laboratorium komputer menggunakan 8LMS.</figcaption>
</figure>

<p>Kepala SMP Negeri 8 Probolinggo, <strong>Andik Sasmitro, S.Pd., M.Pd.</strong>, mengatakan kehadiran 8LMS menjadi jawaban atas berbagai kendala yang selama ini dihadapi sekolah, mulai dari materi pembelajaran yang tersebar di berbagai media hingga proses koreksi ujian manual yang memakan waktu lama.</p>

<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
  "Sebelum ada 8LMS, guru kami kesulitan memantau progres siswa karena tugas dan materi tersebar di berbagai aplikasi yang tidak terhubung satu sama lain. Koreksi lembar jawaban PTS dan PAS juga masih manual, sehingga butuh waktu lama dan rawan salah skor," ujar Andik.
</blockquote>

<p>Ia menambahkan, sistem ini kini telah diterapkan secara serentak untuk seluruh peserta didik dalam pelaksanaan Penilaian Tengah Semester (PTS) maupun Penilaian Akhir Semester (PAS) di laboratorium komputer sekolah.</p>

<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
  "Seratus persen siswa kami sudah aktif menggunakan akun 8LMS dalam kegiatan asesmen. Lebih dari 70 persen tugas dan ujian kini dilakukan lewat sistem ini, sehingga penggunaan kertas jauh berkurang," katanya.
</blockquote>

<h3>Dikembangkan Sendiri oleh Guru Sekolah</h3>

<p>Inisiator sekaligus pengembang 8LMS, <strong>Ibnu Wahyudi, S.Kom., M.MPd.</strong>, menjelaskan bahwa sistem ini dibangun dengan mengadaptasi platform <em>Learning Management System</em> berbasis Moodle yang disesuaikan dengan kebutuhan riil sekolah.</p>

<figure style="display:block;margin:1.75rem auto;width:90%;text-align:center;">
  <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786416393/Screenshot_1382_hivww2.png" alt="Tampilan dashboard 8LMS" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  <figcaption style="margin-top:.5rem;font-size:.875rem;color:#666;">Tampilan dasbor 8LMS tempat guru mengelola materi, tugas, dan hasil asesmen peserta didik.</figcaption>
</figure>

<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
  "8LMS ini punya dua fungsi sekaligus, sebagai media pembelajaran daring harian dan sebagai instrumen resmi pelaksanaan asesmen sumatif seperti PTS dan PAS. Karena dikembangkan sendiri oleh internal sekolah, kami bisa menyesuaikan fitur dengan cepat sesuai kebutuhan di lapangan, tanpa bergantung pihak ketiga," jelas Ibnu, inovator di balik program 8LMS.
</blockquote>

<p>Menurut Ibnu, guru dapat mengunggah video pembelajaran, dokumen, tautan sumber belajar, forum diskusi, hingga kuis interaktif dengan skor otomatis melalui satu platform. Untuk ujian, hasil jawaban peserta didik langsung terekap dalam sistem begitu waktu pengerjaan berakhir, tanpa perlu proses input ulang.</p>

<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
  "Sistem kami juga otomatis menganalisis tingkat kesulitan tiap butir soal berdasarkan pola jawaban seluruh siswa. Ini jadi bahan refleksi guru untuk memperbaiki kualitas soal dan strategi mengajar," tambahnya.
</blockquote>

<h3>Petunjuk Teknis Penggunaan 8LMS</h3>

<figure style="display:block;margin:1.75rem auto;width:55%;text-align:center;">
  <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786416199/ChatGPT_Image_Aug_11_2026_09_39_49_AM_snc5vy.png" alt="Infografis petunjuk teknis penggunaan 8LMS" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  <figcaption style="margin-top:.5rem;font-size:.875rem;color:#666;">Infografis alur penggunaan 8LMS bagi guru, peserta didik, dan operator sekolah.</figcaption>
</figure>

<p><strong>Alur bagi Guru:</strong></p>
<ol>
  <li>Login ke 8LMS menggunakan akun masing-masing dan memilih kelas/mata pelajaran.</li>
  <li>Mengunggah materi (video, dokumen, tautan) dan membuat penugasan daring dengan batas waktu.</li>
  <li>Menyusun bank soal pada modul kuis/ujian lengkap dengan kunci jawaban dan bobot nilai.</li>
  <li>Memantau progres pengerjaan siswa secara <em>real time</em> lewat dasbor.</li>
  <li>Mengunduh rekap nilai dan laporan analisis butir soal setelah ujian selesai.</li>
</ol>

<p><strong>Alur bagi Peserta Didik:</strong></p>
<ol>
  <li>Menempati laboratorium komputer sesuai jadwal saat pelaksanaan PTS/PAS.</li>
  <li>Login menggunakan akun yang telah didaftarkan operator sekolah.</li>
  <li>Mengerjakan soal ujian secara daring sesuai batas waktu sistem.</li>
  <li>Jawaban tersimpan dan terkunci otomatis begitu waktu habis atau siswa mengumpulkan.</li>
  <li>Nilai dapat langsung diketahui tanpa menunggu koreksi manual.</li>
</ol>

<p>Sekolah menegaskan, sebelum hari pelaksanaan asesmen, operator sekolah lebih dulu menyiapkan jadwal, ruang laboratorium, akun pengguna, serta memastikan kesiapan jaringan dan perangkat komputer.</p>

<h3>Dampak Nyata bagi Sekolah dan Lingkungan</h3>

<p>Andik menyebut, penerapan 8LMS turut mendukung capaian SMP Negeri 8 Probolinggo sebagai peraih penghargaan Adiwiyata Nasional 2025, karena berkurangnya penggunaan kertas dalam pelaksanaan ujian juga berdampak pada efisiensi anggaran sekolah.</p>

<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
  "Ini bukan cuma soal digitalisasi, tapi juga soal efisiensi biaya cetak soal dan waktu koreksi yang dulu bisa berhari-hari. Sekarang jauh lebih cepat dan transparan, orang tua pun bisa melihat capaian belajar anaknya lebih jelas," ujarnya.
</blockquote>

<p>Ibnu berharap 8LMS dapat terus disempurnakan dan menjadi contoh praktik baik yang bisa direplikasi sekolah lain di Kota Probolinggo dalam mendukung transformasi digital layanan pendidikan.</p>

<h3>Layanan dan Informasi Lebih Lanjut</h3>

<p>Masyarakat maupun sekolah lain yang ingin mengetahui lebih jauh mengenai inovasi 8LMS dapat mengakses informasi resmi SMP Negeri 8 Kota Probolinggo melalui kanal berikut:</p>
<ul>
  <li><strong>Website:</strong> smpn8prob.sch.id</li>
  <li><strong>Alamat Sekolah:</strong> Jl. Salak No. 137, Kelurahan Jrebeng Kidul, Kecamatan Wonoasih, Kota Probolinggo</li>
  <li><strong>Email:</strong> smpn8.prob@gmail.com</li>
  <li><strong>Media Sosial:</strong> @smpn8probolinggo</li>
</ul>
    `,
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
    label: 'REMUS TUBAYA',
    shortLabel: 'REMUS TUBAYA',
    icon: '🕌',
    tagline: 'Program Tuntas Baca Al-Qur\'an Remaja Musholla SMP Negeri 8 Probolinggo.',
    description:
      'REMUS TUBAYA (Tuntas Baca Al-Qur\'an) adalah program unggulan Remaja Musholla (REMUS) SMP Negeri 8 Probolinggo yang dirancang untuk memastikan seluruh peserta didik mampu membaca Al-Qur\'an dengan baik dan benar melalui pendampingan terstruktur dan berjenjang.',
    highlights: [
      'Pendampingan baca Al-Qur\'an berjenjang bagi seluruh siswa',
      'Diluncurkan langsung oleh Wali Kota Probolinggo',
      'Terintegrasi dengan program BTQ dan Sahabat Qur\'an REMUS',
    ],
    coverImage:
      'https://res.cloudinary.com/dugvpuniy/image/upload/v1786426096/WhatsApp_Image_2026-08-11_at_08.44.52_kpr1xh.jpg',
    content: `
<p><strong>PROBOLINGGO</strong> — Remaja Musholla (REMUS) SMP Negeri 8 Kota Probolinggo resmi meluncurkan program <strong>REMUS TUBAYA (Tuntas Baca Al-Qur'an)</strong>, sebuah inovasi pendampingan membaca Al-Qur'an yang dirancang agar seluruh peserta didik dapat membaca Al-Qur'an dengan baik dan benar sebelum lulus dari jenjang SMP. Program ini diluncurkan secara simbolis langsung oleh <strong>Wali Kota Probolinggo</strong> di lingkungan sekolah.</p>

<figure style="display:block;margin:1.75rem auto;width:100%;text-align:center;">
  <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786426096/WhatsApp_Image_2026-08-11_at_08.44.52_kpr1xh.jpg" alt="Launching program REMUS TUBAYA oleh Wali Kota Probolinggo" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  <figcaption style="margin-top:.5rem;font-size:.875rem;color:#666;">Wali Kota Probolinggo secara simbolis meluncurkan program REMUS TUBAYA di SMP Negeri 8 Probolinggo.</figcaption>
</figure>

<p>Kepala SMP Negeri 8 Probolinggo, <strong>Andik Sasmitro, S.Pd., M.Pd.</strong>, mengatakan kehadiran REMUS TUBAYA menjadi jawaban atas masih adanya peserta didik yang belum lancar membaca Al-Qur'an ketika masuk jenjang SMP, sehingga dibutuhkan pendampingan yang lebih terstruktur dan berkelanjutan.</p>

<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
  "Kami ingin memastikan tidak ada lagi siswa yang lulus dari sekolah ini tanpa kemampuan membaca Al-Qur'an yang memadai. REMUS TUBAYA hadir sebagai ikhtiar bersama seluruh warga sekolah untuk mewujudkan hal itu," ujar Andik.
</blockquote>

<p>Ia menambahkan, program ini sejalan dengan visi sekolah untuk mencetak peserta didik yang religius, berkarakter, dan menjadi teladan, sekaligus memperkuat fungsi musholla sebagai pusat pembinaan karakter Islami peserta didik.</p>

<h3>Pendampingan Berjenjang dan Berkelanjutan</h3>

<figure style="display:block;margin:1.75rem auto;width:100%;text-align:center;">
  <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786426114/WhatsApp_Image_2026-08-11_at_08.52.45_qt9hqd.jpg" alt="Kegiatan pendampingan REMUS TUBAYA" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  <figcaption style="margin-top:.5rem;font-size:.875rem;color:#666;">Kegiatan pendampingan baca Al-Qur'an dalam program REMUS TUBAYA di musholla sekolah.</figcaption>
</figure>

<p>Pembina REMUS menjelaskan bahwa program TUBAYA memetakan kemampuan membaca Al-Qur'an setiap siswa sejak awal tahun ajaran, kemudian mengelompokkan mereka ke dalam beberapa jenjang pendampingan sesuai kemampuan, mulai dari pengenalan huruf hijaiyah, tajwid dasar, hingga kelancaran membaca.</p>

<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
  "Setiap siswa didampingi oleh kakak kelas atau pengurus REMUS yang sudah lancar mengaji melalui program Sahabat Qur'an. Jadi pendampingannya rutin setiap pekan lewat kegiatan BTQ, tidak hanya mengandalkan jam pelajaran agama," jelas pembina REMUS.
</blockquote>

<p>Progres membaca setiap siswa dicatat secara berkala, sehingga guru dan pembina dapat memantau perkembangan serta memberikan perhatian lebih kepada siswa yang membutuhkan pendampingan ekstra.</p>

<h3>Petunjuk Teknis Program REMUS TUBAYA</h3>

<figure style="display:block;margin:1.75rem auto;width:38%;text-align:center;">
  <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786426032/ChatGPT_Image_Aug_11_2026_12_26_13_PM_fdj20y.png" alt="Infografis petunjuk teknis program REMUS TUBAYA" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  <figcaption style="margin-top:.5rem;font-size:.875rem;color:#666;">Infografis alur pelaksanaan program REMUS TUBAYA bagi pengurus, pembina, dan peserta didik.</figcaption>
</figure>

<p><strong>Alur bagi Pengurus dan Pembina REMUS:</strong></p>
<ol>
  <li>Melakukan pemetaan awal kemampuan membaca Al-Qur'an seluruh peserta didik di awal tahun ajaran.</li>
  <li>Mengelompokkan siswa ke dalam jenjang pendampingan sesuai hasil pemetaan.</li>
  <li>Menugaskan pengurus REMUS/kakak pendamping pada tiap kelompok melalui program Sahabat Qur'an.</li>
  <li>Melaksanakan pendampingan rutin setiap pekan lewat kegiatan BTQ di musholla.</li>
  <li>Mencatat dan mengevaluasi perkembangan tiap siswa secara berkala.</li>
</ol>

<p><strong>Alur bagi Peserta Didik:</strong></p>
<ol>
  <li>Mengikuti tes pemetaan kemampuan membaca Al-Qur'an di awal program.</li>
  <li>Bergabung dalam kelompok pendampingan sesuai jenjang yang ditentukan.</li>
  <li>Mengikuti sesi BTQ rutin setiap pekan bersama pendamping.</li>
  <li>Naik jenjang setelah dinyatakan lulus evaluasi bacaan oleh pembina.</li>
  <li>Mendapatkan apresiasi/sertifikat saat berhasil mencapai target kelancaran membaca.</li>
</ol>

<h3>Dampak Nyata bagi Karakter dan Budaya Sekolah</h3>

<p>Andik menyebut, REMUS TUBAYA turut memperkuat budaya religius di lingkungan sekolah dan menjadi salah satu wujud nyata pembinaan karakter Islami yang selama ini digagas melalui REMUS, sejalan dengan misi menjadikan musholla sebagai pusat pembinaan karakter peserta didik.</p>

<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
  "Dukungan Bapak Wali Kota dalam peluncuran program ini menjadi motivasi besar bagi kami untuk terus konsisten mendampingi anak-anak, karena kemampuan membaca Al-Qur'an adalah bekal yang akan mereka bawa seumur hidup," ujar Andik.
</blockquote>

<p>Pihak sekolah berharap REMUS TUBAYA dapat terus berjalan berkelanjutan setiap tahun ajaran dan menjadi contoh praktik baik pembinaan keagamaan yang bisa direplikasi oleh sekolah lain di Kota Probolinggo.</p>

<h3>Layanan dan Informasi Lebih Lanjut</h3>

<p>Masyarakat maupun sekolah lain yang ingin mengetahui lebih jauh mengenai program REMUS TUBAYA dapat mengakses informasi resmi SMP Negeri 8 Kota Probolinggo melalui kanal berikut:</p>
<ul>
  <li><strong>Website:</strong> smpn8prob.sch.id</li>
  <li><strong>Alamat Sekolah:</strong> Jl. Salak No. 137, Kelurahan Jrebeng Kidul, Kecamatan Wonoasih, Kota Probolinggo</li>
  <li><strong>Email:</strong> smpn8.prob@gmail.com</li>
  <li><strong>Media Sosial:</strong> @smpn8probolinggo</li>
</ul>
    `,
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
    coverImage:
      'https://xgbrgzpojexzuuxulljj.supabase.co/storage/v1/object/public/media/posts/1785673283301-ChatGPT%20Image%20Aug%202,%202026,%2007_20_22%20PM.png',
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