// utils/downloadLKPD.js
// @ts-ignore
import { jsPDF } from 'jspdf'

const MARGIN = 15
const PAGE_W = 210
const CONTENT_W = PAGE_W - MARGIN * 2
const PRIMARY = [30, 58, 138]    // biru tua
const ACCENT  = [234, 179, 8]    // kuning
const GRAY    = [100, 100, 100]
const BLACK   = [20, 20, 20]

// ─── Helper: wrap text & return lines ───────────────────────
function splitLines(doc, text, maxWidth) {
  return doc.splitTextToSize(String(text || ''), maxWidth)
}

// ─── Helper: cek & tambah halaman baru ──────────────────────
function checkPage(doc, y, needed = 10) {
  if (y + needed > 280) {
    doc.addPage()
    return MARGIN
  }
  return y
}

// ─── Helper: gambar kotak kosong ────────────────────────────
function drawBox(doc, x, y, w, h) {
  doc.setDrawColor(150, 150, 150)
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(x, y, w, h, 1, 1, 'FD')
}

// ─── Helper: garis jawaban ────────────────────────────────
function drawLines(doc, x, y, w, count = 3) {
  doc.setDrawColor(180, 180, 180)
  doc.setLineWidth(0.3)
  for (let i = 0; i < count; i++) {
    doc.line(x, y + i * 7, x + w, y + i * 7)
  }
  return y + count * 7
}

