/**
 * 🔥 FASE 1: SuperUnifiedProvider - REAL IMPLEMENTATION
 * Conectado ao Supabase Auth com session management
 */
import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface SuperUnifiedContextType {
    data: any;
    loading: boolean;
    state: any;
    setTheme: (theme: string) => void;
    setCurrentStep: (step: number) => void;
    setSelectedBlock: (block: any) => void;
    saveFunnel: () => Promise<void>;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    login: (email: string, password: string) => Promise<{ error: any }>;
    signup: (email: string, password: string) => Promise<{ error: any }>;
    logout: () => Promise<void>;
}

const SuperUnifiedContext = createContext<SuperUnifiedContextType | null>(null);
const AuthContext = createContext<AuthContextType | null>(null);

export function SuperUnifiedProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<any>({});

    // 🔥 REAL AUTH - Conectar ao Supabase
    useEffect(() => {
        // Setup auth listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        // THEN check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return { error };
    };

    const signup = async (email: string, password: string) => {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectUrl
            }
        });
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const authValue: AuthContextType = {
        user,
        session,
        loading,
        isLoading: loading,
        signIn,
        signOut,
        login: signIn,
        signup,
        logout: signOut
    };

    const value: SuperUnifiedContextType = {
        data: { user, session },
        loading,
        state,
        setTheme: (theme: string) => setState((s: any) => ({ ...s, theme })),
        setCurrentStep: (step: number) => setState((s: any) => ({ ...s, currentStep: step })),
        setSelectedBlock: (block: any) => setState((s: any) => ({ ...s, selectedBlock: block })),
        saveFunnel: async () => {
            console.log('saveFunnel called from SuperUnifiedProvider');
        }
    };

    return (
        <AuthContext.Provider value={authValue}>
            <SuperUnifiedContext.Provider value={value}>
                {children}
            </SuperUnifiedContext.Provider>
        </AuthContext.Provider>
    );
}

export function useSuperUnified() {
    const context = useContext(SuperUnifiedContext);
    if (!context) {
        return { 
            data: null, 
            loading: false,
            state: {},
            setTheme: () => {},
            setCurrentStep: () => {},
            setSelectedBlock: () => {},
            saveFunnel: async () => {}
        };
    }
    return context;
}

export function useUnifiedAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        return { 
            user: null,
            session: null,
            loading: false, 
            isLoading: false,
            signIn: async () => ({ error: new Error('Auth context not available') }), 
            signOut: async () => {},
            login: async () => ({ error: new Error('Auth context not available') }),
            signup: async () => ({ error: new Error('Auth context not available') }),
            logout: async () => {}
        };
    }
    return context;
}

export function useAuth() {
    return useUnifiedAuth();
}

export default SuperUnifiedProvider;
