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
      'PAMER SI WOLU (Pembelajaran by Media Real Aksi SMP Wolu) adalah inovasi literasi berbasis media pembelajaran kreatif yang disebar di dalam dan luar kelas, dirancang untuk menumbuhkan budaya berliterasi bagi seluruh warga sekolah tanpa terasa seperti belajar.',
    highlights: [
      'Media literasi tersebar di kelas, koridor, hingga mading',
      'Melibatkan guru, siswa, dan wali murid dalam pembuatan media',
      'Menjawab tantangan rendahnya skor literasi PISA',
    ],
    coverImage:
      'https://res.cloudinary.com/dugvpuniy/image/upload/v1786888024/WhatsApp_Image_2026-08-02_at_15.06.24_3_hafg1t.jpg',
    content: `
<p><strong>PROBOLINGGO</strong> — SMP Negeri 8 Kota Probolinggo menghadirkan inovasi literasi bertajuk <strong>PAMER SI WOLU (Pembelajaran by Media Real Aksi SMP Wolu)</strong>, yang telah diterapkan sejak 2 Mei 2025. Inovasi ini digagas untuk menjawab rendahnya minat dan kemampuan literasi peserta didik, sekaligus mendorong kreativitas guru dalam merancang media pembelajaran yang dekat dengan keseharian murid.</p>

<figure style="display:block;margin:1.75rem auto;width:100%;text-align:center;">
  <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786888024/WhatsApp_Image_2026-08-02_at_15.06.24_3_hafg1t.jpg" alt="Media pembelajaran PAMER SI WOLU di lingkungan sekolah" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  <figcaption style="margin-top:.5rem;font-size:.875rem;color:#666;">Media literasi PAMER SI WOLU dipasang di berbagai titik lingkungan SMP Negeri 8 Probolinggo agar mudah diakses seluruh warga sekolah.</figcaption>
</figure>

<p>Inisiator program, <strong>Dra. Nurul Istifadah</strong>, mengatakan inovasi ini lahir dari keprihatinan terhadap hasil Programme for International Student Assessment (PISA) 2022, di mana Indonesia berada di peringkat 68 dengan skor membaca yang masih rendah, sekaligus dari persoalan literasi yang ia amati langsung di lingkungan sekolah.</p>

<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
  "Kurangnya fasilitas literasi di sekitar peserta didik membuat mereka malas berliterasi, apalagi harus bergerak dulu ke perpustakaan. Waktu istirahat yang hanya 15 menit pun lebih banyak dipakai untuk jajan ke kantin," ujar Nurul.
</blockquote>

<p>Ia menambahkan, rendahnya literasi guru turut membuat pembelajaran yang disajikan kurang menarik, sehingga kreativitas guru dalam mengemas materi menjadi tantangan tersendiri yang perlu dijawab lewat inovasi ini.</p>

<h3>Belajar Tanpa Merasa Belajar</h3>

<p>Nurul menjelaskan, media pembelajaran dalam PAMER SI WOLU sengaja tidak dibatasi hanya berada di dalam kelas, melainkan juga dipasang di koridor, taman, mading, dan tembok-tembok terbuka sekolah agar mudah diakses kapan saja oleh peserta didik.</p>

<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
  "Media tidak hanya terbatas ditempatkan di dalam kelas, tetapi beberapa akan diletakkan di luar ruang dengan tujuan memberi peluang bagi peserta didik untuk beristirahat dan berliterasi secara santai, tanpa ada tekanan untuk berliterasi," ujar Nurul, inovator di balik program PAMER SI WOLU.
</blockquote>

<p>Materi yang ditampilkan diangkat dari kehidupan sehari-hari yang tetap terkait dengan materi pembelajaran, dikemas dengan bahasa sederhana agar tidak terkesan seperti sedang belajar. Media juga bisa dibuat oleh guru sendiri maupun melalui penugasan kepada siswa, kemudian dibagikan lewat grup WhatsApp kelas agar wali murid turut bisa mendampingi anak belajar di rumah.</p>

<div style="display:flex;flex-wrap:wrap;gap:12px;margin:1.75rem 0;">
  <div style="flex:1 1 45%;min-width:220px;">
    <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786888024/WhatsApp_Image_2026-08-02_at_15.06.24_2_gjcstt.jpg" alt="Kegiatan PAMER SI WOLU 1" style="width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  </div>
  <div style="flex:1 1 45%;min-width:220px;">
    <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786888024/WhatsApp_Image_2026-08-02_at_15.06.23_1_moihq3.jpg" alt="Kegiatan PAMER SI WOLU 2" style="width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  </div>
  <div style="flex:1 1 100%;">
    <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786888024/WhatsApp_Image_2026-08-02_at_15.06.24_3_hafg1t.jpg" alt="Kegiatan PAMER SI WOLU 3" style="width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  </div>
</div>
<p style="margin-top:-1.25rem;font-size:.875rem;color:#666;text-align:center;">Suasana peserta didik memanfaatkan media literasi PAMER SI WOLU pada waktu luang di lingkungan sekolah.</p>

<h3>Alur Pelaksanaan Inovasi</h3>

<p>Pelaksanaan PAMER SI WOLU diawali dengan rapat koordinasi pembentukan panitia yang dituangkan dalam SK, lalu dibagi menjadi kelompok Pengelola yang menyiapkan materi dan kemasan media, serta kelompok Pelaksana yang bertanggung jawab memasang, mensosialisasikan, dan mengevaluasi pemanfaatan media di lapangan.</p>

<figure style="display:block;margin:1.75rem auto;width:100%;text-align:center;">
  <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786888135/ChatGPT_Image_16_Agu_2026_20.48.36_r8yktc.png" alt="Infografis tahapan inovasi PAMER SI WOLU" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  <figcaption style="margin-top:.5rem;font-size:.875rem;color:#666;">Infografis tahapan pelaksanaan inovasi PAMER SI WOLU dari perencanaan hingga evaluasi.</figcaption>
</figure>

<p><strong>Alur bagi Kelompok Pengelola:</strong></p>
<ol>
  <li>Menyusun rencana inovasi dan menetapkan panitia melalui SK.</li>
  <li>Mengumpulkan dan mengembangkan materi bersama tim literasi, duta perpustakaan, kader PMR, Adiwiyata, dan OSIS.</li>
  <li>Menentukan bentuk kemasan media (banner, poster, hiasan kelas, atau kreasi lainnya).</li>
  <li>Berkoordinasi dengan pembina ekstrakurikuler untuk mengemas materi menjadi media yang kreatif.</li>
  <li>Mensosialisasikan media yang telah selesai kepada seluruh warga sekolah.</li>
</ol>

<p><strong>Alur bagi Kelompok Pelaksana:</strong></p>
<ol>
  <li>Mempersiapkan pemasangan media di kelas, dinding luar kelas, mading, hingga kanal digital sekolah.</li>
  <li>Merancang pemanfaatan media dalam pembelajaran, gerakan literasi, atau pembiasaan sekolah.</li>
  <li>Mengajak peserta didik memberi komentar atau tanggapan atas materi pada media.</li>
  <li>Memantau dan menjaga keberlangsungan media yang telah dipasang.</li>
  <li>Menyusun laporan pelaksanaan kegiatan sebagai bahan evaluasi panitia.</li>
</ol>

<h3>Dampak Nyata bagi Budaya Literasi Sekolah</h3>

<p>Nurul menyebut, kehadiran media yang tersebar di berbagai titik memberi kesempatan bagi seluruh warga sekolah untuk berliterasi tanpa dibatasi ruang maupun waktu, sekaligus mendorong tumbuhnya rasa tanggung jawab bersama untuk menjaga media itu sendiri.</p>

<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
  "Kami berharap ketertarikan pada media yang terpasang ini akan meningkatkan kemampuan literasi, sehingga kecakapan literasi menjadi jiwa bagi peserta didik dan guru, dan pada akhirnya kita semua menjadi pembelajar sejati," kata Nurul.
</blockquote>

<p>Sekolah berharap PAMER SI WOLU dapat terus dikembangkan dan menjadi contoh praktik baik penguatan budaya literasi berbasis media kreatif yang bisa direplikasi oleh sekolah lain di Kota Probolinggo.</p>

<h3>Layanan dan Informasi Lebih Lanjut</h3>

<p>Masyarakat maupun sekolah lain yang ingin mengetahui lebih jauh mengenai inovasi PAMER SI WOLU dapat mengakses informasi resmi SMP Negeri 8 Kota Probolinggo melalui kanal berikut:</p>
<ul>
  <li><strong>Website:</strong> smpn8prob.sch.id</li>
  <li><strong>Alamat Sekolah:</strong> Jl. Salak No. 137, Kelurahan Jrebeng Kidul, Kecamatan Wonoasih, Kota Probolinggo</li>
  <li><strong>Email:</strong> smpn8@probolinggokota.go.id</li>
  <li><strong>Media Sosial:</strong> @smpn8probolinggo</li>
</ul>
    `,
  },
  {
    slug: 'koala-si-wolu',
    label: 'KOALA SI WOLU',
    shortLabel: 'KOALA SI WOLU',
    icon: '♻️',
    tagline: 'Kompos Alami SMP Negeri 8 Probolinggo dari limbah daun dan sisa makanan.',
    description:
      'KOALA SI WOLU (Kompos Alami SMP Negeri 8 Probolinggo) adalah inovasi pengolahan limbah daun kering dan sisa makanan menjadi kompos alami, sekaligus menjadi wahana pembelajaran sains, penguatan karakter, dan kewirausahaan yang inklusif bagi seluruh murid.',
    highlights: [
      'Mengubah limbah daun & sisa makanan jadi kompos alami',
      'Experiential learning: murid belajar sains sambil bergerak',
      'Inklusif — setiap murid punya peran sesuai potensinya',
    ],
    coverImage:
      'https://res.cloudinary.com/dugvpuniy/image/upload/v1786887477/WhatsApp_Image_2026-08-16_at_20.36.46_mscdqj.jpg',
    content: `
<p><strong>PROBOLINGGO</strong> — SMP Negeri 8 Kota Probolinggo mulai menguji coba inovasi pengelolaan sampah organik bertajuk <strong>KOALA SI WOLU (Kompos Alami SMP Negeri 8 Probolinggo)</strong> pada Tahun Pelajaran 2026/2027. Inovasi ini mengolah limbah daun kering dan sisa makanan dari lingkungan sekolah menjadi kompos alami, sekaligus dirancang sebagai wahana pembelajaran sains, penguatan karakter, dan kewirausahaan yang melibatkan seluruh murid secara inklusif.</p>

<figure style="display:block;margin:1.75rem auto;width:100%;text-align:center;">
  <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786887477/WhatsApp_Image_2026-08-16_at_20.36.46_mscdqj.jpg" alt="Kegiatan pengolahan kompos KOALA SI WOLU" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  <figcaption style="margin-top:.5rem;font-size:.875rem;color:#666;">Kader KOALA SI WOLU mengolah limbah daun dan sisa makanan menjadi kompos alami di lingkungan sekolah.</figcaption>
</figure>

<p>Koordinator sekaligus inisiator program, <strong>Rafi Iqbal Rahmatulloh, S.Pd.</strong>, mengatakan inovasi ini lahir dari persoalan limbah organik yang selama ini dibiarkan menumpuk di lingkungan sekolah, sementara pembelajaran sains tentang daur ulang materi organik masih bersifat teoretis dan kurang melibatkan murid secara aktif.</p>

<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
  "Karakter murid kami cenderung aktif secara fisik dan kurang tertarik pada pembelajaran teoretis di dalam kelas, jadi kami butuh pendekatan belajar yang bergerak, konkret, dan bermakna, bukan sekadar membaca teori," ujar Rafi.
</blockquote>

<p>Ia menambahkan, persoalan sampah organik juga menjadi tantangan di tingkat kota. Tempat Pemrosesan Akhir (TPA) Bestari di Jalan Anggrek menerima sekitar 70 ton sampah per hari, sementara total timbulan sampah kota diperkirakan mencapai 144 ton per hari, sehingga pengurangan sampah dari sumber, termasuk dari sekolah, menjadi penting untuk digalakkan.</p>

<h3>Belajar Sains sambil Bergerak</h3>

<p>Rafi menjelaskan, melalui KOALA SI WOLU limbah organik dikumpulkan, dipilah, dan diolah secara terjadwal oleh Kader KOALA SI WOLU menjadi kompos alami melalui siklus <em>experiential learning</em> yang menggerakkan fisik murid. Setiap murid, termasuk yang berkebutuhan atau berkemampuan belajar beragam, memperoleh peran bermakna sesuai potensinya, mulai dari kegiatan fisik, pencatatan jurnal sains, hingga pemasaran.</p>

<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
  "Murid belajar sambil bergerak, mulai dari mengumpulkan, mencampur, memantau, hingga mengemas dan memasarkan kompos. Program ini juga inklusif, setiap murid mendapat peran bermakna sesuai potensinya, baik pada kegiatan fisik, pencatatan, maupun pemasaran," jelas Rafi, inisiator di balik program KOALA SI WOLU.
</blockquote>

<div style="display:flex;flex-wrap:wrap;gap:12px;margin:1.75rem 0;">
  <div style="flex:1 1 45%;min-width:220px;">
    <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786887477/WhatsApp_Image_2026-08-16_at_20.36.46_mscdqj.jpg" alt="Kegiatan Kader KOALA SI WOLU 1" style="width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  </div>
  <div style="flex:1 1 45%;min-width:220px;">
    <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786887477/WhatsApp_Image_2026-08-16_at_20.36.50_mxyk00.jpg" alt="Kegiatan Kader KOALA SI WOLU 2" style="width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  </div>
  <div style="flex:1 1 100%;">
    <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786887476/WhatsApp_Image_2026-08-16_at_20.36.54_iitl40.jpg" alt="Kegiatan Kader KOALA SI WOLU 3" style="width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  </div>
</div>
<p style="margin-top:-1.25rem;font-size:.875rem;color:#666;text-align:center;">Kader KOALA SI WOLU dalam berbagai tahapan kegiatan, mulai dari pengumpulan limbah hingga pengolahan kompos.</p>

<h3>Empat Tahapan Pengolahan Kompos</h3>

<p>Pelaksanaan KOALA SI WOLU mencakup empat tahapan utama dalam satu siklus tahun pelajaran, mulai dari pengumpulan dan pemilahan limbah, pengomposan dengan metode ember tumpuk/takakura disertai pengamatan sains oleh murid, pemanenan dan pengemasan kompos matang, hingga promosi dan penjualan produk kompos kepada warga sekolah dan masyarakat sekitar.</p>

<figure style="display:block;margin:1.75rem auto;width:100%;text-align:center;">
  <img src="https://res.cloudinary.com/dugvpuniy/image/upload/v1786887164/ChatGPT_Image_16_Agu_2026_20.32.23_smhlaj.png" alt="Infografis tahapan inovasi KOALA SI WOLU" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);" />
  <figcaption style="margin-top:.5rem;font-size:.875rem;color:#666;">Infografis tahapan pelaksanaan inovasi KOALA SI WOLU dari pengumpulan limbah hingga penjualan kompos.</figcaption>
</figure>

<p><strong>Alur bagi Kader KOALA SI WOLU:</strong></p>
<ol>
  <li>Mengumpulkan dan memilah limbah daun kering serta sisa makanan secara terjadwal.</li>
  <li>Mengolah limbah dengan metode ember tumpuk/takakura serta penambahan dekomposer.</li>
  <li>Mencatat jurnal pengamatan suhu, kelembapan, warna, dan tekstur kompos setiap minggu.</li>
  <li>Memanen, mengayak, dan mengemas kompos matang yang siap dimanfaatkan.</li>
  <li>Mempromosikan dan menjual kompos kepada warga sekolah serta masyarakat sekitar.</li>
</ol>

<p><strong>Alur bagi Murid Peserta:</strong></p>
<ol>
  <li>Bergabung dalam kelompok sesuai peran dan potensi masing-masing, termasuk murid berkebutuhan khusus.</li>
  <li>Ikut serta dalam kegiatan fisik pengumpulan dan pengolahan limbah organik.</li>
  <li>Mengisi jurnal pengamatan sains sebagai bagian dari pembelajaran dekomposisi.</li>
  <li>Belajar dasar kewirausahaan lewat pengemasan, penetapan harga, dan promosi kompos.</li>
  <li>Mencatat modal, harga jual, dan keuntungan sederhana dari hasil penjualan.</li>
</ol>

<h3>Dampak Nyata bagi Sekolah dan Lingkungan</h3>

<p>Rafi menyebut, KOALA SI WOLU turut memperkuat program lingkungan hidup (Adiwiyata) sekolah sekaligus menyediakan pupuk alami secara mandiri untuk kebun sekolah, sementara bagi masyarakat sekitar, program ini membuka akses terhadap kompos alami dengan harga terjangkau.</p>

<blockquote style="background-color: #f8f9fa; border-left: 4px solid #0056b3; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #333;">
  "Program ini memadukan sains, kewirausahaan, dan karakter 7KAIH sekaligus dalam satu siklus kegiatan tahunan. Hasil kompos juga kami manfaatkan untuk kebun sekolah dan dijual ke warga sekitar, jadi ini benar-benar siklus produksi-manfaat yang nyata, bukan sekadar proyek sekolah," kata Rafi.
</blockquote>

<p>Ia berharap KOALA SI WOLU dapat terus berjalan melalui regenerasi Kader setiap tahun dan menjadi contoh praktik baik pengelolaan sampah organik berbasis sekolah yang bisa direplikasi oleh satuan pendidikan lain di Kota Probolinggo.</p>

<h3>Layanan dan Informasi Lebih Lanjut</h3>

<p>Masyarakat maupun sekolah lain yang ingin mengetahui lebih jauh mengenai inovasi KOALA SI WOLU dapat mengakses informasi resmi SMP Negeri 8 Kota Probolinggo melalui kanal berikut:</p>
<ul>
  <li><strong>Website:</strong> smpn8prob.sch.id</li>
  <li><strong>Alamat Sekolah:</strong> Jl. Salak No. 137, Kelurahan Jrebeng Kidul, Kecamatan Wonoasih, Kota Probolinggo</li>
  <li><strong>Email:</strong> smpn8.prob@gmail.com</li>
  <li><strong>Media Sosial:</strong> @smpn8probolinggo</li>
</ul>
    `,
  },
]

export function getInovasiBySlug(slug: string): InovasiItem | undefined {
  return INOVASI_LIST.find((i) => i.slug === slug)
}