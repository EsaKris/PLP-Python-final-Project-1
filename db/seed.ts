import { db } from "./index";
import * as schema from "@shared/schema";
import { hash } from "bcrypt";

async function seed() {
  try {
    // Seed users
    const hashedPassword = await hash("password123", 10);

    // Check if users already exist
    const existingUsers = await db.query.users.findMany();
    if (existingUsers.length === 0) {
      console.log("Seeding users...");
      await db.insert(schema.users).values([
        {
          username: "maria_student",
          password: hashedPassword,
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Johnson",
          role: "student",
          profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
          username: "rebecca_teacher",
          password: hashedPassword,
          email: "rebecca@example.com",
          firstName: "Rebecca",
          lastName: "Chen",
          role: "teacher",
          profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
          username: "james_teacher",
          password: hashedPassword,
          email: "james@example.com",
          firstName: "James",
          lastName: "Peterson",
          role: "teacher",
          profileImage: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
          username: "gabriela_teacher",
          password: hashedPassword,
          email: "gabriela@example.com",
          firstName: "Gabriela",
          lastName: "Martinez",
          role: "teacher",
          profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
          username: "michael_parent",
          password: hashedPassword,
          email: "michael@example.com",
          firstName: "Michael",
          lastName: "Rodriguez",
          role: "parent",
          profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
      ]);
    }

    // Seed subjects
    const existingSubjects = await db.query.subjects.findMany();
    if (existingSubjects.length === 0) {
      console.log("Seeding subjects...");
      await db.insert(schema.subjects).values([
        { 
          name: "Physics", 
          description: "Study of matter, energy, and the interaction between them",
          category: "STEM"
        },
        { 
          name: "Literature", 
          description: "Study of written works and their contexts",
          category: "humanities"
        },
        { 
          name: "Spanish", 
          description: "Study of the Spanish language and Hispanic cultures",
          category: "languages"
        },
        { 
          name: "Art History", 
          description: "Study of art throughout history and its cultural context",
          category: "arts"
        }
      ]);
    }

    // Get users and subjects for reference
    const users = await db.query.users.findMany();
    const subjects = await db.query.subjects.findMany();

    const findUserId = (username: string) => {
      const user = users.find(u => u.username === username);
      return user ? user.id : null;
    };

    const findSubjectId = (name: string) => {
      const subject = subjects.find(s => s.name === name);
      return subject ? subject.id : null;
    };

    // Seed courses
    const existingCourses = await db.query.courses.findMany();
    if (existingCourses.length === 0 && users.length > 0 && subjects.length > 0) {
      console.log("Seeding courses...");
      await db.insert(schema.courses).values([
        {
          name: "Advanced Physics",
          description: "Quantum mechanics and advanced physics concepts",
          subjectId: findSubjectId("Physics") || 1,
          teacherId: findUserId("rebecca_teacher") || 2,
          imageUrl: "https://images.unsplash.com/photo-1606064835603-86022867cc77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Modern Literature",
          description: "Analysis of contemporary literary works",
          subjectId: findSubjectId("Literature") || 2,
          teacherId: findUserId("james_teacher") || 3,
          imageUrl: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Spanish Language",
          description: "Conversational Spanish and grammar",
          subjectId: findSubjectId("Spanish") || 3,
          teacherId: findUserId("gabriela_teacher") || 4,
          imageUrl: "https://images.unsplash.com/photo-1605711285791-0219e80e43a3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        }
      ]);
    }

    // Get courses for reference
    const courses = await db.query.courses.findMany();
    
    const findCourseId = (name: string) => {
      const course = courses.find(c => c.name === name);
      return course ? course.id : null;
    };
    
    // Seed assignments
    const existingAssignments = await db.query.assignments.findMany();
    if (existingAssignments.length === 0 && courses.length > 0) {
      console.log("Seeding assignments...");
      
      const now = new Date();
      const twoDaysLater = new Date(now);
      twoDaysLater.setDate(now.getDate() + 2);
      
      const fiveDaysLater = new Date(now);
      fiveDaysLater.setDate(now.getDate() + 5);
      
      const tenDaysLater = new Date(now);
      tenDaysLater.setDate(now.getDate() + 10);
      
      await db.insert(schema.assignments).values([
        {
          title: "Wave Function Analysis",
          description: "Complete a comprehensive analysis of wave functions in quantum systems",
          courseId: findCourseId("Advanced Physics") || 1,
          dueDate: twoDaysLater,
          estimatedTime: 180, // 3 hours
          createdBy: findUserId("rebecca_teacher") || 2
        },
        {
          title: "Essay: The Great Gatsby Analysis",
          description: "Write a 5-page analytical essay on The Great Gatsby's symbolism",
          courseId: findCourseId("Modern Literature") || 2,
          dueDate: fiveDaysLater,
          estimatedTime: 480, // 8 hours
          createdBy: findUserId("james_teacher") || 3
        },
        {
          title: "Spanish Conversation Recording",
          description: "Record a 5-minute conversation in Spanish about your daily routine",
          courseId: findCourseId("Spanish Language") || 3,
          dueDate: tenDaysLater,
          estimatedTime: 120, // 2 hours
          createdBy: findUserId("gabriela_teacher") || 4
        }
      ]);
    }

    // Seed enrollments
    const existingEnrollments = await db.query.enrollments.findMany();
    if (existingEnrollments.length === 0 && courses.length > 0) {
      console.log("Seeding enrollments...");
      
      const studentId = findUserId("maria_student") || 1;
      
      await db.insert(schema.enrollments).values([
        {
          studentId,
          courseId: findCourseId("Advanced Physics") || 1,
          progress: 72
        },
        {
          studentId,
          courseId: findCourseId("Modern Literature") || 2,
          progress: 45
        },
        {
          studentId,
          courseId: findCourseId("Spanish Language") || 3,
          progress: 89
        }
      ]);
    }

    // Seed messages
    const existingMessages = await db.query.messages.findMany();
    if (existingMessages.length === 0 && users.length > 0) {
      console.log("Seeding messages...");
      
      const studentId = findUserId("maria_student") || 1;
      
      // Calculate timestamps for the messages (3 hours ago, yesterday, 2 days ago)
      const now = new Date();
      
      const threeHoursAgo = new Date(now);
      threeHoursAgo.setHours(now.getHours() - 3);
      
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(now.getDate() - 2);
      
      await db.insert(schema.messages).values([
        {
          senderId: findUserId("rebecca_teacher") || 2,
          receiverId: studentId,
          content: "Please don't forget to submit your Wave Function Analysis by Friday. Let me know if you need any help!",
          sentAt: threeHoursAgo
        },
        {
          senderId: findUserId("james_teacher") || 3,
          receiverId: studentId,
          content: "Your outline for the Great Gatsby essay looks promising. I've added some comments to help guide your analysis.",
          sentAt: yesterday
        },
        {
          senderId: findUserId("michael_parent") || 5,
          receiverId: studentId,
          content: "Your latest progress report looks great, Maria! Keep up the excellent work in your Spanish class.",
          sentAt: twoDaysAgo
        }
      ]);
    }

    // Seed parent-student relations
    const existingRelations = await db.query.parentStudentRelations.findMany();
    if (existingRelations.length === 0 && users.length > 0) {
      console.log("Seeding parent-student relations...");
      
      await db.insert(schema.parentStudentRelations).values([
        {
          parentId: findUserId("michael_parent") || 5,
          studentId: findUserId("maria_student") || 1
        }
      ]);
    }

    // Seed learning tools
    const existingTools = await db.query.learningTools.findMany();
    if (existingTools.length === 0) {
      console.log("Seeding learning tools...");
      
      await db.insert(schema.learningTools).values([
        {
          name: "Virtual Labs",
          description: "Hands-on simulations",
          category: "virtual_labs",
          iconClass: "fas fa-flask",
          link: "/tools/virtual-labs"
        },
        {
          name: "Writing Workshop",
          description: "Essay assistance",
          category: "writing_workshop",
          iconClass: "fas fa-pen-alt",
          link: "/tools/writing-workshop"
        },
        {
          name: "Language Tools",
          description: "Pronunciation practice",
          category: "language_tools",
          iconClass: "fas fa-language",
          link: "/tools/language-tools"
        },
        {
          name: "Math Solver",
          description: "Step-by-step solutions",
          category: "math_solver",
          iconClass: "fas fa-calculator",
          link: "/tools/math-solver"
        }
      ]);
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
