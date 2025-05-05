from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count

from .models import Subject, Course, Module, Lesson, Enrollment, LearningTool, CourseResource
from .serializers import (
    SubjectSerializer, CourseSerializer, CourseDetailSerializer, CourseCreateUpdateSerializer,
    ModuleSerializer, LessonSerializer, EnrollmentSerializer, EnrollmentCreateSerializer,
    LearningToolSerializer, CourseResourceSerializer
)


class IsTeacherOrAdmin(permissions.BasePermission):
    """Permission class to allow only teachers and admins"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['teacher', 'admin_teacher', 'admin']


class IsAdminUser(permissions.BasePermission):
    """Permission class to allow only admin users"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'admin_teacher']


class SubjectListView(generics.ListAPIView):
    """View for listing all subjects"""
    queryset = Subject.objects.all().order_by('name')
    serializer_class = SubjectSerializer
    permission_classes = [AllowAny]


class SubjectDetailView(generics.RetrieveAPIView):
    """View for retrieving a subject"""
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [AllowAny]


class SubjectCreateUpdateDeleteView(APIView):
    """View for creating, updating, and deleting subjects"""
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        serializer = SubjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        subject = get_object_or_404(Subject, pk=pk)
        serializer = SubjectSerializer(subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        subject = get_object_or_404(Subject, pk=pk)
        subject.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CourseListView(APIView):
    """View for listing courses"""
    
    def get(self, request):
        # Filter parameters
        subject_id = request.query_params.get('subject_id')
        teacher_id = request.query_params.get('teacher_id')
        search_query = request.query_params.get('search')
        is_active = request.query_params.get('is_active')
        level = request.query_params.get('level')
        
        # Base queryset
        courses = Course.objects.select_related('subject', 'teacher').all()
        
        # Apply filters
        if subject_id:
            courses = courses.filter(subject_id=subject_id)
        if teacher_id:
            courses = courses.filter(teacher_id=teacher_id)
        if search_query:
            courses = courses.filter(
                Q(name__icontains=search_query) | 
                Q(description__icontains=search_query) |
                Q(code__icontains=search_query)
            )
        if is_active:
            is_active_bool = is_active.lower() == 'true'
            courses = courses.filter(is_active=is_active_bool)
        if level:
            courses = courses.filter(level=level)
        
        # Ordering
        courses = courses.order_by('name')
        
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)


class CourseDetailView(APIView):
    """View for retrieving course details"""
    
    def get(self, request, pk):
        course = get_object_or_404(Course.objects.select_related('subject', 'teacher'), pk=pk)
        serializer = CourseDetailSerializer(course)
        return Response(serializer.data)


class CourseCreateUpdateDeleteView(APIView):
    """View for creating, updating, and deleting courses"""
    permission_classes = [IsTeacherOrAdmin]
    
    def post(self, request):
        serializer = CourseCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            # Only admin teachers and admins can assign any teacher
            if request.user.role in ['admin', 'admin_teacher'] or request.data.get('teacher_id') == request.user.id:
                course = serializer.save()
                return Response(CourseSerializer(course).data, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "You can only create courses for yourself as a teacher"}, status=status.HTTP_403_FORBIDDEN)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        
        # Check if user has permission to update this course
        if request.user.role in ['admin', 'admin_teacher'] or course.teacher_id == request.user.id:
            serializer = CourseCreateUpdateSerializer(course, data=request.data)
            if serializer.is_valid():
                course = serializer.save()
                return Response(CourseSerializer(course).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"message": "You don't have permission to update this course"}, status=status.HTTP_403_FORBIDDEN)
    
    def delete(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        
        # Only admins and the course teacher can delete courses
        if request.user.role in ['admin', 'admin_teacher'] or course.teacher_id == request.user.id:
            course.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        return Response({"message": "You don't have permission to delete this course"}, status=status.HTTP_403_FORBIDDEN)


class ModuleListCreateView(APIView):
    """View for listing and creating modules"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, course_id):
        modules = Module.objects.filter(course_id=course_id).order_by('order')
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)
    
    def post(self, request, course_id):
        course = get_object_or_404(Course, pk=course_id)
        
        # Check if user has permission to add modules to this course
        if request.user.role in ['admin', 'admin_teacher'] or course.teacher_id == request.user.id:
            data = request.data.copy()
            data['course'] = course_id
            serializer = ModuleSerializer(data=data)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"message": "You don't have permission to add modules to this course"}, status=status.HTTP_403_FORBIDDEN)


class ModuleDetailView(APIView):
    """View for retrieving, updating, and deleting modules"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        module = get_object_or_404(Module, pk=pk)
        serializer = ModuleSerializer(module)
        return Response(serializer.data)
    
    def put(self, request, pk):
        module = get_object_or_404(Module, pk=pk)
        course = module.course
        
        # Check if user has permission to update this module
        if request.user.role in ['admin', 'admin_teacher'] or course.teacher_id == request.user.id:
            serializer = ModuleSerializer(module, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"message": "You don't have permission to update this module"}, status=status.HTTP_403_FORBIDDEN)
    
    def delete(self, request, pk):
        module = get_object_or_404(Module, pk=pk)
        course = module.course
        
        # Check if user has permission to delete this module
        if request.user.role in ['admin', 'admin_teacher'] or course.teacher_id == request.user.id:
            module.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        return Response({"message": "You don't have permission to delete this module"}, status=status.HTTP_403_FORBIDDEN)


