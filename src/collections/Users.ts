import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // Aktifkan autentikasi

  admin: {
    useAsTitle: 'name',
    group: 'Sistem',
  },

  // Hanya admin yang bisa kelola akun user
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nama Lengkap',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role / Jabatan',
      required: true,
      defaultValue: 'editor',
      options: [
        {
          label: 'Admin (Akses Penuh)',
          value: 'admin',
        },
        {
          label: 'Editor (Tambah & Edit Konten)',
          value: 'editor',
        },
      ],
      // Hanya admin yang bisa ubah role
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}