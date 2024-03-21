class Cart:
    def __init__(self, request):
        self.request = request
        self.session = request.session
        cart = self.session.get("cart")
        if not cart:
            cart = self.session["cart"] = {}
        self.cart = cart

    def add(self, producto, cantidad):

        self.cart[producto.id] = {
            "producto_id": producto.id,
            "nombre": producto.nombre,
            "cantidad": cantidad,
            "precio": str(producto.precio),
            "imagen": producto.imagen.url,
            "categoria": producto.Categoria.nombre,
            "subtotal": str(producto.precio * cantidad)
        }

        self.save()
       

    def save(self):
        """ guarda cambios en el carrito """
        self.session["cart"]= self.cart
        self.session.modified = True

    def remove(self, product):
        product_id = str(product.id)
        if product_id in self.cart:
            del self.cart[product_id]
            self.save()
    
    def clear(self):
        del self.session["cart"]
        self.save()

 

    