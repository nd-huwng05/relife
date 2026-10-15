import type { IsoDateTime } from "./common";

/** `reviews/{id}`: one per collected order. */
export interface Review {
  id: string;
  orderId: string;
  storeId: string;
  customerName: string;
  rating: number;
  tags: string[];
  text: string;
  createdAt: IsoDateTime;
  reply: { text: string; createdAt: IsoDateTime } | null;
}

export interface ReviewSummary {
  rating: number;
  count30d: number;
  topTags: { label: string; count: number }[];
}
