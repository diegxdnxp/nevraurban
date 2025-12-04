// Base de datos de productos con Tallas Disponibles
const products = [
    { id: 1, name: "New Balance X", price: 120.00, img: "img/zapato1.jpg", sizes: [38, 39, 40, 41, 42]},
    { id: 2, name: "New Atletic", price: 95.50, img: "img/zapato2.jpg", sizes: [39, 40, 41] },
    { id: 3, name: "Vans Old skull", price: 80.00, img: "img/zapato3.jpg", sizes: [36, 37, 38, 39] },
    { id: 4, name: "Night Hawk", price: 150.00, img: "img/zapato4.jpg", sizes: [40, 41, 42, 43, 44] }
];

let cart = [];
let currentProduct = null; // Producto seleccionado actualmente
let selectedSize = null;
let selectedQty = 1;

// --- NAVEGACIÓN ---
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(s => {
        s.classList.remove('active-section');
        s.classList.add('hidden-section');
    });
    document.getElementById(sectionId).classList.remove('hidden-section');
    document.getElementById(sectionId).classList.add('active-section');
}

// --- RENDERIZAR MARKET ---
const grid = document.getElementById('product-grid');
products.forEach(p => {
    grid.innerHTML += `
        <div class="product-card">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p>S/.${p.price.toFixed(2)}</p>
            <button class="btn-add" onclick="openProductModal(${p.id})">Seleccionar Opciones</button>
        </div>
    `;
});

// --- MODAL DE PRODUCTO (TALLA Y CANTIDAD) ---
function openProductModal(id) {
    currentProduct = products.find(p => p.id === id);
    selectedSize = null;
    selectedQty = 1;

    // Actualizar UI del Modal
    document.getElementById('modal-product-name').innerText = currentProduct.name;
    document.getElementById('modal-product-price').innerText = `S/.${currentProduct.price.toFixed(2)}`;
    document.getElementById('modal-qty').value = selectedQty;
    document.getElementById('product-modal').style.display = 'block';

    // Generar botones de tallas
    const sizesContainer = document.getElementById('sizes-options');
    sizesContainer.innerHTML = '';
    currentProduct.sizes.forEach(size => {
        const btn = document.createElement('button');
        btn.classList.add('size-btn');
        btn.innerText = size;
        btn.onclick = () => selectSize(btn, size);
        sizesContainer.appendChild(btn);
    });
}

function selectSize(btnElement, size) {
    // Quitar clase 'selected' de todos
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    // Poner al actual
    btnElement.classList.add('selected');
    selectedSize = size;
}

function adjustModalQty(change) {
    let newQty = selectedQty + change;
    if (newQty >= 1) {
        selectedQty = newQty;
        document.getElementById('modal-qty').value = selectedQty;
    }
}

function confirmAddToCart() {
    if (!selectedSize) {
        alert("Por favor selecciona una talla.");
        return;
    }

    // Verificar si ya existe el producto con esa talla en el carrito
    const existingItem = cart.find(item => item.id === currentProduct.id && item.size === selectedSize);

    if (existingItem) {
        existingItem.qty += selectedQty;
    } else {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            size: selectedSize,
            qty: selectedQty,
            img: currentProduct.img
        });
    }

    closeModal('product-modal');
    updateCartUI();
    // Animación visual pequeña en el icono del carrito
    const cartIcon = document.querySelector('.fa-shopping-cart');
    cartIcon.style.color = '#27ae60';
    setTimeout(() => cartIcon.style.color = '', 500);
}

// --- LÓGICA DEL CARRITO (CON + Y -) ---
function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    
    list.innerHTML = '';
    let total = 0;
    let totalCount = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        totalCount += item.qty;

        list.innerHTML += `
            <li>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <span>Talla: ${item.size} | Unit: S/.${item.price}</span>
                </div>
                <div class="item-controls">
                    <button class="btn-small" onclick="changeCartQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="btn-small" onclick="changeCartQty(${index}, 1)">+</button>
                </div>
            </li>
        `;
    });

    totalEl.innerText = `S/.${total.toFixed(2)}`;
    countEl.innerText = totalCount;
}

function changeCartQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        const confirmDelete = confirm("¿Eliminar producto?");
        if(confirmDelete) cart.splice(index, 1);
        else cart[index].qty = 1;
    }
    updateCartUI();
}

// --- MODALES Y CHECKOUT ---
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function openCart() { 
    document.getElementById('cart-modal').style.display = 'block'; 
    updateCartUI();
}
function goToCheckout() {
    if (cart.length === 0) { alert("Carrito vacío"); return; }
    closeModal('cart-modal');
    document.getElementById('checkout-modal').style.display = 'block';
}

function processPayment(e) {
    e.preventDefault();
    const btn = document.querySelector('.btn-pay');
    const originalText = btn.innerText;
    
    btn.innerText = "Procesando...";
    btn.style.opacity = "0.7";
    btn.disabled = true;

    setTimeout(() => {
        // --- AQUÍ ESTÁ EL MENSAJE SOLICITADO ---
        alert("⚠️ ALERTA DE SEGURIDAD ⚠️\n\nError 403: Tarjeta clonada detectada. Transacción rechazada por el banco emisor.");
        
        // Restaurar botón
        btn.innerText = originalText;
        btn.style.opacity = "1";
        btn.disabled = false;
        
    }, 2500); // 2.5 segundos de espera para suspenso
}

// Cerrar click afuera
window.onclick = function(e) {
    if (e.target.classList.contains('modal')) e.target.style.display = "none";
}   