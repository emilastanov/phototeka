from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Post(models.Model):
    user = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE, related_name='owners')
    description = models.TextField(blank=True, max_length=512, verbose_name='Описание')
    date = models.DateTimeField(auto_now_add=True)

    # def save(self, *args, **kwargs):
    #     super(Post, self).save(*args, **kwargs)


class PostLike(models.Model):
    choice = [
        ('like', 'Нравится'),
    ]

    post = models.ForeignKey(Post, verbose_name='Пост', on_delete=models.CASCADE)
    user = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE, related_name='liker')

    #Убрать
    like = models.TextField(blank=True, max_length=256, verbose_name='Лайк', choices=choice)




class PostImage(models.Model):
    post = models.ForeignKey(Post, verbose_name='Пост', on_delete=models.CASCADE)
    img = models.ImageField(upload_to='posts/%Y/%m/%d', verbose_name='Фото')


class PostComment(models.Model):
    post = models.ForeignKey(Post, verbose_name='Пост', on_delete=models.CASCADE)
    user = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE, related_name='commentator')
    comment = models.TextField(max_length=256, verbose_name='Текст')