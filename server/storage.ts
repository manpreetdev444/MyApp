import {
  users,
  couples,
  vendors,
  individuals,
  vendorPackages,
  portfolioItems,
  inquiries,
  budgetItems,
  timelineItems,
  type User,
  type UpsertUser,
  type Couple,
  type Vendor,
  type Individual,
  type VendorPackage,
  type PortfolioItem,
  type Inquiry,
  type BudgetItem,
  type TimelineItem,
  type InsertCouple,
  type InsertVendor,
  type InsertIndividual,
  type InsertVendorPackage,
  type InsertPortfolioItem,
  type InsertInquiry,
  type InsertBudgetItem,
  type InsertTimelineItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, sql, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Couple operations
  getCoupleByUserId(userId: string): Promise<Couple | undefined>;
  createCouple(couple: InsertCouple): Promise<Couple>;
  updateCouple(coupleId: string, updates: Partial<InsertCouple>): Promise<Couple>;

  // Individual operations
  getIndividualByUserId(userId: string): Promise<Individual | undefined>;
  createIndividual(individual: InsertIndividual): Promise<Individual>;

  // Vendor operations
  getVendorByUserId(userId: string): Promise<Vendor | undefined>;
  getVendorById(vendorId: string): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(vendorId: string, updates: Partial<InsertVendor>): Promise<Vendor>;
  searchVendors(filters: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Vendor[]>;

  // Vendor package operations
  getVendorPackages(vendorId: string): Promise<VendorPackage[]>;
  createVendorPackage(packageData: InsertVendorPackage): Promise<VendorPackage>;
  updateVendorPackage(packageId: string, updates: Partial<InsertVendorPackage>): Promise<VendorPackage>;
  deleteVendorPackage(packageId: string): Promise<void>;

  // Portfolio operations
  getVendorPortfolio(vendorId: string): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  deletePortfolioItem(itemId: string): Promise<void>;

  // Inquiry operations
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getCoupleInquiries(coupleId: string): Promise<Inquiry[]>;
  getVendorInquiries(vendorId: string): Promise<Inquiry[]>;
  updateInquiry(inquiryId: string, updates: { status?: string; vendorResponse?: string }): Promise<Inquiry>;

  // Budget operations
  getBudgetItems(coupleId: string): Promise<BudgetItem[]>;
  createBudgetItem(item: InsertBudgetItem): Promise<BudgetItem>;
  updateBudgetItem(itemId: string, updates: Partial<InsertBudgetItem>): Promise<BudgetItem>;
  deleteBudgetItem(itemId: string): Promise<void>;

  // Timeline operations
  getTimelineItems(coupleId: string): Promise<TimelineItem[]>;
  createTimelineItem(item: InsertTimelineItem): Promise<TimelineItem>;
  updateTimelineItem(itemId: string, updates: Partial<InsertTimelineItem>): Promise<TimelineItem>;
  deleteTimelineItem(itemId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Couple operations
  async getCoupleByUserId(userId: string): Promise<Couple | undefined> {
    const [couple] = await db.select().from(couples).where(eq(couples.userId, userId));
    return couple;
  }

  async createCouple(coupleData: InsertCouple): Promise<Couple> {
    const [couple] = await db.insert(couples).values(coupleData).returning();
    return couple;
  }

  async updateCouple(coupleId: string, updates: Partial<InsertCouple>): Promise<Couple> {
    const [couple] = await db
      .update(couples)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(couples.id, coupleId))
      .returning();
    return couple;
  }

  // Individual operations
  async getIndividualByUserId(userId: string): Promise<Individual | undefined> {
    const [individual] = await db.select().from(individuals).where(eq(individuals.userId, userId));
    return individual;
  }

  async createIndividual(individualData: InsertIndividual): Promise<Individual> {
    const [individual] = await db.insert(individuals).values(individualData).returning();
    return individual;
  }

  // Vendor operations
  async getVendorByUserId(userId: string): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, userId));
    return vendor;
  }

  async getVendorById(vendorId: string): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, vendorId));
    return vendor;
  }

  async createVendor(vendorData: InsertVendor): Promise<Vendor> {
    const [vendor] = await db.insert(vendors).values(vendorData).returning();
    return vendor;
  }

  async updateVendor(vendorId: string, updates: Partial<InsertVendor>): Promise<Vendor> {
    const [vendor] = await db
      .update(vendors)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(vendors.id, vendorId))
      .returning();
    return vendor;
  }

  async searchVendors(filters: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Vendor[]> {
    let query = db.select().from(vendors).where(eq(vendors.isActive, true));

    const conditions = [];

    if (filters.category) {
      conditions.push(eq(vendors.category, filters.category));
    }

    if (filters.location) {
      conditions.push(ilike(vendors.location, `%${filters.location}%`));
    }

    if (filters.search) {
      conditions.push(
        sql`${vendors.businessName} ILIKE ${`%${filters.search}%`} OR ${vendors.description} ILIKE ${`%${filters.search}%`}`
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(vendors.rating));
  }

  // Vendor package operations
  async getVendorPackages(vendorId: string): Promise<VendorPackage[]> {
    return db.select().from(vendorPackages).where(and(eq(vendorPackages.vendorId, vendorId), eq(vendorPackages.isActive, true)));
  }

  async createVendorPackage(packageData: InsertVendorPackage): Promise<VendorPackage> {
    const [packageItem] = await db.insert(vendorPackages).values(packageData).returning();
    return packageItem;
  }

  async updateVendorPackage(packageId: string, updates: Partial<InsertVendorPackage>): Promise<VendorPackage> {
    const [packageItem] = await db
      .update(vendorPackages)
      .set(updates)
      .where(eq(vendorPackages.id, packageId))
      .returning();
    return packageItem;
  }

  async deleteVendorPackage(packageId: string): Promise<void> {
    await db.update(vendorPackages).set({ isActive: false }).where(eq(vendorPackages.id, packageId));
  }

  // Portfolio operations
  async getVendorPortfolio(vendorId: string): Promise<PortfolioItem[]> {
    return db.select().from(portfolioItems).where(eq(portfolioItems.vendorId, vendorId)).orderBy(desc(portfolioItems.orderIndex));
  }

  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const [portfolioItem] = await db.insert(portfolioItems).values(item).returning();
    return portfolioItem;
  }

  async deletePortfolioItem(itemId: string): Promise<void> {
    await db.delete(portfolioItems).where(eq(portfolioItems.id, itemId));
  }

  // Inquiry operations
  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db.insert(inquiries).values(inquiry).returning();
    return newInquiry;
  }

  async getCoupleInquiries(coupleId: string): Promise<Inquiry[]> {
    return db.select().from(inquiries).where(eq(inquiries.coupleId, coupleId)).orderBy(desc(inquiries.createdAt));
  }

  async getVendorInquiries(vendorId: string): Promise<Inquiry[]> {
    return db.select().from(inquiries).where(eq(inquiries.vendorId, vendorId)).orderBy(desc(inquiries.createdAt));
  }

  async updateInquiry(inquiryId: string, updates: { status?: "pending" | "responded" | "accepted" | "declined"; vendorResponse?: string }): Promise<Inquiry> {
    const [inquiry] = await db
      .update(inquiries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(inquiries.id, inquiryId))
      .returning();
    return inquiry;
  }

  // Budget operations
  async getBudgetItems(coupleId: string): Promise<BudgetItem[]> {
    return db.select().from(budgetItems).where(eq(budgetItems.coupleId, coupleId)).orderBy(desc(budgetItems.createdAt));
  }

  async createBudgetItem(item: InsertBudgetItem): Promise<BudgetItem> {
    const [budgetItem] = await db.insert(budgetItems).values(item).returning();
    return budgetItem;
  }

  async updateBudgetItem(itemId: string, updates: Partial<InsertBudgetItem>): Promise<BudgetItem> {
    const [budgetItem] = await db
      .update(budgetItems)
      .set(updates)
      .where(eq(budgetItems.id, itemId))
      .returning();
    return budgetItem;
  }

  async deleteBudgetItem(itemId: string): Promise<void> {
    await db.delete(budgetItems).where(eq(budgetItems.id, itemId));
  }

  // Timeline operations
  async getTimelineItems(coupleId: string): Promise<TimelineItem[]> {
    return db.select().from(timelineItems).where(eq(timelineItems.coupleId, coupleId)).orderBy(timelineItems.dueDate);
  }

  async createTimelineItem(item: InsertTimelineItem): Promise<TimelineItem> {
    const [timelineItem] = await db.insert(timelineItems).values(item).returning();
    return timelineItem;
  }

  async updateTimelineItem(itemId: string, updates: Partial<InsertTimelineItem>): Promise<TimelineItem> {
    const [timelineItem] = await db
      .update(timelineItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(timelineItems.id, itemId))
      .returning();
    return timelineItem;
  }

  async deleteTimelineItem(itemId: string): Promise<void> {
    await db.delete(timelineItems).where(eq(timelineItems.id, itemId));
  }
}

export const storage = new DatabaseStorage();
