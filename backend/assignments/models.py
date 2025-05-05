from django.db import models
from django.conf import settings


class Assignment(models.Model):
    """Assignment model representing tasks or assessments assigned to students"""
    
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    )
    
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructions = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField()
    total_points = models.PositiveIntegerField(default=100)
    estimated_time_minutes = models.PositiveIntegerField(default=60)
    allowed_attempts = models.PositiveIntegerField(default=1)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_assignments')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.course.code} - {self.title}"
    
    @property
    def is_published(self):
        return self.status == 'published'
    
    @property
    def is_draft(self):
        return self.status == 'draft'
    
    @property
    def is_past_due(self):
        from django.utils import timezone
        return self.due_date < timezone.now()


class AssignmentFile(models.Model):
    """Files associated with assignments"""
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='files')
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to='assignment_files/')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title


class Submission(models.Model):
    """Student submissions for assignments"""
    
    STATUS_CHOICES = (
        ('submitted', 'Submitted'),
        ('graded', 'Graded'),
        ('returned', 'Returned'),
        ('late', 'Late'),
    )
    
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    submitted_at = models.DateTimeField(auto_now_add=True)
    text_response = models.TextField(blank=True, null=True)
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    feedback = models.TextField(blank=True, null=True)
    graded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='graded_submissions')
    graded_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    attempt_number = models.PositiveIntegerField(default=1)
    
    class Meta:
        unique_together = ['assignment', 'student', 'attempt_number']
    
    def __str__(self):
        return f"{self.student.email} - {self.assignment.title} - Attempt {self.attempt_number}"
    
    @property
    def is_late(self):
        return self.submitted_at > self.assignment.due_date
    
    @property
    def is_graded(self):
        return self.status == 'graded' or self.status == 'returned'
    
    def save(self, *args, **kwargs):
        if self.is_late and self.status == 'submitted':
            self.status = 'late'
        super().save(*args, **kwargs)


class SubmissionFile(models.Model):
    """Files associated with student submissions"""
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='files')
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to='submission_files/')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title


class Quiz(models.Model):
    """Quiz model as a type of assignment"""
    assignment = models.OneToOneField(Assignment, on_delete=models.CASCADE, related_name='quiz')
    time_limit_minutes = models.PositiveIntegerField(default=30)
    randomize_questions = models.BooleanField(default=False)
    show_result_immediately = models.BooleanField(default=True)
    passing_score = models.PositiveIntegerField(default=60)  # Percentage
    
    def __str__(self):
        return f"Quiz: {self.assignment.title}"


class Question(models.Model):
    """Questions for quizzes"""
    
    QUESTION_TYPES = (
        ('multiple_choice', 'Multiple Choice'),
        ('true_false', 'True/False'),
        ('short_answer', 'Short Answer'),
        ('essay', 'Essay'),
        ('matching', 'Matching'),
    )
    
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    points = models.PositiveIntegerField(default=1)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.quiz.assignment.title} - Question {self.order + 1}"


class Answer(models.Model):
    """Answers for multiple choice and true/false questions"""
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.TextField()
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.question.text[:30]}... - Answer {self.order + 1}"


class StudentAnswer(models.Model):
    """Student answers to quiz questions"""
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.ForeignKey(Answer, on_delete=models.CASCADE, null=True, blank=True)
    text_answer = models.TextField(null=True, blank=True)
    is_correct = models.BooleanField(null=True, blank=True)
    points_earned = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"{self.submission.student.email} - {self.question.text[:30]}..."