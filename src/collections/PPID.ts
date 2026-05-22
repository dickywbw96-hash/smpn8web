import type { CollectionConfig } from 'payload'

export const PPID: CollectionConfig = {
  slug: 'ppid',
  labels: {
    singular: 'Dokumen PPID',
    plural: 'PPID',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'documentDate', 'updatedAt'],
    group: 'Konten Website',
    description: 'Kelola dokumen dan informasi PPID (Pejabat Pengelola Informasi dan Dokumentasi)',
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
      label: 'Judul Dokumen / Artikel',
      type: 'text',
      required: true,
    },
    // ── Kategori ───────────────────────────────────────
    {
      name: 'category',
      label: 'Kategori PPID',
      type: 'select',
      required: true,
      options: [
        // Tentang PPID
        { label: '🏛️ Profil PPID', value: 'profil_ppid' },
        { label: '📄 SK (Surat Keputusan)', value: 'sk' },
        { label: '📋 Tugas dan Fungsi', value: 'tugas_fungsi' },
        { label: '📢 Maklumat Pelayanan Publik', value: 'maklumat' },
        { label: '🕐 Jam Layanan', value: 'jam_layanan' },
        // Lainnya
        { label: '🔄 Alur Permohonan Informasi', value: 'alur_permohonan' },
        { label: '🤝 MoU', value: 'mou' },
        { label: '📝 SOP PPID', value: 'sop' },
        { label: '📊 Daftar Informasi Publik', value: 'daftar_informasi' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    // ── Nomor Dokumen ──────────────────────────────────
    {
      name: 'documentNumber',
      label: 'Nomor Dokumen',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Contoh: 001/PPID/SMPN8/2024',
      },
    },
    // ── Tanggal Dokumen ────────────────────────────────
    {
      name: 'documentDate',
      label: 'Tanggal Dokumen',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    // ── Versi Dokumen ──────────────────────────────────
    {
      name: 'version',
      label: 'Versi',
      type: 'text',
      defaultValue: '1.0',
      admin: {
        position: 'sidebar',
        description: 'Contoh: 1.0, 2.1, Rev.3',
      },
    },
    // ── Isi Konten ─────────────────────────────────────
    {
      name: 'content',
      label: 'Isi Konten',
      type: 'richText',
      admin: {
        description: 'Konten artikel atau deskripsi dokumen',
      },
    },
    // ── File Lampiran ──────────────────────────────────
    {
      name: 'attachments',
      label: 'File Lampiran',
      type: 'array',
      labels: {
        singular: 'Lampiran',
        plural: 'Daftar Lampiran',
      },
      admin: {
        description: 'Upload file dokumen (PDF, Word, Excel, dll.)',
      },
      fields: [
        {
          name: 'file',
          label: 'File',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'fileLabel',
          label: 'Label File',
          type: 'text',
          admin: {
            description: 'Nama tampil tombol download. Contoh: "Download SK PPID 2024"',
          },
        },
        {
          name: 'fileDescription',
          label: 'Keterangan File',
          type: 'text',
        },
      ],
    },
    // ── Foto / Gambar Pendukung ────────────────────────
    {
      name: 'images',
      label: 'Foto Pendukung',
      type: 'array',
      labels: {
        singular: 'Foto',
        plural: 'Foto',
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
    // ── Download Tracker ───────────────────────────────
    {
      name: 'downloadCount',
      label: 'Jumlah Download',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Otomatis bertambah setiap file didownload',
      },
    },
    // ── Visibilitas ────────────────────────────────────
    {
      name: 'isPublished',
      label: 'Publikasikan',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck untuk menyembunyikan dari publik',
      },
    },
    // ── Urutan ─────────────────────────────────────────
    {
      name: 'order',
      label: 'Urutan Tampil',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Angka kecil tampil lebih dulu dalam kategorinya',
      },
    },
    // ── Audit Log ─────────────────────────────────────
    {
      name: 'lastEditedBy',
      label: 'Terakhir Diedit Oleh',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (req.user) {
          data.lastEditedBy = req.user.id
        }
        return data
      },
    ],
  },
  timestamps: true,
}