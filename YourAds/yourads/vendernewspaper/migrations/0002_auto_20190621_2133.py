# Generated by Django 2.2.2 on 2019-06-21 16:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usernewspaper', '0002_auto_20190621_2133'),
        ('vendernewspaper', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='ClassifiedType',
        ),
        migrations.RemoveField(
            model_name='newspapername',
            name='city',
        ),
        migrations.DeleteModel(
            name='NewspaperSize',
        ),
        migrations.DeleteModel(
            name='City',
        ),
        migrations.DeleteModel(
            name='NewspaperName',
        ),
    ]
