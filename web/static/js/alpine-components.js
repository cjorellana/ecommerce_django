// Alpine.js components for e-commerce site

// Componente para el carrito en catalogo.html
function carrito(id, nombre) {
    return {
        agregar() {
            const csrftoken = document.querySelector('input[name="csrfmiddlewaretoken"]')?.value 
                || this.getCookie('csrftoken');

            fetch(`/add_cart/${id}`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Actualizar el mini-carrito
                    this.actualizarMiniCarrito();
                    
                    // Mostrar mensaje de éxito
                    Swal.fire({
                        title: 'Producto añadido',
                        text: `Se añadió "${nombre}" al carrito`,
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al añadir el producto',
                    icon: 'error'
                });
            });
        },
        
        // Función para obtener cookies (utilizada para el token CSRF)
        getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        },
        
        // Actualizar el mini-carrito
        actualizarMiniCarrito(callback) {
            fetch('/carrito', {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.text())
            .then(html => {
                // Extraer solo la parte del mini-carrito del HTML completo
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Actualizar el contador
                const cartCount = doc.querySelector('.h-cart-icon span')?.textContent.trim();
                if (cartCount && document.querySelector('.h-cart-icon span')) {
                    document.querySelector('.h-cart-icon span').textContent = cartCount;
                }
                
                // Actualizar el subtotal en el icono del carrito
                const cartTotal = doc.querySelector('.h-cart-total')?.textContent.trim();
                if (cartTotal && document.querySelector('.h-cart-total')) {
                    document.querySelector('.h-cart-total').textContent = cartTotal;
                }
                
                // Actualizar la lista de productos
                const cartList = doc.querySelector('.cart_list');
                if (cartList && document.querySelector('.cart_list')) {
                    document.querySelector('.cart_list').innerHTML = cartList.innerHTML;
                }
                
                // Actualizar el total dentro del dropdown
                const totalElement = doc.querySelector('.widget_shopping_cart_content .total');
                if (totalElement && document.querySelector('.widget_shopping_cart_content .total')) {
                    document.querySelector('.widget_shopping_cart_content .total').innerHTML = totalElement.innerHTML;
                }
                
                // Ejecutar el callback si existe
                if (typeof callback === 'function') {
                    callback();
                }


                
            })
            .catch(error => {
                console.error('Error al actualizar el mini-carrito:', error);
            });
        }
    };
}

