import { z } from "zod";

const toBool = (v: unknown) => String(v).toLowerCase() === "true";
const toNumber = (v: unknown, fallback?: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const EnvSchema = z.object({
  MODE: z.string().default("development"),
  DEV: z.boolean().default(false),
  PROD: z.boolean().default(false),

  VITE_DISABLE_TELEMETRY: z
    .string()
    .optional()
    .transform((v) => toBool(v)),
  VITE_ENABLE_SUPABASE: z
    .string()
    .optional()
    .transform((v) => toBool(v)),
  VITE_DISABLE_SUPABASE: z
    .string()
    .optional()
    .transform((v) => toBool(v)),
  VITE_SUPABASE_URL: z.string().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),

  VITE_USE_UNIFIED_QUIZ: z
    .string()
    .optional()
    .transform((v) => toBool(v)),
  VITE_FORCE_UNIFIED_EDITOR: z
    .string()
    .optional()
    .transform((v) => toBool(v)),
  VITE_ROLLOUT_PERCENTAGE: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => toNumber(v)),

  VITE_DEBUG_LOVABLE: z
    .string()
    .optional()
    .transform((v) => toBool(v)),
  VITE_ENABLE_LOVABLE_WINDOW: z
    .string()
    .optional()
    .transform((v) => toBool(v)),
  VITE_DISABLE_LOVABLE_WINDOW: z
    .string()
    .optional()
    .transform((v) => toBool(v)),
  VITE_LOVABLE_REACTIVATE_MS: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => toNumber(v, 30000)),

  VITE_LOCAL_ADMIN_EMAIL: z.string().optional(),
  VITE_LOCAL_ADMIN_PASSWORD: z.string().optional(),

  VITE_SUPABASE_FUNNEL_ID: z.string().optional(),
  VITE_SUPABASE_QUIZ_ID: z.string().optional(),
  VITE_DEFAULT_FUNNEL_ID: z.string().optional(),
});

const raw = {
  MODE: (import.meta as any)?.env?.MODE,
  DEV: (import.meta as any)?.env?.DEV,
  PROD: (import.meta as any)?.env?.PROD,

  VITE_DISABLE_TELEMETRY: (import.meta as any)?.env?.VITE_DISABLE_TELEMETRY,
  VITE_ENABLE_SUPABASE: (import.meta as any)?.env?.VITE_ENABLE_SUPABASE,
  VITE_DISABLE_SUPABASE: (import.meta as any)?.env?.VITE_DISABLE_SUPABASE,
  VITE_SUPABASE_URL: (import.meta as any)?.env?.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY,

  VITE_USE_UNIFIED_QUIZ: (import.meta as any)?.env?.VITE_USE_UNIFIED_QUIZ,
  VITE_FORCE_UNIFIED_EDITOR: (import.meta as any)?.env
    ?.VITE_FORCE_UNIFIED_EDITOR,
  VITE_ROLLOUT_PERCENTAGE: (import.meta as any)?.env?.VITE_ROLLOUT_PERCENTAGE,

  VITE_DEBUG_LOVABLE: (import.meta as any)?.env?.VITE_DEBUG_LOVABLE,
  VITE_ENABLE_LOVABLE_WINDOW: (import.meta as any)?.env
    ?.VITE_ENABLE_LOVABLE_WINDOW,
  VITE_DISABLE_LOVABLE_WINDOW: (import.meta as any)?.env
    ?.VITE_DISABLE_LOVABLE_WINDOW,
  VITE_LOVABLE_REACTIVATE_MS: (import.meta as any)?.env
    ?.VITE_LOVABLE_REACTIVATE_MS,

  VITE_LOCAL_ADMIN_EMAIL: (import.meta as any)?.env?.VITE_LOCAL_ADMIN_EMAIL,
  VITE_LOCAL_ADMIN_PASSWORD: (import.meta as any)?.env
    ?.VITE_LOCAL_ADMIN_PASSWORD,

  VITE_SUPABASE_FUNNEL_ID: (import.meta as any)?.env?.VITE_SUPABASE_FUNNEL_ID,
  VITE_SUPABASE_QUIZ_ID: (import.meta as any)?.env?.VITE_SUPABASE_QUIZ_ID,
  VITE_DEFAULT_FUNNEL_ID: (import.meta as any)?.env?.VITE_DEFAULT_FUNNEL_ID,
};

const parsed = EnvSchema.safeParse(raw);
if (!parsed.success) {
  if ((import.meta as any)?.env?.DEV) {
    // eslint-disable-next-line no-console
    console.warn("Env validation warnings:", parsed.error.flatten());
  }
}

export const env = (parsed.success ? parsed.data : (raw as any)) as z.infer<
  typeof EnvSchema
>;
export const isDev = !!env.DEV;
export const isProd = !!env.PROD;
export const mode = env.MODE || "development";
export default env;
