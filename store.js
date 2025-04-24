// Sample product data with more details
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        category: "electronics",
        image: "https://source.unsplash.com/random/400x400/?headphones",
        description: "High-quality wireless headphones with noise cancellation.",
        rating: 4.5,
        reviews: 128,
        stock: 50,
        tags: ["wireless", "audio", "bluetooth"]
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        category: "electronics",
        image: "https://source.unsplash.com/random/400x400/?smartwatch",
        description: "Feature-rich smartwatch with health tracking.",
        rating: 4.8,
        reviews: 256,
        stock: 30,
        tags: ["wearable", "fitness", "smart"]
    },
    {
        id: 3,
        name: "Designer Backpack",
        price: 79.99,
        category: "accessories",
        image: "https://source.unsplash.com/random/400x400/?backpack",
        description: "Stylish and functional backpack for everyday use.",
        rating: 4.3,
        reviews: 89,
        stock: 45,
        tags: ["fashion", "travel", "storage"]
    },
    {
        id: 4,
        name: "Running Shoes",
        price: 129.99,
        category: "clothing",
        image: "https://source.unsplash.com/random/400x400/?shoes",
        description: "Comfortable running shoes with advanced cushioning.",
        rating: 4.6,
        reviews: 312,
        stock: 60,
        tags: ["sports", "fitness", "running"]
    },
    {
        id: 5,
        name: "Coffee Maker",
        price: 149.99,
        category: "home",
        image: "https://source.unsplash.com/random/400x400/?coffeemaker",
        description: "Automatic coffee maker with timer and temperature control.",
        rating: 4.4,
        reviews: 167,
        stock: 25,
        tags: ["kitchen", "appliance", "coffee"]
    },
    {
        id: 6,
        name: "Yoga Mat",
        price: 49.99,
        category: "home",
        image: "https://source.unsplash.com/random/400x400/?yogamat",
        description: "Non-slip yoga mat with carrying strap.",
        rating: 4.7,
        reviews: 203,
        stock: 75,
        tags: ["fitness", "yoga", "exercise"]
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
const searchInput = document.getElementById('searchInput');
const tagFilters = document.querySelectorAll('.tag-filters input');

// Initialize products and cart in localStorage if not exists
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
}

if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Cart functionality with improved feedback
function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    
    if (product) {
        if (product.stock <= 0) {
            showNotification('Sorry, this item is out of stock!', 'error');
            return;
        }

        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                showNotification('Maximum stock limit reached!', 'error');
                return;
            }
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
        showNotification('Product added to cart!', 'success');
        updateCartCount();
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Enhanced product display with ratings and stock
function displayProducts(productsToShow = products, container = productGrid) {
    if (!container) return;
    
    container.innerHTML = '';
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.stock <= 5 ? `<div class="stock-badge">Only ${product.stock} left!</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${generateStarRating(product.rating)}
                    <span class="review-count">(${product.reviews})</span>
                </div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-tags">
                    ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${product.stock <= 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> ${product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        `;
        container.appendChild(productCard);
    });
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Enhanced filtering with search and tags
function filterProducts() {
    const selectedCategories = Array.from(categoryFilters)
        .filter(filter => filter.checked)
        .map(filter => filter.value);
    
    const selectedTags = Array.from(tagFilters)
        .filter(filter => filter.checked)
        .map(filter => filter.value);
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const minPriceValue = parseFloat(minPrice.value) || 0;
    const maxPriceValue = parseFloat(maxPrice.value) || Infinity;
    
    let filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => product.tags.includes(tag));
        const searchMatch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        const priceMatch = product.price >= minPriceValue && product.price <= maxPriceValue;
        
        return categoryMatch && tagMatch && searchMatch && priceMatch;
    });
    
    // Enhanced sorting
    const sortValue = sortBy.value;
    switch(sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'reviews':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            filteredProducts.sort((a, b) => a.id - b.id);
    }
    
    displayProducts(filteredProducts);
    updateFilterCount(filteredProducts.length);
}

function updateFilterCount(count) {
    const filterCount = document.getElementById('filterCount');
    if (filterCount) {
        filterCount.textContent = `${count} products found`;
    }
}

// Event Listeners with debouncing for search
let searchTimeout;
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filterProducts();
        }, 300);
    });
}

if (categoryFilters.length > 0) {
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', filterProducts);
    });
}

if (tagFilters.length > 0) {
    tagFilters.forEach(filter => {
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

// Enhanced view toggle with smooth transitions
if (viewButtons.length > 0) {
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const view = button.dataset.view;
            const productGrid = document.getElementById('productGrid');
            
            if (view === 'list') {
                productGrid.style.gridTemplateColumns = '1fr';
                productGrid.classList.add('list-view');
            } else {
                productGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
                productGrid.classList.remove('list-view');
            }
        });
    });
}

// Cart count update
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Display featured products on home page with enhanced styling
if (featuredProducts) {
    const featuredItems = products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
    displayProducts(featuredItems, featuredProducts);
}

// Initial display and setup
displayProducts();
updateCartCount(); 