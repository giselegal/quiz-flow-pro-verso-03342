import * as React from 'react';

interface DataDebugProps {
  funnel: any;
  currentPage: any;
  pages: any[];
}

const DataDebug: React.FC<DataDebugProps> = ({ funnel, currentPage, pages }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="fixed top-4 left-4 z-50 bg-blue-900/90 text-white p-3 rounded-lg text-xs max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold">🔍 Data Debug</span>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-white/80 hover:text-white"
        >
          {expanded ? '−' : '+'}
        </button>
      </div>
      
      <div className="space-y-1">
        <div>Funnel: {funnel ? '✅' : '❌'}</div>
        <div>Current Page: {currentPage ? '✅' : '❌'}</div>
        <div>Pages Count: {pages?.length || 0}</div>
        {funnel && <div>Funnel ID: {funnel.id?.substring(0, 12)}...</div>}
      </div>

      {expanded && (
        <div className="mt-3 pt-2 border-t border-white/20">
          <div className="mb-2">
            <strong>Pages List:</strong>
          </div>
          {pages?.length > 0 ? (
            <div className="max-h-40 overflow-y-auto space-y-1">
              {pages.map((page, index) => (
                <div key={page.id || index} className="text-xs bg-white/10 p-1 rounded">
                  <div>#{index + 1}: {page.name || page.title}</div>
                  <div className="text-white/60">
                    ID: {page.id?.substring(0, 8)}...
                  </div>
                  <div className="text-white/60">
                    Blocks: {page.blocks?.length || 0}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-red-300">No pages found!</div>
          )}
          
          {currentPage && (
            <div className="mt-2 pt-2 border-t border-white/20">
              <strong>Current Page:</strong>
              <div>Name: {currentPage.name || currentPage.title}</div>
              <div>Blocks: {currentPage.blocks?.length || 0}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataDebug;
