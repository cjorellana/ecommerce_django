from django.shortcuts import render

from .models import Categoria,Producto


# Create your views here.
def index(request):
    categorias = Categoria.objects.all()
    productos = Producto.objects.all()
    context = {
        'categorias':categorias,
        'productos':productos
    }
    return render(request, 'index.html', context)
    