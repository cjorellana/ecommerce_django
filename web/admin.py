from django.contrib import admin

# Register your models here.
from .models import Categoria, Producto

admin.site.register(Categoria)
#admin.site.register(Producto)

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre','descripcion', 'precio')
    #list_filter = ('categoria',)
    search_fields = ('nombre',)
    ordering = ('-id',)
    list_per_page = 10

