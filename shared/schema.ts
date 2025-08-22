import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ['couple', 'vendor'] }).notNull().default('couple'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Couples table for wedding planning data
export const couples = pgTable("couples", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  partnerName: varchar("partner_name"),
  weddingDate: timestamp("wedding_date"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  spentAmount: decimal("spent_amount", { precision: 10, scale: 2 }).default('0'),
  venue: varchar("venue"),
  guestCount: integer("guest_count"),
  style: varchar("style"), // rustic, elegant, modern, etc.
  location: varchar("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vendors table for vendor profiles
export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  businessName: varchar("business_name").notNull(),
  category: varchar("category").notNull(), // photography, catering, venue, music, etc.
  description: text("description"),
  location: varchar("location"),
  phone: varchar("phone"),
  website: varchar("website"),
  instagram: varchar("instagram"),
  pinterest: varchar("pinterest"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default('0'),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vendor packages table
export const vendorPackages = pgTable("vendor_packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").notNull().references(() => vendors.id, { onDelete: 'cascade' }),
  name: varchar("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: varchar("duration"), // e.g., "6 hours", "full day"
  features: text("features").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Portfolio items for vendor showcases
export const portfolioItems = pgTable("portfolio_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").notNull().references(() => vendors.id, { onDelete: 'cascade' }),
  title: varchar("title"),
  description: text("description"),
  imageUrl: varchar("image_url").notNull(),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Inquiries between couples and vendors
export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  coupleId: varchar("couple_id").notNull().references(() => couples.id, { onDelete: 'cascade' }),
  vendorId: varchar("vendor_id").notNull().references(() => vendors.id, { onDelete: 'cascade' }),
  message: text("message").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  eventDate: timestamp("event_date"),
  status: varchar("status", { enum: ['pending', 'responded', 'accepted', 'declined'] }).default('pending'),
  vendorResponse: text("vendor_response"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Budget items for couples
export const budgetItems = pgTable("budget_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  coupleId: varchar("couple_id").notNull().references(() => couples.id, { onDelete: 'cascade' }),
  category: varchar("category").notNull(),
  description: varchar("description").notNull(),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  isPaid: boolean("is_paid").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Timeline items for wedding planning
export const timelineItems = pgTable("timeline_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  coupleId: varchar("couple_id").notNull().references(() => couples.id, { onDelete: 'cascade' }),
  title: varchar("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  isCompleted: boolean("is_completed").default(false),
  category: varchar("category"), // venue, catering, photography, etc.
  priority: varchar("priority", { enum: ['low', 'medium', 'high'] }).default('medium'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  couple: one(couples),
  vendor: one(vendors),
}));

export const couplesRelations = relations(couples, ({ one, many }) => ({
  user: one(users, {
    fields: [couples.userId],
    references: [users.id],
  }),
  inquiries: many(inquiries),
  budgetItems: many(budgetItems),
  timelineItems: many(timelineItems),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  user: one(users, {
    fields: [vendors.userId],
    references: [users.id],
  }),
  packages: many(vendorPackages),
  portfolioItems: many(portfolioItems),
  inquiries: many(inquiries),
}));

export const vendorPackagesRelations = relations(vendorPackages, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorPackages.vendorId],
    references: [vendors.id],
  }),
}));

export const portfolioItemsRelations = relations(portfolioItems, ({ one }) => ({
  vendor: one(vendors, {
    fields: [portfolioItems.vendorId],
    references: [vendors.id],
  }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  couple: one(couples, {
    fields: [inquiries.coupleId],
    references: [couples.id],
  }),
  vendor: one(vendors, {
    fields: [inquiries.vendorId],
    references: [vendors.id],
  }),
}));

export const budgetItemsRelations = relations(budgetItems, ({ one }) => ({
  couple: one(couples, {
    fields: [budgetItems.coupleId],
    references: [couples.id],
  }),
}));

export const timelineItemsRelations = relations(timelineItems, ({ one }) => ({
  couple: one(couples, {
    fields: [timelineItems.coupleId],
    references: [couples.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
});

export const insertCoupleSchema = createInsertSchema(couples).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
  reviewCount: true,
});

export const insertVendorPackageSchema = createInsertSchema(vendorPackages).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
  createdAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const insertBudgetItemSchema = createInsertSchema(budgetItems).omit({
  id: true,
  createdAt: true,
});

export const insertTimelineItemSchema = createInsertSchema(timelineItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema> & { id: string };
export type User = typeof users.$inferSelect;
export type Couple = typeof couples.$inferSelect;
export type Vendor = typeof vendors.$inferSelect;
export type VendorPackage = typeof vendorPackages.$inferSelect;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type BudgetItem = typeof budgetItems.$inferSelect;
export type TimelineItem = typeof timelineItems.$inferSelect;

export type InsertCouple = z.infer<typeof insertCoupleSchema>;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type InsertVendorPackage = z.infer<typeof insertVendorPackageSchema>;
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type InsertBudgetItem = z.infer<typeof insertBudgetItemSchema>;
export type InsertTimelineItem = z.infer<typeof insertTimelineItemSchema>;
