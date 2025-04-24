// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        category: "electronics",
        image: "https://source.unsplash.com/random/400x400/?headphones",
        description: "High-quality wireless headphones with noise cancellation."
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        category: "electronics",
        image: "https://source.unsplash.com/random/400x400/?smartwatch",
        description: "Feature-rich smartwatch with health tracking."
    },
    {
        id: 3,
        name: "Designer Backpack",
        price: 79.99,
        category: "accessories",
        image: "https://source.unsplash.com/random/400x400/?backpack",
        description: "Stylish and functional backpack for everyday use."
    },
    {
        id: 4,
        name: "Running Shoes",
        price: 129.99,
        category: "clothing",
        image: "https://source.unsplash.com/random/400x400/?shoes",
        description: "Comfortable running shoes with advanced cushioning."
    },
    {
        id: 5,
        name: "Coffee Maker",
        price: 149.99,
        category: "home",
        image: "https://source.unsplash.com/random/400x400/?coffeemaker",
        description: "Automatic coffee maker with timer and temperature control."
    },
    {
        id: 6,
        name: "Yoga Mat",
        price: 49.99,
        category: "home",
        image: "https://source.unsplash.com/random/400x400/?yogamat",
        description: "Non-slip yoga mat with carrying strap."
    }
];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const featuredProducts = document.getElementById('featuredProducts');
const categoryFilters = document.querySelectorAll('.filter-options input');
const priceRange = document.getElementById('priceRange');
const minPrice = document.getElementById('minPrice');
const maxPrice = document.getElementById('maxPrice');
const sortBy = document.getElementById('sortBy');
const viewButtons = document.querySelectorAll('.view-btn');

// Initialize products and cart in localStorage if not exists
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
}

if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Cart functionality
function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    
    if (product) {
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
        
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification('Product added to cart!');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load and display products
function displayProducts(productsToShow = products, container = productGrid) {
    if (!container) return;
    
    container.innerHTML = '';
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p>${product.description}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        container.appendChild(productCard);
    });
}

// Filter products
function filterProducts() {
    const selectedCategories = Array.from(categoryFilters)
        .filter(filter => filter.checked)
        .map(filter => filter.value);
    
    const minPriceValue = parseFloat(minPrice.value) || 0;
    const maxPriceValue = parseFloat(maxPrice.value) || Infinity;
    
    let filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const priceMatch = product.price >= minPriceValue && product.price <= maxPriceValue;
        return categoryMatch && priceMatch;
    });
    
    // Sort products
    const sortValue = sortBy.value;
    switch(sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            // Popularity (default) - using ID as a proxy for popularity
            filteredProducts.sort((a, b) => a.id - b.id);
    }
    
    displayProducts(filteredProducts);
}

// Event Listeners
if (categoryFilters.length > 0) {
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', filterProducts);
    });
}

if (priceRange) {
    priceRange.addEventListener('input', (e) => {
        maxPrice.value = e.target.value;
        filterProducts();
    });
}

if (minPrice && maxPrice) {
    minPrice.addEventListener('change', filterProducts);
    maxPrice.addEventListener('change', filterProducts);
}

if (sortBy) {
    sortBy.addEventListener('change', filterProducts);
}

// View toggle functionality
if (viewButtons.length > 0) {
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const view = button.dataset.view;
            if (view === 'list') {
                productGrid.style.gridTemplateColumns = '1fr';
            } else {
                productGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
            }
        });
    });
}

// Display featured products on home page
if (featuredProducts) {
    const featuredItems = products.slice(0, 4); // Show first 4 products
    displayProducts(featuredItems, featuredProducts);
}

// Initial display
displayProducts(); 