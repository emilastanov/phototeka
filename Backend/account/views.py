from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics

from .permissions import *
from .serializers import *
from .models import *
from photos.models import Post, PostImage, PostLike, PostComment
from photos.serializers import PostDetailSerializer, PostImageSerializer, PostCommentSerializer, PostLikeSerializer


class ProfileListView(generics.ListAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = (IsAdminUser,)
    queryset = User.objects.all()
    authentication_classes = (TokenAuthentication,)


class ProfileDetailView(APIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly, )
    authentication_classes = (TokenAuthentication,)

    def get_object(self, user):
        try:
            return Profile.objects.get(user=user)
        except:
            raise 404

    def get(self, request, format=None):
        profile = ProfileDetailSerializer(self.get_object(request.user))
        user = UserDetailSerializer(User.objects.get(pk=request.user.id))
        subscribtions = [SubscriptionSerializer(sub).data for sub in Subscribtion.objects.filter(user=request.user.id)]
        subscribers = [SubscriptionSerializer(sub).data for sub in Subscribtion.objects.filter(subscribtion=request.user.id)]
        return Response({
            'user': user.data,
            'profile': profile.data,
            'subscribtions': {
                'count': len(subscribtions),
                'data': subscribtions
            },
            'subscribers': {
                'count': len(subscribers),
                'data': subscribers
            },
        })

    def put(self, request, format=None):
        profile = self.get_object(request.user)
        serializer = ProfileDetailSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class ProfileDetailUsernameView(APIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly, )
    authentication_classes = (TokenAuthentication,)

    def get_object(self, user):
        try:
            return Profile.objects.get(user=user)
        except:
            raise 404

    def get(self, request, username, format=None):
        try:
            u = User.objects.get(username=username)
        except:
            return Response({
                'error': 'Пользователь не найден!'
            })
        user = UserDetailSerializer(u)
        profile = ProfileDetailSerializer(self.get_object(u.id))

        subscribtions = [SubscriptionSerializer(sub).data for sub in Subscribtion.objects.filter(user=u.id)]
        subscribers = [SubscriptionSerializer(sub).data for sub in Subscribtion.objects.filter(subscribtion=u.id)]
        return Response({
            'user': user.data,
            'profile': profile.data,
            'subscribtions': {
                'count': len(subscribtions),
                'data': subscribtions
            },
            'subscribers': {
                'count': len(subscribers),
                'data': subscribers
            },
        })

class ProfileDetailIdView(APIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly, )
    authentication_classes = (TokenAuthentication,)

    def get_object(self, user):
        try:
            return Profile.objects.get(user=user)
        except:
            raise 404

    def get(self, request, id, format=None):
        u = User.objects.get(id=id)
        user = UserDetailSerializer(u)
        profile = ProfileDetailSerializer(self.get_object(u.id))

        subscribtions = [SubscriptionSerializer(sub).data for sub in Subscribtion.objects.filter(user=u.id)]
        subscribers = [SubscriptionSerializer(sub).data for sub in Subscribtion.objects.filter(subscribtion=u.id)]
        return Response({
            'user': user.data,
            'profile': profile.data,
            'subscribtions': {
                'count': len(subscribtions),
                'data': subscribtions
            },
            'subscribers': {
                'count': len(subscribers),
                'data': subscribers
            },
        })

class SubscriptionCreateView(generics.CreateAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)


class SubscriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubscriptionSerializer
    queryset = Subscribtion.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly, )
    authentication_classes = (TokenAuthentication,)


class WallListView(APIView):
    queryset = Post.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)
    authentication_classes = (TokenAuthentication,)

    def get(self, request, format=None):
        subscribtions = [sub.subscribtion.id for sub in
                         Subscribtion.objects.filter(user=request.user.id)]
        posts = []
        for id in subscribtions:
            for post in Post.objects.filter(user=id):
                u = User.objects.get(id=id)
                user = UserDetailSerializer(u)
                profile = ProfileDetailSerializer(Profile.objects.get(user=u.id))
                comments = [PostCommentSerializer(comment).data for comment in
                                 PostComment.objects.filter(post=post)]
                likes = [PostLikeSerializer(like).data for like in PostLike.objects.filter(post=post)]

                posts.append({
                    'info': PostDetailSerializer(post).data,
                    'images': [PostImageSerializer(img).data for img in PostImage.objects.filter(post=post)],
                    'owner': {
                        'user': user.data,
                        'profile': profile.data
                    },
                    'comments': {
                        'count': len(comments),
                        'data': comments
                    },
                    'likes': {
                        'count': len(likes),
                        'data': likes
                    }
                })

        return Response({'data': sorted(posts,key=lambda item: item['info']['date'],reverse=True)})