// src/utils/elkpd.ts
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function generateToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let token = ''
  for (let i = 0; i < 8; i++) token += chars[Math.floor(Math.random() * chars.length)]
  return token
}

export function hitungSkorOtomatis(soalList: any[], jawabanSiswa: Record<string, any>): number {
  let total = 0
  soalList.forEach((soal) => {
    if (soal.tipe === 'uraian') return
    const jawaban = jawabanSiswa[soal.id]
    if (jawaban === undefined || jawaban === null) return
    const skor = soal.skor || 10
    switch (soal.tipe) {
      case 'pilgan':
      case 'benar_salah':
        if (String(jawaban).trim().toLowerCase() === String(soal.kunci).trim().toLowerCase()) total += skor
        break
      case 'menjodohkan': {
        let benar = 0
        const total2 = soal.pasangan?.length || 0
        soal.pasangan?.forEach((p: any) => {
          const val = jawaban[p.kiri_id] ?? jawaban[p.kiri]
          if (val === undefined) return
          if (String(val).trim().toLowerCase() === String(p.kanan_id ?? p.kanan).trim().toLowerCase()) benar++
        })
        if (total2 > 0) total += Math.round((benar / total2) * skor)
        break
      }
      case 'tts': {
        let benar = 0
        const total2 = soal.kotak?.length || 0
        soal.kotak?.forEach((k: any) => {
          const val = jawaban[k.id] ?? jawaban[k.petunjuk]
          if (val === undefined) return
          if (String(val).trim().toLowerCase() === String(k.jawaban).trim().toLowerCase()) benar++
        })
        if (total2 > 0) total += Math.round((benar / total2) * skor)
        break
      }
      case 'drag_drop': {
        let benar = 0
        const total2 = soal.slot?.length || 0
        soal.slot?.forEach((s: any) => {
          const val = jawaban[s.id]
          if (val !== undefined && String(val).trim() === String(s.jawaban_item_id).trim()) benar++
        })
        if (total2 > 0) total += Math.round((benar / total2) * skor)
        break
      }
    }
  })
  return total
}

export function buildMateriPrompt(f: any): string {
  return `Kamu adalah guru ${f.mapel} jenjang ${f.jenjang} kelas ${f.kelas}.
Buat ringkasan materi pembelajaran dengan ketentuan:
- Topik: ${f.topik}
- Gaya: ${f.gaya === 'ringkas' ? 'padat dan to the point' : f.gaya === 'detail' ? 'lengkap dengan penjelasan dan contoh' : 'narasi santai dan mudah dipahami siswa'}
- Bahasa Indonesia yang baik dan sesuai usia siswa
${f.keterangan ? `- Catatan dari guru: ${f.keterangan}` : ''}
${f.sertakanVideo ? `- Di AKHIR teks, tambahkan baris khusus persis seperti ini:\nVIDEO_URL: [tulis URL YouTube bahasa Indonesia yang paling relevan dengan topik ini, pastikan benar-benar ada]` : ''}

Format output: teks materi langsung tanpa heading/markdown berlebihan. Maksimal 400 kata.`
}

export function buildSoalPrompt(f: any): string {
  const TIPE_LABEL: Record<string, string> = {
    pilgan: 'Pilihan Ganda', benar_salah: 'Benar/Salah',
    menjodohkan: 'Menjodohkan', uraian: 'Uraian', drag_drop: 'Drag & Drop', tts: 'Isian Singkat',
  }
  const tipeLabel = f.tipeSoal.map((t: string) => TIPE_LABEL[t] || t).join(', ')
  return `Kamu adalah guru ${f.mapel} jenjang ${f.jenjang} kelas ${f.kelas}.
Buat ${f.jumlahSoal} soal LKPD tentang: ${f.topik}
Tipe soal yang dipakai: ${tipeLabel}
Level kesulitan: ${f.levelKesulitan}
${f.keterangan ? `Catatan: ${f.keterangan}` : ''}

WAJIB output JSON array valid, tanpa markdown, tanpa komentar. Setiap soal sesuai struktur ini:
Pilihan ganda: {"id":"<uid>","tipe":"pilgan","skor":10,"pertanyaan":"...","pilihan":[{"id":"a","teks":"..."},{"id":"b","teks":"..."},{"id":"c","teks":"..."},{"id":"d","teks":"..."}],"kunci":"a"}
Benar/Salah: {"id":"<uid>","tipe":"benar_salah","skor":10,"pertanyaan":"...","kunci":"benar"}
Menjodohkan: {"id":"<uid>","tipe":"menjodohkan","skor":10,"pertanyaan":"...","pasangan":[{"kiri_id":"<uid>","kiri":"...","kanan_id":"<uid>","kanan":"..."}]}
Isian singkat: {"id":"<uid>","tipe":"tts","skor":10,"pertanyaan":"...","kotak":[{"id":"<uid>","petunjuk":"...","jawaban":"..."}]}
Drag & Drop: {"id":"<uid>","tipe":"drag_drop","skor":10,"pertanyaan":"...","item":[{"id":"<uid>","teks":"..."}],"slot":[{"id":"<uid>","label":"...","jawaban_item_id":"<id item yang benar>"}]}
Uraian: {"id":"<uid>","tipe":"uraian","skor":20,"pertanyaan":"..."}

Ganti <uid> dengan string acak 9 karakter huruf+angka.
Distribusikan tipe soal secara merata dari daftar: ${f.tipeSoal.join(',')}.
Output HANYA array JSON, mulai dari [ dan akhiri dengan ].`
}

export function parseMateriResult(text: string, sertakanVideo: boolean) {
  let isiMateri = text.trim()
  let youtubeUrl = ''
  if (sertakanVideo) {
    const match = text.match(/VIDEO_URL:\s*(https?:\/\/[^\s\n]+)/i)
    if (match) {
      youtubeUrl = match[1].trim()
      isiMateri = text.replace(/VIDEO_URL:\s*https?:\/\/[^\s\n]+/i, '').trim()
    }
  }
  return { isiMateri, youtubeUrl }
}

export function parseSoalResult(text: string) {
  const cleaned = text.replace(/```json|```/gi, '').trim()
  const match = cleaned.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('Format soal dari AI tidak valid.')
  const arr = JSON.parse(match[0])
  if (!Array.isArray(arr)) throw new Error('AI tidak mengembalikan array soal.')
  return arr.map((s: any) => ({ ...s, id: s.id || generateId() }))
}

export function createSoalBaru(tipe: string) {
  const base = { id: generateId(), tipe, skor: 10, pertanyaan: '' }
  switch (tipe) {
    case 'pilgan': return { ...base, pilihan: [
      { id: 'a', teks: '' }, { id: 'b', teks: '' },
      { id: 'c', teks: '' }, { id: 'd', teks: '' },
    ], kunci: 'a' }
    case 'benar_salah': return { ...base, kunci: 'benar' }
    case 'menjodohkan': return { ...base, pasangan: [
      { kiri_id: generateId(), kiri: '', kanan_id: generateId(), kanan: '' },
      { kiri_id: generateId(), kiri: '', kanan_id: generateId(), kanan: '' },
    ]}
    case 'tts': return { ...base, kotak: [
      { id: generateId(), petunjuk: '', jawaban: '' },
      { id: generateId(), petunjuk: '', jawaban: '' },
    ]}
    case 'drag_drop': return { ...base,
      item: [{ id: generateId(), teks: '' }, { id: generateId(), teks: '' }],
      slot: [
        { id: generateId(), label: '', jawaban_item_id: '' },
        { id: generateId(), label: '', jawaban_item_id: '' },
      ],
    }
    default: return base
  }
}