class LessonListCreateView(APIView):
    """View for listing and creating lessons"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, module_id):
        lessons = Lesson.objects.filter(module_id=module_id).order_by('order')
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)
    
    def post(self, request, module_id):
        module = get_object_or_404(Module, pk=module_id)
        course = module.course
        
        # Check if user has permission to add lessons to this module
        if request.user.role in ['admin', 'admin_teacher'] or course.teacher_id == request.user.id:
            data = request.data.copy()
            data['module'] = module_id
            serializer = LessonSerializer(data=data)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"message": "You don't have permission to add lessons to this module"}, status=status.HTTP_403_FORBIDDEN)


class LessonDetailView(APIView):
    """View for retrieving, updating, and deleting lessons"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        lesson = get_object_or_404(Lesson, pk=pk)
        
        # For public courses or enrolled students, any authenticated user can view
        course = lesson.module.course
        if course.is_active:
            # Check if user is enrolled or is a teacher/admin
            if (request.user.role in ['admin', 'admin_teacher', 'teacher'] or 
                course.teacher_id == request.user.id or 
                Enrollment.objects.filter(student=request.user, course=course, is_active=True).exists()):
                serializer = LessonSerializer(lesson)
                return Response(serializer.data)
        
        return Response({"message": "You don't have permission to view this lesson"}, status=status.HTTP_403_FORBIDDEN)
    
    def put(self, request, pk):
        lesson = get_object_or_404(Lesson, pk=pk)
        course = lesson.module.course
        
        # Check if user has permission to update this lesson
        if request.user.role in ['admin', 'admin_teacher'] or course.teacher_id == request.user.id:
            serializer = LessonSerializer(lesson, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"message": "You don't have permission to update this lesson"}, status=status.HTTP_403_FORBIDDEN)
    
    def delete(self, request, pk):
        lesson = get_object_or_404(Lesson, pk=pk)
        course = lesson.module.course
        
        # Check if user has permission to delete this lesson
        if request.user.role in ['admin', 'admin_teacher'] or course.teacher_id == request.user.id:
            lesson.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        return Response({"message": "You don't have permission to delete this lesson"}, status=status.HTTP_403_FORBIDDEN)


