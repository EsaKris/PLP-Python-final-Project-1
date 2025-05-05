from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, SessionView,
    UserProfileView, ChangePasswordView, TeacherListView,
    StudentListView
)

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('session/', SessionView.as_view(), name='session'),
    
    # User profile endpoints
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # User listing endpoints
    path('teachers/', TeacherListView.as_view(), name='teachers'),
    path('students/', StudentListView.as_view(), name='students'),
]