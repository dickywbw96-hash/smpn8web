import type { CollectionConfig } from 'payload'

export const SliderDashboard: CollectionConfig = {
  slug: 'slider-dashboard',
  labels: {
    singular: 'Slider',
    plural: 'Slider Dashboard',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'isActive', 'order', 'updatedAt'],
    group: 'Konten Website',
    description: 'Kelola foto slider di halaman utama (bergeser tiap 5 detik)',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    // ── Judul ──────────────────────────────────────────
    {
      name: 'title',
      label: 'Judul Slide',
      type: 'text',
      required: true,
      admin: {
        description: 'Judul yang tampil di atas foto slider',
      },
    },
    // ── Deskripsi Singkat ──────────────────────────────
    {
      name: 'description',
      label: 'Deskripsi Singkat',
      type: 'textarea',
      maxLength: 150,
      admin: {
        description: 'Deskripsi singkat yang tampil di bawah judul. Maks 150 karakter.',
        rows: 2,
      },
    },
    // ── Foto ───────────────────────────────────────────
    {
      name: 'image',
      label: 'Foto Slider',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Ukuran ideal: 1920x700px (landscape). Format: JPG/WebP',
      },
    },
    // ── Link (opsional) ────────────────────────────────
    {
      name: 'linkTo',
      label: 'Link Tuju (Opsional)',
      type: 'group',
      admin: {
        description: 'Jika diisi, slide bisa diklik dan mengarah ke halaman berita',
      },
      fields: [
        {
          name: 'type',
          label: 'Jenis Link',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'Tidak Ada', value: 'none' },
            { label: 'Ke Berita', value: 'post' },
            { label: 'URL Kustom', value: 'custom' },
          ],
        },
        {
          name: 'post',
          label: 'Pilih Berita',
          type: 'relationship',
          relationTo: 'posts',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'post',
          },
        },
        {
          name: 'url',
          label: 'URL Kustom',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'custom',
            description: 'Contoh: /berita/kegiatan-class-meeting',
          },
        },
      ],
    },
    // ── Urutan ─────────────────────────────────────────
    {
      name: 'order',
      label: 'Urutan Tampil',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Angka kecil tampil lebih dulu. 0 = pertama.',
      },
    },
    // ── Status ─────────────────────────────────────────
    {
      name: 'isActive',
      label: 'Aktifkan Slide',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck untuk menyembunyikan slide tanpa menghapus',
      },
    },
    // ── Periode Tampil ─────────────────────────────────
    {
      name: 'schedule',
      label: 'Jadwal Tampil',
      type: 'group',
      admin: {
        position: 'sidebar',
        description: 'Opsional: atur kapan slide mulai/selesai ditampilkan',
      },
      fields: [
        {
          name: 'startDate',
          label: 'Mulai Tampil',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'dayOnly' },
          },
        },
        {
          name: 'endDate',
          label: 'Selesai Tampil',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'dayOnly' },
          },
        },
      ],
    },
  ],
  timestamps: true,
}