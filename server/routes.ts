import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { insertVendorSchema, insertVendorPackageSchema, insertInquirySchema, insertBudgetItemSchema, insertTimelineItemSchema, insertCoupleSchema, insertIndividualSchema } from "@shared/schema";
import { z } from "zod";

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

  // Vendor routes
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

  app.put('/api/vendors/profile', isAuthenticated, async (req: any, res) => {
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

  // Portfolio routes
  app.get('/api/vendor/portfolio', isAuthenticated, async (req: any, res) => {
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

  // Inquiry routes
  app.post('/api/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const couple = await storage.getCoupleByUserId(userId);
      
      if (!couple) {
        return res.status(404).json({ message: "Couple profile not found" });
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

  app.get('/api/inquiries/received', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const vendor = await storage.getVendorByUserId(userId);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }

      const inquiries = await storage.getVendorInquiries(vendor.id);
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.get('/api/inquiries/sent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const couple = await storage.getCoupleByUserId(userId);
      
      if (!couple) {
        return res.status(404).json({ message: "Couple profile not found" });
      }

      const inquiries = await storage.getCoupleInquiries(couple.id);
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.put('/api/inquiries/:inquiryId/respond', isAuthenticated, async (req: any, res) => {
    try {
      const { inquiryId } = req.params;
      const { response, status } = req.body;
      
      const inquiry = await storage.updateInquiry(inquiryId, {
        vendorResponse: response,
        status,
      });
      
      res.json(inquiry);
    } catch (error) {
      console.error("Error responding to inquiry:", error);
      res.status(500).json({ message: "Failed to respond to inquiry" });
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

  const httpServer = createServer(app);
  return httpServer;
}
