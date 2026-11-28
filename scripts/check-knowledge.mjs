/**
 * Validate beaver-open knowledge and source naming without dependencies,
 * network access or writes. Run from any directory: node scripts/check-knowledge.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const failures = []
const read = name => fs.readFileSync(path.join(root, name), 'utf8')
const config = JSON.parse(read('docs/knowledge-checks.json'))
const pkg = JSON.parse(read('package.json'))

for (const key of config.rootScripts) {
  if (typeof pkg.scripts?.[key] !== 'string')
    failures.push(`package.json: missing script ${key}`)
}
for (const [name, names] of Object.entries(config.packageScripts ?? {})) {
  if (!fs.existsSync(path.join(root, name))) {
    failures.push(`Missing manifest: ${name}`)
    continue
  }
  const manifest = JSON.parse(read(name))
  for (const key of names) {
    if (typeof manifest.scripts?.[key] !== 'string')
      failures.push(`${name}: missing script ${key}`)
  }
}
for (const name of config.requiredPaths) {
  if (!fs.existsSync(path.join(root, name)))
    failures.push(`Missing source path: ${name}`)
}

function markdowns(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? markdowns(full) : entry.isFile() && entry.name.endsWith('.md') ? [full] : []
  })
}

const documents = [
  path.join(root, 'AGENTS.md'),
  ...markdowns(path.join(root, 'docs')),
  ...(config.ruleFiles ?? []).map(name => path.join(root, name)),
]
const uniqueDocuments = [...new Set(documents)]
let links = 0
for (const file of uniqueDocuments) {
  const text = fs.readFileSync(file, 'utf8')
  const relative = path.relative(root, file)
  // Fenced examples are not documentation links; anchors are not validated.
  const content = text.replace(/```[^\n]*\n[\s\S]*?```/g, '')
  for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const raw = match[1].trim().replace(/^<|>$/g, '')
    if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(raw)) continue
    const local = raw.split(/[?#]/, 1)[0]
    let target
    try { target = path.resolve(path.dirname(file), decodeURIComponent(local)) }
    catch { failures.push(`${relative}: malformed link ${raw}`); continue }
    if (!fs.existsSync(target)) failures.push(`${relative}: broken link ${raw}`)
    links++
  }
}
console.log(`Book check: ${(config.chapters ?? []).length} ordered chapters; rule files included in link checks.`)

const contents = read('docs/README.md')
for (const [index, chapter] of (config.chapters ?? []).entries()) {
  const full = path.join(root, 'docs', chapter)
  if (!fs.existsSync(full)) {
    failures.push(`Missing book chapter ${index + 1}: ${chapter}`)
    continue
  }
  const heading = fs.readFileSync(full, 'utf8').split(/\r?\n/, 1)[0]
  if (!heading.startsWith(`# 第${index + 1}章`))
    failures.push(`Wrong chapter heading: ${chapter}: ${heading}`)
  if (!contents.includes(`](${chapter})`))
    failures.push(`Chapter missing from main table of contents: ${chapter}`)
}

// Naming: only src/App.vue may start with an uppercase letter; every file and
// directory under src uses lowerCamelCase. CSS class names are not checked.
const exceptions = new Set(config.namingExceptions ?? [])
const camel = /^[a-z][A-Za-z0-9]*$/
let namesChecked = 0
function checkNames(dir, relDir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.posix.join(relDir, entry.name)
    const stem = entry.isDirectory() ? entry.name : entry.name.replace(/\.[^.]+$/, '')
    namesChecked++
    if (!camel.test(stem) && !exceptions.has(rel))
      failures.push(`Naming: ${rel} must be lowerCamelCase (only App.vue is exempt)`)
    if (entry.isDirectory()) checkNames(path.join(dir, entry.name), rel)
  }
}
checkNames(path.join(root, 'src'), 'src')

const agentLines = read('AGENTS.md').trimEnd().split(/\r?\n/).length
if (agentLines > 150) failures.push(`AGENTS.md has ${agentLines} lines, limit 150`)

for (const failure of failures) console.error(`FAIL: ${failure}`)
console.log(`Checked ${uniqueDocuments.length} Markdown files, ${links} local links, ${config.requiredPaths.length} source paths, ${namesChecked} src names; AGENTS.md ${agentLines} lines.`)
console.log('Script names, links, book order and naming only: no business, compiler, test, security or semantic verification performed.')
process.exitCode = failures.length ? 1 : 0
