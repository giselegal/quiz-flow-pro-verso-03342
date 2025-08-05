import { sqliteTable, text, integer, blob, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const utmAnalytics = sqliteTable("utm_analytics", {
  id: text("id").primaryKey(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  participantId: text("participant_id"),
  createdAt: text("created_at"),
});

export const quizParticipants = sqliteTable("quiz_participants", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  quizId: text("quiz_id"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  createdAt: text("created_at"),
});

export const funnels = sqliteTable("funnels", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id"),
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  version: integer("version").default(1),
  settings: text("settings"), // JSON text
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const funnelPages = sqliteTable("funnel_pages", {
  id: text("id").primaryKey(),
  funnelId: text("funnel_id").notNull(),
  pageType: text("page_type").notNull(),
  pageOrder: integer("page_order").notNull(),
  title: text("title"),
  blocks: text("blocks").notNull(), // JSON text
  metadata: text("metadata"), // JSON text
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const funnelVersions = sqliteTable("funnel_versions", {
  id: text("id").primaryKey(),
  funnelId: text("funnel_id").notNull(),
  version: integer("version").notNull(),
  funnelData: text("funnel_data").notNull(), // JSON text
  createdAt: text("created_at"),
  createdBy: integer("created_by"),
});

export const conversionEvents = sqliteTable("conversion_events", {
  id: text("id").primaryKey(),
  eventType: text("event_type").notNull(),
  userEmail: text("user_email"),
  value: real("value").default(0),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  eventData: text("event_data"), // JSON text
  createdAt: text("created_at"),
});

export const quizResults = sqliteTable("quiz_results", {
  id: text("id").primaryKey(),
  participantId: text("participant_id").notNull(),
  quizId: text("quiz_id"),
  responses: text("responses").notNull(), // JSON text
  scores: text("scores"), // JSON text
  predominantStyle: text("predominant_style"),
  createdAt: text("created_at"),
});

export const hotmartPurchases = sqliteTable("hotmart_purchases", {
  id: text("id").primaryKey(),
  transactionId: text("transaction_id").notNull().unique(),
  buyerEmail: text("buyer_email"),
  buyerName: text("buyer_name"),
  productId: text("product_id"),
  productName: text("product_name"),
  amount: real("amount"),
  currency: text("currency").default("BRL"),
  status: text("status"),
  eventType: text("event_type"),
  purchaseDate: text("purchase_date"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UtmAnalytics = typeof utmAnalytics.$inferSelect;
export type InsertUtmAnalytics = typeof utmAnalytics.$inferInsert;
export type QuizParticipant = typeof quizParticipants.$inferSelect;
export type InsertQuizParticipant = typeof quizParticipants.$inferInsert;
export type Funnel = typeof funnels.$inferSelect;
export type InsertFunnel = typeof funnels.$inferInsert;
export type FunnelPage = typeof funnelPages.$inferSelect;
export type InsertFunnelPage = typeof funnelPages.$inferInsert;
export type FunnelVersion = typeof funnelVersions.$inferSelect;
export type InsertFunnelVersion = typeof funnelVersions.$inferInsert;
export type ConversionEvent = typeof conversionEvents.$inferSelect;
export type InsertConversionEvent = typeof conversionEvents.$inferInsert;
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = typeof quizResults.$inferInsert;
export type HotmartPurchase = typeof hotmartPurchases.$inferSelect;
export type InsertHotmartPurchase = typeof hotmartPurchases.$inferInsert;
