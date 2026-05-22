import type { CollectionConfig } from 'payload'

const DeleteRequests: CollectionConfig = {
  slug: 'delete-requests',
  labels: {
    singular: 'Permintaan Hapus',
    plural: 'Permintaan Hapus',
  },
  admin: {
    useAsTitle: 'docTitle',
    group: 'Sistem',
    description: 'Permintaan hapus artikel dari editor — hanya admin yang bisa menyetujui.',
    // Hanya admin yang bisa lihat collection ini
    hidden: ({ user }) => user?.role === 'editor',
  },
  access: {
    // Hanya admin yang bisa baca, update, delete
    read:   ({ req }) => req.user?.role === 'admin',
    create: () => true, // Editor POST via API
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'docTitle',
      label: 'Judul Dokumen',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'collectionSlug',
      label: 'Koleksi',
      type: 'select',
      required: true,
      admin: { readOnly: true },
      options: [
        { label: 'Berita / Artikel', value: 'posts' },
        { label: 'Slider Dashboard', value: 'slider-dashboard' },
        { label: 'Ekstrakurikuler', value: 'ekstrakurikuler' },
        { label: 'PPID', value: 'ppid' },
      ],
    },
    {
      name: 'docId',
      label: 'ID Dokumen',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: '⏳ Menunggu Persetujuan', value: 'pending' },
        { label: '✅ Disetujui (sudah dihapus)', value: 'approved' },
        { label: '❌ Ditolak', value: 'rejected' },
      ],
      admin: {
        // Admin bisa ubah status ini untuk approve/reject
        description: 'Ubah ke "Disetujui" untuk menghapus dokumen asli, atau "Ditolak" untuk menolak permintaan.',
      },
    },
    {
      name: 'requestedAt',
      label: 'Waktu Permintaan',
      type: 'date',
      admin: {
        readOnly: true,
        date: { displayFormat: 'dd/MM/yyyy HH:mm' },
      },
    },
    {
      name: 'notes',
      label: 'Catatan Admin',
      type: 'textarea',
      admin: {
        description: 'Catatan internal admin (tidak dilihat editor)',
        placeholder: 'Alasan ditolak atau catatan lainnya...',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          data.requestedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Jika status berubah jadi approved → hapus dokumen asli
        if (operation === 'update' && doc.status === 'approved') {
          try {
            await req.payload.delete({
              collection: doc.collectionSlug,
              id: doc.docId,
            })
          } catch (err) {
            console.error('[DeleteRequests hook] Gagal hapus dokumen asli:', err)
          }
        }
      },
    ],
  },
  timestamps: true,
}

export default DeleteRequests
