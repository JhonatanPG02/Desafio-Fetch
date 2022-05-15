
const contenedorProductos = document.querySelector(".contenedor-productos");
const productosComprados = document.querySelector('.card-items');
let precioTotal = document.querySelector('.price-total');
let contadorCarrito = document.querySelector('.count-product');

let productosCarrito = [];
let totalCard = 0;
let cantidadProducto = 0;


document.addEventListener('DOMContentLoaded', () => {
    //Llamamos a la funcion para visualizar los productos
    productos()

})

//Aplicams un Fetch para hacer el llamado a la data.
  const productos = async () => {

	const resp = await

fetch('https://raw.githubusercontent.com/JhonatanPG02/Proyecto-Final-BurgerFire/main/data.json')
const data = await resp.json()
// Aplicamos un forEach y por cada producto realizamos eventos para mostrarlo en la web
data.forEach( ({id, nombre, precio, foto}) => {
	    const divProducto = document.createElement('div');
        divProducto.classList.add('carta');

        const fotoProducto = document.createElement('img')
        fotoProducto.classList.add('pic');
        fotoProducto.src = foto

        const tituloProducto = document.createElement('h2')
        tituloProducto.classList.add('title')
        tituloProducto.textContent = nombre

        const precioProducto = document.createElement('h4')
        precioProducto.classList.add('precio')
        precioProducto.textContent = `${precio}$`

        const buttonProducto = document.createElement('button')
        buttonProducto.classList.add('btn-producto')
        buttonProducto.setAttribute('data-id', id)
        buttonProducto.textContent = 'Agregar a Carrito'
 

        // Enlazamos los nodos hijos al padre
        divProducto.appendChild(fotoProducto)
        divProducto.appendChild(tituloProducto)
        divProducto.appendChild(precioProducto)
        divProducto.appendChild(buttonProducto)

        contenedorProductos.appendChild(divProducto)

    });
}

// Aplicamos funciones de eventos para agregar o eliminar productos.
function loadEventListener() {

    contenedorProductos.addEventListener('click', agregarProducto);

    productosComprados.addEventListener('click', eliminarProducto);
}

loadEventListener()


// Función aplicable a agregar productos al carrito.
function agregarProducto(e) {
    e.preventDefault();
    
    if(e.target.classList.contains('btn-producto')) {
    const productoSeleccionado = e.target.parentElement
    leerContenido(productoSeleccionado);

    //Mensaje de producto agregado
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'producto agregado',
        showConfirmButton: false,
        timer: 1000
      })
    }  
}

// Función aplicable a agregar productos al carrito.
function eliminarProducto(e) {
    
    Swal.fire({
        title: 'Estas seguro de eliminar el producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Producto Eliminado!',)
            // Si confirma la eliminación ingresa a ejecutarte, de lo contrario se cancela.       
            if(e.target.classList.contains('delete-product')) {
                const deleteId = e.target.getAttribute('data-id');
        
             //Iteramos el array de los productos del carrito para identificar el producto a eliminar y restar el valor total.
            productosCarrito.forEach(value => {
                if (value.id == deleteId) {
                let precioDuplicado = parseFloat(value.price) * parseFloat(value.counter);
                totalCard -= precioDuplicado;
                }
            });
            leerHtml()

                //Iteramos el array de los productos del carrito para filtrar solo los productos que no coinciden con lo seleccionado.
                    productosCarrito = productosCarrito.filter(producto => producto.id !== deleteId)
                    cantidadProducto--
          }
        } 
    leerHtml()
     })
      
}

// Aplicamos una función que nos permita obtener las propiedades necesarias de cada producto que incluiremos al carrito: 
function leerContenido(producto){
    let infoProducto = {
        image: producto.querySelector('img').src,
        title: producto.querySelector('.title').textContent,
        price: producto.querySelector('.precio').textContent,
        id: producto.querySelector('button').getAttribute('data-id'),
        counter: 1
    }

    totalCard += parseFloat(infoProducto.price)

    //Aplicamos validacion de productos existentes, la cual permita sumar la cantidad si ya existe.
    const existe = productosCarrito.some(producto => producto.id === infoProducto.id);
    if (existe) {
        const agregado = productosCarrito.map(producto => {
           
            if (producto.id === infoProducto.id) {
                producto.counter++;
                return producto;
            } else {
                return producto
            }     
        
        });
        
        productosCarrito = [...agregado]
    } else {
        
        //Aplicando spreed operator y operador++
        productosCarrito = [...productosCarrito, infoProducto]
        cantidadProducto++
    }   

    leerHtml();
}


//Aplicamos una función de creación de la estructura de HTML de los productos agregados al carrito:
function leerHtml(){

    productosComprados.innerHTML = ''

    productosCarrito.forEach(producto => {
        // Aplicando la destrudcturacion a cada objeto del array de productosCarrito.
        const {image, title, price, counter, id} = producto;
        const row = document.createElement('div');
        row.classList.add('item')
        row.innerHTML = `
            <img src='${image}' alt="">
                <div class="item-content">
                        <h5>${title}</h5>
                        <h5 class="cart-price">${price}</h5>
                        <h6>Cantidad: ${counter}</h6>
                </div>
            <span class="delete-product" data-id="${id}">X</span>`;

        productosComprados.appendChild(row);

        precioTotal.textContent = totalCard;
        
        contadorCarrito.textContent = cantidadProducto;
        if(totalCard == 0) contadorCarrito.textContent = 0;
    });

    sincronizarStorage();

}



//Aplicamos la funcion para incluir los productos del carrito al localStorage
function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(productosCarrito));
}


//Función para mostrar el modal del carrito
function showCart(x){
    document.getElementById("products-id").style.display = "block";
}

function closeBtn(){
    document.getElementById("products-id").style.display = "none";
}