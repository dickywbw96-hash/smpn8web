import type { CollectionConfig } from 'payload'

export const Ekstrakurikuler: CollectionConfig = {
  slug: 'ekstrakurikuler',
  labels: {
    singular: 'Ekstrakurikuler',
    plural: 'Ekstrakurikuler',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'pembina', 'isActive', 'order'],
    group: 'Konten Website',
    description: 'Kelola data ekstrakurikuler sekolah',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    // ── Nama Ekskul ────────────────────────────────────
    {
      name: 'name',
      label: 'Nama Ekstrakurikuler',
      type: 'text',
      required: true,
    },
    // ── Ikon / Kategori ────────────────────────────────
    {
      name: 'category',
      label: 'Kategori',
      type: 'select',
      options: [
        { label: '⚽ Olahraga', value: 'olahraga' },
        { label: '🎨 Seni & Budaya', value: 'seni_budaya' },
        { label: '📚 Akademik', value: 'akademik' },
        { label: '🎖️ Kepemimpinan', value: 'kepemimpinan' },
        { label: '💻 Teknologi', value: 'teknologi' },
        { label: '🌿 Lingkungan', value: 'lingkungan' },
        { label: '🎵 Musik', value: 'musik' },
        { label: '📿 Keagamaan', value: 'keagamaan' },
        { label: '🔧 Keterampilan', value: 'keterampilan' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    // ── Logo / Foto Cover ──────────────────────────────
    {
      name: 'coverImage',
      label: 'Foto Cover',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Foto utama atau logo ekstrakurikuler. Ideal: 800x600px',
      },
    },
    // ── Pembina ────────────────────────────────────────
    {
      name: 'pembina',
      label: 'Nama Pembina',
      type: 'text',
      required: true,
      admin: {
        description: 'Nama lengkap guru pembina',
      },
    },
    {
      name: 'pembinaNIP',
      label: 'NIP Pembina',
      type: 'text',
      admin: {
        description: 'NIP pembina (opsional)',
      },
    },
    // ── Jadwal ─────────────────────────────────────────
    {
      name: 'schedule',
      label: 'Jadwal Latihan',
      type: 'group',
      fields: [
        {
          name: 'hari',
          label: 'Hari',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Senin', value: 'senin' },
            { label: 'Selasa', value: 'selasa' },
            { label: 'Rabu', value: 'rabu' },
            { label: 'Kamis', value: 'kamis' },
            { label: 'Jumat', value: 'jumat' },
            { label: 'Sabtu', value: 'sabtu' },
          ],
        },
        {
          name: 'waktu',
          label: 'Waktu',
          type: 'text',
          admin: {
            description: 'Contoh: 14.00 – 16.00 WIB',
          },
        },
        {
          name: 'tempat',
          label: 'Tempat',
          type: 'text',
          admin: {
            description: 'Contoh: Lapangan Basket, Aula, Lab Komputer',
          },
        },
      ],
    },
    // ── Deskripsi / Profil ─────────────────────────────
    {
      name: 'description',
      label: 'Profil & Deskripsi',
      type: 'richText',
      admin: {
        description: 'Deskripsi lengkap ekskul, sejarah, tujuan, dll.',
      },
    },
    // ── Prestasi ───────────────────────────────────────
    {
      name: 'achievements',
      label: 'Prestasi',
      type: 'array',
      labels: {
        singular: 'Prestasi',
        plural: 'Daftar Prestasi',
      },
      admin: {
        description: 'Prestasi yang pernah diraih ekskul ini',
      },
      fields: [
        {
          name: 'title',
          label: 'Nama Prestasi',
          type: 'text',
          required: true,
        },
        {
          name: 'year',
          label: 'Tahun',
          type: 'text',
        },
        {
          name: 'level',
          label: 'Tingkat',
          type: 'select',
          options: [
            { label: 'Sekolah', value: 'sekolah' },
            { label: 'Kecamatan', value: 'kecamatan' },
            { label: 'Kota/Kabupaten', value: 'kota' },
            { label: 'Provinsi', value: 'provinsi' },
            { label: 'Nasional', value: 'nasional' },
            { label: 'Internasional', value: 'internasional' },
          ],
        },
      ],
    },
    // ── Galeri Foto ────────────────────────────────────
    {
      name: 'gallery',
      label: 'Galeri Foto',
      type: 'array',
      labels: {
        singular: 'Foto',
        plural: 'Foto Galeri',
      },
      fields: [
        {
          name: 'image',
          label: 'Foto',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          label: 'Keterangan',
          type: 'text',
        },
      ],
    },
    // ── Status & Urutan ────────────────────────────────
    {
      name: 'isActive',
      label: 'Aktif',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck untuk menyembunyikan dari website',
      },
    },
    {
      name: 'order',
      label: 'Urutan Tampil',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}