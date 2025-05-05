from django.db import models
from django.conf import settings


class Message(models.Model):
    """Model for individual messages between users"""
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    subject = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-sent_at']
    
    def __str__(self):
        return f"From: {self.sender.email} To: {self.receiver.email} ({self.sent_at.strftime('%Y-%m-%d %H:%M')})"
    
    def mark_as_read(self):
        """Mark the message as read and set the read timestamp"""
        from django.utils import timezone
        self.is_read = True
        self.read_at = timezone.now()
        self.save()


class Conversation(models.Model):
    """Model to track conversations between users"""
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='conversations')
    title = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Conversation {self.pk}: {self.title or 'Untitled'}"
    
    @property
    def last_message(self):
        return self.messages.order_by('-sent_at').first()
    
    def unread_count(self, user):
        return self.messages.filter(receiver=user, is_read=False).count()


class GroupMessage(models.Model):
    """Model for messages sent to a conversation with multiple participants"""
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='group_messages')
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['sent_at']
    
    def __str__(self):
        return f"Group message from {self.sender.email} in {self.conversation}"


class MessageAttachment(models.Model):
    """File attachments for messages"""
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='attachments', null=True, blank=True)
    group_message = models.ForeignKey(GroupMessage, on_delete=models.CASCADE, related_name='attachments', null=True, blank=True)
    file = models.FileField(upload_to='message_attachments/')
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=100)
    size = models.PositiveIntegerField()  # Size in bytes
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.filename


class Notification(models.Model):
    """Notification model for messaging system activities"""
    
    NOTIFICATION_TYPES = (
        ('message', 'New Message'),
        ('group_message', 'New Group Message'),
        ('mention', 'Mention'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    message = models.ForeignKey(Message, on_delete=models.CASCADE, null=True, blank=True)
    group_message = models.ForeignKey(GroupMessage, on_delete=models.CASCADE, null=True, blank=True)
    text = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Notification for {self.user.email}: {self.text}"