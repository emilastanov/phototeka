from django.urls import path
from .views import *

app_name = 'account'
urlpatterns = [
    path('', ProfileDetailView.as_view()),
    path('list/', ProfileListView.as_view()),
    path('<username>/',ProfileDetailUsernameView.as_view()),
    path('id/<int:id>/',ProfileDetailIdView.as_view()),
    path('subscription/<int:pk>/', SubscriptionDetailView.as_view()),
    path('subscription/create/', SubscriptionCreateView.as_view()),
    path('wall/get/', WallListView.as_view())
]
