// Selecciona todos los botones con la clase add-to-cart-btn
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

// Crea un array para almacenar los productos seleccionados
let selectedProducts = [];

// Agrega un evento de clic a cada botón "BUY NOW"
addToCartBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        // Obtiene los datos del producto asociados al botón desde los atributos 'data-'
        const productName = btn.dataset.productName;


        const product = {
            name: productName,
        };

        // 1. Límite de 3 elementos y 2. No repetir productos
        if (selectedProducts.length >= 2) {
            Swal.fire('¡Atención!', '¡Máximo 2 batas en la lista!', 'info')
            // alert("¡Máximo 3 productos en el carrito!"); // Opcional: Mostrar alerta
            return; // Sale de la función sin añadir el producto
        }

        const isProductInCart = selectedProducts.some(item => item.name === productName);
        if (isProductInCart) {
            Swal.fire('¡Atención!', '¡Esta bata ya está en tu lista!', 'info')
            // alert("Este producto ya está en el carrito."); // Opcional: Mostrar alerta
            return; // Sale de la función sin añadir el producto repetido
        }

        // Agrega el producto al array de productos seleccionados
        selectedProducts.push(product);

        // Actualiza la vista del carrito
        updateCartPreview();
    });
});

// Función para actualizar la vista del carrito
function updateCartPreview() {
    const cartPreview = document.getElementById('cart-preview');
    const cartTotal = document.getElementById('cart-total');

    cartPreview.innerHTML = ''; // Limpia el contenido anterior del carrito
    let totalPrice = 0;

    if (selectedProducts.length === 0) {
        cartPreview.innerHTML = '<p>¡Selecciona tu bata!</p>';
    } else {
        // Itera sobre los productos seleccionados para crear la vista del carrito
        selectedProducts.forEach((product, index) => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('cart-item', 'mb-2', 'd-flex', 'align-items-center', 'justify-content-between'); // Clases de Bootstrap para estilo

            // Nombre del producto
            const nameElement = document.createElement('span');
            nameElement.textContent = product.name;
            nameElement.classList.add('cart-item-name', 'mr-2'); // Clases de Bootstrap para estilo

            // Botón de eliminar
            const removeButton = document.createElement('button');
            removeButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; // Icono de Font Awesome (necesitas incluir Font Awesome en tu HTML)
            removeButton.classList.add('btn', 'btn-danger', 'btn-sm', 'remove-from-cart-btn'); // Clases de Bootstrap para estilo
            removeButton.setAttribute('data-product-index', index); // Guarda el índice del producto para eliminarlo correctamente

            // Evento para eliminar producto al hacer clic en el botón
            removeButton.addEventListener('click', () => {
                const productIndexToRemove = parseInt(removeButton.dataset.productIndex);
                selectedProducts.splice(productIndexToRemove, 1); // Elimina el producto del array
                updateCartPreview(); // Actualiza la vista del carrito
            });

            productDiv.appendChild(nameElement);
            productDiv.appendChild(removeButton);
            cartPreview.appendChild(productDiv);

            // totalPrice += product.price;
        });
    }

    // cartTotal.textContent = `$${totalPrice.toFixed(2)}`; // Actualiza el total
}

const btnSubirInfo = document.getElementById('btnSubir')
btnSubirInfo.addEventListener('click', () => {
    const nombreUsuario = document.getElementById('usuario').value
    if (nombreUsuario == '') {
        Swal.fire('¡Error!', `¡Por favor, proporciona tu nombre`, 'error')
    }else{
        if(selectedProducts.length > 0 && selectedProducts.length < 4 ){
            btnSubirInfo.disabled = true
            var settings = {
                "url": "https://script.google.com/macros/s/AKfycbwJE2VAfudvNjC0BhW2QjsqAD5LLICmBXhi2nCTW-2ivppyq7XSwSXxB2QO2BnJh3Ud/exec",
                "type": "POST",
                "data":JSON.stringify({
                    "nombre": nombreUsuario,
                    "data": selectedProducts
                }),
                success: function(){
                    // alert( "Gracias" );
                },
                error: function() {
                    // btn_descargar.removeAttribute('disabled')
                    Swal.fire('Error de conexión','','info')
                }
            };
            $.ajax(settings).done(function (response) {
                console.log(response)
                if (response == 'ok') {
                    Swal.fire('¡Éxito!', `¡Tu selección se ha subido con éxito ${nombreUsuario}!`, 'success').then(()=>location.reload())
                }else{
                    Swal.fire('¡Oh no!', `Algo salió mal, por favor`, 'error').then(()=>location.reload())
                }
                
            })
            
            
        }else{
            Swal.fire('¡Atención!', '¡Por favor, agrega alguna bata que te agrade!', 'info')
        }
    }
})