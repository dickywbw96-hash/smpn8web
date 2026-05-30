// src/components/elkpd/soal/TTSSoal.tsx
'use client'
interface Kotak { id: string; petunjuk: string; jawaban: string }
interface Soal { id: string; pertanyaan?: string; kotak?: Kotak[]; skor?: number }
interface Props { soal: Soal; nomor: number; jawaban: Record<string, string>; onChange: (id: string, val: Record<string, string>) => void }

export default function TTSSoal({ soal, nomor, jawaban = {}, onChange }: Props) {
  const update = (kotakId: string, nilai: string) => onChange(soal.id, { ...jawaban, [kotakId]: nilai })

  return (
    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
      <div className="flex items-start gap-2 mb-3">
        <span className="bg-teal-400 text-white font-black text-xs px-2 py-1 rounded-lg min-w-[28px] text-center">{nomor}</span>
        <div>
          <p className="text-white font-medium text-sm leading-relaxed">{soal.pertanyaan || 'Isi kotak-kotak di bawah ini!'}</p>
          <p className="text-teal-300 text-xs mt-1">🔤 Isian Singkat</p>
        </div>
      </div>
      <div className="space-y-3 ml-2">
        {soal.kotak?.map((k, i) => (
          <div key={k.id} className="flex items-center gap-3">
            <span className="text-white/60 text-sm min-w-[20px] font-bold">{i + 1}.</span>
            <div className="flex-1">
              <p className="text-white/80 text-xs mb-1">{k.petunjuk}</p>
              <input type="text" value={jawaban[k.id] || ''} onChange={(e) => update(k.id, e.target.value)}
                placeholder={`Jawaban ${i + 1}...`}
                className="w-full bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
          </div>
        ))}
      </div>
      <p className="text-white/40 text-xs mt-2 text-right">Skor: {soal.skor || 10}</p>
    </div>
  )
}
