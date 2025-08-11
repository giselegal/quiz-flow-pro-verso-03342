import { useAuth } from "@/context/AuthContext";
import { StyleResult } from "@/types/quiz";
import { useCallback, useEffect, useState } from "react";

interface UserStyleData {
  primaryStyle?: StyleResult;
  secondaryStyles?: StyleResult[];
  lastCalculated?: Date;
  preferences?: {
    colors?: string[];
    patterns?: string[];
    fabrics?: string[];
  };
}

export const useUserDataPersistence = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserStyleData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do usuário do localStorage ou sessionStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        setIsLoading(true);
        const storageKey = `userStyleData_${user?.id || "anonymous"}`;
        const savedData = localStorage.getItem(storageKey);

        if (savedData) {
          const parsedData = JSON.parse(savedData);
          // Validar se os dados não estão expirados (24 horas)
          const lastCalculated = new Date(parsedData.lastCalculated);
          const now = new Date();
          const hoursDiff = Math.abs(now.getTime() - lastCalculated.getTime()) / 36e5;

          if (hoursDiff < 24) {
            setUserData(parsedData);
          } else {
            // Dados expirados, limpar
            localStorage.removeItem(storageKey);
            setUserData({});
          }
        }
      } catch (err) {
        setError("Erro ao carregar dados do usuário");
        console.error("Erro ao carregar dados:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Salvar dados do usuário
  const saveUserData = useCallback(
    (data: Partial<UserStyleData>) => {
      try {
        const storageKey = `userStyleData_${user?.id || "anonymous"}`;
        const updatedData = {
          ...userData,
          ...data,
          lastCalculated: new Date(),
        };

        localStorage.setItem(storageKey, JSON.stringify(updatedData));
        setUserData(updatedData);
        setError(null);
      } catch (err) {
        setError("Erro ao salvar dados do usuário");
        console.error("Erro ao salvar dados:", err);
      }
    },
    [userData, user]
  );

  // Atualizar preferências do usuário
  const updatePreferences = useCallback(
    (preferences: UserStyleData["preferences"]) => {
      saveUserData({ preferences });
    },
    [saveUserData]
  );

  // Limpar dados do usuário
  const clearUserData = useCallback(() => {
    try {
      const storageKey = `userStyleData_${user?.id || "anonymous"}`;
      localStorage.removeItem(storageKey);
      setUserData({});
      setError(null);
    } catch (err) {
      setError("Erro ao limpar dados do usuário");
      console.error("Erro ao limpar dados:", err);
    }
  }, [user]);

  return {
    userData,
    isLoading,
    error,
    saveUserData,
    updatePreferences,
    clearUserData,
  };
};
