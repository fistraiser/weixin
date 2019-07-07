from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'weixinlogin', views.weixinlogin),
    url(r'changePassword', views.changePassword),
]