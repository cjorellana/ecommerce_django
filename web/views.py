from django.shortcuts import render

from .models import Categoria,Producto


# Create your views here.
def index(request):
    categorias = Categoria.objects.all()
    productos = Producto.objects.all()
    print(productos)
    context = {
        'categorias':categorias,
        'productos':productos
    }
    return render(request, 'index.html', context)
    
#busqueda de producto
def buscar(request):
    nombre = request.POST['nombre']
    productos = Producto.objects.filter(nombre__icontains=nombre)

    categorias = Categoria.objects.all()

    context = {
        'categorias':categorias,
        'productos':productos
    }
    return render(request, 'index.html', context)
    