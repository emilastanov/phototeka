from django.urls import path
from .views import *

app_name = 'photos'
urlpatterns = [
    path('', PostListView.as_view()),
    path('create/', Upload.as_view({'post': 'create'}), name='post-detail'),
    path('<int:pk>/', PostDetailView.as_view()),
    path('user/<int:pk>/', UsersPostListView.as_view()),
    path('comment/<int:pk>/', PostCommentDetailView.as_view()),
    path('comment/create/', PostCommentCreateView.as_view()),
    path('like/<int:pk>/', PostLikeDetailView.as_view()),
    path('like/create/', PostLikeCreateView.as_view()),
    path('tag/<tag>/', PostTagListView.as_view()),
]
