// Shopping Cart Management

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Add product to cart
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);
    showNotification('Ürün sepete eklendi!', 'success');
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }
}

// Update quantity
function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
            if (window.location.pathname.includes('cart.html')) {
                loadCartPage();
            }
        }
    }
}

// Calculate total
function calculateTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart count in navbar
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Clear cart
function clearCart() {
    if (confirm('Sepeti temizlemek istediğinizden emin misiniz?')) {
        localStorage.removeItem('cart');
        updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            loadCartPage();
        }
        showNotification('Sepet temizlendi', 'success');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Load cart page
function loadCartPage() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const emptyCartMessage = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');

    if (!cartItemsContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }

    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">${formatPrice(item.price)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <input type="number" value="${item.quantity}" min="1" 
                       onchange="updateQuantity(${item.id}, parseInt(this.value))" 
                       class="quantity-input">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="cart-item-total">
                ${formatPrice(item.price * item.quantity)}
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    const total = calculateTotal();
    if (cartTotalElement) {
        cartTotalElement.textContent = formatPrice(total);
    }
}

// Checkout function
function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('Sepetiniz boş!', 'error');
        return;
    }

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
        showNotification('Lütfen önce giriş yapın', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    // Simulate checkout
    showNotification('Siparişiniz alındı! Teşekkür ederiz.', 'success');
    setTimeout(() => {
        clearCart();
        window.location.href = 'index.html';
    }, 2000);
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Load cart page if on cart page
    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }
});