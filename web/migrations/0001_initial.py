# Generated by Django 5.2 on 2025-05-17 01:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=200)),
                ('fecha_registro', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=200)),
                ('descripcion', models.TextField(null=True)),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('fecha_registro', models.DateTimeField(auto_now_add=True)),
                ('imagen', models.ImageField(blank=True, upload_to='productos')),
                ('Categoria', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='web.categoria')),
            ],
        ),
    ]
