// Shop Page JavaScript

let allProducts = [];
let filteredProducts = [];

// Initialize shop page
document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('shop.html')) return;
    
    allProducts = getAllProducts();
    filteredProducts = [...allProducts];
    
    // Populate category filter
    populateCategoryFilter();
    
    // Display products
    displayProducts(filteredProducts);
    
    // Setup event listeners
    setupEventListeners();
});

// Populate category filter dropdown
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    const categories = getCategories();
    
    categories.forEach(category => {
        if (category !== 'all') {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    // Price filter
    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    
    // Sort filter
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', applySorting);
    }
}

// Handle search
function handleSearch(e) {
    const query = e.target.value.trim();
    
    if (query === '') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = searchProducts(query);
    }
    
    applyFilters();
}

// Apply filters
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    let products = [...filteredProducts];
    
    // Apply category filter
    if (categoryFilter && categoryFilter.value !== 'all') {
        products = products.filter(p => p.category === categoryFilter.value);
    }
    
    // Apply price filter
    if (priceFilter && priceFilter.value !== 'all') {
        const [min, max] = priceFilter.value.split('-').map(Number);
        products = products.filter(p => p.price >= min && p.price <= max);
    }
    
    applySorting(products);
}

// Apply sorting
function applySorting(products = null) {
    const sortFilter = document.getElementById('sortFilter');
    
    if (!products) {
        products = [...filteredProducts];
        applyFilters();
        return;
    }
    
    if (!sortFilter) {
        displayProducts(products);
        return;
    }
    
    const sortValue = sortFilter.value;
    let sortedProducts = [...products];
    
    switch(sortValue) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
            break;
        default:
            // Keep original order
            break;
    }
    
    displayProducts(sortedProducts);
}

// Display products
function displayProducts(products) {
    const container = document.getElementById('shopProducts');
    const countElement = document.getElementById('productsCount');
    
    if (!container) return;
    
    // Update count
    if (countElement) {
        const count = products.length;
        countElement.textContent = `${count} ürün gösteriliyor`;
    }
    
    // Display products
    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--gray); margin-bottom: 20px;"></i>
                <p style="font-size: 1.2rem; color: var(--gray);">Ürün bulunamadı</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => renderProductCard(product)).join('');
    
    // Add click event to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-to-cart-btn') && 
                !e.target.closest('.add-to-cart-btn')) {
                const productId = this.dataset.id;
                window.location.href = `product-detail.html?id=${productId}`;
            }
        });
    });
}