from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class UserProfile(AbstractUser  ):
    cost = models.FloatField(default=0.0,verbose_name='用户已消费')

    class Meta():
        verbose_name = '用户信息'
        verbose_name_plural = verbose_name