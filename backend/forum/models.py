from django.db import models
from django.conf import settings


class ForumCategory(models.Model):
    """Categories for organizing forum discussions"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon_class = models.CharField(max_length=50, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Forum categories"
        ordering = ['order']
    
    def __str__(self):
        return self.name
    
    @property
    def topic_count(self):
        return self.topics.count()
    
    @property
    def post_count(self):
        return sum(topic.post_count for topic in self.topics.all())


class ForumTopic(models.Model):
    """Discussion topics within forum categories"""
    category = models.ForeignKey(ForumCategory, on_delete=models.CASCADE, related_name='topics')
    title = models.CharField(max_length=200)
    content = models.TextField()
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_topics')
    is_pinned = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_pinned', '-updated_at']
    
    def __str__(self):
        return self.title
    
    @property
    def post_count(self):
        return self.posts.count()
    
    @property
    def last_post(self):
        return self.posts.order_by('-created_at').first()


class ForumPost(models.Model):
    """Individual posts within topics"""
    topic = models.ForeignKey(ForumTopic, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='forum_posts')
    is_edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Post by {self.creator.email} in {self.topic.title}"
    
    @property
    def is_first_post(self):
        first_post = self.topic.posts.order_by('created_at').first()
        return first_post.id == self.id if first_post else False


class ForumAttachment(models.Model):
    """File attachments for forum posts"""
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='forum_attachments/')
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=100)
    size = models.PositiveIntegerField()  # Size in bytes
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.filename


class ForumSubscription(models.Model):
    """User subscriptions to forum topics"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='forum_subscriptions')
    topic = models.ForeignKey(ForumTopic, on_delete=models.CASCADE, related_name='subscriptions')
    receive_emails = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'topic']
    
    def __str__(self):
        return f"{self.user.email} subscribed to {self.topic.title}"


class ForumReaction(models.Model):
    """Reactions to forum posts like upvotes or specific emojis"""
    
    REACTION_CHOICES = (
        ('upvote', 'Upvote'),
        ('helpful', 'Helpful'),
        ('like', 'Like'),
        ('thanks', 'Thanks'),
        ('insightful', 'Insightful'),
    )
    
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='forum_reactions')
    reaction_type = models.CharField(max_length=20, choices=REACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['post', 'user', 'reaction_type']
    
    def __str__(self):
        return f"{self.user.email} reacted with {self.get_reaction_type_display()} to post in {self.post.topic.title}"


class ForumPoll(models.Model):
    """Polls attached to forum topics"""
    topic = models.OneToOneField(ForumTopic, on_delete=models.CASCADE, related_name='poll')
    question = models.CharField(max_length=255)
    allow_multiple_choices = models.BooleanField(default=False)
    end_date = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Poll: {self.question}"
    
    @property
    def total_votes(self):
        return sum(choice.votes.count() for choice in self.choices.all())


class PollChoice(models.Model):
    """Individual choices for a forum poll"""
    poll = models.ForeignKey(ForumPoll, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return self.text
    
    @property
    def vote_count(self):
        return self.votes.count()
    
    @property
    def percentage(self):
        total = self.poll.total_votes
        if total > 0:
            return (self.vote_count / total) * 100
        return 0


class PollVote(models.Model):
    """Records of user votes in polls"""
    poll = models.ForeignKey(ForumPoll, on_delete=models.CASCADE, related_name='votes')
    choice = models.ForeignKey(PollChoice, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='poll_votes')
    voted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['poll', 'user', 'choice']
    
    def __str__(self):
        return f"{self.user.email} voted for {self.choice.text} in poll {self.poll.question}"