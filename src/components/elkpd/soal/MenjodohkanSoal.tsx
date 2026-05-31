// src/components/elkpd/soal/MenjodohkanSoal.tsx
interface Props { soal: any; nomor: number; jawaban: Record<string, string>; onChange: (id: string, val: any) => void }
export default function MenjodohkanSoal({ soal, nomor, jawaban = {}, onChange }: Props) {
  const pasangan = soal.pasangan || []
  const opsi = [...new Set(pasangan.map((p: any) => p.kanan))] as string[]
  const pilih = (kiri: string, kanan: string) => onChange(soal.id, { ...jawaban, [kiri]: kanan })
  const hapus = (kiri: string) => { const u = { ...jawaban }; delete u[kiri]; onChange(soal.id, u) }
  const sudahDipilih = (kanan: string) => Object.values(jawaban).includes(kanan)
  const terjawab = pasangan.filter((p: any) => jawaban[p.kiri]).length
  return (
    <div style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20, overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'14px 14px 12px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ minWidth:28, height:28, background:'rgba(139,92,246,0.35)', border:'1px solid rgba(139,92,246,0.5)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'#c4b5fd', fontWeight:900, fontSize:13, flexShrink:0 }}>{nomor}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ color:'#fff', fontWeight:700, fontSize:14, lineHeight:1.45, margin:0 }}>{soal.pertanyaan}</p>
          <p style={{ color:'rgba(167,139,250,0.7)', fontSize:12, marginTop:4, marginBottom:0 }}>Pilih pasangan yang tepat untuk setiap pernyataan</p>
        </div>
      </div>
      <div style={{ padding:'8px 14px 0', display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.1)', borderRadius:4, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${(terjawab/pasangan.length)*100}%`, background: terjawab===pasangan.length ? '#22c55e' : '#a78bfa', borderRadius:4, transition:'width 0.3s ease' }} />
        </div>
        <span style={{ color:'rgba(255,255,255,0.35)', fontSize:10, fontWeight:700, flexShrink:0 }}>{terjawab}/{pasangan.length}</span>
      </div>
      <div style={{ padding:'10px 12px 14px' }}>
        {pasangan.map((p: any, i: number) => {
          const dipilih = jawaban[p.kiri]
          return (
            <div key={i} style={{ marginBottom: i < pasangan.length-1 ? 10 : 0, background: dipilih ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.04)', border: dipilih ? '1px solid rgba(139,92,246,0.35)' : '1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'10px 12px', transition:'all 0.2s ease' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:8 }}>
                <span style={{ minWidth:22, height:22, background:'rgba(139,92,246,0.25)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'#c4b5fd', fontWeight:800, fontSize:11, flexShrink:0, marginTop:1 }}>{String.fromCharCode(65+i)}</span>
                <p style={{ color:'#fff', fontSize:13, fontWeight:600, lineHeight:1.45, margin:0 }}>{p.kiri}</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, paddingLeft:30 }}>
                <span style={{ color: dipilih ? '#a78bfa' : 'rgba(255,255,255,0.25)', fontSize:16, flexShrink:0 }}>↓</span>
                <div style={{ flex:1, position:'relative' }}>
                  <select value={dipilih || ''} onChange={e => pilih(p.kiri, e.target.value)}
                    style={{ width:'100%', background: dipilih ? 'rgba(139,92,246,0.2)' : 'rgba(0,0,0,0.3)', border: dipilih ? '1.5px solid rgba(139,92,246,0.6)' : '1.5px solid rgba(255,255,255,0.15)', borderRadius:10, color: dipilih ? '#e9d5ff' : 'rgba(255,255,255,0.45)', fontWeight: dipilih ? 700 : 400, padding:'9px 32px 9px 12px', outline:'none', appearance:'none', WebkitAppearance:'none', cursor:'pointer', transition:'all 0.2s ease', boxSizing:'border-box', fontSize:16 }}>
                    <option value="" disabled style={{ background:'#1f2937', color:'#9ca3af' }}>-- Pilih --</option>
                    {opsi.map((op, j) => (
                      <option key={j} value={op} disabled={sudahDipilih(op) && dipilih !== op} style={{ background:'#1f2937', color: sudahDipilih(op) && dipilih !== op ? '#6b7280' : '#f3f4f6' }}>{op}</option>
                    ))}
                  </select>
                  <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color: dipilih ? '#a78bfa' : 'rgba(255,255,255,0.3)', fontSize:12, pointerEvents:'none' }}>▾</span>
                </div>
              </div>
              {dipilih && (
                <div style={{ marginTop:6, paddingLeft:30, display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.35)', borderRadius:6, padding:'2px 8px', color:'#c4b5fd', fontSize:11, fontWeight:600 }}>✓ Terpilih</span>
                  <button type="button" onClick={() => hapus(p.kiri)} style={{ background:'none', border:'none', color:'rgba(239,68,68,0.6)', fontSize:11, cursor:'pointer', padding:'2px 4px' }}>Hapus</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
