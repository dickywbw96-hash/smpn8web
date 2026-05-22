import dotenv from 'dotenv'
dotenv.config()

const { getPayload } = await import('payload')
const { default: config } = await import('./src/payload.config.ts')

const payload = await getPayload({ config })

await payload.create({
  collection: 'users',
  data: {
    email: 'admin@smpn8.sch.id',
    password: 'Admin1234!',
    name: 'Administrator',
  },
})

console.log('✅ User admin berhasil dibuat!')
console.log('Email: admin@smpn8.sch.id')
console.log('Password: Admin1234!')

process.exit(0)