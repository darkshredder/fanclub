# Generated by Django 3.1.5 on 2021-01-23 22:29

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0004_auto_20210123_2154'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='read_by',
            field=models.ManyToManyField(related_name='read_by', to=settings.AUTH_USER_MODEL),
        ),
    ]
