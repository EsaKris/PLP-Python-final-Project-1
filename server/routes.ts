import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { authenticate } from "passport";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { compare } from "bcrypt";
import pgSimple from "connect-pg-simple";
import { pool } from "@db";

const PgSession = pgSimple(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "session",
      }),
      secret: process.env.SESSION_SECRET || "techiekraft_secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  // Set up Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Passport to use a local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username or password" });
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Incorrect username or password" });
        }

        // Don't send the password to the client
        const { password: _, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUserById(id);
      if (!user) {
        return done(null, false);
      }
      // Don't send the password to the client
      const { password: _, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message || "Authentication failed" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({ user });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(function(err) {
      if (err) { 
        return res.status(500).json({ message: "Error logging out" }); 
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/session", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ authenticated: true, user: req.user });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Middleware to ensure user is authenticated
  const ensureAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // User routes
  app.get("/api/users/me", ensureAuthenticated, async (req, res) => {
    res.json({ user: req.user });
  });

  // Course routes
  app.get("/api/courses", ensureAuthenticated, async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Error fetching courses" });
    }
  });

  app.get("/api/courses/:id", ensureAuthenticated, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourseById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Error fetching course" });
    }
  });

  // Enrollments routes
  app.get("/api/enrollments", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as { id: number; role: string };
      if (user.role !== "student") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const enrollments = await storage.getEnrollmentsByStudentId(user.id);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Error fetching enrollments" });
    }
  });

  // Assignments routes
  app.get("/api/assignments", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as { id: number; role: string };
      let assignments;
      
      if (user.role === "student") {
        assignments = await storage.getAssignmentsByStudentId(user.id);
      } else if (user.role === "teacher") {
        assignments = await storage.getAssignmentsByTeacherId(user.id);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ message: "Error fetching assignments" });
    }
  });

  app.post("/api/assignments", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as { id: number; role: string };
      if (user.role !== "teacher") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const assignmentSchema = z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        courseId: z.number().int().positive("Course ID is required"),
        dueDate: z.string().transform(str => new Date(str)),
        estimatedTime: z.number().int().positive().optional(),
      });
      
      const validatedData = assignmentSchema.parse(req.body);
      const assignment = await storage.createAssignment({
        ...validatedData,
        createdBy: user.id,
      });
      
      res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating assignment:", error);
      res.status(500).json({ message: "Error creating assignment" });
    }
  });

  // Messages routes
  app.get("/api/messages", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as { id: number };
      const messages = await storage.getMessagesByUserId(user.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Error fetching messages" });
    }
  });

  app.post("/api/messages", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as { id: number };
      
      const messageSchema = z.object({
        receiverId: z.number().int().positive("Receiver ID is required"),
        content: z.string().min(1, "Message content is required"),
      });
      
      const validatedData = messageSchema.parse(req.body);
      const message = await storage.createMessage({
        ...validatedData,
        senderId: user.id,
      });
      
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Error sending message" });
    }
  });

  // Learning tools routes
  app.get("/api/learning-tools", ensureAuthenticated, async (req, res) => {
    try {
      const tools = await storage.getLearningTools();
      res.json(tools);
    } catch (error) {
      console.error("Error fetching learning tools:", error);
      res.status(500).json({ message: "Error fetching learning tools" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
