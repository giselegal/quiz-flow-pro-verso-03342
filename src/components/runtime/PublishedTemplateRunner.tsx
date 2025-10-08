import React, { useEffect, useState } from 'react';

interface PublishedTemplateRunnerProps {
	slug: string;
	autoStart?: boolean;
}

interface RuntimeSnapshot {
	id: string;
	slug: string;
	stages: Array<{ id: string; type: string; order: number; componentIds: string[] }>;
	components: Record<string, { id: string; type: string; props: any }>;
	outcomes?: any[];
	logic?: any;
}

interface SessionState {
	sessionId: string;
	currentStageId: string;
	score?: number;
}

// Componente mínimo apenas para desbloquear testes de integração
export const PublishedTemplateRunner: React.FC<PublishedTemplateRunnerProps> = ({ slug, autoStart = true }) => {
	const [snapshot, setSnapshot] = useState<RuntimeSnapshot | null>(null);
	const [session, setSession] = useState<SessionState | null>(null);
	const [outcome, setOutcome] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Carrega snapshot publicado
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/templates/${slug}/published-runtime`);
				if (!res.ok) throw new Error('Falha ao carregar snapshot');
				const data = await res.json();
				if (!cancelled) setSnapshot(data);
			} catch (e: any) {
				if (!cancelled) setError(e.message || 'Erro desconhecido');
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => { cancelled = true; };
	}, [slug]);

	// Auto start
	useEffect(() => {
		if (!autoStart || !snapshot || session) return;
		(async () => {
			try {
				const res = await fetch(`/api/templates/${slug}/runtime/start`, { method: 'POST' });
				if (!res.ok) throw new Error('Falha ao iniciar sessão');
				const data = await res.json();
				setSession(data);
			} catch (e: any) {
				setError(e.message || 'Erro desconhecido');
			}
		})();
	}, [autoStart, snapshot, session, slug]);

	const advance = async () => {
		if (!session) return;
		try {
			const res = await fetch(`/api/templates/${slug}/runtime/answer`, { method: 'POST' });
			if (!res.ok) throw new Error('Falha ao avançar');
			const data = await res.json();
			if (data.outcome) {
				setOutcome(data.outcome);
			} else if (data.nextStageId) {
				setSession(s => s ? { ...s, currentStageId: data.nextStageId, score: data.score } : s);
			}
		} catch (e: any) {
			setError(e.message || 'Erro desconhecido');
		}
	};

	if (loading && !snapshot) return <div>Carregando...</div>;
	if (error) return <div>Erro: {error}</div>;
	if (!snapshot) return <div>Snapshot não encontrado</div>;

	const currentStage = snapshot.stages.find(s => s.id === session?.currentStageId);

	return (
		<div>
			<h2>Published Template Runner</h2>
			{session && (
				<div>
					<div>Stage Atual: {session.currentStageId}</div>
					<button onClick={advance} disabled={!!outcome}>
						{currentStage?.type === 'result' ? 'Finalizar' : 'Avançar'}
					</button>
				</div>
			)}
			{outcome && (
				<div>
					<h3>Outcome</h3>
					<pre>{outcome.template}</pre>
				</div>
			)}
		</div>
	);
};

export default PublishedTemplateRunner;
