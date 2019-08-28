from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

User = get_user_model()


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='user_photos', blank=True)
    description = models.TextField(blank=True, max_length=512, verbose_name='Описание')


class Subscribtion(models.Model):
    user =  models.ForeignKey(User, verbose_name='Подписчик', on_delete=models.CASCADE, related_name='subscriber')
    subscribtion = models.ForeignKey(User, verbose_name='Подписка', on_delete=models.CASCADE, related_name='subscribtion')


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()