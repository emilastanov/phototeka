from django.contrib import admin
from .models import *


class ImageInline(admin.StackedInline):
    model = PostImage


@admin.register(Post)
class PostsAdmin(admin.ModelAdmin):
    inlines = [ImageInline,]


