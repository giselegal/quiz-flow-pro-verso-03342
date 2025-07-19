import { 
  pgTable, 
  uuid, 
  text, 
  boolean, 
  integer, 
  jsonb, 
  timestamp, 
  decimal 
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// UTM Analytics table
export const utmAnalytics = pgTable("utm_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  participantId: text("participant_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz Participants table
export const quizParticipants = pgTable("quiz_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email"),
  quizId: text("quiz_id"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Funnels table (core table)
export const funnels = pgTable("funnels", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  isPublished: boolean("is_published").default(false),
  version: integer("version").default(1),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Funnel Pages table
export const funnelPages = pgTable("funnel_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  funnelId: uuid("funnel_id").references(() => funnels.id, { onDelete: "cascade" }).notNull(),
  pageType: text("page_type").notNull(),
  pageOrder: integer("page_order").notNull(),
  title: text("title"),
  blocks: jsonb("blocks").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Funnel Versions table
export const funnelVersions = pgTable("funnel_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  funnelId: uuid("funnel_id").references(() => funnels.id, { onDelete: "cascade" }).notNull(),
  version: integer("version").notNull(),
  funnelData: jsonb("funnel_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: uuid("created_by").references(() => users.id),
});

// Conversion Events table
export const conversionEvents = pgTable("conversion_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventType: text("event_type").notNull(),
  userEmail: text("user_email"),
  value: decimal("value").default("0"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  eventData: jsonb("event_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz Results table
export const quizResults = pgTable("quiz_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  participantId: text("participant_id").notNull(),
  quizId: text("quiz_id"),
  responses: jsonb("responses").notNull(),
  scores: jsonb("scores"),
  predominantStyle: text("predominant_style"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Hotmart Purchases table
export const hotmartPurchases = pgTable("hotmart_purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  transactionId: text("transaction_id").notNull().unique(),
  buyerEmail: text("buyer_email"),
  buyerName: text("buyer_name"),
  productId: text("product_id"),
  productName: text("product_name"),
  amount: decimal("amount"),
  currency: text("currency").default("BRL"),
  status: text("status"),
  eventType: text("event_type"),
  purchaseDate: timestamp("purchase_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Webhooks table
export const webhooks = pgTable("webhooks", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  eventType: text("event_type").notNull(),
  method: text("method").default("POST"),
  headers: jsonb("headers"),
  secret: text("secret"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Types for TypeScript
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

export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = typeof webhooks.$inferInsert;
