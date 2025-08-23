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
  vendorAvailability,
  savedVendors,
  notifications,
  userSettings,
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
  type VendorAvailability,
  type SavedVendor,
  type Notification,
  type UserSettings,
  type InsertCouple,
  type InsertVendor,
  type InsertIndividual,
  type InsertVendorPackage,
  type InsertPortfolioItem,
  type InsertInquiry,
  type InsertBudgetItem,
  type InsertTimelineItem,
  type InsertVendorAvailability,
  type InsertSavedVendor,
  type InsertNotification,
  type InsertUserSettings,
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
  deleteVendor(vendorId: string): Promise<void>;
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

  // Vendor availability operations
  getVendorAvailability(vendorId: string): Promise<VendorAvailability[]>;
  updateVendorAvailability(availabilityData: InsertVendorAvailability): Promise<VendorAvailability>;

  // Saved vendor operations
  getSavedVendors(userId: string): Promise<SavedVendor[]>;
  saveVendor(saveData: InsertSavedVendor): Promise<SavedVendor>;
  unsaveVendor(userId: string, vendorId: string): Promise<void>;

  // Consumer operations
  getConsumerInquiries(userId: string): Promise<Inquiry[]>;
  updateConsumerProfile(userId: string, updates: any): Promise<any>;

  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(notificationId: string): Promise<void>;
  markAllNotificationsRead(userId: string): Promise<void>;

  // User settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  upsertUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings>;

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

  async deleteVendor(vendorId: string): Promise<void> {
    await db.delete(vendors).where(eq(vendors.id, vendorId));
  }

  async searchVendors(filters: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Vendor[]> {
    const conditions = [eq(vendors.isActive, true)];

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

    return await db
      .select()
      .from(vendors)
      .where(and(...conditions))
      .orderBy(desc(vendors.rating));
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

  // Vendor availability operations
  async getVendorAvailability(vendorId: string): Promise<VendorAvailability[]> {
    return db.select().from(vendorAvailability).where(eq(vendorAvailability.vendorId, vendorId));
  }

  async updateVendorAvailability(availabilityData: InsertVendorAvailability): Promise<VendorAvailability> {
    const [existing] = await db
      .select()
      .from(vendorAvailability)
      .where(and(
        eq(vendorAvailability.vendorId, availabilityData.vendorId),
        eq(vendorAvailability.date, availabilityData.date)
      ));

    if (existing) {
      // Update existing availability record
      const [updated] = await db
        .update(vendorAvailability)
        .set({ ...availabilityData, updatedAt: new Date() })
        .where(eq(vendorAvailability.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new availability record
      const [created] = await db
        .insert(vendorAvailability)
        .values(availabilityData)
        .returning();
      return created;
    }
  }

  // Saved vendor operations
  async getSavedVendors(userId: string): Promise<SavedVendor[]> {
    return db
      .select({
        id: savedVendors.id,
        userId: savedVendors.userId,
        vendorId: savedVendors.vendorId,
        createdAt: savedVendors.createdAt,
        vendor: vendors,
      })
      .from(savedVendors)
      .innerJoin(vendors, eq(savedVendors.vendorId, vendors.id))
      .where(eq(savedVendors.userId, userId)) as any;
  }

  async saveVendor(saveData: InsertSavedVendor): Promise<SavedVendor> {
    // Check if already saved
    const [existing] = await db
      .select()
      .from(savedVendors)
      .where(
        and(
          eq(savedVendors.userId, saveData.userId),
          eq(savedVendors.vendorId, saveData.vendorId)
        )
      );

    if (existing) {
      return existing;
    }

    const [saved] = await db
      .insert(savedVendors)
      .values(saveData)
      .returning();
    return saved;
  }

  async unsaveVendor(userId: string, vendorId: string): Promise<void> {
    await db
      .delete(savedVendors)
      .where(
        and(
          eq(savedVendors.userId, userId),
          eq(savedVendors.vendorId, vendorId)
        )
      );
  }

  // Consumer operations
  async getConsumerInquiries(userId: string): Promise<Inquiry[]> {
    // Get inquiries based on user role - if couple, use couple id, if individual, use user id directly
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      return [];
    }

    if (user.role === 'couple') {
      const [couple] = await db.select().from(couples).where(eq(couples.userId, userId));
      if (!couple) return [];
      
      return db
        .select({
          id: inquiries.id,
          coupleId: inquiries.coupleId,
          vendorId: inquiries.vendorId,
          message: inquiries.message,
          budget: inquiries.budget,
          eventDate: inquiries.eventDate,
          status: inquiries.status,
          vendorResponse: inquiries.vendorResponse,
          createdAt: inquiries.createdAt,
          updatedAt: inquiries.updatedAt,
          vendor: vendors,
        })
        .from(inquiries)
        .innerJoin(vendors, eq(inquiries.vendorId, vendors.id))
        .where(eq(inquiries.coupleId, couple.id))
        .orderBy(desc(inquiries.createdAt)) as any;
    }

    // For individuals or other consumer types, we might need a different approach
    // For now, return empty array
    return [];
  }

  async updateConsumerProfile(userId: string, updates: any): Promise<any> {
    // Update based on user role
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === 'couple') {
      const [couple] = await db.select().from(couples).where(eq(couples.userId, userId));
      if (!couple) {
        throw new Error('Couple profile not found');
      }

      const [updated] = await db
        .update(couples)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(couples.id, couple.id))
        .returning();
      return updated;
    }

    if (user.role === 'individual') {
      const [individual] = await db.select().from(individuals).where(eq(individuals.userId, userId));
      if (!individual) {
        throw new Error('Individual profile not found');
      }

      const [updated] = await db
        .update(individuals)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(individuals.id, individual.id))
        .returning();
      return updated;
    }

    throw new Error('Invalid user role for consumer profile update');
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId));
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));
  }

  // User settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings;
  }

  async upsertUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings> {
    const [upserted] = await db
      .insert(userSettings)
      .values({ userId, ...settings })
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: { ...settings, updatedAt: new Date() },
      })
      .returning();
    return upserted;
  }

}

export const storage = new DatabaseStorage();
