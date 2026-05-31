// @ts-ignore
import ExcelJS from 'exceljs'
// @ts-ignore
import { saveAs } from 'file-saver'

export const downloadExcel = async ({ judul, guru, jawabanList }) => {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = guru.nama
  workbook.created = new Date()

  // Kelompokkan data jawaban berdasarkan kelas
  const dataPerKelas = jawabanList.reduce((acc, curr) => {
    const kelas = curr.kelas || 'Tanpa Kelas'
    if (!acc[kelas]) acc[kelas] = []
    acc[kelas].push(curr)
    return acc
  }, {})

  // Looping untuk membuat sheet setiap kelas
  Object.keys(dataPerKelas)
    .sort()
    .forEach((kelas) => {
      // Nama sheet dibatasi maksimal 31 karakter oleh Excel
      const sheet = workbook.addWorksheet(`Kelas ${kelas}`.substring(0, 31))

      // 1. Tambahkan Header Judul & Nama Guru
      sheet.mergeCells('A1:E1')
      const titleCell = sheet.getCell('A1')
      titleCell.value = `HASIL LKPD: ${judul.toUpperCase()}`
      titleCell.font = { name: 'Arial', size: 14, bold: true }
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' }

      sheet.mergeCells('A2:E2')
      const guruCell = sheet.getCell('A2')
      guruCell.value = `Guru Pengampu: ${guru.nama} (${guru.mapel})`
      guruCell.font = { name: 'Arial', size: 11, italic: true }
      guruCell.alignment = { vertical: 'middle', horizontal: 'center' }

      sheet.addRow([]) // Baris kosong

      // 2. Tambahkan Header Tabel
      const headerRow = sheet.addRow(['No', 'Nama Siswa', 'Skor Pilihan Ganda', 'Skor Uraian', 'Total Skor'])
      headerRow.font = { bold: true }
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' }

      // Styling border tebal untuk header
      headerRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' }
        }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' } // Warna abu-abu muda
        }
      })

      // 3. Masukkan Data Siswa
      const siswaList = dataPerKelas[kelas]
      siswaList.forEach((siswa, index) => {
        const row = sheet.addRow([
          index + 1,
          siswa.nama,
          siswa.skor_otomatis || 0,
          siswa.skor_uraian || 0,
          siswa.skor_total ?? siswa.skor_otomatis
        ])

        // Styling border biasa untuk data
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: colNumber === 1 ? 'medium' : 'thin' },
            bottom: { style: index === siswaList.length - 1 ? 'medium' : 'thin' }, // Border bawah tebal di baris terakhir
            right: { style: colNumber === 5 ? 'medium' : 'thin' }
          }
          if (colNumber !== 2) { // Rata tengah kecuali kolom nama
            cell.alignment = { vertical: 'middle', horizontal: 'center' }
          }
        })
      })

      // Atur lebar kolom
      sheet.getColumn(1).width = 5   // No
      sheet.getColumn(2).width = 35  // Nama
      sheet.getColumn(3).width = 20  // Skor PG
      sheet.getColumn(4).width = 15  // Skor Uraian
      sheet.getColumn(5).width = 15  // Total Skor
    })

  // Simpan dan Download File
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, `Nilai_${judul.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`)
}