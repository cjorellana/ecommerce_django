from django.urls import path
from . import views

app_name = 'web'

urlpatterns = [
    path('', views.index,name='index'),
    path('productoPorCategoria/<int:id>', views.productosPorCategoria,name='productoPorCategoria'),
    path('productoPorNombre', views.buscar,name='productoPorNombre'),
    path('producto/<int:id>', views.detalle,name='producto'),
    path('carrito', views.carrito, name='carrito'),
    path('add_cart/<int:id>', views.add_cart, name='add_cart'),
    path('eliminarProductoCarrito/<int:producto_id>', views.eliminar_producto_carrito, name='eliminarProductoCarrito'),
    path('limpiarCarrito', views.limpiar_carrito, name='limpiarCarrito'),
    path('aumentarCantidad/<int:producto_id>', views.aumentar_cantidad, name='aumentarCantidad'),
    path('disminuirCantidad/<int:producto_id>', views.disminuir_cantidad, name='disminuirCantidad'),
]
