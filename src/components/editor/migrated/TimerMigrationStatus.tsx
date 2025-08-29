import React, { memo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, AlertCircle, Zap } from 'lucide-react';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';

interface TimerMigrationFile {
  path: string;
  name: string;
  status: 'pending' | 'migrated' | 'error';
  originalCount: number;
  migratedCount: number;
  errorDetails?: string;
}

interface TimerMigrationStatusProps {
  showInProduction?: boolean;
}

/**
 * TimerMigrationStatus - Dashboard de status da migração de timers
 * 
 * Monitora e exibe o progresso da migração de setTimeout/setInterval
 * para useOptimizedScheduler em toda a aplicação
 */
const TimerMigrationStatus: React.FC<TimerMigrationStatusProps> = memo(({
  showInProduction = false
}) => {
  const [files, setFiles] = useState<TimerMigrationFile[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { schedule } = useOptimizedScheduler();

  // Lista de arquivos conhecidos com timers (baseado na análise anterior)
  const knownTimerFiles: Omit<TimerMigrationFile, 'status' | 'migratedCount'>[] = [
    {
      path: 'src/components/editor/EditorProvider.tsx',
      name: 'EditorProvider',
      originalCount: 1,
    },
    {
      path: 'src/components/editor/blocks/BlockRenderer.tsx',
      name: 'BlockRenderer',
      originalCount: 1,
    },
    {
      path: 'src/components/editor/blocks/ButtonInlineBlock.tsx',
      name: 'ButtonInlineBlock',
      originalCount: 1,
    },
    {
      path: 'src/components/editor/blocks/CTAInlineBlock.tsx',
      name: 'CTAInlineBlock',
      originalCount: 1,
    },
    {
      path: 'src/components/editor/blocks/ExampleInlineBlock.tsx',
      name: 'ExampleInlineBlock',
      originalCount: 1,
    },
    {
      path: 'src/components/editor/blocks/FormContainerBlock.tsx',
      name: 'FormContainerBlock',
      originalCount: 1,
    },
    {
      path: 'src/components/editor/blocks/LoaderInlineBlock.tsx',
      name: 'LoaderInlineBlock',
      originalCount: 1,
    },
    {
      path: 'src/components/editor/blocks/ProductionBlockBoundary.tsx',
      name: 'ProductionBlockBoundary',
      originalCount: 1,
    },
    {
      path: 'src/components/editor/blocks/AnimatedStatCounterBlock.tsx',
      name: 'AnimatedStatCounterBlock',
      originalCount: 1,
    },
    {
      path: 'src/components/editor/blocks/QuizOfferCountdownBlock.tsx',
      name: 'QuizOfferCountdownBlock',
      originalCount: 1,
    },
    {
      path: 'src/components/editor/blocks/StatInlineBlock.tsx',
      name: 'StatInlineBlock',
      originalCount: 1,
    },
    {
      path: 'src/components/editor/blocks/StatsMetricsBlock.tsx',
      name: 'StatsMetricsBlock',
      originalCount: 1,
    },
    {
      path: 'src/components/editor/blocks/UrgencyTimerInlineBlock.tsx',
      name: 'UrgencyTimerInlineBlock',
      originalCount: 1,
    },
    {
      path: 'src/components/editor/blocks/result/UrgencyCountdownInlineBlock.tsx',
      name: 'UrgencyCountdownInlineBlock',
      originalCount: 1,
    }
  ];

  // Simular análise dos arquivos (em produção, isso seria feito via análise de código)
  useEffect(() => {
    const analyzeFiles = () => {
      const analyzedFiles: TimerMigrationFile[] = knownTimerFiles.map(file => {
        // Simular análise baseada nos arquivos que já migramos
        const isMigrated = ['EditorProvider', 'BlockRenderer', 'ButtonInlineBlock'].includes(file.name);
        
        return {
          ...file,
          status: isMigrated ? 'migrated' : 'pending',
          migratedCount: isMigrated ? file.originalCount : 0,
        };
      });

      setFiles(analyzedFiles);
    };

    analyzeFiles();
    
    // Atualizar periodicamente
    const cleanup = schedule('timer-analysis', analyzeFiles, 30000);
    return cleanup;
  }, [schedule]);

  // Calcular estatísticas
  const stats = files.reduce(
    (acc, file) => ({
      total: acc.total + file.originalCount,
      migrated: acc.migrated + file.migratedCount,
      files: acc.files + 1,
      migratedFiles: acc.migratedFiles + (file.status === 'migrated' ? 1 : 0),
      pendingFiles: acc.pendingFiles + (file.status === 'pending' ? 1 : 0),
      errorFiles: acc.errorFiles + (file.status === 'error' ? 1 : 0),
    }),
    { total: 0, migrated: 0, files: 0, migratedFiles: 0, pendingFiles: 0, errorFiles: 0 }
  );

  const progressPercentage = stats.total > 0 ? Math.round((stats.migrated / stats.total) * 100) : 0;

  // Não mostrar em produção por padrão
  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg z-50">
      {/* Header compacto */}
      <div 
        className="flex items-center gap-3 p-3 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-sm text-gray-800">Timer Migration</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 rounded-full px-2 py-1 text-xs font-mono">
            {progressPercentage}%
          </div>
          <div className={cn(
            "w-2 h-2 rounded-full",
            progressPercentage === 100 ? "bg-green-500" : "bg-yellow-500"
          )} />
        </div>
        
        <div className={cn(
          "text-gray-400 transition-transform",
          isExpanded && "rotate-90"
        )}>
          ▶
        </div>
      </div>

      {/* Conteúdo expandido */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-3 space-y-3">
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress: {stats.migrated}/{stats.total} timers</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Estatísticas resumidas */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-green-600">{stats.migratedFiles}</div>
              <div className="text-gray-600">Migrated</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600">{stats.pendingFiles}</div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">{stats.errorFiles}</div>
              <div className="text-gray-600">Errors</div>
            </div>
          </div>

          {/* Lista de arquivos */}
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="flex-shrink-0">
                  {file.status === 'migrated' && (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  )}
                  {file.status === 'pending' && (
                    <Clock className="w-3 h-3 text-yellow-500" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-gray-800 truncate">
                    {file.name}
                  </div>
                  {file.errorDetails && (
                    <div className="text-red-600 text-xs">
                      {file.errorDetails}
                    </div>
                  )}
                </div>
                
                <div className="flex-shrink-0 font-mono text-gray-600">
                  {file.migratedCount}/{file.originalCount}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button 
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              onClick={() => {
                console.log('Timer Migration Status:', { stats, files });
              }}
            >
              Log Status
            </button>
            <button 
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              onClick={() => setIsExpanded(false)}
            >
              Minimize
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

TimerMigrationStatus.displayName = 'TimerMigrationStatus';

export default TimerMigrationStatus;