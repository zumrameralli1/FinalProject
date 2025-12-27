// Product Data
function getProducts() {
    return [
        {
            id: 1,
            name: 'iPhone 15 Pro',
            price: 45000,
            category: 'telefon',
            image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
            description: 'Son teknoloji iPhone 15 Pro. A17 Pro çip, ProMotion ekran ve titanium tasarım.'
        },
        {
            id: 2,
            name: 'Samsung Galaxy S24',
            price: 38000,
            category: 'telefon',
            image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
            description: 'Galaxy AI ile güçlendirilmiş Samsung Galaxy S24. 200MP kamera ve parlak ekran.'
        },
        {
            id: 3,
            name: 'MacBook Air M3',
            price: 52000,
            category: 'laptop',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
            description: 'M3 çip ile güçlendirilmiş MacBook Air. İnce, hafif ve güçlü.'
        },
        {
            id: 4,
            name: 'iPad Pro 12.9',
            price: 35000,
            category: 'tablet',
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
            description: 'M2 çipli iPad Pro. Liquid Retina XDR ekran ve Apple Pencil desteği.'
        },
        {
            id: 5,
            name: 'AirPods Pro 2',
            price: 8500,
            category: 'aksesuar',
            image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
            description: 'Aktif gürültü önleme ve şeffaf mod. USB-C şarj kutusu.'
        },
        {
            id: 6,
            name: 'Apple Watch Series 9',
            price: 15000,
            category: 'aksesuar',
            image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
            description: 'Her zaman açık Retina ekran. Sağlık ve fitness özellikleri.'
        },
        {
            id: 7,
            name: 'Sony WH-1000XM5',
            price: 12000,
            category: 'aksesuar',
            image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
            description: 'Endüstri lideri gürültü önleme teknolojisi. 30 saat pil ömrü.'
        },
        {
            id: 8,
            name: 'Dell XPS 15',
            price: 48000,
            category: 'laptop',
            image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
            description: 'Intel Core i7, 16GB RAM, 512GB SSD. 15.6 inç InfinityEdge ekran.'
        }
    ];
}

// Cart Functions
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart(cart);
    alert('Ürün sepete eklendi!');
}

function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    
    // Reload cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }
}

function updateQuantity(productId, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
            if (window.location.pathname.includes('cart.html')) {
                loadCart();
            }
        }
    }
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.textContent = totalItems;
    }
}

// User Authentication
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginLink = document.getElementById('nav-login');
    const welcomeMsg = document.getElementById('welcome-message');
    const userName = document.getElementById('user-name');
    
    if (user) {
        if (loginLink) {
            loginLink.textContent = 'Çıkış Yap';
            loginLink.href = '#';
            loginLink.onclick = (e) => {
                e.preventDefault();
                logout();
            };
        }
        
        if (welcomeMsg && userName) {
            userName.textContent = user.name || user.email;
            welcomeMsg.style.display = 'block';
        }
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Normal Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!validateEmail(email)) {
        alert('Lütfen geçerli bir e-posta adresi girin.');
        return false;
    }
    
    if (!validatePassword(password)) {
        alert('Şifre en az 6 karakter olmalıdır.');
        return false;
    }
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert('E-posta veya şifre hatalı!');
    }
    
    return false;
}

// Registration
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!name || name.length < 2) {
        alert('Lütfen geçerli bir isim girin.');
        return false;
    }
    
    if (!validateEmail(email)) {
        alert('Lütfen geçerli bir e-posta adresi girin.');
        return false;
    }
    
    if (!validatePassword(password)) {
        alert('Şifre en az 6 karakter olmalıdır.');
        return false;
    }
    
    if (password !== confirmPassword) {
        alert('Şifreler eşleşmiyor!');
        return false;
    }
    
    // Save user
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
        alert('Bu e-posta adresi zaten kullanılıyor!');
        return false;
    }
    
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Kayıt başarılı! Giriş yapabilirsiniz.');
    window.location.href = 'login.html';
    
    return false;
}

// Menu Toggle for Mobile
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkLoginStatus();
});
