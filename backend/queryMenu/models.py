from django.db import models
from django.utils.html import format_html
# Create your models here.


class menu(models.Model):
    typeName = models.CharField(max_length=50,verbose_name='种类')  # 种类
    name = models.CharField(max_length=50,verbose_name='名字')  # 名字
    src = models.ImageField(default='image/defaultImg.jpg', upload_to='image',verbose_name='图片')
    sales = models.IntegerField(default=0,verbose_name='销量')
    rating = models.FloatField(default=5,verbose_name='评分')
    price = models.FloatField(default=9999.0,verbose_name='售价')
    status_type = (('启用', u'启用'), ('停用', u'停用'))
    status = models.CharField(default='启用',verbose_name='是否启用',max_length=30,choices=status_type)

    def image_data(self):
        if self.src.url:
            return format_html(
            '<img src="{}" width="100px" />',
            self.src.url,
            )

    image_data.short_description = u'图片'

    class Meta:
        verbose_name = '餐品'
        verbose_name_plural = '餐品'