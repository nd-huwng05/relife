import { createOrderSchema, type Bag, type CreateOrderInput, type Order, type PaymentInstructions } from "@relife/shared";

import { db, fn, mockRequest } from "@/lib/mock";

// FC4 data access. The app never sets money or status itself: it calls Functions and then
// reads the order back. An order becomes `paid` only through the payment webhook.
// TODO(S4): call `createOrder`, `createPayment`, `cancelHold` callables and listen to
// `orders/{id}` with onSnapshot instead of polling.

export function getBagForCheckout(bagId: string): Promise<Bag> {
  return mockRequest(() => {
    const bag = db.bags.find((b) => b.id === bagId);
    if (!bag) throw new Error("Không tìm thấy túi bánh");
    return bag;
  });
}

export function createOrder(input: CreateOrderInput): Promise<Order> {
  const payload = createOrderSchema.parse(input);
  return mockRequest(() => fn.createOrder(payload), 700);
}

export function getOrder(orderId: string): Promise<Order> {
  return mockRequest(() => {
    fn.expireHolds();
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Không tìm thấy đơn");
    return order;
  }, 200);
}

export function createPayment(orderId: string): Promise<PaymentInstructions> {
  return mockRequest(() => fn.createPayment(orderId), 500);
}

/** "Tôi đã chuyển khoản": tells the server to expect the webhook; does not mark paid. */
export function reportTransfer(orderId: string): Promise<Order> {
  return mockRequest(() => fn.reportTransfer(orderId), 400);
}

export function cancelHold(orderId: string): Promise<Order> {
  return mockRequest(() => fn.cancelHold(orderId), 400);
}

export function getImpact(): Promise<{ bagsSaved: number }> {
  return mockRequest(() => ({ bagsSaved: db.customer.impact.bagsSaved + 1 }), 100);
}
