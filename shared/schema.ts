import { pgTable, text, serial, integer, boolean, timestamp, json, foreignKey, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User role enum
export const roleEnum = pgEnum('role', ['student', 'teacher', 'parent', 'admin']);

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  role: roleEnum("role").notNull(),
  profileImage: text("profileImage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  enrollments: many(enrollments),
  assignments: many(assignments),
  messages: many(messages),
  children: many(parentStudentRelations, { relationName: "parent" }),
  parentOf: many(parentStudentRelations, { relationName: "student" }),
}));

// Subject schema
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // STEM, humanities, arts, languages
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subjectsRelations = relations(subjects, ({ many }) => ({
  courses: many(courses),
}));

// Course schema
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  subjectId: integer("subject_id").references(() => subjects.id).notNull(),
  teacherId: integer("teacher_id").references(() => users.id).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const coursesRelations = relations(courses, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [courses.subjectId],
    references: [subjects.id],
  }),
  teacher: one(users, {
    fields: [courses.teacherId],
    references: [users.id],
  }),
  modules: many(modules),
  enrollments: many(enrollments),
  assignments: many(assignments),
}));

// Module schema
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  content: json("content"), // Store rich content as JSON
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const modulesRelations = relations(modules, ({ one }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
}));

// Enrollment schema
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  progress: integer("progress").default(0), // Progress percentage
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
});

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(users, {
    fields: [enrollments.studentId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

// Assignment schema
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  dueDate: timestamp("due_date").notNull(),
  estimatedTime: integer("estimated_time"), // In minutes
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  course: one(courses, {
    fields: [assignments.courseId],
    references: [courses.id],
  }),
  creator: one(users, {
    fields: [assignments.createdBy],
    references: [users.id],
  }),
  submissions: many(submissions),
}));

// Submission schema
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").references(() => assignments.id).notNull(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  content: text("content"),
  grade: integer("grade"),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  gradedAt: timestamp("graded_at"),
});

export const submissionsRelations = relations(submissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [submissions.assignmentId],
    references: [assignments.id],
  }),
  student: one(users, {
    fields: [submissions.studentId],
    references: [users.id],
  }),
}));

// Message schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
  }),
}));

// Parent-Student relation
export const parentStudentRelations = pgTable("parent_student_relations", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").references(() => users.id).notNull(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const parentStudentRelationsRelations = relations(parentStudentRelations, ({ one }) => ({
  parent: one(users, {
    fields: [parentStudentRelations.parentId],
    references: [users.id],
    relationName: "parent",
  }),
  student: one(users, {
    fields: [parentStudentRelations.studentId],
    references: [users.id],
    relationName: "student",
  }),
}));

// Learning tools schema
export const learningTools = pgTable("learning_tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // virtual_labs, writing_workshop, language_tools, math_solver
  iconClass: text("icon_class").notNull(),
  link: text("link").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Validation schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const insertSubjectSchema = createInsertSchema(subjects);
export const selectSubjectSchema = createSelectSchema(subjects);
export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = typeof subjects.$inferInsert;

export const insertCourseSchema = createInsertSchema(courses);
export const selectCourseSchema = createSelectSchema(courses);
export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export const insertModuleSchema = createInsertSchema(modules);
export const selectModuleSchema = createSelectSchema(modules);
export type Module = typeof modules.$inferSelect;
export type InsertModule = typeof modules.$inferInsert;

export const insertEnrollmentSchema = createInsertSchema(enrollments);
export const selectEnrollmentSchema = createSelectSchema(enrollments);
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

export const insertAssignmentSchema = createInsertSchema(assignments);
export const selectAssignmentSchema = createSelectSchema(assignments);
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = typeof assignments.$inferInsert;

export const insertSubmissionSchema = createInsertSchema(submissions);
export const selectSubmissionSchema = createSelectSchema(submissions);
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = typeof submissions.$inferInsert;

export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

export const insertParentStudentRelationSchema = createInsertSchema(parentStudentRelations);
export const selectParentStudentRelationSchema = createSelectSchema(parentStudentRelations);
export type ParentStudentRelation = typeof parentStudentRelations.$inferSelect;
export type InsertParentStudentRelation = typeof parentStudentRelations.$inferInsert;

export const insertLearningToolSchema = createInsertSchema(learningTools);
export const selectLearningToolSchema = createSelectSchema(learningTools);
export type LearningTool = typeof learningTools.$inferSelect;
export type InsertLearningTool = typeof learningTools.$inferInsert;
