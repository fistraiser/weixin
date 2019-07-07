from django.contrib import admin
from .models import UserProfile
from django.contrib.auth.models import Group, User
from django.contrib.auth.admin import UserAdmin
# Register your models here.


class MyUserAdmin(UserAdmin):
    list_display = ('username','cost','email','is_staff')
    search_fields = ('username','cost')
    list_filter = ('username','cost')
admin.site.register(UserProfile, MyUserAdmin)
#admin.site.unregister(Group)