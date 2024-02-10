from django.urls import path
from . import views

app_name = 'web'

urlpatterns = [
    path('', views.index,name='index'),
    path('productoPorCategoria/<int:id>', views.productosPorCategoria,name='productoPorCategoria'),
    path('productoPorNombre', views.buscar,name='productoPorNombre'),
]
