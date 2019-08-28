from rest_framework import generics
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication

from account.models import Profile
from account.serializers import UserDetailSerializer, ProfileDetailSerializer
from .permissions import *
from .serializers import *
from .models import *


class Upload(ModelViewSet):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    lookup_field = 'user'
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)


class PostListView(generics.ListAPIView):
    serializer_class = PostDetailSerializer
    queryset = Post.objects.all().order_by('-date')
    permission_classes = (IsAdminUser,)
    authentication_classes = (TokenAuthentication,)


class UsersPostListView(APIView):
    queryset = Post.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)
    authentication_classes = (TokenAuthentication,)
    def get(self, request, pk, format=None):
        data = []
        posts = Post.objects.filter(user=pk)
        for post in posts:
            data.append({
                'info': PostDetailSerializer(post).data,
                'images': [PostImageSerializer(img).data for img in PostImage.objects.filter(post=post)],
                'comments': [PostCommentSerializer(comment).data for comment in PostComment.objects.filter(post=post)],
                'likes': [PostLikeSerializer(like).data for like in PostLike.objects.filter(post=post)]
            })

        return Response({'data': data})



class PostDetailView(APIView):
    queryset = Post.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly, )
    authentication_classes = (TokenAuthentication,)

    def get_object(self, pk):
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            raise 404

    def get(self, request, pk, format=None):
        post = self.get_object(pk)
        images = [PostImageSerializer(img).data for img in PostImage.objects.filter(post=post)]
        comments = [PostCommentSerializer(comment).data for comment in PostComment.objects.filter(post=post)]
        likes = [PostLikeSerializer(like).data for like in PostLike.objects.filter(post=post)]
        serializer = PostDetailSerializer(post)
        return Response({'post': serializer.data, 'images':images, 'comments': {'count': len(comments), 'data':comments}, 'likes': {'count': len(likes), 'data': likes}})

    def delete(self, request, pk, format=None):
        post = self.get_object(pk)
        post.delete()
        return Response(status=204)

    def put(self, request, pk, format=None):
        post = self.get_object(pk)
        serializer = PostDetailSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class PostCommentCreateView(generics.CreateAPIView):
    serializer_class = PostCommentSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)


class PostCommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostCommentSerializer
    queryset = PostComment.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly, )
    authentication_classes = (TokenAuthentication,)


class PostLikeCreateView(generics.CreateAPIView):
    serializer_class = PostLikeSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)


class PostLikeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostLikeSerializer
    queryset = PostLike.objects.all()
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly, )
    authentication_classes = (TokenAuthentication,)


class PostTagListView(APIView):
    queryset = Post.objects.all()
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def getTags(self, text):
        for word in text.split():
            if word[0] == '#':
                yield word[1:]

    def get(self, request, tag, format=None):
        posts = []
        allPosts = Post.objects.all().order_by('-date')
        for p in allPosts:
            if tag in list(self.getTags(p.description)):
                u = User.objects.get(id=p.user.id)
                user = UserDetailSerializer(u)
                profile = ProfileDetailSerializer(Profile.objects.get(user=u.id))
                comments = [PostCommentSerializer(comment).data for comment in
                            PostComment.objects.filter(post=p)]
                likes = [PostLikeSerializer(like).data for like in PostLike.objects.filter(post=p)]

                posts.append({
                    'info': PostDetailSerializer(p).data,
                    'images': [PostImageSerializer(img).data for img in PostImage.objects.filter(post=p)],
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
        return Response({'data': posts})


