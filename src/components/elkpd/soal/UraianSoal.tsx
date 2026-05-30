// src/components/elkpd/soal/UraianSoal.tsx
'use client'
interface Soal { id: string; pertanyaan: string; skor?: number }
interface Props { soal: Soal; nomor: number; jawaban: string; onChange: (id: string, val: string) => void }

export default function UraianSoal({ soal, nomor, jawaban = '', onChange }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
      <div className="flex items-start gap-2 mb-3">
        <span className="bg-orange-400 text-white font-black text-xs px-2 py-1 rounded-lg min-w-[28px] text-center">{nomor}</span>
        <div>
          <p className="text-white font-medium text-sm leading-relaxed">{soal.pertanyaan}</p>
          <p className="text-orange-300 text-xs mt-1">✍ Jawaban Uraian — dinilai oleh guru</p>
        </div>
      </div>
      <textarea value={jawaban} onChange={(e) => onChange(soal.id, e.target.value)}
        placeholder="Tulis jawabanmu di sini..." rows={4}
        className="w-full bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
      <p className="text-white/40 text-xs mt-1 text-right">Skor max: {soal.skor || 10} (dinilai guru)</p>
    </div>
  )
}
