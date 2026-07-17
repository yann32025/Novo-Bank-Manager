import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Professional session setup with 30-minute timeout
  app.use(session({
    cookie: { 
      maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    },
    store: new SessionStore({
      checkPeriod: 86400000 
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'novo-banco-secure-key-2026'
  }));

  // Setup / migrate account data
  try {
    const { db } = await import("./db");
    const { users, accounts } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");

    let targetUser = await storage.getUserByUsername("AlexandraJade1");

    if (!targetUser) {
      // Migrate old user if exists
      const oldUser = await storage.getUserByUsername("Manoel11");
      if (oldUser) {
        await db.update(users).set({
          username: "AlexandraJade1",
          password: "1515",
          fullName: "Alexandra Jade Clara",
          profilePicture: null,
        }).where(eq(users.id, oldUser.id));
        await db.update(accounts).set({
          balance: "167000.00",
          isBlocked: true,
        }).where(eq(accounts.userId, oldUser.id));
      } else {
        // Create fresh account
        const [user] = await db.insert(users).values({
          username: "AlexandraJade1",
          password: "1515",
          fullName: "Alexandra Jade Clara",
          profilePicture: null,
        }).returning();
        await db.insert(accounts).values({
          userId: user.id,
          accountNumber: "00056006910",
          balance: "167000.00",
          isBlocked: true,
          cardNumber: "4000 1234 5678 9010",
        });
      }
    }
  } catch(e) {
    console.error("Failed to seed data", e);
  }

  // Auth Middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    next();
  };

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(input.username);
      
      if (!user || user.password !== input.password) {
        return res.status(401).json({ message: "Identifiants incorrects" });
      }

      // @ts-ignore
      req.session.userId = user.id;
      
      res.json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        profilePicture: user.profilePicture
      });
    } catch (e) {
      res.status(400).json({ message: "Erreur de validation" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    // @ts-ignore
    req.session.destroy();
    res.json({ message: "Déconnecté" });
  });

  app.get(api.auth.me.path, requireAuth, async (req, res) => {
    // @ts-ignore
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).json({ message: "Utilisateur introuvable" });
    
    res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      profilePicture: user.profilePicture
    });
  });

  app.get(api.accounts.get.path, requireAuth, async (req, res) => {
    // @ts-ignore
    const account = await storage.getAccount(req.session.userId);
    if (!account) return res.status(404).json({ message: "Compte introuvable" });
    
    res.json({
      id: account.id,
      accountNumber: account.accountNumber,
      balance: account.balance,
      isBlocked: account.isBlocked,
      cardNumber: account.cardNumber
    });
  });

  app.post(api.transfers.create.path, requireAuth, async (req, res) => {
    try {
      // @ts-ignore
      const userId = req.session.userId;
      const account = await storage.getAccount(userId);
      
      const input = api.transfers.create.input.parse(req.body);

      if (account?.isBlocked) {
        await storage.createTransfer(userId, input.iban, input.bic, input.amount, "failed", "Le compte est bloqué");
        await storage.createNotification(userId, "Virement refusé: Le compte est bloqué.");
        return res.status(403).json({ message: "Virement refusé: Le compte est bloqué." });
      }

      // If not blocked, it would succeed
      await storage.createTransfer(userId, input.iban, input.bic, input.amount, "success", "");
      await storage.createNotification(userId, "Virement effectué avec succès.");
      res.json({ id: 1, status: "success", message: "Virement effectué" });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Erreur interne" });
    }
  });

  app.get(api.notifications.list.path, requireAuth, async (req, res) => {
    // @ts-ignore
    const notifications = await storage.getNotifications(req.session.userId);
    res.json(notifications);
  });

  app.post(api.notifications.markRead.path, requireAuth, async (req, res) => {
    // @ts-ignore
    await storage.markNotificationsAsRead(req.session.userId);
    res.json({ success: true });
  });

  app.post(api.profile.updatePicture.path, requireAuth, async (req, res) => {
    try {
      const input = api.profile.updatePicture.input.parse(req.body);
      // @ts-ignore
      const user = await storage.updateProfilePicture(req.session.userId, input.profilePicture);
      res.json({ success: true, profilePicture: user.profilePicture });
    } catch(e) {
      res.status(400).json({ message: "Erreur de validation" });
    }
  });

  return httpServer;
}
