import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const utmAnalytics = pgTable("utm_analytics", {
  id: uuid("id").defaultRandom().primaryKey(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  participantId: uuid("participant_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const funnels = pgTable("funnels", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id").references(() => users.id),
  isPublished: boolean("is_published").default(false),
  version: integer("version").default(1),
  settings: jsonb("settings"), // themes, A/B testing config, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const funnelPages = pgTable("funnel_pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  funnelId: uuid("funnel_id")
    .notNull()
    .references(() => funnels.id, { onDelete: "cascade" }),
  pageType: text("page_type").notNull(), // 'intro', 'question', 'main-transition', etc.
  pageOrder: integer("page_order").notNull(),
  title: text("title"),
  blocks: jsonb("blocks").notNull(), // array of block configurations
  metadata: jsonb("metadata"), // page-specific settings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const funnelVersions = pgTable("funnel_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  funnelId: uuid("funnel_id")
    .notNull()
    .references(() => funnels.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  funnelData: jsonb("funnel_data").notNull(), // complete funnel snapshot
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUtmAnalytics = z.infer<typeof insertUtmAnalyticsSchema>;
export type UtmAnalytics = typeof utmAnalytics.$inferSelect;

export type InsertFunnel = z.infer<typeof insertFunnelSchema>;
export type Funnel = typeof funnels.$inferSelect;
export type InsertFunnelPage = z.infer<typeof insertFunnelPageSchema>;
export type FunnelPage = typeof funnelPages.$inferSelect;
export type InsertFunnelVersion = z.infer<typeof insertFunnelVersionSchema>;
export type FunnelVersion = typeof funnelVersions.$inferSelect;
