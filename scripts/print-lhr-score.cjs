const fs = require('fs')

try {
  const path = '.artifacts/lhr.report.json'
  const raw = fs.readFileSync(path, 'utf8')
  const json = JSON.parse(raw)
  const score = json?.categories?.performance?.score
  console.log('Lighthouse performance score:', score)
} catch (e) {
  console.error('Failed to read Lighthouse report:', e.message)
  process.exit(1)
}

