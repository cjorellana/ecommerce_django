from django.shortcuts import render,get_object_or_404

from .models import Categoria,Producto


# Create your views here.
def index(request):
    categorias = Categoria.objects.all()
    productos = Producto.objects.all()
    #print(productos)
    context = {
        'categorias':categorias,
        'productos':productos
    }
    return render(request, 'index.html', context)


#productos por categoria
def productosPorCategoria(request, id):
    objcategoria = Categoria.objects.get(id=id)
    productos = objcategoria.producto_set.all()
    #productos = Producto.objects.filter(categoria=objcategoria)

    categorias = Categoria.objects.all()

    context = {
        'categorias':categorias,
        'productos':productos
    }
    return render(request, 'index.html', context)
    
#busqueda de producto
def buscar(request):
    nombre = request.POST.get('nombre', '')
    productos = Producto.objects.filter(nombre__icontains=nombre)

    categorias = Categoria.objects.all()

    context = {
        'categorias':categorias,
        'productos':productos
    }
    return render(request, 'index.html', context)

#detalle de producto


def detalle(request, id):


    #objproducto = Producto.objects.get(id=id)
    objproducto = get_object_or_404(Producto, pk=id)
    
    context = {        
        'producto': objproducto
    }

    return render(request, 'producto.html', context)


""" Carrito  """
from .carrito import Cart

def carrito(request):
    return render(request, 'carrito.html')

def add_cart(request, id):
    #cantidad = int(request.POST['cantidad'])
    if request.method == 'POST':
        cantidad = int(request.POST['cantidad'])
    else:
        cantidad = 1

    objProducto = Producto.objects.get(pk=id)
    carritoProducto = Cart(request)
    #print(objProducto.Categoria)
    carritoProducto.add(objProducto, cantidad)

    return render(request, 'carrito.html')