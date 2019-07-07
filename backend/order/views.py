from django.shortcuts import render
from django.http import HttpResponse
from .models import Order,TodayOrder
from queryMenu.models import menu as Menu
import json
import datetime
from django.contrib.auth.hashers import make_password, check_password
from weixinlogin.models import UserProfile

# Create your views here.
class CJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        else:
            return json.JSONEncoder.default(self, obj)


def update_score(name,score):
    food = Menu.objects.filter(name=name)[0]
    number = min(max(food.sales, 200), 2000)
    food.rating = (food.rating * number + score)/(number+1)
    food.save()


def postComment(request):
    data = json.loads(request.body)['order']
    print(data)
    order_id = data['order_id'] + '='
    order = Order.objects.filter(order_id=order_id)
    for it in data['order']:
        for item in order:
            if it['name'] == item.food_name:
                item.score = it['score']
                update_score(it['name'],it['score'])
                item.state = data['state']
                item.comment = data['comment']
                item.save();
    tmp = ['True']
    return HttpResponse(tmp)


def commitOrder(request):
    data = json.loads(request.body)
    #{'username': 'helong', 'cost': '19998', date': '2019-5-9 20:46:10', 'state': '订单待评论', 'comment': '', 'order': [{'name': '鸡腿', 'numb': 2, 'src': '/images/my-selected.png'}]}
    username = data['username']
    date_time = data['date']
    usercost = data['cost']
    order_id = make_password(username+date_time)
    state = data['state']
    comment = data['comment']
    order_list = data['order']
    for item in order_list:
        food_name = item['name']
        number = item['numb']
        food = Menu.objects.filter(name=food_name)[0]
        food.sales += number
        food.save()
        cost = food.price * number
        Order.objects.create(username=username,order_id=order_id,food_name=food_name,comment=comment,score=5,date_time=date_time,number=number,state=state,cost=cost)
        ReTodayOrder(food_name,number,state,date_time)
    add_usercost(username,usercost)
    tmp = ['True']
    return HttpResponse(tmp)


def add_usercost(username,cost):
    src_cost = UserProfile.objects.filter(username=username)[0]
    src_cost.cost += cost
    src_cost.save()


def ReTodayOrder(food_name,number,state,date_time):
    today = datetime.date.today()
    tomorrow = datetime.date(today.year,today.month,today.day+1)
    order_list = TodayOrder.objects.filter(date_time__range=(today,tomorrow))
    order = order_list.filter(food_name=food_name)
    if(len(order)):
        for item in order:
            item.number += number
            item.date_time = date_time
            item.save()
    else:
        TodayOrder.objects.create(food_name=food_name,number=number,state=state,date_time=date_time)


def get_src(name):
    result = Menu.objects.filter(name=name).values('src')
    if result:
        return str(result[0]['src'])
    else:
        return ''


def getOrder(request):
    data = json.loads(request.body)
    username = data['username']
    order_list = []
    name = Order.objects.all().filter(username=username).values('order_id','username').order_by('-date_time').distinct()[0:60]
    print(name.query)
    for it in name:
        order = []
        order_result = Order.objects.all().filter(order_id = it['order_id'])
        for item in order_result:
            order.append({'name':item.food_name,'numb':item.number,'score':item.score,'src':get_src(item.food_name),})
        order_list.append({'order':order,'comment':item.comment,'date':item.date_time,'state':item.state,'order_id':item.order_id[:-1]})
    return HttpResponse(json.dumps(order_list,cls=CJsonEncoder))