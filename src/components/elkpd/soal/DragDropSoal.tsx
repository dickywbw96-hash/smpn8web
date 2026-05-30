// src/components/elkpd/soal/DragDropSoal.tsx
'use client'
import { useState } from 'react'

interface Item { id: string; teks: string }
interface Slot { id: string; label: string; jawaban_item_id: string }
interface Soal { id: string; pertanyaan: string; item?: Item[]; slot?: Slot[]; skor?: number }
interface Props { soal: Soal; nomor: number; jawaban: Record<string, string>; onChange: (id: string, val: Record<string, string>) => void }

export default function DragDropSoal({ soal, nomor, jawaban = {}, onChange }: Props) {
  const [dragItem, setDragItem] = useState<string | null>(null)

  const updateSlot = (slotId: string, itemId: string) => {
    const newJawaban = { ...jawaban }
    Object.keys(newJawaban).forEach((key) => { if (newJawaban[key] === itemId) delete newJawaban[key] })
    newJawaban[slotId] = itemId
    onChange(soal.id, newJawaban)
  }

  const removeFromSlot = (slotId: string) => {
    const newJawaban = { ...jawaban }
    delete newJawaban[slotId]
    onChange(soal.id, newJawaban)
  }

  const usedItems = Object.values(jawaban)
  const tersediaItems = soal.item?.filter((it) => !usedItems.includes(it.id)) || []
  const getItemById = (id: string) => soal.item?.find((it) => it.id === id)

  return (
    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
      <div className="flex items-start gap-2 mb-3">
        <span className="bg-pink-400 text-white font-black text-xs px-2 py-1 rounded-lg min-w-[28px] text-center">{nomor}</span>
        <div>
          <p className="text-white font-medium text-sm leading-relaxed">{soal.pertanyaan}</p>
          <p className="text-pink-300 text-xs mt-1">🎯 Seret item ke kotak yang tepat</p>
        </div>
      </div>

      {/* Bank item */}
      <div className="bg-white/10 rounded-xl p-3 mb-4">
        <p className="text-white/60 text-xs mb-2 font-semibold">Pilihan Item:</p>
        <div className="flex flex-wrap gap-2">
          {tersediaItems.map((item) => (
            <div key={item.id} draggable onDragStart={() => setDragItem(item.id)} onDragEnd={() => setDragItem(null)}
              className="bg-pink-400/80 hover:bg-pink-300 text-white px-3 py-1.5 rounded-lg text-sm font-semibold cursor-grab active:cursor-grabbing select-none transition">
              {item.teks}
            </div>
          ))}
          {tersediaItems.length === 0 && <p className="text-white/40 text-xs">Semua item sudah digunakan</p>}
        </div>
      </div>

      {/* Slot */}
      <div className="space-y-2">
        {soal.slot?.map((slot) => {
          const filledItem = jawaban[slot.id] ? getItemById(jawaban[slot.id]) : null
          return (
            <div key={slot.id} className="flex items-center gap-3">
              <p className="text-white/80 text-sm flex-1">{slot.label}</p>
              <div onDragOver={(e) => e.preventDefault()}
                onDrop={() => { if (dragItem) updateSlot(slot.id, dragItem); setDragItem(null) }}
                className={`min-w-[100px] min-h-[36px] rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${filledItem ? 'border-green-400 bg-green-400/20' : 'border-white/30 bg-white/10 hover:border-pink-400'}`}>
                {filledItem ? (
                  <button type="button" onClick={() => removeFromSlot(slot.id)} className="text-green-300 text-sm font-bold px-2 py-1">
                    {filledItem.teks} ✕
                  </button>
                ) : (
                  <span className="text-white/30 text-xs">Letakkan di sini</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-white/40 text-xs mt-3 text-right">Skor: {soal.skor || 10}</p>
    </div>
  )
}
