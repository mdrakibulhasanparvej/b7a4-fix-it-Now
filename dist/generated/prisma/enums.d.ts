export declare const Role: {
    readonly CUSTOMER: "CUSTOMER";
    readonly TECHNICIAN: "TECHNICIAN";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const BookingStatus: {
    readonly REQUESTED: "REQUESTED";
    readonly ACCEPTED: "ACCEPTED";
    readonly DECLINED: "DECLINED";
    readonly PAID: "PAID";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
//# sourceMappingURL=enums.d.ts.map