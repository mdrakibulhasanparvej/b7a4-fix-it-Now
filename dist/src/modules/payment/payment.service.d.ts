export declare const paymentService: {
    createPaymentIntent: (customerId: string, bookingId: string) => Promise<{
        clientSecret: string | null;
        payment: {
            id: string;
            userId: string;
            status: string;
            bookingId: string;
            amount: number;
            provider: string;
            transactionId: string | null;
        };
    }>;
    confirmPayment: (paymentIntentId: string) => Promise<{
        id: string;
        userId: string;
        status: string;
        bookingId: string;
        amount: number;
        provider: string;
        transactionId: string | null;
    }>;
    getMyPayments: (userId: string) => Promise<({
        booking: {
            service: {
                id: string;
                description: string | null;
                title: string;
                price: number;
                categoryId: string;
                technicianId: string;
            };
        } & {
            id: string;
            technicianId: string;
            customerId: string;
            serviceId: string;
            status: import("../../../generated/prisma/enums").BookingStatus;
            scheduleDate: Date | null;
        };
    } & {
        id: string;
        userId: string;
        status: string;
        bookingId: string;
        amount: number;
        provider: string;
        transactionId: string | null;
    })[]>;
    getPaymentById: (paymentId: string, userId: string) => Promise<{
        booking: {
            service: {
                id: string;
                description: string | null;
                title: string;
                price: number;
                categoryId: string;
                technicianId: string;
            };
        } & {
            id: string;
            technicianId: string;
            customerId: string;
            serviceId: string;
            status: import("../../../generated/prisma/enums").BookingStatus;
            scheduleDate: Date | null;
        };
    } & {
        id: string;
        userId: string;
        status: string;
        bookingId: string;
        amount: number;
        provider: string;
        transactionId: string | null;
    }>;
    handleStripeWebhook: (body: Buffer, sig: string) => Promise<{
        received: boolean;
    }>;
};
//# sourceMappingURL=payment.service.d.ts.map