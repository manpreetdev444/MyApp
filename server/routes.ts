import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { insertVendorSchema, insertVendorPackageSchema, insertInquirySchema, insertBudgetItemSchema, insertTimelineItemSchema, insertCoupleSchema, insertIndividualSchema } from "@shared/schema";
import { z } from "zod";
import { eq, ilike, and, or } from "drizzle-orm";
import { db } from "./db";
import { vendors } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get role-specific data
      let roleData = null;
      if (user.role === 'vendor') {
        roleData = await storage.getVendorByUserId(userId);
      } else if (user.role === 'consumer') {
        roleData = await storage.getIndividualByUserId(userId);
      }

      res.json({ ...user, roleData });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Setup user profile after login
  app.post('/api/setup-profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const { role, ...profileData } = req.body;

      // Update user role
      await storage.upsertUser({
        id: userId,
        ...(req.user as any).claims,
        role,
      });

      // Create role-specific profile
      if (role === 'vendor') {
        const vendorData = insertVendorSchema.parse({
          userId,
          businessName: profileData.businessName || 'My Business',
          category: profileData.category || 'Other Services',
          description: profileData.description || 'Professional services',
          ...profileData,
        });
        const vendor = await storage.createVendor(vendorData);
        res.json({ success: true, profile: vendor });
      } else if (role === 'consumer') {
        const individualData = insertIndividualSchema.parse({
          userId,
          fullName: profileData.fullName || `${(req.user as any).claims.first_name} ${(req.user as any).claims.last_name}`,
          ...profileData,
        });
        const individual = await storage.createIndividual(individualData);
        res.json({ success: true, profile: individual });
      } else {
        res.status(400).json({ message: "Invalid role" });
      }
    } catch (error) {
      console.error("Error setting up profile:", error);
      res.status(500).json({ message: "Failed to setup profile" });
    }
  });

  // 1. /api/vendors - Vendor CRUD operations
  // GET all vendors with filters for consumer search
  app.get('/api/vendors', async (req, res) => {
    try {
      const { category, location, search, minPrice, maxPrice } = req.query;
      
      const vendors = await storage.searchVendors({
        category: category as string,
        location: location as string,
        search: search as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });

      res.json(vendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  // GET single vendor by ID
  app.get('/api/vendors/:vendorId', async (req, res) => {
    try {
      const { vendorId } = req.params;
      
      const vendor = await storage.getVendorById(vendorId);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      const packages = await storage.getVendorPackages(vendorId);
      const portfolio = await storage.getVendorPortfolio(vendorId);

      res.json({
        ...vendor,
        packages,
        portfolio,
      });
    } catch (error) {
      console.error("Error fetching vendor:", error);
      res.status(500).json({ message: "Failed to fetch vendor" });
    }
  });

  // POST create vendor profile (when vendor updates profile)
  app.post('/api/vendors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      
      // Check if vendor already exists
      const existingVendor = await storage.getVendorByUserId(userId);
      if (existingVendor) {
        return res.status(409).json({ message: "Vendor profile already exists" });
      }

      const vendorData = insertVendorSchema.parse({
        ...req.body,
        userId,
      });
      
      const vendor = await storage.createVendor(vendorData);
      res.json(vendor);
    } catch (error) {
      console.error("Error creating vendor:", error);
      res.status(500).json({ message: "Failed to create vendor profile" });
    }
  });

  // PUT update vendor profile
  app.put('/api/vendors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const vendor = await storage.getVendorByUserId(userId);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }

      const updates = insertVendorSchema.partial().parse(req.body);
      const updatedVendor = await storage.updateVendor(vendor.id, updates);
      
      res.json(updatedVendor);
    } catch (error) {
      console.error("Error updating vendor profile:", error);
      res.status(500).json({ message: "Failed to update vendor profile" });
    }
  });

  // DELETE vendor (optional for later)
  app.delete('/api/vendors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const vendor = await storage.getVendorByUserId(userId);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }

      await storage.deleteVendor(vendor.id);
      res.json({ message: "Vendor profile deleted successfully" });
    } catch (error) {
      console.error("Error deleting vendor:", error);
      res.status(500).json({ message: "Failed to delete vendor profile" });
    }
  });

  // Vendor package routes
  app.get('/api/vendor/packages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const vendor = await storage.getVendorByUserId(userId);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }

      const packages = await storage.getVendorPackages(vendor.id);
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  app.post('/api/vendor/packages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const vendor = await storage.getVendorByUserId(userId);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }

      const packageData = insertVendorPackageSchema.parse({
        ...req.body,
        vendorId: vendor.id,
      });
      
      const newPackage = await storage.createVendorPackage(packageData);
      res.json(newPackage);
    } catch (error) {
      console.error("Error creating package:", error);
      res.status(500).json({ message: "Failed to create package" });
    }
  });

  // 4. /api/portfolio - Vendor portfolio management
  // GET vendor portfolio
  app.get('/api/portfolio', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const vendor = await storage.getVendorByUserId(userId);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }

      const portfolio = await storage.getVendorPortfolio(vendor.id);
      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // POST vendor uploads images/videos/links
  app.post('/api/portfolio', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const vendor = await storage.getVendorByUserId(userId);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }

      const portfolioData = {
        ...req.body,
        vendorId: vendor.id,
      };
      
      const portfolioItem = await storage.createPortfolioItem(portfolioData);
      res.json(portfolioItem);
    } catch (error) {
      console.error("Error uploading portfolio item:", error);
      res.status(500).json({ message: "Failed to upload portfolio item" });
    }
  });

  // Object storage routes for portfolio images
  app.get("/objects/:objectPath(*)", isAuthenticated, async (req, res) => {
    const userId = (req.user as any)?.claims?.sub;
    const objectStorageService = new ObjectStorageService();
    
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      
      if (!canAccess) {
        return res.sendStatus(401);
      }
      
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  app.put("/api/portfolio-images", isAuthenticated, async (req: any, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    const userId = (req.user as any)?.claims?.sub;
    const vendor = await storage.getVendorByUserId(userId);
    
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.imageURL,
        {
          owner: userId,
          visibility: "public",
        },
      );

      const portfolioItem = await storage.createPortfolioItem({
        vendorId: vendor.id,
        title: req.body.title || '',
        description: req.body.description || '',
        imageUrl: objectPath,
        orderIndex: req.body.orderIndex || 0,
      });

      res.status(200).json({
        objectPath: objectPath,
        portfolioItem,
      });
    } catch (error) {
      console.error("Error setting portfolio image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vendor availability routes
  app.get('/api/vendor/availability', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const vendor = await storage.getVendorByUserId(userId);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }

      const availability = await storage.getVendorAvailability(vendor.id);
      res.json(availability);
    } catch (error) {
      console.error("Error fetching vendor availability:", error);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  app.put('/api/vendor/availability', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const vendor = await storage.getVendorByUserId(userId);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }

      const { date, isAvailable, eventType, eventTitle, notes } = req.body;
      
      if (!date) {
        return res.status(400).json({ error: "Date is required" });
      }

      const availability = await storage.updateVendorAvailability({
        vendorId: vendor.id,
        date: new Date(date),
        isAvailable: isAvailable ?? true,
        eventType: eventType || null,
        eventTitle: eventTitle || null,
        notes: notes || null,
      });

      res.json(availability);
    } catch (error) {
      console.error("Error updating vendor availability:", error);
      res.status(500).json({ message: "Failed to update availability" });
    }
  });

  // Vendor profile routes
  app.put('/api/vendor/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const vendor = await storage.getVendorByUserId(userId);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }

      const { businessName, category, description, location, phone, website, instagram, pinterest } = req.body;
      
      const updatedVendor = await storage.updateVendor(vendor.id, {
        businessName,
        category,
        description,
        location,
        phone,
        website,
        instagram,
        pinterest,
      });

      res.json(updatedVendor);
    } catch (error) {
      console.error("Error updating vendor profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Inquiry routes
  // 2. /api/inquiries - Inquiry management
  // POST consumer sends inquiry to vendor
  app.post('/api/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const couple = await storage.getCoupleByUserId(userId);
      
      if (!couple) {
        return res.status(404).json({ message: "Consumer profile not found" });
      }

      const inquiryData = insertInquirySchema.parse({
        ...req.body,
        coupleId: couple.id,
      });
      
      const inquiry = await storage.createInquiry(inquiryData);
      res.json(inquiry);
    } catch (error) {
      console.error("Error creating inquiry:", error);
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  // GET vendor inquiries (received inquiries for vendors)
  app.get('/api/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role === 'vendor') {
        const vendor = await storage.getVendorByUserId(userId);
        if (!vendor) {
          return res.status(404).json({ message: "Vendor profile not found" });
        }
        const inquiries = await storage.getVendorInquiries(vendor.id);
        res.json(inquiries);
      } else if (user.role === 'consumer') {
        // For consumers, get their sent inquiries
        const inquiries = await storage.getConsumerInquiries(userId);
        res.json(inquiries);
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  // PUT vendor updates inquiry status (accept/decline)
  app.put('/api/inquiries/:inquiryId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const { inquiryId } = req.params;
      const { response, status } = req.body;

      // Verify the vendor owns this inquiry
      const vendor = await storage.getVendorByUserId(userId);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }

      const inquiry = await storage.updateInquiry(inquiryId, {
        vendorResponse: response,
        status,
      });
      
      res.json(inquiry);
    } catch (error) {
      console.error("Error updating inquiry:", error);
      res.status(500).json({ message: "Failed to update inquiry" });
    }
  });

  // Budget routes
  app.get('/api/budget', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const couple = await storage.getCoupleByUserId(userId);
      
      if (!couple) {
        return res.status(404).json({ message: "Couple profile not found" });
      }

      const budgetItems = await storage.getBudgetItems(couple.id);
      res.json(budgetItems);
    } catch (error) {
      console.error("Error fetching budget:", error);
      res.status(500).json({ message: "Failed to fetch budget" });
    }
  });

  app.post('/api/budget', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const couple = await storage.getCoupleByUserId(userId);
      
      if (!couple) {
        return res.status(404).json({ message: "Couple profile not found" });
      }

      const budgetData = insertBudgetItemSchema.parse({
        ...req.body,
        coupleId: couple.id,
      });
      
      const budgetItem = await storage.createBudgetItem(budgetData);
      res.json(budgetItem);
    } catch (error) {
      console.error("Error creating budget item:", error);
      res.status(500).json({ message: "Failed to create budget item" });
    }
  });

  // Timeline routes
  app.get('/api/timeline', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const couple = await storage.getCoupleByUserId(userId);
      
      if (!couple) {
        return res.status(404).json({ message: "Couple profile not found" });
      }

      const timelineItems = await storage.getTimelineItems(couple.id);
      res.json(timelineItems);
    } catch (error) {
      console.error("Error fetching timeline:", error);
      res.status(500).json({ message: "Failed to fetch timeline" });
    }
  });

  app.post('/api/timeline', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const couple = await storage.getCoupleByUserId(userId);
      
      if (!couple) {
        return res.status(404).json({ message: "Couple profile not found" });
      }

      const timelineData = insertTimelineItemSchema.parse({
        ...req.body,
        coupleId: couple.id,
      });
      
      const timelineItem = await storage.createTimelineItem(timelineData);
      res.json(timelineItem);
    } catch (error) {
      console.error("Error creating timeline item:", error);
      res.status(500).json({ message: "Failed to create timeline item" });
    }
  });

  app.put('/api/timeline/:itemId', isAuthenticated, async (req: any, res) => {
    try {
      const { itemId } = req.params;
      const updates = req.body;
      
      const timelineItem = await storage.updateTimelineItem(itemId, updates);
      res.json(timelineItem);
    } catch (error) {
      console.error("Error updating timeline item:", error);
      res.status(500).json({ message: "Failed to update timeline item" });
    }
  });

  // 3. /api/calendar - Vendor availability management
  // GET vendor availability
  app.get('/api/calendar', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const vendor = await storage.getVendorByUserId(userId);

      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      const availability = await storage.getVendorAvailability(vendor.id);
      res.json(availability);
    } catch (error) {
      console.error("Error fetching vendor availability:", error);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  // POST vendor sets availability
  app.post('/api/calendar', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const vendor = await storage.getVendorByUserId(userId);

      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      const { date, isAvailable } = req.body;
      if (!date) {
        return res.status(400).json({ message: "Date is required" });
      }

      const availability = await storage.updateVendorAvailability({
        vendorId: vendor.id,
        date: new Date(date),
        isAvailable: Boolean(isAvailable),
      });

      res.json(availability);
    } catch (error) {
      console.error("Error setting vendor availability:", error);
      res.status(500).json({ message: "Failed to set availability" });
    }
  });

  // PUT update availability
  app.put('/api/calendar', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const vendor = await storage.getVendorByUserId(userId);

      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      const { date, isAvailable } = req.body;
      if (!date) {
        return res.status(400).json({ message: "Date is required" });
      }

      const availability = await storage.updateVendorAvailability({
        vendorId: vendor.id,
        date: new Date(date),
        isAvailable: Boolean(isAvailable),
      });

      res.json(availability);
    } catch (error) {
      console.error("Error updating vendor availability:", error);
      res.status(500).json({ message: "Failed to update availability" });
    }
  });

  // Consumer routes
  app.get('/api/vendors/search', isAuthenticated, async (req: any, res) => {
    try {
      const { searchQuery = '', categoryFilter = '', locationFilter = '', budgetFilter = '' } = req.query;
      
      // Build search filters
      const whereConditions: any[] = [];
      
      if (searchQuery) {
        whereConditions.push(
          or(
            ilike(vendors.businessName, `%${searchQuery}%`),
            ilike(vendors.description, `%${searchQuery}%`)
          )
        );
      }
      
      if (categoryFilter) {
        whereConditions.push(eq(vendors.category, categoryFilter));
      }
      
      if (locationFilter) {
        whereConditions.push(ilike(vendors.location, `%${locationFilter}%`));
      }

      const searchCondition = whereConditions.length > 0 ? and(...whereConditions) : undefined;

      const vendorList = await (searchCondition
        ? db.select().from(vendors).where(searchCondition).limit(50)
        : db.select().from(vendors).limit(50)
      );

      res.json(vendorList);
    } catch (error) {
      console.error("Error searching vendors:", error);
      res.status(500).json({ message: "Failed to search vendors" });
    }
  });

  app.get('/api/consumer/saved-vendors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedVendors = await storage.getSavedVendors(userId);
      res.json(savedVendors);
    } catch (error) {
      console.error("Error fetching saved vendors:", error);
      res.status(500).json({ message: "Failed to fetch saved vendors" });
    }
  });

  app.post('/api/consumer/save-vendor', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { vendorId } = req.body;

      if (!vendorId) {
        return res.status(400).json({ message: "Vendor ID is required" });
      }

      const savedVendor = await storage.saveVendor({ userId, vendorId });
      res.json(savedVendor);
    } catch (error) {
      console.error("Error saving vendor:", error);
      res.status(500).json({ message: "Failed to save vendor" });
    }
  });

  app.delete('/api/consumer/save-vendor/:vendorId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { vendorId } = req.params;

      await storage.unsaveVendor(userId, vendorId);
      res.json({ message: "Vendor removed from saved list" });
    } catch (error) {
      console.error("Error removing saved vendor:", error);
      res.status(500).json({ message: "Failed to remove vendor" });
    }
  });

  app.get('/api/consumer/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const inquiries = await storage.getConsumerInquiries(userId);
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching consumer inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.put('/api/consumer/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;

      const updatedProfile = await storage.updateConsumerProfile(userId, updates);
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating consumer profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
