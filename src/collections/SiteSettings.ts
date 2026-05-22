import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Pengaturan Website',
  admin: {
    group: 'Pengaturan',
    description: 'Pengaturan global: alamat sekolah, media sosial, visi misi, kepala sekolah',
    hideAPIURL: true,
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [

        // ════════════════════════════════════════════════
        //  TAB 1 — INFORMASI SEKOLAH
        // ════════════════════════════════════════════════
        {
          label: '🏫 Informasi Sekolah',
          fields: [
            {
              name: 'schoolName',
              label: 'Nama Sekolah',
              type: 'text',
              defaultValue: 'SMP Negeri 8 Probolinggo',
            },
            {
              name: 'schoolNSS',
              label: 'NSS (Nomor Statistik Sekolah)',
              type: 'text',
            },
            {
              name: 'schoolNPSN',
              label: 'NPSN',
              type: 'text',
            },
            {
              name: 'schoolLogo',
              label: 'Logo Sekolah',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Format PNG transparan. Ideal: 400x400px',
              },
            },
            {
              name: 'address',
              label: 'Alamat',
              type: 'group',
              fields: [
                {
                  name: 'street',
                  label: 'Jalan',
                  type: 'text',
                  admin: { description: 'Contoh: Jl. Mastrip No.XX' },
                },
                {
                  name: 'kelurahan',
                  label: 'Kelurahan',
                  type: 'text',
                },
                {
                  name: 'kecamatan',
                  label: 'Kecamatan',
                  type: 'text',
                },
                {
                  name: 'city',
                  label: 'Kota',
                  type: 'text',
                  defaultValue: 'Probolinggo',
                },
                {
                  name: 'province',
                  label: 'Provinsi',
                  type: 'text',
                  defaultValue: 'Jawa Timur',
                },
                {
                  name: 'postalCode',
                  label: 'Kode Pos',
                  type: 'text',
                },
                {
                  name: 'mapsUrl',
                  label: 'Link Google Maps',
                  type: 'text',
                  admin: { description: 'URL Google Maps embed atau share link' },
                },
              ],
            },
            {
              name: 'contact',
              label: 'Kontak',
              type: 'group',
              fields: [
                {
                  name: 'phone',
                  label: 'Nomor Telepon',
                  type: 'text',
                  admin: { description: 'Contoh: (0335) 123456' },
                },
                {
                  name: 'whatsapp',
                  label: 'WhatsApp',
                  type: 'text',
                  admin: { description: 'Format: 628xxxxxxxxxx' },
                },
                {
                  name: 'email',
                  label: 'Email Sekolah',
                  type: 'email',
                },
                {
                  name: 'website',
                  label: 'Website',
                  type: 'text',
                  defaultValue: 'https://smpn8prob.sch.id',
                },
              ],
            },
          ],
        },

        // ════════════════════════════════════════════════
        //  TAB 2 — MEDIA SOSIAL
        // ════════════════════════════════════════════════
        {
          label: '📱 Media Sosial',
          fields: [
            {
              name: 'socialMedia',
              label: 'Akun Media Sosial',
              type: 'group',
              admin: {
                description: 'Kosongkan jika tidak ada. Icon akan otomatis tampil jika diisi.',
              },
              fields: [
                {
                  name: 'facebook',
                  label: 'Facebook',
                  type: 'text',
                  admin: { description: 'Contoh: https://facebook.com/smpn8probolinggo' },
                },
                {
                  name: 'instagram',
                  label: 'Instagram',
                  type: 'text',
                  admin: { description: 'Contoh: https://instagram.com/smpn8prob' },
                },
                {
                  name: 'youtube',
                  label: 'YouTube',
                  type: 'text',
                  admin: { description: 'Contoh: https://youtube.com/@smpn8prob' },
                },
                {
                  name: 'twitter',
                  label: 'Twitter / X',
                  type: 'text',
                },
                {
                  name: 'tiktok',
                  label: 'TikTok',
                  type: 'text',
                },
              ],
            },
          ],
        },

        // ════════════════════════════════════════════════
        //  TAB 3 — KEPALA SEKOLAH
        // ════════════════════════════════════════════════
        {
          label: '👤 Kepala Sekolah',
          fields: [
            {
              name: 'principal',
              label: 'Data Kepala Sekolah',
              type: 'group',
              fields: [
                {
                  name: 'name',
                  label: 'Nama Lengkap',
                  type: 'text',
                  admin: { description: 'Lengkap dengan gelar. Contoh: Drs. Ahmad Fauzi, M.Pd.' },
                },
                {
                  name: 'nip',
                  label: 'NIP',
                  type: 'text',
                },
                {
                  name: 'photo',
                  label: 'Foto Kepala Sekolah',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Foto formal. Ideal: 400x500px (portrait)' },
                },
                {
                  name: 'message',
                  label: 'Sambutan Singkat',
                  type: 'textarea',
                  admin: {
                    description: 'Kutipan atau sambutan singkat kepsek untuk ditampilkan di homepage',
                    rows: 4,
                  },
                },
              ],
            },
          ],
        },

        // ════════════════════════════════════════════════
        //  TAB 4 — VISI & MISI
        // ════════════════════════════════════════════════
        {
          label: '🎯 Visi & Misi',
          fields: [
            {
              name: 'vision',
              label: 'Visi Sekolah',
              type: 'textarea',
              admin: {
                description: 'Visi sekolah yang ditampilkan di homepage dan halaman profil',
                rows: 3,
              },
            },
            {
              name: 'mission',
              label: 'Misi Sekolah',
              type: 'array',
              labels: {
                singular: 'Poin Misi',
                plural: 'Daftar Misi',
              },
              admin: { description: 'Tambahkan poin-poin misi sekolah' },
              fields: [
                {
                  name: 'point',
                  label: 'Poin Misi',
                  type: 'textarea',
                  required: true,
                  admin: { rows: 2 },
                },
              ],
            },
            {
              name: 'motto',
              label: 'Motto Sekolah',
              type: 'text',
              admin: {
                description: 'Contoh: Berprestasi, Berkarakter, Berwawasan Global',
              },
            },
          ],
        },

        // ════════════════════════════════════════════════
        //  TAB 5 — TICKER & PENGUMUMAN
        // ════════════════════════════════════════════════
        {
          label: '📢 Ticker & Pengumuman',
          fields: [
            {
              name: 'tickerText',
              label: 'Teks Ticker Berjalan',
              type: 'text',
              defaultValue: 'Selamat datang di website resmi SMP Negeri 8 Probolinggo',
              admin: { description: 'Teks yang berjalan di bagian atas halaman utama' },
            },
            {
              name: 'tickerEnabled',
              label: 'Aktifkan Ticker',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'heroTaglines',
              label: 'Tagline di Depan Slider',
              type: 'array',
              labels: {
                singular: 'Tagline',
                plural: 'Taglines',
              },
              defaultValue: [
                { text: '✨ Guru Berkualitas' },
                { text: '🌿 Sekolah Adiwiyata' },
                { text: '🏆 Sekolah Berprestasi' },
              ],
              admin: { description: 'Teks positif yang tampil di depan foto slider homepage' },
              fields: [
                {
                  name: 'text',
                  label: 'Teks Tagline',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },

        // ════════════════════════════════════════════════
        //  TAB 6 — SEO
        // ════════════════════════════════════════════════
        {
          label: '🔍 SEO',
          fields: [
            {
              name: 'seo',
              label: 'Pengaturan SEO Global',
              type: 'group',
              fields: [
                {
                  name: 'metaTitle',
                  label: 'Meta Title Default',
                  type: 'text',
                  defaultValue: 'SMP Negeri 8 Probolinggo',
                },
                {
                  name: 'metaDescription',
                  label: 'Meta Description Default',
                  type: 'textarea',
                  maxLength: 160,
                  admin: { rows: 2 },
                },
                {
                  name: 'ogImage',
                  label: 'Open Graph Image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Gambar yang muncul saat link dibagikan di medsos. Ideal: 1200x630px',
                  },
                },
                {
                  name: 'googleAnalyticsId',
                  label: 'Google Analytics ID',
                  type: 'text',
                  admin: { description: 'Contoh: G-XXXXXXXXXX' },
                },
              ],
            },
          ],
        },

        // ════════════════════════════════════════════════
        //  TAB 7 — TEMA WEBSITE
        // ════════════════════════════════════════════════
        {
          label: '🎨 Tema Website',
          fields: [
            {
              name: 'activeTheme',
              type: 'text',
              defaultValue: 'klasik-formal',
              admin: {
  // components: {
  //   Field: '@/components/admin/ThemePicker',
  // },
  description: 'Pilih tampilan visual website...',
},
            },
          ],
        },

      ], // tutup tabs array
    },   // tutup tabs field
  ],     // tutup fields
}