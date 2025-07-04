// src/db/schema.ts
import {
    pgTable,
    serial,
    varchar,
    text,
    timestamp,
    integer,
    decimal,
    boolean,
    date,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 🔸 Enums
export const bookingStatusEnum = pgEnum("booking_status", ["Pending", "Confirmed"]);
export const ticketStatusEnum = pgEnum("ticket_status", ["Open", "In Progress", "Resolved", "Closed"]);

// 🔹 Users Table
export const UsersTable = pgTable("users", {
    userId: serial("user_id").primaryKey(),
    firstname: varchar("firstname", { length: 50 }).notNull(),
    lastname: varchar("lastname", { length: 50 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: text("password").notNull(),
    contactPhone: varchar("contact_phone", { length: 20 }).notNull(),
    address: varchar("address", { length: 255 }).notNull(),
    isAdmin: boolean("is_admin").default(false),
    verificationCode: varchar("verification_code", { length: 6 }),
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 🔹 Hotels Table
export const HotelsTable = pgTable("hotels", {
    hotelId: serial("hotel_id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    imageUrl: varchar("image_url", { length: 255 }),
    location: varchar("location", { length: 100 }).notNull(),
    address: text("address"),
    contactPhone: varchar("contact_phone", { length: 20 }).notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    rating: varchar("rating", { length: 10 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 🔹 Rooms Table
export const RoomsTable = pgTable("rooms", {
    roomId: serial("room_id").primaryKey(),
    hotelId: integer("hotel_id")
        .references(() => HotelsTable.hotelId, { onDelete: "cascade" }) // If hotel is deleted, remove its rooms
        .notNull(),
    roomType: varchar("room_type", { length: 50 }),
    pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
    capacity: integer("capacity").notNull(),
    amenities: text("amenities"),
    isAvailable: boolean("is_available").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 🔹 Bookings Table
export const BookingsTable = pgTable("bookings", {
    bookingId: serial("booking_id").primaryKey(),
    userId: integer("user_id")
        .references(() => UsersTable.userId, { onDelete: "cascade" }) // If user is deleted, delete bookings
        .notNull(),
    roomId: integer("room_id")
        .references(() => RoomsTable.roomId, { onDelete: "cascade" }) // If room is deleted, delete bookings
        .notNull(),
    checkInDate: date("check_in_date").notNull(),
    checkOutDate: date("check_out_date").notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
    bookingStatus: bookingStatusEnum("booking_status").default("Pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 🔹 Payments Table
export const PaymentsTable = pgTable("payments", {
    paymentId: serial("payment_id").primaryKey(),
    bookingId: integer("booking_id")
        .references(() => BookingsTable.bookingId, { onDelete: "cascade" }) // If booking is deleted, delete payment
        .notNull(),
    userId: integer("user_id")
        .references(() => UsersTable.userId, { onDelete: "cascade" }) // if user is deleted, delete payment
        .notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    isPaid: boolean("is_paid").default(false),
    paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
    transactionId: text("transaction_id").notNull(),
    paymentDate: timestamp("payment_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 🔹 Support Tickets Table
export const SupportTicketsTable = pgTable("support_tickets", {
    ticketId: serial("ticket_id").primaryKey(),
    userId: integer("user_id")
        .references(() => UsersTable.userId, { onDelete: "cascade" }) // If user is deleted, delete their tickets
        .notNull(),
    subject: varchar("subject", { length: 100 }).notNull(),
    description: text("description").notNull(),
    status: ticketStatusEnum("ticket_status").default("Open"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});


// Each user can have multiple bookings, payments, and support tickets.
export const usersRelations = relations(UsersTable, ({ many }) => ({
    bookings: many(BookingsTable), // One user → many bookings
    payments: many(PaymentsTable), // One user → many payments (indirect via bookings)
    tickets: many(SupportTicketsTable), // One user → many support tickets
}));

// Each hotel can have many rooms.
export const hotelsRelations = relations(HotelsTable, ({ many }) => ({
    rooms: many(RoomsTable), // One hotel → many rooms
}));

// Each room belongs to one hotel and can have many bookings over time.
export const roomsRelations = relations(RoomsTable, ({ one, many }) => ({
    hotel: one(HotelsTable, {
        fields: [RoomsTable.hotelId],
        references: [HotelsTable.hotelId],
    }), // One room → belongs to one hotel

    bookings: many(BookingsTable), // One room → many bookings (different dates)
}));

// Each booking is made by one user and is for one room.
export const bookingsRelations = relations(BookingsTable, ({ one }) => ({
    user: one(UsersTable, {
        fields: [BookingsTable.userId],
        references: [UsersTable.userId],
    }), // One booking → made by one user

    room: one(RoomsTable, {
        fields: [BookingsTable.roomId],
        references: [RoomsTable.roomId],
    }), // One booking → for one room
}));

// Each payment is linked to one booking
export const paymentsRelations = relations(PaymentsTable, ({ one }) => ({
    booking: one(BookingsTable, {
        fields: [PaymentsTable.bookingId],
        references: [BookingsTable.bookingId],
    }), // One payment → belongs to one booking
    user: one(UsersTable, {
        fields: [PaymentsTable.userId],
        references: [UsersTable.userId],
    }) // One payment → made by one user
}));

// Each support ticket is submitted by one user
export const supportTicketsRelations = relations(SupportTicketsTable, ({ one }) => ({
    user: one(UsersTable, {
        fields: [SupportTicketsTable.userId],
        references: [UsersTable.userId],
    }), // One support ticket → submitted by one user
}));


export type TSUser = typeof UsersTable.$inferSelect;
export type TSUserInsert = typeof UsersTable.$inferInsert;
export type TSHotel = typeof HotelsTable.$inferSelect;
export type TSHotelInsert = typeof HotelsTable.$inferInsert;
export type TSRoom = typeof RoomsTable.$inferSelect;
export type TSRoomInsert = typeof RoomsTable.$inferInsert;
export type TSBooking = typeof BookingsTable.$inferSelect;
export type TSBookingInsert = typeof BookingsTable.$inferInsert;
export type TSPayment = typeof PaymentsTable.$inferSelect;
export type TSPaymentInsert = typeof PaymentsTable.$inferInsert;
export type TSTicket = typeof SupportTicketsTable.$inferSelect;
export type TSTicketInsert = typeof SupportTicketsTable.$inferInsert;
