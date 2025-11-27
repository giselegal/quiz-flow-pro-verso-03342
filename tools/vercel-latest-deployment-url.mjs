#!/usr/bin/env node
import fetch from 'node-fetch';

const token = process.env.VERCEL_API_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID;
const target = process.env.VERCEL_TARGET || 'preview'; // 'production' or 'preview'

if (!token || !projectId) {
  console.error('Missing VERCEL_API_TOKEN or VERCEL_PROJECT_ID environment variables.');
  process.exit(1);
}

const base = 'https://api.vercel.com';

async function main() {
  // Fetch latest READY deployment for the project
  const params = new URLSearchParams({
    projectId,
    state: 'READY',
    target,
    limit: '1',
  });

  const res = await fetch(`${base}/v13/deployments?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed to fetch deployments: ${res.status} ${res.statusText}\n${text}`);
    process.exit(2);
  }

  const json = await res.json();
  const deployment = json.deployments?.[0];
  if (!deployment) {
    console.error('No READY deployments found for project.');
    process.exit(3);
  }

  const url = deployment?.url?.startsWith('http') ? deployment.url : `https://${deployment.url}`;
  // Output plain URL to stdout for consumption by workflows
  process.stdout.write(url);
}

main().catch((err) => {
  console.error(err);
  process.exit(99);
});
