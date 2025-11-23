import React, { createContext, useContext, ReactNode } from 'react';

interface SyncContextType {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  sync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastSyncTime, setLastSyncTime] = React.useState<Date | null>(null);

  const sync = async () => {
    setIsSyncing(true);
    try {
      // Stub implementation - no actual syncing
      await new Promise(resolve => setTimeout(resolve, 100));
      setLastSyncTime(new Date());
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SyncContext.Provider value={{ isSyncing, lastSyncTime, sync }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within SyncProvider');
  }
  return context;
};
