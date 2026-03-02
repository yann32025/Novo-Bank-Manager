import { db } from "./db";
import { 
  users, accounts, notifications, transfers,
  type User, type Account, type Notification, type Transfer
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAccount(userId: number): Promise<Account | undefined>;
  
  createNotification(userId: number, message: string): Promise<Notification>;
  getNotifications(userId: number): Promise<Notification[]>;
  markNotificationsAsRead(userId: number): Promise<void>;
  
  createTransfer(userId: number, iban: string, bic: string, amount: string, status: string, reason: string): Promise<Transfer>;
  updateProfilePicture(userId: number, url: string): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getAccount(userId: number): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.userId, userId));
    return account;
  }

  async createNotification(userId: number, message: string): Promise<Notification> {
    const [notification] = await db.insert(notifications).values({
      userId,
      message,
    }).returning();
    return notification;
  }

  async getNotifications(userId: number): Promise<Notification[]> {
    return await db.select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationsAsRead(userId: number): Promise<void> {
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));
  }

  async createTransfer(userId: number, iban: string, bic: string, amount: string, status: string, reason: string): Promise<Transfer> {
    const [transfer] = await db.insert(transfers).values({
      userId,
      iban,
      bic,
      amount,
      status,
      reason
    }).returning();
    return transfer;
  }

  async updateProfilePicture(userId: number, url: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ profilePicture: url })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