// ─── Load logo as base64 ────────────────────────────────────
async function loadLogo() {
  try {
    const res = await fetch('/logo.png')
    const blob = await res.blob()
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

// ═══════════════════════════════════════════════════════════
//  MAIN EXPORT
// ═══════════════════════════════════════════════════════════
export async function downloadLKPDPdf({ judul, guru, token, isiMateri, youtubeUrl, soalList }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const logoData = await loadLogo()

  // ══════════════════════════════
  //  HALAMAN 1 — COVER
  // ══════════════════════════════
  // Header biru
  doc.setFillColor(...PRIMARY)
  doc.rect(0, 0, PAGE_W, 55, 'F')

  // Logo
  if (logoData) {
    doc.addImage(logoData, 'PNG', MARGIN, 8, 20, 20)
  }

  // Nama sekolah
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('SMP NEGERI 8 PROBOLINGGO', logoData ? MARGIN + 24 : MARGIN, 16)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('Lembar Kerja Peserta Didik (LKPD)', logoData ? MARGIN + 24 : MARGIN, 22)
  doc.text('Platform Pembelajaran Jarak Jauh', logoData ? MARGIN + 24 : MARGIN, 27)

  // TOKEN badge
  doc.setFillColor(...ACCENT)
  doc.roundedRect(PAGE_W - MARGIN - 38, 8, 38, 22, 3, 3, 'F')
  doc.setTextColor(30, 30, 30)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.text('TOKEN KEGIATAN', PAGE_W - MARGIN - 19, 15, { align: 'center' })
  doc.setFontSize(16)
  doc.text(token, PAGE_W - MARGIN - 19, 25, { align: 'center' })

  // Sub-header abu
  doc.setFillColor(240, 244, 255)
  doc.rect(0, 55, PAGE_W, 18, 'F')
  doc.setTextColor(...PRIMARY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(`Mata Pelajaran : ${guru.mapel || '-'}`, MARGIN, 63)
  doc.text(`Guru Pengampu  : ${guru.nama || '-'}`, MARGIN, 69)

  // Garis bawah sub-header
  doc.setDrawColor(...PRIMARY)
  doc.setLineWidth(0.5)
  doc.line(0, 73, PAGE_W, 73)

  // Judul kegiatan
  doc.setTextColor(...BLACK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  const judulLines = splitLines(doc, judul || 'Tanpa Judul', CONTENT_W)
  let y = 88
  judulLines.forEach(l => {
    doc.text(l, PAGE_W / 2, y, { align: 'center' })
    y += 8
  })

  // Dekorasi strip bawah judul
  doc.setFillColor(...ACCENT)
  doc.rect(PAGE_W / 2 - 18, y, 36, 1.5, 'F')
  y += 10

  // Kotak identitas siswa
  doc.setDrawColor(...PRIMARY)
  doc.setLineWidth(0.4)
  doc.roundedRect(MARGIN, y, CONTENT_W, 50, 3, 3, 'D')

  doc.setFillColor(...PRIMARY)
  doc.roundedRect(MARGIN, y, CONTENT_W, 8, 3, 3, 'F')
  doc.rect(MARGIN, y + 4, CONTENT_W, 4, 'F') // ratakan sudut bawah
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('IDENTITAS SISWA', PAGE_W / 2, y + 5.5, { align: 'center' })

  doc.setTextColor(...BLACK)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const iy = y + 14
  const fields = ['Nama Lengkap', 'Kelas / Absen', 'Tanggal']
  fields.forEach((f, i) => {
    doc.text(`${f}  :`, MARGIN + 4, iy + i * 12)
    doc.setDrawColor(150, 150, 150)
    doc.line(MARGIN + 36, iy + i * 12, MARGIN + CONTENT_W - 4, iy + i * 12)
  })

  // Footer cover
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(7)
  doc.text('Dibuat dengan LMAN SMPN8 • created by dhickz666', PAGE_W / 2, 290, { align: 'center' })

  // ══════════════════════════════
  //  HALAMAN 2 — MATERI
  // ══════════════════════════════
  if (isiMateri && isiMateri.trim()) {
    doc.addPage()
    y = MARGIN

    // Header section
    doc.setFillColor(...PRIMARY)
    doc.rect(0, 0, PAGE_W, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('📖  MATERI PEMBELAJARAN', MARGIN, 8)
    doc.setFontSize(7)
    doc.text(judul, PAGE_W - MARGIN, 8, { align: 'right' })

    y = 20

    // 1. SET FONT DAN WARNA DULU SEBELUM SPLIT TEXT!
    doc.setTextColor(...BLACK)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    // 2. BARU LAKUKAN SPLIT TEXT (sekarang jsPDF akan menghitung dengan font size 10)
    const materiLines = splitLines(doc, isiMateri, CONTENT_W - 8)
    
    // 3. GAMBAR KOTAK BACKGROUND
    doc.setFillColor(248, 250, 255)
    doc.setDrawColor(...PRIMARY)
    doc.setLineWidth(0.3)
    const boxH = Math.min(materiLines.length * 5.5 + 10, 240)
    doc.roundedRect(MARGIN, y, CONTENT_W, boxH, 2, 2, 'FD')

    // 4. PRINT TEKSNYA
    let ty = y + 7
    for (const line of materiLines) {
      ty = checkPage(doc, ty, 6)
      if (ty === MARGIN) {
        // halaman baru: ulang header kecil
        doc.setFillColor(...PRIMARY)
        doc.rect(0, 0, PAGE_W, 12, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('📖  MATERI (lanjutan)', MARGIN, 8)
        
        // Kotak background untuk halaman lanjutan (opsional agar tetap rapi)
        doc.setFillColor(248, 250, 255)
        doc.setDrawColor(...PRIMARY)
        doc.roundedRect(MARGIN, 20, CONTENT_W, 260 - MARGIN, 2, 2, 'FD') // Kotak baru

        ty = 26
        
        // Kembalikan ke font teks materi
        doc.setTextColor(...BLACK)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
      }
      doc.text(line, MARGIN + 4, ty)
      ty += 5.5
    }
    y = ty + 6

    // Link YouTube (biarkan seperti aslinya)
    if (youtubeUrl) {
      y = checkPage(doc, y, 14)
      doc.setFillColor(254, 226, 226)
      doc.setDrawColor(220, 38, 38)
      doc.roundedRect(MARGIN, y, CONTENT_W, 12, 2, 2, 'FD')
      doc.setTextColor(180, 20, 20)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.text('▶  Video Pembelajaran:', MARGIN + 3, y + 5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(30, 100, 200)
      doc.text(youtubeUrl, MARGIN + 3, y + 10)
      y += 16
    }

    // Footer
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(7)
    doc.text('Dibuat dengan LMAN SMPN8 • created by dhickz666', PAGE_W / 2, 290, { align: 'center' })
  }

  // ══════════════════════════════
  //  HALAMAN SOAL LKPD
  // ══════════════════════════════
  if (soalList && soalList.length > 0) {
    doc.addPage()
    y = MARGIN

    // Header section
    doc.setFillColor(22, 101, 52)  // hijau tua
    doc.rect(0, 0, PAGE_W, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('📝  LEMBAR KERJA PESERTA DIDIK (LKPD)', MARGIN, 8)
    doc.setFontSize(7)
    doc.text(`${soalList.length} soal`, PAGE_W - MARGIN, 8, { align: 'right' })

    y = 20

    // Instruksi
    doc.setFillColor(240, 253, 244)
    doc.setDrawColor(22, 163, 74)
    doc.roundedRect(MARGIN, y, CONTENT_W, 10, 2, 2, 'FD')
    doc.setTextColor(22, 101, 52)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.text('Kerjakan soal-soal berikut dengan teliti dan jujur!', MARGIN + 3, y + 6.5)
    y += 16

    // ── Render tiap soal ──
    for (let i = 0; i < soalList.length; i++) {
      const soal = soalList[i]
      y = checkPage(doc, y, 20)

      // Nomor soal
      doc.setFillColor(...PRIMARY)
      doc.circle(MARGIN + 3.5, y + 1, 3.5, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.text(String(i + 1), MARGIN + 3.5, y + 1.8, { align: 'center' })

      // Tipe badge
      const tipeLabel = { pilgan:'Pilihan Ganda', benar_salah:'Benar/Salah', menjodohkan:'Menjodohkan', drag_drop:'Drag & Drop', uraian:'Uraian' }[soal.tipe] || soal.tipe
      doc.setFillColor(238, 242, 255)
      doc.setDrawColor(...PRIMARY)
      doc.setLineWidth(0.2)
      const badgeW = doc.getTextWidth(tipeLabel) + 4
      doc.roundedRect(MARGIN + 9, y - 2, badgeW, 5.5, 1, 1, 'FD')
      doc.setTextColor(...PRIMARY)
      doc.setFontSize(6.5)
      doc.text(tipeLabel, MARGIN + 11, y + 1.8)

      // Skor
      doc.setTextColor(...GRAY)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.text(`[${soal.skor} poin]`, PAGE_W - MARGIN, y + 1.8, { align: 'right' })

      y += 7

      // Teks pertanyaan
      doc.setTextColor(...BLACK)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      const qLines = splitLines(doc, soal.pertanyaan || '(Pertanyaan belum diisi)', CONTENT_W - 8)
      qLines.forEach(l => {
        y = checkPage(doc, y, 6)
        doc.text(l, MARGIN + 2, y)
        y += 5.5
      })
      y += 3

      // ── Jawaban per tipe ──

      // PILGAN
      if (soal.tipe === 'pilgan') {
        const opts = soal.pilihan || []
        opts.forEach((p, pi) => {
          y = checkPage(doc, y, 8)
          // Lingkaran untuk dilingkari
          doc.setDrawColor(...PRIMARY)
          doc.setLineWidth(0.3)
          doc.circle(MARGIN + 5, y + 0.5, 2.5, 'D')
          doc.setTextColor(...PRIMARY)
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(8)
          doc.text(String.fromCharCode(65 + pi), MARGIN + 5, y + 1, { align: 'center' })
          doc.setTextColor(...BLACK)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          const pLines = splitLines(doc, p.teks || '...', CONTENT_W - 14)
          pLines.forEach((l, li) => {
            doc.text(l, MARGIN + 10, y + li * 5)
          })
          y += Math.max(pLines.length * 5, 7)
        })
        doc.setTextColor(...GRAY)
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(7)
        doc.text('*Lingkari huruf jawaban yang benar', MARGIN + 2, y + 1)
        y += 6
      }

      // BENAR / SALAH
      else if (soal.tipe === 'benar_salah') {
        y = checkPage(doc, y, 12)
        const bw = 38
        // Benar box
        doc.setFillColor(240, 253, 244)
        doc.setDrawColor(22, 163, 74)
        doc.roundedRect(MARGIN + 2, y, bw, 10, 2, 2, 'FD')
        doc.setTextColor(22, 101, 52)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.text('✓  BENAR', MARGIN + 2 + bw / 2, y + 6.5, { align: 'center' })
        // Salah box
        doc.setFillColor(255, 241, 242)
        doc.setDrawColor(220, 38, 38)
        doc.roundedRect(MARGIN + 2 + bw + 4, y, bw, 10, 2, 2, 'FD')
        doc.setTextColor(180, 20, 20)
        doc.text('✗  SALAH', MARGIN + 2 + bw + 4 + bw / 2, y + 6.5, { align: 'center' })
        y += 14
      }

      // MENJODOHKAN
      else if (soal.tipe === 'menjodohkan') {
        const pairs = soal.pasangan || []
        y = checkPage(doc, y, pairs.length * 10 + 8)
        const colW = (CONTENT_W - 8) / 2

        // Header tabel
        doc.setFillColor(...PRIMARY)
        doc.rect(MARGIN + 2, y, colW, 7, 'F')
        doc.rect(MARGIN + 2 + colW + 4, y, colW, 7, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.text('Kolom A', MARGIN + 2 + colW / 2, y + 4.8, { align: 'center' })
        doc.text('Kolom B (jawaban)', MARGIN + 2 + colW + 4 + colW / 2, y + 4.8, { align: 'center' })
        y += 7

        pairs.forEach((p, pi) => {
          y = checkPage(doc, y, 9)
          const bg = pi % 2 === 0 ? [248, 250, 255] : [255, 255, 255]
          doc.setFillColor(...bg)
          doc.rect(MARGIN + 2, y, colW, 9, 'F')
          doc.rect(MARGIN + 2 + colW + 4, y, colW, 9, 'F')
          doc.setDrawColor(200, 210, 230)
          doc.rect(MARGIN + 2, y, colW, 9, 'D')
          doc.rect(MARGIN + 2 + colW + 4, y, colW, 9, 'D')
          doc.setTextColor(...BLACK)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          doc.text(`${pi + 1}. ${p.kiri || ''}`, MARGIN + 4, y + 6)
          // Kolom kanan kosong — siswa menulis
          y += 9
        })
        doc.setTextColor(...GRAY)
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(7)
        doc.text('*Tulis pasangan yang tepat di Kolom B', MARGIN + 2, y + 2)
        y += 7
      }

      // DRAG & DROP
      else if (soal.tipe === 'drag_drop') {
        const items = soal.item || []
        const slots = soal.slot || []
        y = checkPage(doc, y, 14)

        // Tampilkan item pilihan
        doc.setFillColor(255, 251, 235)
        doc.setDrawColor(...ACCENT)
        doc.setLineWidth(0.3)
        const itemBox = CONTENT_W
        doc.roundedRect(MARGIN + 2, y, itemBox, 10, 2, 2, 'FD')
        doc.setTextColor(92, 70, 0)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7.5)
        const itemStr = items.map((it, ii) => `${ii + 1}) ${it.teks}`).join('   ')
        doc.text('Pilihan: ' + itemStr, MARGIN + 4, y + 6.5)
        y += 14

        // Slot jawaban (kotak kosong)
        slots.forEach((sl, si) => {
          y = checkPage(doc, y, 10)
          doc.setTextColor(...BLACK)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          doc.text(`${si + 1}. ${sl.label || `Slot ${si + 1}`}`, MARGIN + 2, y + 4)
          drawBox(doc, MARGIN + CONTENT_W - 42, y, 40, 8)
          y += 11
        })
        doc.setTextColor(...GRAY)
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(7)
        doc.text('*Tulis nomor/teks item yang tepat di kotak', MARGIN + 2, y)
        y += 6
      }

      // URAIAN
      else if (soal.tipe === 'uraian') {
        y = checkPage(doc, y, 28)
        y = drawLines(doc, MARGIN + 2, y, CONTENT_W - 4, 4)
        y += 4
      }

      // Garis pemisah antar soal
      doc.setDrawColor(220, 220, 230)
      doc.setLineWidth(0.2)
      doc.line(MARGIN, y, PAGE_W - MARGIN, y)
      y += 5
    }

    // ── Total skor ──
    y = checkPage(doc, y, 14)
    const totalSkor = soalList.reduce((acc, s) => acc + (s.skor || 0), 0)
    doc.setFillColor(238, 242, 255)
    doc.setDrawColor(...PRIMARY)
    doc.roundedRect(MARGIN, y, CONTENT_W, 12, 2, 2, 'FD')
    doc.setTextColor(...PRIMARY)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(`Total Skor Maksimal: ${totalSkor} poin`, MARGIN + 4, y + 8)
    doc.text('Nilai Akhir: ______', PAGE_W - MARGIN - 4, y + 8, { align: 'right' })
    y += 16

    // TTD guru
    y = checkPage(doc, y, 30)
    doc.setTextColor(...BLACK)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text('Probolinggo, ___________________', PAGE_W - MARGIN - 4, y, { align: 'right' })
    y += 5
    doc.text('Guru Mata Pelajaran,', PAGE_W - MARGIN - 4, y, { align: 'right' })
    y += 20
    doc.setFont('helvetica', 'bold')
    doc.text(guru.nama || '', PAGE_W - MARGIN - 4, y, { align: 'right' })

    // Footer semua halaman
    doc.setTextColor(150, 150, 150)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.text('Dibuat dengan LMAN SMPN8 • created by dhickz666', PAGE_W / 2, 290, { align: 'center' })
  }

  // ── Save ──
  const safeName = (judul || 'LKPD').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)
  doc.save(`LKPD_${safeName}_${token}.pdf`)
}// TypeScript port
