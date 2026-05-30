// src/components/elkpd/soal/MenjodohkanSoal.tsx
'use client'
interface Pasangan { kiri_id: string; kiri: string; kanan_id: string; kanan: string }
interface Soal { id: string; pertanyaan?: string; pasangan?: Pasangan[]; skor?: number }
interface Props { soal: Soal; nomor: number; jawaban: Record<string, string>; onChange: (id: string, val: Record<string, string>) => void }

export default function MenjodohkanSoal({ soal, nomor, jawaban = {}, onChange }: Props) {
  const update = (kiriId: string, kananId: string) => onChange(soal.id, { ...jawaban, [kiriId]: kananId })

  return (
    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
      <div className="flex items-start gap-2 mb-3">
        <span className="bg-purple-400 text-white font-black text-xs px-2 py-1 rounded-lg min-w-[28px] text-center">{nomor}</span>
        <div>
          <p className="text-white font-medium text-sm leading-relaxed">{soal.pertanyaan || 'Jodohkan kolom kiri dengan kolom kanan yang sesuai!'}</p>
          <p className="text-purple-300 text-xs mt-1">Pilih pasangan yang tepat untuk setiap item</p>
        </div>
      </div>
      <div className="space-y-2 ml-2">
        {soal.pasangan?.map((p) => (
          <div key={p.kiri_id} className="flex items-center gap-2">
            <div className="flex-1 bg-white/15 border border-white/20 rounded-lg px-3 py-2">
              <p className="text-white text-sm font-medium">{p.kiri}</p>
            </div>
            <span className="text-white/50">→</span>
            <select value={jawaban[p.kiri_id] || ''} onChange={(e) => update(p.kiri_id, e.target.value)}
              className="flex-1 bg-white/20 border border-white/30 text-white rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
              <option value="" className="bg-gray-800">-- Pilih --</option>
              {soal.pasangan?.map((opt) => (
                <option key={opt.kanan_id} value={opt.kanan_id} className="bg-gray-800">{opt.kanan}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <p className="text-white/40 text-xs mt-2 text-right">Skor: {soal.skor || 10}</p>
    </div>
  )
}
