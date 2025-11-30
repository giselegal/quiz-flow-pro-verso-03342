// Loader assíncrono para o JSON do template gold via public/
// Em Vite, arquivos em public/ devem ser acessados via fetch em runtime

export async function loadGoldFunnelJson(): Promise<any> {
	const url = '/templates/quiz21-v4-gold.json';
	const res = await fetch(url, { cache: 'no-cache' });
	if (!res.ok) throw new Error(`Falha ao carregar ${url}: ${res.status}`);
	return res.json();
}

export default loadGoldFunnelJson;
