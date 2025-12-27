// Product database
const productsDatabase = [
    {
        id: 1,
        name: 'MacBook Pro 14"',
        category: 'Laptop',
        price: 45999,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        description: 'M3 Pro chip ile güçlendirilmiş, 14 inç Liquid Retina XDR display, 512GB SSD',
        featured: true
    },
    {
        id: 2,
        name: 'iPhone 15 Pro',
        category: 'Telefon',
        price: 35999,
        image: 'https://images.unsplash.com/photo-1592286927505-bf92040d7b4b?w=500',
        description: 'Titanium tasarım, A17 Pro chip, 48MP kamera sistemi',
        featured: true
    },
    {
        id: 3,
        name: 'AirPods Pro',
        category: 'Aksesuar',
        price: 7999,
        image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500',
        description: 'Aktif gürültü engelleme, adaptive audio, USB-C şarj',
        featured: true
    },
    {
        id: 4,
        name: 'iPad Air',
        category: 'Tablet',
        price: 19999,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
        description: 'M1 chip, 10.9 inç Liquid Retina display, 64GB',
        featured: true
    },
    {
        id: 5,
        name: 'Apple Watch Series 9',
        category: 'Aksesuar',
        price: 12999,
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
        description: 'S9 chip, Always-On Retina display, sağlık özellikleri',
        featured: false
    },
    {
        id: 6,
        name: 'Magic Keyboard',
        category: 'Aksesuar',
        price: 3499,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
        description: 'Kablosuz, şarj edilebilir, Touch ID',
        featured: false
    },
    {
        id: 7,
        name: 'Samsung Galaxy S24 Ultra',
        category: 'Telefon',
        price: 42999,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
        description: 'Snapdragon 8 Gen 3, 200MP kamera, S Pen',
        featured: false
    },
    {
        id: 8,
        name: 'Dell XPS 15',
        category: 'Laptop',
        price: 38999,
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
        description: 'Intel i7, 16GB RAM, 512GB SSD, NVIDIA RTX 4050',
        featured: false
    },
    {
        id: 9,
        name: 'Sony WH-1000XM5',
        category: 'Aksesuar',
        price: 8999,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
        description: 'Industry-leading gürültü engelleme, 30 saat pil ömrü',
        featured: false
    },
    {
        id: 10,
        name: 'HP Pavilion 27"',
        category: 'Monitor',
        price: 9999,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
        description: '4K UHD, IPS panel, HDR support',
        featured: false
    },
    {
        id: 11,
        name: 'Logitech MX Master 3S',
        category: 'Aksesuar',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
        description: 'Wireless, ergonomik tasarım, 8K DPI',
        featured: false
    },
    {
        id: 12,
        name: 'Samsung Galaxy Tab S9',
        category: 'Tablet',
        price: 16999,
        image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500',
        description: 'Snapdragon 8 Gen 2, 11 inç, S Pen dahil',
        featured: false
    }
];

// Get all products
function getAllProducts() {
    return productsDatabase;
}

// Get featured products
function getFeaturedProducts() {
    return productsDatabase.filter(product => product.featured);
}

// Get product by ID
function getProductById(id) {
    return productsDatabase.find(product => product.id === parseInt(id));
}

// Get products by category
function getProductsByCategory(category) {
    if (category === 'all') return productsDatabase;
    return productsDatabase.filter(product => product.category === category);
}

// Search products
function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return productsDatabase.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
}

// Filter products by price range
function filterByPrice(min, max) {
    return productsDatabase.filter(product => 
        product.price >= min && product.price <= max
    );
}

// Get unique categories
function getCategories() {
    const categories = [...new Set(productsDatabase.map(p => p.category))];
    return ['all', ...categories];
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0
    }).format(price);
}

// Render product card
function renderProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">${formatPrice(product.price)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Sepete Ekle
                </button>
            </div>
        </div>
    `;
}

// Load featured products on homepage
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const featured = getFeaturedProducts();
    container.innerHTML = featured.map(product => renderProductCard(product)).join('');

    // Add click event to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-to-cart-btn')) {
                const productId = this.dataset.id;
                window.location.href = `product-detail.html?id=${productId}`;
            }
        });
    });
}

// Initialize on page load
if (document.getElementById('featuredProducts')) {
    loadFeaturedProducts();
}