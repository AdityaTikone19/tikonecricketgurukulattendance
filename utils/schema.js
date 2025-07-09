import { boolean, int, mysqlTable, varchar, datetime, text } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const GRADES=mysqlTable('grades',{
       id:int('id').primaryKey(),
       grade:varchar('grade',{length:25}).notNull()
});

export const STUDENTS=mysqlTable('students',{
       id:int('id').autoincrement().primaryKey(),
       name:varchar('name',{length:20}).notNull(),
       grade:varchar('grade',{length:25}).notNull(),
       address:varchar('address',{length:50}),
       contact:varchar('contact',{length:11}),
       age:varchar('age',{length:20}),
       email: varchar('email', { length: 255 }),
       dateOfBirth:varchar('date_of_birth',{length:25}).notNull(),
       
})

export const ATTENDANCE=mysqlTable('attendance',{
       id:int('id',{length:11}).autoincrement().primaryKey(),
       studentId:int('studentId',{length:11}).notNull(),
       present:boolean('present').default(false),
       day:int('day',{length:11}).notNull(),
       date:varchar('date',{length:20}),
});

export const USERS = mysqlTable('users', {
       id: int('id').primaryKey().autoincrement(),
       email: varchar('email', { length: 255 }).notNull(),
       password: varchar('password', { length: 255 }).notNull(),
       sessionToken: varchar('session_token', { length: 255 }),
       token: varchar('token', { length: 255 }), 
});

export const PASSWORD_RESET_TOKENS = mysqlTable("password_reset_tokens", {
       token: varchar("token", { length: 255 }).primaryKey(),
       email: varchar("email", { length: 255 }).notNull(),
       expires: datetime("expires").notNull(),
     });

     
export const userSettings = mysqlTable("user_settings", {
       email: varchar("email", { length: 255 }).primaryKey(), // now using email instead of id
       name: varchar("name", { length: 255 }),
       bio: varchar("bio", { length: 512 }),
       theme: varchar("theme", { length: 10 }),
       emailNotifications: boolean("email_notifications"),
       smsNotifications: boolean("sms_notifications"),
       pushNotifications: boolean("push_notifications"),
       pushSubscription: text("push_subscription"),
       phone: varchar("phone", { length: 20 }),
     });

export const SESSION_TOKENS = mysqlTable("session_tokens", {
       token: varchar("token", { length: 255 }).primaryKey(),
       email: varchar("email", { length: 255 }).notNull(),
       createdAt: datetime("created_at").default(sql`NOW()`),
     });
     