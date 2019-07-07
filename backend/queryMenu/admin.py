from django.contrib import admin
from queryMenu.models import menu
# Register your models here.

class menuAdmin(admin.ModelAdmin):
    list_display = ('typeName','name','sales','rating','image_data','status')
    list_editable = ['status']
    readonly_fields = ('image_data',)  # 必须加这行 否则访问编辑页面会报错
    search_fields = ('typeName','name')
    list_filter = ('typeName','status','name')
    list_per_page = 30

admin.site.register(menu,menuAdmin)