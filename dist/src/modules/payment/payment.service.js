import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { getStripe } from "../../utils/stripe";
import httpStatus from "http-status";
const createPaymentIntent = async (customerId, bookingId) => {
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
        throw new AppError(httpStatus.BAD_REQUEST, "Booking must be accepted before payment");
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
const confirmPayment = async (paymentIntentId) => {
    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);
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
const getMyPayments = async (userId) => {
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
const getPaymentById = async (paymentId, userId) => {
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
const handleStripeWebhook = async (body, sig) => {
    const event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
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
//# sourceMappingURL=payment.service.js.map