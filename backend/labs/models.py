from django.db import models
from django.conf import settings


class VirtualLab(models.Model):
    """Virtual laboratory environments for interactive learning"""
    
    LAB_TYPES = (
        ('science', 'Science Lab'),
        ('programming', 'Programming Lab'),
        ('language', 'Language Lab'),
        ('math', 'Math Lab'),
        ('simulation', 'Simulation'),
        ('other', 'Other')
    )
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    lab_type = models.CharField(max_length=20, choices=LAB_TYPES)
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='virtual_labs', null=True, blank=True)
    subject = models.ForeignKey('courses.Subject', on_delete=models.CASCADE, related_name='virtual_labs')
    url = models.URLField()
    embed_code = models.TextField(blank=True, null=True)
    thumbnail = models.ImageField(upload_to='lab_thumbnails/', blank=True, null=True)
    instructions = models.TextField(blank=True, null=True)
    requires_approval = models.BooleanField(default=False)
    is_public = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_labs')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


class LabSession(models.Model):
    """Record of student sessions in virtual labs"""
    
    STATUS_CHOICES = (
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('abandoned', 'Abandoned')
    )
    
    virtual_lab = models.ForeignKey(VirtualLab, on_delete=models.CASCADE, related_name='sessions')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lab_sessions')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)
    duration_minutes = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.student.email} - {self.virtual_lab.name} ({self.start_time.strftime('%Y-%m-%d')})"
    
    def save(self, *args, **kwargs):
        if self.end_time and self.start_time:
            # Calculate duration in minutes
            delta = self.end_time - self.start_time
            self.duration_minutes = int(delta.total_seconds() / 60)
        super().save(*args, **kwargs)


class LabResult(models.Model):
    """Results and artifacts from lab sessions"""
    session = models.ForeignKey(LabSession, on_delete=models.CASCADE, related_name='results')
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='lab_results/', blank=True, null=True)
    score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.session.student.email}"


class WritingWorkshop(models.Model):
    """Writing workshops and collaborative document editing tools"""
    
    WORKSHOP_TYPES = (
        ('essay', 'Essay Workshop'),
        ('creative', 'Creative Writing'),
        ('technical', 'Technical Writing'),
        ('research', 'Research Paper'),
        ('peer_review', 'Peer Review'),
        ('collaborative', 'Collaborative Writing')
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    workshop_type = models.CharField(max_length=20, choices=WORKSHOP_TYPES)
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='writing_workshops', null=True, blank=True)
    instructions = models.TextField()
    document_template = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField(blank=True, null=True)
    word_count_min = models.PositiveIntegerField(default=0)
    word_count_max = models.PositiveIntegerField(default=0)
    requires_peer_review = models.BooleanField(default=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_workshops')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title


class WritingSubmission(models.Model):
    """Student submissions for writing workshops"""
    
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('in_review', 'In Peer Review'),
        ('reviewed', 'Peer Reviewed'),
        ('graded', 'Graded')
    )
    
    workshop = models.ForeignKey(WritingWorkshop, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='writing_submissions')
    title = models.CharField(max_length=200)
    content = models.TextField()
    word_count = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    grade = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} by {self.student.email}"


class PeerReview(models.Model):
    """Peer reviews for writing submissions"""
    submission = models.ForeignKey(WritingSubmission, on_delete=models.CASCADE, related_name='peer_reviews')
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='performed_reviews')
    content = models.TextField()
    rating = models.PositiveSmallIntegerField()  # Rating on a scale (e.g., 1-5)
    completed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['submission', 'reviewer']
    
    def __str__(self):
        return f"Review by {self.reviewer.email} for {self.submission.title}"


class LanguageTool(models.Model):
    """Language learning and translation tools"""
    
    TOOL_TYPES = (
        ('translation', 'Translation Tool'),
        ('dictionary', 'Dictionary'),
        ('grammar', 'Grammar Checker'),
        ('vocabulary', 'Vocabulary Builder'),
        ('pronunciation', 'Pronunciation Guide'),
        ('conjugation', 'Verb Conjugation')
    )
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    tool_type = models.CharField(max_length=20, choices=TOOL_TYPES)
    url = models.URLField()
    api_key_required = models.BooleanField(default=False)
    embed_code = models.TextField(blank=True, null=True)
    supported_languages = models.CharField(max_length=255)
    icon_class = models.CharField(max_length=50, blank=True, null=True)
    is_premium = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


class MathTool(models.Model):
    """Mathematics learning and problem-solving tools"""
    
    TOOL_TYPES = (
        ('calculator', 'Calculator'),
        ('grapher', 'Graphing Tool'),
        ('solver', 'Equation Solver'),
        ('geometry', 'Geometry Tool'),
        ('statistics', 'Statistics Tool'),
        ('probability', 'Probability Tool')
    )
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    tool_type = models.CharField(max_length=20, choices=TOOL_TYPES)
    url = models.URLField()
    api_key_required = models.BooleanField(default=False)
    embed_code = models.TextField(blank=True, null=True)
    complexity_level = models.CharField(max_length=50, default='All levels')  # Elementary, Middle School, High School, College
    icon_class = models.CharField(max_length=50, blank=True, null=True)
    is_premium = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


class Schedule(models.Model):
    """Academic calendar and event scheduling"""
    
    EVENT_TYPES = (
        ('class', 'Class Session'),
        ('exam', 'Examination'),
        ('deadline', 'Assignment Deadline'),
        ('meeting', 'Meeting'),
        ('event', 'School Event'),
        ('holiday', 'Holiday/Vacation')
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='schedule_events', null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True, null=True)
    is_recurring = models.BooleanField(default=False)
    recurrence_pattern = models.CharField(max_length=50, blank=True, null=True)  # daily, weekly, etc.
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} ({self.start_time.strftime('%Y-%m-%d %H:%M')})"
    
    @property
    def duration_minutes(self):
        delta = self.end_time - self.start_time
        return int(delta.total_seconds() / 60)