import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Slug di-cast as any karena DeleteRequests collection mungkin belum
// ter-generate di payload-types.ts. Setelah `npm run dev` pertama
// dan types ter-generate ulang, as any bisa dihapus.
const SLUG = 'delete-requests' as any

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const requests = await payload.find({
      collection: SLUG,
      sort: '-createdAt',
      depth: 1,
    })

    return NextResponse.json(requests)
  } catch (err) {
    console.error('[delete-requests GET]', err)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { docId, collectionSlug, docTitle } = body

    if (!docId || !collectionSlug) {
      return NextResponse.json(
        { error: 'docId dan collectionSlug wajib diisi' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    const saved = await payload.create({
      collection: SLUG,
      data: {
        docId,
        collectionSlug,
        docTitle: docTitle || docId,
        // status field tidak pakai Payload status system,
        // tapi field biasa — jadi tidak perlu 'draft'|'published'
      },
    })

    return NextResponse.json({ success: true, id: saved.id }, { status: 201 })
  } catch (err) {
    console.error('[delete-requests POST]', err)
    return NextResponse.json({ error: 'Gagal menyimpan permintaan' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, action } = body

    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'id dan action (approve/reject) wajib diisi' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    if (action === 'approve') {
      // Ambil data permintaan hapus
      const request = await payload.findByID({
        collection: SLUG,
        id,
      }) as any

      // Hapus dokumen asli di collection terkait
      await payload.delete({
        collection: request.collectionSlug as any,
        id: request.docId,
      })

      // Tandai permintaan sebagai approved
      await payload.update({
        collection: SLUG,
        id,
        data: { status: 'approved' },
      })

      return NextResponse.json({ success: true, message: 'Dokumen berhasil dihapus' })
    } else {
      // Reject — hanya update status
      await payload.update({
        collection: SLUG,
        id,
        data: { status: 'rejected' },
      })

      return NextResponse.json({ success: true, message: 'Permintaan ditolak' })
    }
  } catch (err) {
    console.error('[delete-requests PATCH]', err)
    return NextResponse.json({ error: 'Gagal memproses permintaan' }, { status: 500 })
  }
}