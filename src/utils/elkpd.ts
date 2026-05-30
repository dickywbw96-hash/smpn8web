// src/utils/elkpd.ts

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
        if (jawaban === soal.kunci) total += skor
        break
      case 'benar_salah':
        if (String(jawaban) === String(soal.kunci)) total += skor
        break
      case 'menjodohkan': {
        let benar = 0
        const totalItem = soal.pasangan?.length || 0
        soal.pasangan?.forEach((p: any) => { if (jawaban[p.kiri_id] === p.kanan_id) benar++ })
        if (totalItem > 0) total += Math.round((benar / totalItem) * skor)
        break
      }
      case 'tts': {
        let benar = 0
        const totalKotak = soal.kotak?.length || 0
        soal.kotak?.forEach((k: any) => {
          if (String(jawaban[k.id] || '').trim().toLowerCase() === String(k.jawaban).trim().toLowerCase()) benar++
        })
        if (totalKotak > 0) total += Math.round((benar / totalKotak) * skor)
        break
      }
      case 'drag_drop': {
        let benar = 0
        const totalSlot = soal.slot?.length || 0
        soal.slot?.forEach((s: any) => { if (jawaban[s.id] === s.jawaban_item_id) benar++ })
        if (totalSlot > 0) total += Math.round((benar / totalSlot) * skor)
        break
      }
    }
  })
  return total
}
