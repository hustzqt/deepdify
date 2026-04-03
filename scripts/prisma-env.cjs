/**
 * Loads .env then .env.local (override) so Prisma CLI matches Next.js runtime (Neon vs local).
 * Usage: node scripts/prisma-env.cjs db push
 */
const { spawnSync } = require('child_process')
const path = require('path')

const root = path.join(__dirname, '..')
require('dotenv').config({ path: path.join(root, '.env') })
require('dotenv').config({ path: path.join(root, '.env.local'), override: true })

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node scripts/prisma-env.cjs <prisma subcommand> [args...]')
  console.error('Example: node scripts/prisma-env.cjs db push')
  process.exit(1)
}

const r = spawnSync('npx', ['prisma', ...args], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
  cwd: root,
})
process.exit(r.status ?? 1)