class EnrollmentListView(APIView):
    """View for listing enrollments"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        course_id = request.query_params.get('course_id')
        student_id = request.query_params.get('student_id')
        
        # Students can only see their own enrollments
        if user.role == 'student':
            enrollments = Enrollment.objects.filter(student=user)
            if course_id:
                enrollments = enrollments.filter(course_id=course_id)
        
        # Teachers can see enrollments for their courses
        elif user.role == 'teacher':
            if course_id:
                course = get_object_or_404(Course, pk=course_id)
                if course.teacher != user:
                    return Response({"message": "You can only view enrollments for your own courses"}, 
                                   status=status.HTTP_403_FORBIDDEN)
                enrollments = Enrollment.objects.filter(course=course)
                if student_id:
                    enrollments = enrollments.filter(student_id=student_id)
            else:
                # Get all enrollments for courses taught by this teacher
                enrollments = Enrollment.objects.filter(course__teacher=user)
                if student_id:
                    enrollments = enrollments.filter(student_id=student_id)
        
        # Admin users can see all enrollments
        elif user.role in ['admin', 'admin_teacher']:
            enrollments = Enrollment.objects.all()
            if course_id:
                enrollments = enrollments.filter(course_id=course_id)
            if student_id:
                enrollments = enrollments.filter(student_id=student_id)
        
        # Parents can see enrollments for their children
        elif user.role == 'parent':
            children = user.children.all()
            enrollments = Enrollment.objects.filter(student__in=children)
            if course_id:
                enrollments = enrollments.filter(course_id=course_id)
            if student_id and int(student_id) in children.values_list('id', flat=True):
                enrollments = enrollments.filter(student_id=student_id)
            else:
                if student_id:
                    return Response({"message": "You can only view enrollments for your children"}, 
                                   status=status.HTTP_403_FORBIDDEN)
        
        else:
            return Response({"message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)


class EnrollmentCreateView(APIView):
    """View for creating enrollments"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        
        if user.role == 'student':
            # Students can only enroll themselves
            data = request.data.copy()
            data['student_id'] = user.id
        elif user.role == 'parent':
            # Parents can enroll their children
            if 'student_id' in request.data:
                children = user.children.values_list('id', flat=True)
                if int(request.data['student_id']) not in children:
                    return Response({"message": "You can only enroll your children"}, 
                                   status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({"message": "Student ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            data = request.data.copy()
        elif user.role in ['admin', 'teacher', 'admin_teacher']:
            # Teachers and admins can enroll any student
            if 'student_id' not in request.data:
                return Response({"message": "Student ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            data = request.data.copy()
        else:
            return Response({"message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if the course exists and is active
        if 'course_id' not in data:
            return Response({"message": "Course ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            course = Course.objects.get(pk=data['course_id'])
            if not course.is_active:
                return Response({"message": "This course is not currently active"}, 
                               status=status.HTTP_400_BAD_REQUEST)
        except Course.DoesNotExist:
            return Response({"message": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if enrollment already exists
        existing_enrollment = Enrollment.objects.filter(
            student_id=data['student_id'],
            course_id=data['course_id']
        ).first()
        
        if existing_enrollment:
            if not existing_enrollment.is_active:
                # Reactivate enrollment
                existing_enrollment.is_active = True
                existing_enrollment.save()
                return Response(EnrollmentSerializer(existing_enrollment).data)
            else:
                return Response({"message": "Student is already enrolled in this course"}, 
                               status=status.HTTP_400_BAD_REQUEST)
        
        serializer = EnrollmentCreateSerializer(data=data)
        if serializer.is_valid():
            enrollment = serializer.save()
            return Response(EnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EnrollmentDetailView(APIView):
    """View for retrieving, updating, and deleting enrollments"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        enrollment = get_object_or_404(Enrollment, pk=pk)
        
        # Check permissions
        user = request.user
        if (user.role == 'student' and enrollment.student != user) or \
           (user.role == 'teacher' and enrollment.course.teacher != user) or \
           (user.role == 'parent' and enrollment.student.id not in user.children.values_list('id', flat=True)):
            if not user.role in ['admin', 'admin_teacher']:
                return Response({"message": "You don't have permission to view this enrollment"}, 
                               status=status.HTTP_403_FORBIDDEN)
        
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data)
    
    def patch(self, request, pk):
        enrollment = get_object_or_404(Enrollment, pk=pk)
        
        # Check permissions
        user = request.user
        if user.role == 'student':
            # Students can only update their progress
            if enrollment.student != user:
                return Response({"message": "You can only update your own enrollments"}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            # Students can only update progress field
            allowed_fields = ['progress']
            for field in request.data:
                if field not in allowed_fields:
                    return Response({"message": f"You don't have permission to update the {field} field"}, 
                                   status=status.HTTP_403_FORBIDDEN)
        
        elif user.role == 'teacher':
            # Teachers can only update enrollments for their courses
            if enrollment.course.teacher != user:
                return Response({"message": "You can only update enrollments for your own courses"}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            # Teachers can update grade, is_active, and completion_date
            allowed_fields = ['grade', 'is_active', 'completion_date']
            for field in request.data:
                if field not in allowed_fields:
                    return Response({"message": f"You don't have permission to update the {field} field"}, 
                                   status=status.HTTP_403_FORBIDDEN)
        
        elif user.role not in ['admin', 'admin_teacher']:
            return Response({"message": "You don't have permission to update this enrollment"}, 
                           status=status.HTTP_403_FORBIDDEN)
        
        serializer = EnrollmentSerializer(enrollment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        enrollment = get_object_or_404(Enrollment, pk=pk)
        
        # Check permissions
        user = request.user
        if not user.role in ['admin', 'admin_teacher']:
            if (user.role == 'teacher' and enrollment.course.teacher != user):
                return Response({"message": "You don't have permission to delete this enrollment"}, 
                               status=status.HTTP_403_FORBIDDEN)
        
        # Soft delete by marking as inactive
        enrollment.is_active = False
        enrollment.save()
        
        return Response(status=status.HTTP_204_NO_CONTENT)


class LearningToolListView(generics.ListAPIView):
    """View for listing learning tools"""
    queryset = LearningTool.objects.filter(is_active=True).order_by('name')
    serializer_class = LearningToolSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class LearningToolDetailView(generics.RetrieveAPIView):
    """View for retrieving a learning tool"""
    queryset = LearningTool.objects.filter(is_active=True)
    serializer_class = LearningToolSerializer
    permission_classes = [IsAuthenticated]


class LearningToolCreateUpdateDeleteView(APIView):
    """View for creating, updating, and deleting learning tools"""
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        serializer = LearningToolSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        tool = get_object_or_404(LearningTool, pk=pk)
        serializer = LearningToolSerializer(tool, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        tool = get_object_or_404(LearningTool, pk=pk)
        tool.is_active = False
        tool.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
