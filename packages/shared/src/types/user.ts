import type { NotificationKind, UserRole } from "../constants";
import type { Vnd } from "../money";
import type { IsoDateTime, PhotoRef } from "./common";

export interface CustomerNotificationPrefs {
  orders: boolean;
  pickupReminder: boolean;
  followedStores: boolean;
  nearbyDeals: boolean;
  reviewReminder: boolean;
  news: boolean;
}

/** `users/{uid}` */
export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  phoneVerified: boolean;
  email: string | null;
  avatar: PhotoRef | null;
  role: UserRole;
  areaLabel: string;
  impact: {
    bagsSaved: number;
    foodKg: number;
    moneySaved: Vnd;
  };
  notificationPrefs: CustomerNotificationPrefs;
  followingStoreIds: string[];
  savedBagIds: string[];
}

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: IsoDateTime;
  read: boolean;
  /** In-app route to open, e.g. "/pickup/o1". */
  link: string | null;
}
