import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, desc, sql, asc } from "drizzle-orm";

export const storage = {
  // Users
  async getUserById(id: number) {
    return await db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
  },

  async getUserByUsername(username: string) {
    return await db.query.users.findFirst({
      where: eq(schema.users.username, username),
    });
  },

  // Courses
  async getCourses() {
    return await db.query.courses.findMany({
      with: {
        teacher: true,
        subject: true,
      },
    });
  },

  async getCourseById(id: number) {
    return await db.query.courses.findFirst({
      where: eq(schema.courses.id, id),
      with: {
        teacher: true,
        subject: true,
        modules: true,
      },
    });
  },

  // Enrollments
  async getEnrollmentsByStudentId(studentId: number) {
    return await db.query.enrollments.findMany({
      where: eq(schema.enrollments.studentId, studentId),
      with: {
        course: {
          with: {
            teacher: true,
          },
        },
      },
    });
  },

  async updateEnrollmentProgress(id: number, progress: number) {
    const [enrollment] = await db
      .update(schema.enrollments)
      .set({ progress, lastAccessedAt: new Date() })
      .where(eq(schema.enrollments.id, id))
      .returning();
    return enrollment;
  },

  // Assignments
  async getAssignmentsByStudentId(studentId: number) {
    // Get all courses the student is enrolled in
    const enrollments = await db.query.enrollments.findMany({
      where: eq(schema.enrollments.studentId, studentId),
      columns: {
        courseId: true,
      },
    });

    const courseIds = enrollments.map((e) => e.courseId);

    if (courseIds.length === 0) {
      return [];
    }

    // Get assignments for those courses
    return await db.query.assignments.findMany({
      where: sql`${schema.assignments.courseId} IN (${sql.join(courseIds, sql`, `)})`,
      with: {
        course: {
          with: {
            teacher: true,
          },
        },
      },
      orderBy: [asc(schema.assignments.dueDate)],
    });
  },

  async getAssignmentsByTeacherId(teacherId: number) {
    // Get all courses taught by the teacher
    const courses = await db.query.courses.findMany({
      where: eq(schema.courses.teacherId, teacherId),
      columns: {
        id: true,
      },
    });

    const courseIds = courses.map((c) => c.id);

    if (courseIds.length === 0) {
      return [];
    }

    // Get assignments for those courses
    return await db.query.assignments.findMany({
      where: sql`${schema.assignments.courseId} IN (${sql.join(courseIds, sql`, `)})`,
      with: {
        course: true,
      },
      orderBy: [asc(schema.assignments.dueDate)],
    });
  },

  async createAssignment(assignmentData: schema.InsertAssignment) {
    const [assignment] = await db
      .insert(schema.assignments)
      .values(assignmentData)
      .returning();
    return assignment;
  },

  // Messages
  async getMessagesByUserId(userId: number) {
    return await db.query.messages.findMany({
      where: sql`${schema.messages.receiverId} = ${userId} OR ${schema.messages.senderId} = ${userId}`,
      with: {
        sender: true,
        receiver: true,
      },
      orderBy: [desc(schema.messages.sentAt)],
    });
  },

  async createMessage(messageData: schema.InsertMessage) {
    const [message] = await db
      .insert(schema.messages)
      .values(messageData)
      .returning();
    return message;
  },

  async markMessageAsRead(id: number) {
    const [message] = await db
      .update(schema.messages)
      .set({ read: true, readAt: new Date() })
      .where(eq(schema.messages.id, id))
      .returning();
    return message;
  },

  // Learning Tools
  async getLearningTools() {
    return await db.query.learningTools.findMany();
  },
};
