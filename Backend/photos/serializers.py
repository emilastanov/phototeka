from rest_framework import serializers
from rest_framework.relations import HyperlinkedRelatedField

from .models import *


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ('img',)

class PostSerializer(serializers.HyperlinkedModelSerializer):
    url = HyperlinkedRelatedField(
        view_name="post-detail",
        read_only=True,
    )
    user = serializers.ReadOnlyField(source='user.username')
    images = PostImageSerializer(source='postimage_set', many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id','description', 'date', 'user','images','url']


    def create(self, validated_data):
        images_data = self.context.get('view').request.FILES
        post = Post.objects.create(**validated_data, user_id=self.context['request'].user.id)
        for image_data in images_data.values():
            PostImage.objects.create(post=post, img=image_data)
        return post



class PostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class PostCommentSerializer(serializers.ModelSerializer):
    user = serializers.CharField(default=serializers.CurrentUserDefault())

    class Meta:
        model = PostComment
        fields = ['comment','user', 'post','id']


class PostLikeSerializer(serializers.ModelSerializer):
    user = serializers.CharField(default=serializers.CurrentUserDefault())

    class Meta:
        model = PostLike
        fields = ['user', 'post','id']

