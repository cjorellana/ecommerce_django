from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse

from .models import Categoria, Producto


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
    # Verificar que sea una solicitud POST para proteger contra CSRF
    if request.method != 'POST':
        return redirect('web:index')
    
    try:
        cantidad = int(request.POST.get('cantidad', 1))
        if cantidad < 1:
            cantidad = 1
    except (ValueError, TypeError):
        cantidad = 1

    try:
        objProducto = Producto.objects.get(pk=id)
        carritoProducto = Cart(request)
        carritoProducto.add(objProducto, cantidad)
        
        # Si la solicitud es AJAX (verificamos el encabezado X-Requested-With)
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True, 
                'message': f'{objProducto.nombre} añadido al carrito',
                'cart_count': len(carritoProducto.cart)
            })
        
        # Para solicitudes normales, redirigir al carrito
        return redirect('web:carrito')
    except Producto.DoesNotExist:
        # Si el producto no existe
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'success': False, 'message': 'Producto no encontrado'}, status=404)
        
        # Redirigir a la página principal
        return redirect('web:index')

def eliminar_producto_carrito(request, producto_id):
    # Verificar que sea una solicitud POST
    if request.method != 'POST':
        return redirect('web:carrito')
        
    try:
        objProducto = Producto.objects.get(pk=producto_id)
        carritoProducto = Cart(request)
        carritoProducto.remove(objProducto)
        
        # Si la solicitud es AJAX
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True, 
                'message': f'{objProducto.nombre} eliminado del carrito',
                'cart_count': len(carritoProducto.cart)
            })
            
        return redirect('web:carrito')
    except Producto.DoesNotExist:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'success': False, 'message': 'Producto no encontrado'}, status=404)
        return redirect('web:carrito')

def limpiar_carrito(request):  
    # Verificar que sea una solicitud POST
    if request.method != 'POST':
        return redirect('web:carrito')
        
    carritoProducto = Cart(request)
    carritoProducto.clear()
    
    # Si la solicitud es AJAX
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True, 
            'message': 'Carrito vaciado correctamente',
            'cart_count': 0
        })
        
    return redirect('web:carrito')