// src/components/elkpd/soal/BenarSalahSoal.tsx
'use client'
interface Soal { id: string; pertanyaan: string; skor?: number }
interface Props { soal: Soal; nomor: number; jawaban: string; onChange: (id: string, val: string) => void }

export default function BenarSalahSoal({ soal, nomor, jawaban, onChange }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
      <div className="flex items-start gap-2 mb-3">
        <span className="bg-blue-400 text-white font-black text-xs px-2 py-1 rounded-lg min-w-[28px] text-center">{nomor}</span>
        <p className="text-white font-medium text-sm leading-relaxed flex-1">{soal.pertanyaan}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 ml-2">
        {(['benar', 'salah'] as const).map((v) => (
          <button key={v} type="button" onClick={() => onChange(soal.id, v)}
            className={`py-3 rounded-xl font-bold text-sm transition-all ${jawaban === v ? (v === 'benar' ? 'bg-green-400 text-gray-900 shadow-lg scale-105' : 'bg-red-400 text-white shadow-lg scale-105') : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'}`}>
            {v === 'benar' ? '✅ BENAR' : '❌ SALAH'}
          </button>
        ))}
      </div>
      <p className="text-white/40 text-xs mt-2 text-right">Skor: {soal.skor || 10}</p>
    </div>
  )
}
