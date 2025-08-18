import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
});

export const utmAnalytics = sqliteTable('utm_analytics', {
  id: text('id').primaryKey(),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  utmContent: text('utm_content'),
  utmTerm: text('utm_term'),
  participantId: text('participant_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

export const quizParticipants = sqliteTable('quiz_participants', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  quizId: text('quiz_id'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

export const funnels = sqliteTable('funnels', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  userId: integer('user_id').references(() => users.id),
  isPublished: integer('is_published', { mode: 'boolean' }).default(false),
  version: integer('version').default(1),
  settings: text('settings', { mode: 'json' }), // themes, A/B testing config, etc.
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).defaultNow(),
});

export const funnelPages = sqliteTable('funnel_pages', {
  id: text('id').primaryKey(),
  funnelId: text('funnel_id')
    .notNull()
    .references(() => funnels.id, { onDelete: 'cascade' }),
  pageType: text('page_type').notNull(), // 'intro', 'question', 'main-transition', etc.
  pageOrder: integer('page_order').notNull(),
  title: text('title'),
  blocks: text('blocks', { mode: 'json' }).notNull(), // array of block configurations
  metadata: text('metadata', { mode: 'json' }), // page-specific settings
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).defaultNow(),
});

export const funnelVersions = sqliteTable('funnel_versions', {
  id: text('id').primaryKey(),
  funnelId: text('funnel_id')
    .notNull()
    .references(() => funnels.id, { onDelete: 'cascade' }),
  version: integer('version').notNull(),
  funnelData: text('funnel_data', { mode: 'json' }).notNull(), // complete funnel snapshot
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
  createdBy: integer('created_by').references(() => users.id),
});

// Tracking de eventos e conversões
export const conversionEvents = sqliteTable('conversion_events', {
  id: text('id').primaryKey(),
  eventType: text('event_type').notNull(), // 'lead', 'purchase', 'page_view', 'quiz_complete'
  eventSource: text('event_source').notNull(), // 'quiz', 'hotmart', 'manual'
  participantId: text('participant_id'),
  userEmail: text('user_email'),
  userName: text('user_name'),
  eventValue: integer('event_value'), // valor em centavos
  currency: text('currency').default('BRL'),
  transactionId: text('transaction_id'),
  productName: text('product_name'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  utmContent: text('utm_content'),
  utmTerm: text('utm_term'),
  fbclid: text('fbclid'),
  facebookEventId: text('facebook_event_id'), // Para tracking CAPI
  metadata: text('metadata', { mode: 'json' }), // dados extras específicos do evento
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

// Resultados detalhados do quiz
export const quizResults = sqliteTable('quiz_results', {
  id: text('id').primaryKey(),
  participantId: text('participant_id').references(() => quizParticipants.id),
  quizType: text('quiz_type').default('style-discovery'),
  primaryStyle: text('primary_style'), // categoria do estilo dominante
  stylePercentage: integer('style_percentage'), // pontuação do estilo
  allStyles: text('all_styles', { mode: 'json' }), // todos os estilos e pontuações
  answers: text('answers', { mode: 'json' }), // respostas do quiz
  utmData: text('utm_data', { mode: 'json' }), // dados UTM no momento do quiz
  browserData: text('browser_data', { mode: 'json' }), // IP, user agent, etc.
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

// Compras do Hotmart
export const hotmartPurchases = sqliteTable('hotmart_purchases', {
  id: text('id').primaryKey(),
  transactionId: text('transaction_id').notNull().unique(),
  status: text('status').notNull(), // 'complete', 'approved', 'cancelled', 'refunded'
  buyerEmail: text('buyer_email').notNull(),
  buyerName: text('buyer_name').notNull(),
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  price: integer('price').notNull(), // em centavos
  currency: text('currency').default('BRL'),
  commissionValue: integer('commission_value'),
  affiliateEmail: text('affiliate_email'),
  webhookEventId: text('webhook_event_id'),
  rawWebhookData: text('raw_webhook_data', { mode: 'json' }),
  facebookEventSent: integer('facebook_event_sent', {
    mode: 'boolean',
  }).default(false),
  conversionEventId: text('conversion_event_id').references(() => conversionEvents.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUtmAnalyticsSchema = createInsertSchema(utmAnalytics).pick({
  utmSource: true,
  utmMedium: true,
  utmCampaign: true,
  utmContent: true,
  utmTerm: true,
  participantId: true,
});

export const insertQuizParticipantSchema = createInsertSchema(quizParticipants).pick({
  name: true,
  email: true,
  quizId: true,
  utmSource: true,
  utmMedium: true,
  utmCampaign: true,
});

export const insertFunnelSchema = createInsertSchema(funnels).pick({
  name: true,
  description: true,
  userId: true,
  settings: true,
});

export const insertFunnelPageSchema = createInsertSchema(funnelPages).pick({
  funnelId: true,
  pageType: true,
  pageOrder: true,
  title: true,
  blocks: true,
  metadata: true,
});

export const insertFunnelVersionSchema = createInsertSchema(funnelVersions).pick({
  funnelId: true,
  version: true,
  funnelData: true,
  createdBy: true,
});

export const insertConversionEventSchema = createInsertSchema(conversionEvents).pick({
  eventType: true,
  eventSource: true,
  participantId: true,
  userEmail: true,
  userName: true,
  eventValue: true,
  currency: true,
  transactionId: true,
  productName: true,
  utmSource: true,
  utmMedium: true,
  utmCampaign: true,
  utmContent: true,
  utmTerm: true,
  fbclid: true,
  facebookEventId: true,
  metadata: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).pick({
  participantId: true,
  quizType: true,
  primaryStyle: true,
  stylePercentage: true,
  allStyles: true,
  answers: true,
  utmData: true,
  browserData: true,
});

export const insertHotmartPurchaseSchema = createInsertSchema(hotmartPurchases).pick({
  transactionId: true,
  status: true,
  buyerEmail: true,
  buyerName: true,
  productId: true,
  productName: true,
  price: true,
  currency: true,
  commissionValue: true,
  affiliateEmail: true,
  webhookEventId: true,
  rawWebhookData: true,
  facebookEventSent: true,
  conversionEventId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUtmAnalytics = z.infer<typeof insertUtmAnalyticsSchema>;
export type UtmAnalytics = typeof utmAnalytics.$inferSelect;
export type InsertQuizParticipant = z.infer<typeof insertQuizParticipantSchema>;
export type QuizParticipant = typeof quizParticipants.$inferSelect;

export type InsertFunnel = z.infer<typeof insertFunnelSchema>;
export type Funnel = typeof funnels.$inferSelect;
export type InsertFunnelPage = z.infer<typeof insertFunnelPageSchema>;
export type FunnelPage = typeof funnelPages.$inferSelect;
export type InsertFunnelVersion = z.infer<typeof insertFunnelVersionSchema>;
export type FunnelVersion = typeof funnelVersions.$inferSelect;
export type InsertConversionEvent = z.infer<typeof insertConversionEventSchema>;
export type ConversionEvent = typeof conversionEvents.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertHotmartPurchase = z.infer<typeof insertHotmartPurchaseSchema>;
export type HotmartPurchase = typeof hotmartPurchases.$inferSelect;
