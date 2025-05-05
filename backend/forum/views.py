
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ForumCategory, ForumTopic, ForumPost

class ParentForumViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ForumTopic.objects.filter(
            category__name='Parent Forum'
        ).order_by('-is_pinned', '-created_at')
    
    def create(self, request):
        if not request.user.is_parent():
            return Response(
                {'error': 'Only parents can create topics in parent forum'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_school_announcements(request):
    if not request.user.is_parent():
        return Response(
            {'error': 'Only parents can view announcements'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    announcements = ForumTopic.objects.filter(
        category__name='School Announcements'
    ).order_by('-created_at')
    
    # Convert to list of dictionaries
    return Response([{
        'id': a.id,
        'title': a.title,
        'content': a.content,
        'created_at': a.created_at,
        'is_pinned': a.is_pinned
    } for a in announcements])
