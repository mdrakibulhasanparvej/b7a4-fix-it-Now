import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { getStripe } from "../../utils/stripe";
import httpStatus from "http-status";

// The paymentService object provides methods for managing payments in the application. It includes functions to create a payment intent, confirm a payment, retrieve payments for a specific user, get payment details by ID, and handle Stripe webhook events. Each method interacts with the database using Prisma and handles potential errors by throwing AppError instances with appropriate HTTP status codes and messages.

const createPaymentIntent = async (customerId: string, bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new AppError(httpStatus.FORBIDDEN, "Not your booking");
  }

  if (booking.status !== "ACCEPTED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Booking must be accepted before payment",
    );
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (existingPayment?.status === "COMPLETED") {
    throw new AppError(httpStatus.BAD_REQUEST, "Already paid");
  }

  const amountInCents = Math.round(booking.service.price * 100);

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    metadata: { bookingId },
  });

  const payment = await prisma.payment.upsert({
    where: { bookingId },
    update: {
      amount: booking.service.price,
      transactionId: paymentIntent.id,
      status: "PENDING",
    },
    create: {
      bookingId,
      amount: booking.service.price,
      transactionId: paymentIntent.id,
      status: "PENDING",
      userId: customerId,
    },
  });

  return { clientSecret: paymentIntent.client_secret, payment };
};

// The confirmPayment function confirms a payment by checking the status of the payment intent retrieved from Stripe. It takes a paymentIntentId as a parameter and retrieves the corresponding payment intent from Stripe. If the payment intent status is not "succeeded", it throws an AppError indicating that the payment has not succeeded. It then retrieves the bookingId from the payment intent metadata and updates the payment record in the database to mark it as "COMPLETED". Finally, it updates the associated booking status to "PAID" and returns the updated payment information.

const confirmPayment = async (paymentIntentId: string) => {
  const paymentIntent =
    await getStripe().paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment has not succeeded");
  }

  const bookingId = paymentIntent.metadata.bookingId;
  if (!bookingId) {
    throw new AppError(httpStatus.BAD_REQUEST, "No booking linked");
  }

  const payment = await prisma.payment.update({
    where: { bookingId },
    data: { status: "COMPLETED", transactionId: paymentIntent.id },
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "PAID" },
  });

  return payment;
};

// The getMyPayments function retrieves payments for a specific user based on their userId. It takes a userId as a parameter and queries the database for payments associated with the user. The function includes related information such as the associated booking and service, and orders the results by payment ID in descending order.

const getMyPayments = async (userId: string) => {
  return prisma.payment.findMany({
    where: { userId },
    include: {
      booking: {
        include: { service: true },
      },
    },
    orderBy: { id: "desc" },
  });
};

// The getPaymentById function retrieves payment details by payment ID and user ID. It takes a paymentId and userId as parameters and queries the database for the corresponding payment record. If the payment is not found, it throws an AppError with a not found status code. If the user is not authorized to view the payment (i.e., they are not the owner of the payment), it throws an AppError with a forbidden status code. If the checks pass, it returns the payment details along with related information such as the associated booking and service.

const getPaymentById = async (paymentId: string, userId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: {
        include: { service: true },
      },
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Not your payment");
  }

  return payment;
};

// The handleStripeWebhook function handles Stripe webhook events. It takes the raw request body and the Stripe signature as parameters, constructs the event using the Stripe library, and checks the event type. If the event type is "payment_intent.succeeded", it retrieves the payment intent from the event data and calls the confirmPayment function to confirm the payment. Finally, it returns a response indicating that the webhook event was received.

const handleStripeWebhook = async (body: Buffer, sig: string) => {
  const event = getStripe().webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as any;
    await confirmPayment(paymentIntent.id);
  }

  return { received: true };
};

export const paymentService = {
  createPaymentIntent,
  confirmPayment,
  getMyPayments,
  getPaymentById,
  handleStripeWebhook,
};
