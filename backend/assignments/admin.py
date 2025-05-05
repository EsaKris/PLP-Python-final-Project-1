from django.contrib import admin
from .models import (
    Assignment, AssignmentFile, Submission, SubmissionFile,
    Quiz, Question, Answer, StudentAnswer
)


class AssignmentFileInline(admin.TabularInline):
    model = AssignmentFile
    extra = 1


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'due_date', 'status', 'created_by', 'created_at')
    list_filter = ('course', 'status', 'created_by')
    search_fields = ('title', 'description', 'instructions')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [AssignmentFileInline]


class SubmissionFileInline(admin.TabularInline):
    model = SubmissionFile
    extra = 1


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('student', 'assignment', 'submitted_at', 'score', 'status', 'attempt_number')
    list_filter = ('assignment', 'status', 'assignment__course')
    search_fields = ('student__email', 'student__first_name', 'student__last_name', 'assignment__title')
    readonly_fields = ('submitted_at', 'is_late')
    inlines = [SubmissionFileInline]


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    show_change_link = True


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'time_limit_minutes', 'randomize_questions', 'show_result_immediately', 'passing_score')
    list_filter = ('assignment__course', 'randomize_questions', 'show_result_immediately')
    search_fields = ('assignment__title',)
    inlines = [QuestionInline]


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 2


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'quiz', 'question_type', 'points', 'order')
    list_filter = ('quiz__assignment', 'question_type')
    search_fields = ('text', 'quiz__assignment__title')
    inlines = [AnswerInline]


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('text', 'question', 'is_correct', 'order')
    list_filter = ('question__quiz', 'is_correct')
    search_fields = ('text', 'question__text')


@admin.register(StudentAnswer)
class StudentAnswerAdmin(admin.ModelAdmin):
    list_display = ('submission', 'question', 'is_correct', 'points_earned')
    list_filter = ('submission__assignment', 'is_correct')
    search_fields = ('submission__student__email', 'question__text')