from django.urls import path
from .views import (
    SubjectListView, SubjectDetailView, SubjectCreateUpdateDeleteView,
    CourseListView, CourseDetailView, CourseCreateUpdateDeleteView,
    ModuleListCreateView, ModuleDetailView,
    LessonListCreateView, LessonDetailView,
    EnrollmentListView, EnrollmentCreateView, EnrollmentDetailView,
    LearningToolListView, LearningToolDetailView, LearningToolCreateUpdateDeleteView
)

urlpatterns = [
    # Subject endpoints
    path('subjects/', SubjectListView.as_view(), name='subject-list'),
    path('subjects/<int:pk>/', SubjectDetailView.as_view(), name='subject-detail'),
    path('subjects/create/', SubjectCreateUpdateDeleteView.as_view(), name='subject-create'),
    path('subjects/<int:pk>/update/', SubjectCreateUpdateDeleteView.as_view(), name='subject-update'),
    path('subjects/<int:pk>/delete/', SubjectCreateUpdateDeleteView.as_view(), name='subject-delete'),
    
    # Course endpoints
    path('', CourseListView.as_view(), name='course-list'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('create/', CourseCreateUpdateDeleteView.as_view(), name='course-create'),
    path('<int:pk>/update/', CourseCreateUpdateDeleteView.as_view(), name='course-update'),
    path('<int:pk>/delete/', CourseCreateUpdateDeleteView.as_view(), name='course-delete'),
    
    # Module endpoints
    path('<int:course_id>/modules/', ModuleListCreateView.as_view(), name='module-list'),
    path('modules/<int:pk>/', ModuleDetailView.as_view(), name='module-detail'),
    path('modules/<int:pk>/update/', ModuleDetailView.as_view(), name='module-update'),
    path('modules/<int:pk>/delete/', ModuleDetailView.as_view(), name='module-delete'),
    
    # Lesson endpoints
    path('modules/<int:module_id>/lessons/', LessonListCreateView.as_view(), name='lesson-list'),
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),
    path('lessons/<int:pk>/update/', LessonDetailView.as_view(), name='lesson-update'),
    path('lessons/<int:pk>/delete/', LessonDetailView.as_view(), name='lesson-delete'),
    
    # Enrollment endpoints
    path('enrollments/', EnrollmentListView.as_view(), name='enrollment-list'),
    path('enrollments/create/', EnrollmentCreateView.as_view(), name='enrollment-create'),
    path('enrollments/<int:pk>/', EnrollmentDetailView.as_view(), name='enrollment-detail'),
    path('enrollments/<int:pk>/update/', EnrollmentDetailView.as_view(), name='enrollment-update'),
    path('enrollments/<int:pk>/delete/', EnrollmentDetailView.as_view(), name='enrollment-delete'),
    
    # Learning tool endpoints
    path('learning-tools/', LearningToolListView.as_view(), name='learning-tool-list'),
    path('learning-tools/<int:pk>/', LearningToolDetailView.as_view(), name='learning-tool-detail'),
    path('learning-tools/create/', LearningToolCreateUpdateDeleteView.as_view(), name='learning-tool-create'),
    path('learning-tools/<int:pk>/update/', LearningToolCreateUpdateDeleteView.as_view(), name='learning-tool-update'),
    path('learning-tools/<int:pk>/delete/', LearningToolCreateUpdateDeleteView.as_view(), name='learning-tool-delete'),
]