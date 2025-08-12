import { motion, AnimatePresence } from "framer-motion";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { LoadingSpinner } from "./loading-spinner";

export const GlobalLoadingOverlay: React.FC = () => {
  const { state } = useGlobalLoading();

  return (
    <AnimatePresence>
      {state.isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-card rounded-lg p-6 shadow-lg border max-w-sm w-full mx-4"
          >
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" />

              {state.message && (
                <p className="text-sm text-muted-foreground text-center">{state.message}</p>
              )}

              {typeof state.progress === "number" && (
                <div className="w-full">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progresso</span>
                    <span>{Math.round(state.progress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${state.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