// Componente para la página de detalle de producto
function productoDetalle(id, nombre) {
    return {
        id: id,
        nombre: nombre,
        cantidad: 1,
        color: '',
        
        incrementar() {
            this.cantidad = parseInt(this.cantidad) + 1 || 1;
        },
        
        decrementar() {
            this.cantidad = Math.max(1, parseInt(this.cantidad) - 1 || 1);
        },
        
        agregarAlCarrito() {
            // Validar que la cantidad sea un número positivo
            const cantidad = parseInt(this.cantidad);
            if (isNaN(cantidad) || cantidad < 1) {
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor ingresa una cantidad válida',
                    icon: 'error'
                });
                return false;
            }
            
            // Confirmar la acción con el usuario
            Swal.fire({
                title: 'Añadir al carrito',
                text: `¿Quieres añadir ${this.cantidad} ${this.cantidad > 1 ? 'unidades' : 'unidad'} de "${this.nombre}"${this.color ? ' (Color: ' + this.color + ')' : ''} a tu carrito?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#ff3100',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, añadir',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Obtener el token CSRF
                    const csrftoken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
                    
                    // Crear el objeto con los datos del formulario
                    const formData = new FormData();
                    formData.append('csrfmiddlewaretoken', csrftoken);
                    formData.append('cantidad', this.cantidad);
                    if (this.color) {
                        formData.append('color', this.color);
                    }
                    
                    // Enviar la petición AJAX
                    fetch(`/add_cart/${this.id}`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Mostrar mensaje de éxito
                            Swal.fire({
                                title: 'Producto añadido',
                                text: `Se añadieron ${this.cantidad} ${this.cantidad > 1 ? 'unidades' : 'unidad'} de "${this.nombre}"${this.color ? ' (Color: ' + this.color + ')' : ''} al carrito`,
                                icon: 'success',
                                timer: 1800,
                                showConfirmButton: false
                            });
                            
                            // Actualizar el mini-carrito
                            this.actualizarMiniCarrito();
                        } else {
                            throw new Error(data.message || 'Error al añadir al carrito');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire({
                            title: 'Error',
                            text: error.message || 'Hubo un problema al añadir el producto al carrito',
                            icon: 'error'
                        });
                    });
                }
            });
            
            return false; // Evitar que se envíe el formulario
        },
        
        // Función para actualizar el mini-carrito
        actualizarMiniCarrito(callback) {
            fetch('/carrito', {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.text())
            .then(html => {
                // Extraer solo la parte del mini-carrito del HTML completo
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Actualizar el contador
                const cartCount = doc.querySelector('.h-cart-icon span')?.textContent.trim();
                if (cartCount && document.querySelector('.h-cart-icon span')) {
                    document.querySelector('.h-cart-icon span').textContent = cartCount;
                }
                
                // Actualizar el subtotal en el icono del carrito
                const cartTotal = doc.querySelector('.h-cart-total')?.textContent.trim();
                if (cartTotal && document.querySelector('.h-cart-total')) {
                    document.querySelector('.h-cart-total').textContent = cartTotal;
                }
                
                // Actualizar la lista de productos
                const cartList = doc.querySelector('.cart_list');
                if (cartList && document.querySelector('.cart_list')) {
                    document.querySelector('.cart_list').innerHTML = cartList.innerHTML;
                }
                
                // Actualizar el total dentro del dropdown
                const totalElement = doc.querySelector('.widget_shopping_cart_content .total');
                if (totalElement && document.querySelector('.widget_shopping_cart_content .total')) {
                    document.querySelector('.widget_shopping_cart_content .total').innerHTML = totalElement.innerHTML;
                }
                
                // Ejecutar el callback si existe
                if (typeof callback === 'function') {
                    callback();
                }
            })
            .catch(error => {
                console.error('Error al actualizar el mini-carrito:', error);
            });
        }
    };
}

// Componente para la página del carrito
function carritoCompras(csrfToken) {
    return {
        csrfToken: csrfToken,
        
        // Obtener el token CSRF de las cookies (como respaldo)
        getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        },
        
        // Confirmar eliminación de producto
        confirmarEliminar(id, nombre) {
            Swal.fire({
                title: '¿Eliminar producto?',
                text: `¿Quieres eliminar '${nombre}' del carrito?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#ff3100',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.eliminarProducto(id);
                }
            });
        },
        
        // Eliminar producto mediante AJAX
        eliminarProducto(id) {
            // Crear formData para envío
            const formData = new FormData();
            formData.append('csrfmiddlewaretoken', this.csrfToken || this.getCookie('csrftoken'));
            
            // Enviar solicitud AJAX usando la URL correcta
            fetch(`/eliminarProductoCarrito/${id}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Actualizar el mini-carrito y luego recargar la página
                    this.actualizarMiniCarrito(() => {
                        location.reload();
                    });
                } else {
                    throw new Error('Error al eliminar el producto');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al eliminar el producto',
                    icon: 'error'
                });
            });
        },
        
        // Confirmar limpiar carrito
        confirmarLimpiarCarrito() {
            Swal.fire({
                title: '¿Limpiar carrito?',
                text: "Se eliminarán todos los productos del carrito",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ff3100',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, limpiar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.limpiarCarrito();
                }
            });
        },
        
        // Limpiar el carrito mediante AJAX
        limpiarCarrito() {
            // Crear formData para envío
            const formData = new FormData();
            formData.append('csrfmiddlewaretoken', this.csrfToken || this.getCookie('csrftoken'));
            
            // Enviar solicitud AJAX usando la URL correcta
            fetch('/limpiarCarrito', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Actualizar el mini-carrito y luego recargar la página
                    this.actualizarMiniCarrito(() => {
                        location.reload();
                    });
                } else {
                    throw new Error('Error al limpiar el carrito');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al limpiar el carrito',
                    icon: 'error'
                });
            });
        },
        
        // Aumentar la cantidad de un producto
        aumentarCantidad(id) {
            // Crear formData para envío
            const formData = new FormData();
            formData.append('csrfmiddlewaretoken', this.csrfToken || this.getCookie('csrftoken'));
            
            // Enviar solicitud AJAX usando la URL correcta
            fetch(`/aumentarCantidad/${id}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.actualizarVistaProducto(id, data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        
        // Disminuir la cantidad de un producto
        disminuirCantidad(id) {
            // Crear formData para envío
            const formData = new FormData();
            formData.append('csrfmiddlewaretoken', this.csrfToken || this.getCookie('csrftoken'));
            
            // Enviar solicitud AJAX usando la URL correcta
            fetch(`/disminuirCantidad/${id}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (data.eliminado) {
                        // Si el producto fue eliminado, actualizar primero el mini-carrito
                        this.actualizarMiniCarrito(() => {
                            location.reload();
                        });
                    } else {
                        this.actualizarVistaProducto(id, data);
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        
        // Actualizar la vista de un producto en el carrito
        actualizarVistaProducto(id, data) {
            const itemRow = document.querySelector(`[data-producto-id="${id}"]`);
            if (itemRow) {
                const cantidadInput = itemRow.querySelector('input[type="text"]');
                const subtotalElement = itemRow.querySelector('.prod-li-total');
                const totalElement = document.querySelector('.cart-totals-val');
                
                cantidadInput.value = data.cantidad;
                subtotalElement.textContent = 'Q ' + data.subtotal;
                totalElement.textContent = 'Q ' + data.cart_total;
                
                // Actualizar el mini-carrito
                this.actualizarMiniCarrito();
            }
        },
        
        // Actualizar el mini-carrito
        actualizarMiniCarrito(callback) {
            fetch('/carrito', {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.text())
            .then(html => {
                // Extraer solo la parte del mini-carrito del HTML completo
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Actualizar el contador
                const cartCount = doc.querySelector('.h-cart-icon span')?.textContent.trim();
                if (cartCount && document.querySelector('.h-cart-icon span')) {
                    document.querySelector('.h-cart-icon span').textContent = cartCount;
                }
                
                // Actualizar el subtotal en el icono del carrito
                const cartTotal = doc.querySelector('.h-cart-total')?.textContent.trim();
                if (cartTotal && document.querySelector('.h-cart-total')) {
                    document.querySelector('.h-cart-total').textContent = cartTotal;
                }
                
                // Actualizar la lista de productos
                const cartList = doc.querySelector('.cart_list');
                if (cartList && document.querySelector('.cart_list')) {
                    document.querySelector('.cart_list').innerHTML = cartList.innerHTML;
                }
                
                // Actualizar el total dentro del dropdown
                const totalElement = doc.querySelector('.widget_shopping_cart_content .total');
                if (totalElement && document.querySelector('.widget_shopping_cart_content .total')) {
                    document.querySelector('.widget_shopping_cart_content .total').innerHTML = totalElement.innerHTML;
                }
                
                // Ejecutar el callback si existe
                if (typeof callback === 'function') {
                    callback();
                }
            })
            .catch(error => {
                console.error('Error al actualizar el mini-carrito:', error);
            });
        }
    };
}
