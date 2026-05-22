import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Berita',
    plural: 'Berita',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt', 'updatedAt'],
    group: 'Konten Website',
    description: 'Kelola berita dan informasi sekolah',
    },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'editor'
    },
    update: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'editor'
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // Auto-set publishedAt saat pertama kali publish
        if (operation === 'create' || (operation === 'update' && data.status === 'published')) {
          if (!data.publishedAt) {
            data.publishedAt = new Date().toISOString()
          }
        }
        // Auto-set author
        if (operation === 'create' && req.user) {
          data.author = req.user.id
        }
        return data
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000,
      },
    },
    maxPerDoc: 10,
  },
  fields: [
    // ── Judul ──────────────────────────────────────────
    {
      name: 'title',
      label: 'Judul Berita',
      type: 'text',
      required: true,
    },
    // ── Slug ──────────────────────────────────────────
    {
      name: 'slug',
      label: 'Slug URL',
      type: 'text',
      unique: true,
      admin: {
        description: 'Otomatis dibuat dari judul. Contoh: kegiatan-class-meeting-2024',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            // Auto-generate slug dari title jika belum ada
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
            }
            return value
          },
        ],
      },
    },
    // ── Status & Kategori (Sidebar) ────────────────────
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: '📝 Draft', value: 'draft' },
        { label: '✅ Published', value: 'published' },
        { label: '🗄️ Arsip', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      label: 'Kategori',
      type: 'select',
      required: true,
      options: [
        { label: '📰 Kegiatan Umum', value: 'kegiatan_umum' },
        { label: '🏆 Prestasi', value: 'prestasi' },
        { label: '🎯 Kegiatan Organisasi', value: 'kegiatan_organisasi' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      label: 'Tanggal Publish',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'author',
      label: 'Penulis',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    // ── Featured Image ─────────────────────────────────
    {
      name: 'featuredImage',
      label: 'Foto Utama',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Ukuran ideal: 1200x630px. Format: JPG/WebP',
      },
    },
    // ── Excerpt ────────────────────────────────────────
    {
      name: 'excerpt',
      label: 'Ringkasan Berita',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: {
        description: 'Ditampilkan di daftar berita. Maks 300 karakter.',
        rows: 3,
      },
    },
    // ── Konten Utama ───────────────────────────────────
    {
      name: 'content',
      label: 'Isi Berita',
      type: 'richText',
      required: true,
    },
    // ── Galeri Foto ────────────────────────────────────
    {
      name: 'gallery',
      label: 'Galeri Foto',
      type: 'array',
      labels: {
        singular: 'Foto',
        plural: 'Foto',
      },
      admin: {
        description: 'Tambahkan foto-foto pendukung berita',
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
          label: 'Keterangan Foto',
          type: 'text',
        },
      ],
    },
    // ── Tags ──────────────────────────────────────────
    {
      name: 'tags',
      label: 'Tags',
      type: 'array',
      admin: {
        description: 'Contoh: lomba, juara, nasional',
      },
      fields: [
        {
          name: 'tag',
          label: 'Tag',
          type: 'text',
        },
      ],
    },
    // ── Tampilkan di Dashboard Slider ─────────────────
    {
      name: 'showInSlider',
      label: 'Tampilkan di Slider Dashboard',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Centang agar berita ini muncul di slider homepage',
      },
    },
    // ── Delete Request (untuk editor) ─────────────────
    {
      name: 'deleteRequested',
      label: 'Permintaan Hapus',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Editor mengirim permintaan hapus ke admin',
        condition: (_, siblingData) => siblingData?.deleteRequested === true,
      },
    },
    {
      name: 'deleteRequestNote',
      label: 'Alasan Hapus',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.deleteRequested === true,
        rows: 2,
      },
    },
    // ── SEO ───────────────────────────────────────────
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      admin: {
        description: 'Pengaturan SEO untuk mesin pencari',
      },
      fields: [
        {
          name: 'metaTitle',
          label: 'Meta Title',
          type: 'text',
          maxLength: 60,
          admin: {
            description: 'Maks 60 karakter. Kosongkan untuk pakai judul berita.',
          },
        },
        {
          name: 'metaDescription',
          label: 'Meta Description',
          type: 'textarea',
          maxLength: 160,
          admin: {
            description: 'Maks 160 karakter. Kosongkan untuk pakai ringkasan.',
            rows: 2,
          },
        },
      ],
    },
  ],
  timestamps: true,
}