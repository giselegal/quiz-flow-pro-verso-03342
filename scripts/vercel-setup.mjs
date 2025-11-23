import fetch from 'node-fetch'

function arg(key, def) {
  const i = process.argv.findIndex((a) => a === key)
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1]
  return def
}

const token = process.env.VERCEL_TOKEN || arg('--token')
const projectRef = arg('--project')
const domain = arg('--domain')
const backendUrl = arg('--backend')
const useVercelDns = arg('--vercel-dns', 'false') === 'true'
const envPairs = process.argv.filter((a) => a.startsWith('--env=')).map((a) => a.slice('--env='.length))

if (!token || !projectRef) {
  process.stderr.write('Missing VERCEL_TOKEN or --project\n')
  process.exit(1)
}

const api = 'https://api.vercel.com'

async function req(method, url, body) {
  const r = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const ct = r.headers.get('content-type') || ''
  if (!r.ok) {
    const text = ct.includes('json') ? JSON.stringify(await r.json()) : await r.text()
    throw new Error(`${method} ${url} ${r.status}: ${text.slice(0, 400)}`)
  }
  return ct.includes('json') ? r.json() : r.text()
}

async function getProject(ref) {
  return req('GET', `${api}/v9/projects/${encodeURIComponent(ref)}`)
}

async function addEnv(projectId, key, value) {
  return req('POST', `${api}/v9/projects/${projectId}/env`, {
    key,
    value,
    target: ['development', 'preview', 'production'],
    type: 'encrypted',
  })
}

async function addDomainToProject(projectId, name) {
  return req('POST', `${api}/v9/projects/${projectId}/domains`, { name })
}

async function addDnsRecordA(name) {
  return req('POST', `${api}/v2/domains/${name}/records`, { type: 'A', name: '', value: '76.76.21.21' })
}

async function addDnsRecordCnameWww(name) {
  return req('POST', `${api}/v2/domains/${name}/records`, { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com' })
}

async function main() {
  const project = await getProject(projectRef)
  const projectId = project.id
  if (envPairs.length > 0) {
    for (const pair of envPairs) {
      const [k, v] = pair.split('=')
      if (k && v) await addEnv(projectId, k, v)
    }
  }
  if (domain) {
    await addDomainToProject(projectId, domain)
    if (useVercelDns) {
      await addDnsRecordA(domain)
      await addDnsRecordCnameWww(domain)
    }
  }
  if (backendUrl) {
    process.stdout.write(`Backend URL set: ${backendUrl}\n`)
  }
  process.stdout.write('Done.\n')
}

main().catch((e) => {
  process.stderr.write(String(e.message || e))
  process.exit(1)
})