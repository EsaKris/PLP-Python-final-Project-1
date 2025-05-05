from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, SessionView,
    UserProfileView, ChangePasswordView, TeacherListView,
    StudentListView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('session/', SessionView.as_view(), name='session'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/image/', UserProfileView.as_view(), name='profile_image'),
    path('password/', ChangePasswordView.as_view(), name='change_password'),
    path('teachers/', TeacherListView.as_view(), name='teacher_list'),
    path('students/', StudentListView.as_view(), name='student_list'),
]