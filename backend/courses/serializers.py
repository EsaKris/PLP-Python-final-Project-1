from rest_framework import serializers
from .models import Subject, Course, Module, Lesson, Enrollment, LearningTool, CourseResource
from accounts.serializers import UserSerializer, TeacherSerializer


class SubjectSerializer(serializers.ModelSerializer):
    """Serializer for Subject model"""
    class Meta:
        model = Subject
        fields = ['id', 'name', 'description', 'category', 'icon_class', 'created_at', 'updated_at']


class LessonSerializer(serializers.ModelSerializer):
    """Serializer for Lesson model"""
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'content', 'order', 'module', 
            'video_url', 'duration_minutes', 'is_active', 
            'created_at', 'updated_at'
        ]


class ModuleSerializer(serializers.ModelSerializer):
    """Serializer for Module model"""
    lessons = LessonSerializer(many=True, read_only=True)
    
    class Meta:
        model = Module
        fields = [
            'id', 'title', 'description', 'order', 'course',
            'is_active', 'created_at', 'updated_at', 'lessons'
        ]


class CourseResourceSerializer(serializers.ModelSerializer):
    """Serializer for CourseResource model"""
    class Meta:
        model = CourseResource
        fields = [
            'id', 'title', 'description', 'file', 'url',
            'resource_type', 'is_required', 'created_at', 'updated_at'
        ]


class CourseSerializer(serializers.ModelSerializer):
    """Serializer for Course model with nested subject and teacher"""
    subject = SubjectSerializer(read_only=True)
    teacher = TeacherSerializer(read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'name', 'code', 'description', 'subject', 'teacher',
            'image', 'start_date', 'end_date', 'is_active', 'level',
            'credit_hours', 'created_at', 'updated_at'
        ]


class CourseDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Course model with nested modules and resources"""
    subject = SubjectSerializer(read_only=True)
    teacher = TeacherSerializer(read_only=True)
    modules = ModuleSerializer(many=True, read_only=True)
    resources = CourseResourceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'name', 'code', 'description', 'subject', 'teacher',
            'image', 'start_date', 'end_date', 'is_active', 'level',
            'credit_hours', 'created_at', 'updated_at', 'modules', 'resources'
        ]


class CourseCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating courses"""
    class Meta:
        model = Course
        fields = [
            'id', 'name', 'code', 'description', 'subject_id', 'teacher_id',
            'image', 'start_date', 'end_date', 'is_active', 'level',
            'credit_hours'
        ]


class EnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for Enrollment model"""
    course = CourseSerializer(read_only=True)
    student = UserSerializer(read_only=True)
    
    class Meta:
        model = Enrollment
        fields = [
            'id', 'student', 'course', 'progress', 'enrollment_date',
            'last_accessed', 'is_active', 'completion_date', 'grade'
        ]


class EnrollmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating enrollments"""
    class Meta:
        model = Enrollment
        fields = ['student_id', 'course_id']


class LearningToolSerializer(serializers.ModelSerializer):
    """Serializer for LearningTool model"""
    class Meta:
        model = LearningTool
        fields = [
            'id', 'name', 'description', 'category', 'url',
            'icon_class', 'is_active', 'created_at', 'updated_at'
        ]