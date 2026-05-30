// src/components/elkpd/soal/PilganSoal.tsx
'use client'
interface Pilihan { id: string; teks: string }
interface Soal { id: string; pertanyaan: string; pilihan?: Pilihan[]; skor?: number }
interface Props { soal: Soal; nomor: number; jawaban: string; onChange: (id: string, val: string) => void }

export default function PilganSoal({ soal, nomor, jawaban, onChange }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
      <div className="flex items-start gap-2 mb-3">
        <span className="bg-yellow-400 text-gray-900 font-black text-xs px-2 py-1 rounded-lg min-w-[28px] text-center">{nomor}</span>
        <p className="text-white font-medium text-sm leading-relaxed flex-1">{soal.pertanyaan}</p>
      </div>
      <div className="space-y-2 ml-2">
        {soal.pilihan?.map((p, i) => (
          <button key={p.id} type="button" onClick={() => onChange(soal.id, p.id)}
            className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${jawaban === p.id ? 'bg-yellow-400 border-yellow-300 text-gray-900 font-bold' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}>
            <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{p.teks}
          </button>
        ))}
      </div>
      <p className="text-white/40 text-xs mt-2 text-right">Skor: {soal.skor || 10}</p>
    </div>
  )
}
