from django.shortcuts import render
from django.http import HttpResponse
from django.db import models
from .models import menu as Menu
from order.models import Order
from django.db.models import Sum
import json
# Create your views here.

def queryMenu(request):
    # menu = [{'typeName': '快餐类','''menuContent':[{'name':'炸鸡'},{'name':'鸡腿'}]},{}]
    data = json.loads(request.body)
    username = data['username']
    menu = []
    typeName = []
    feed_list = []
    feed = []
    feed = Order.objects.filter(username=username).values('food_name').annotate(numb=Sum('number')).values('food_name','numb')[0:5]
    if len(feed) == 0:
        feed = Order.objects.values('food_name').annotate(numb=Sum('number')).values('food_name','numb')[0:5]
    for it in feed:
        item = Menu.objects.filter(name=it['food_name'],status='启用')
        if item:
            item = item[0]
            feed_list.append({'name':item.name,'src':str(item.src),'sales':item.sales,'rating':round(item.rating,1),'numb':0, 'price':item.price})
    menu.append({'typeName': '为你推荐', 'menuContent': feed_list})
    typeName = Menu.objects.all().values('typeName').order_by('typeName').distinct()
    for it in typeName:
        my_dict = {}
        my_dict['typeName'] = it['typeName']
        menuContent = Menu.objects.filter(typeName=it['typeName'],status='启用')
        list = []
        for item in menuContent:
            list.append({'name':item.name,'src':str(item.src),'sales':item.sales,'rating':round(item.rating,1),'numb':0, 'price':item.price})
        my_dict['menuContent'] = list
        if len(list) != 0:
            menu.append(my_dict)
    tmp = json.dumps(menu)
    return HttpResponse(tmp)