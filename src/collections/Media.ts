import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true, // Aktifkan fitur upload

  admin: {
    group: 'Konten',
  },

  // Siapa yang bisa akses media
  access: {
    read: () => true, // Semua orang bisa lihat foto
    create: ({ req: { user } }) => !!user, // Harus login untuk upload
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Deskripsi Foto (Alt Text)',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Keterangan Foto',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kategori',
      options: [
        { label: 'Kegiatan Sekolah', value: 'kegiatan' },
        { label: 'Prestasi', value: 'prestasi' },
        { label: 'Profil Sekolah', value: 'profil' },
        { label: 'Ekstrakurikuler', value: 'ekskul' },
        { label: 'PPID', value: 'ppid' },
        { label: 'Lainnya', value: 'lainnya' },
      ],
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      label: 'Diupload oleh',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
    },
  ],

  // Simpan info siapa yang upload
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user) {
          data.uploadedBy = req.user.id
        }
        return data
      },
    ],
  },
}