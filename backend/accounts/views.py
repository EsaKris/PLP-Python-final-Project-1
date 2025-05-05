from django.contrib.auth import login, logout, authenticate, get_user_model
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets

from .serializers import (
    UserSerializer, UserProfileSerializer, RegisterSerializer,
    LoginSerializer, ChangePasswordSerializer, TeacherSerializer,
    StudentSerializer, ParentSerializer
)

User = get_user_model()


class RegisterView(APIView):
    """View for user registration"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User registered successfully",
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """View for user login"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, username=email, password=password)
            
            if user is not None:
                login(request, user)
                user.last_login_at = timezone.now()
                user.save(update_fields=['last_login_at'])
                
                return Response({
                    "user": UserSerializer(user).data,
                    "authenticated": True
                }, status=status.HTTP_200_OK)
            
            return Response({
                "message": "Invalid credentials",
                "authenticated": False
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """View for user logout"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)


class SessionView(APIView):
    """View to check current session status"""
    
    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                "authenticated": True,
                "user": UserSerializer(request.user).data
            })
        return Response({"authenticated": False})


class UserProfileView(APIView):
    """View for retrieving and updating user profile"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        if 'profile_image' not in request.FILES:
            return Response(
                {'error': 'No image file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        image = request.FILES['profile_image']
        
        # Optional: Validate file type
        if not image.content_type.startswith('image/'):
            return Response(
                {'error': 'File must be an image'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user = request.user
        # Delete old image if it exists to save space
        if user.profile_image:
            user.profile_image.delete(save=False)
            
        user.profile_image = image
        user.save()
        
        return Response({
            'message': 'Profile image updated successfully',
            'image_url': user.profile_image.url if user.profile_image else None
        })


class ChangePasswordView(APIView):
    """View for changing user password"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            # Check old password
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            # Set new password
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            # Update session
            login(request, user)
            
            return Response({"message": "Password changed successfully"})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeacherListView(APIView):
    """View for listing teachers"""
    
    def get(self, request):
        teachers = User.objects.filter(role__in=['teacher', 'admin_teacher']).order_by('first_name')
        serializer = TeacherSerializer(teachers, many=True)
        return Response(serializer.data)


class StudentListView(APIView):
    """View for listing students"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Only teachers and admins can see all students
        if request.user.role in ['teacher', 'admin_teacher', 'admin']:
            students = User.objects.filter(role='student').order_by('first_name')
            serializer = StudentSerializer(students, many=True)
            return Response(serializer.data)
        # Parents can only see their children
        elif request.user.role == 'parent':
            children = request.user.children.all()
            serializer = StudentSerializer(children, many=True)
            return Response(serializer.data)
        # Students can't see other students
        return Response({"message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_children(request):
    if not request.user.is_parent():
        return Response({'error': 'Only parents can access this endpoint'}, 
                       status=status.HTTP_403_FORBIDDEN)

    children = request.user.children.all()
    serializer = UserSerializer(children, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_progress_reports(request):
    if not request.user.is_parent():
        return Response({'error': 'Only parents can access this endpoint'}, 
                       status=status.HTTP_403_FORBIDDEN)

    children = request.user.children.all()
    reports = []
    for child in children:
        # Get grades, attendance, and other metrics for each child
        reports.append({
            'child_id': child.id,
            'name': child.full_name,
            'grade_level': child.grade_level,
            'attendance': '95%',  # This would come from an attendance model
            'average_grade': 'A-', # This would come from a grades model
            'behavior': 'Excellent'
        })
    return Response(reports)