from django.contrib import admin
from .models import Subject, Course, Module, Lesson, Enrollment, LearningTool, CourseResource


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'created_at')
    list_filter = ('category',)
    search_fields = ('name', 'description')


class ModuleInline(admin.TabularInline):
    model = Module
    extra = 1


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'subject', 'teacher', 'is_active', 'level', 'created_at')
    list_filter = ('subject', 'is_active', 'level')
    search_fields = ('name', 'code', 'description')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ModuleInline]


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'is_active')
    list_filter = ('course', 'is_active')
    search_fields = ('title', 'description')
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'order', 'duration_minutes', 'is_active')
    list_filter = ('module__course', 'is_active')
    search_fields = ('title', 'content')


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'progress', 'enrollment_date', 'is_active')
    list_filter = ('course', 'is_active')
    search_fields = ('student__email', 'student__first_name', 'student__last_name', 'course__name')
    readonly_fields = ('enrollment_date', 'last_accessed')


@admin.register(LearningTool)
class LearningToolAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'url', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'description')


@admin.register(CourseResource)
class CourseResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'resource_type', 'is_required')
    list_filter = ('course', 'resource_type', 'is_required')
    search_fields = ('title', 'description')