document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    const cartIcon = document.getElementById('cartIcon');
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const scrollToTopButton = document.getElementById('scrollToTop');

    let cart = [];
    let products = [];
    let filteredProducts = [];

    // Fetch products from JSON file
    const fetchProducts = async () => {
        try {
            const response = await fetch('products.json');
            const data = await response.json();
            products = data.products;
            filteredProducts = products;
            populateCategories(data.categories);
            renderProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Populate categories in filter dropdown
    const populateCategories = (categories) => {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    };

    // Render products dynamically
    const renderProducts = () => {
        productList.innerHTML = '';
        filteredProducts.forEach(product => {
            const productCol = document.createElement('div');
            productCol.className = 'col';
            productCol.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${product.image}" class="card-img-top p-3" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="h5 mb-0">${product.price} грн</span>
                            <button class="btn btn-primary add-to-cart-button addToCartButton" data-id="${product.id}">
                                <i class="fas fa-cart-plus "></i> Додати
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productList.appendChild(productCol);
        });
    };

    // Apply all filters
    const applyFilters = () => {
        const maxPrice = parseInt(priceRange.value);
        priceValue.textContent = `${maxPrice} грн`;

        const selectedCategory = categoryFilter.value;
        const query = searchInput.value.toLowerCase();

        filteredProducts = products.filter(product => {
            const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
            const matchesPrice = product.price <= maxPrice;
            const matchesSearch = product.name.toLowerCase().includes(query);
            return matchesCategory && matchesPrice && matchesSearch;
        });

        renderProducts();
    };

    // Add to cart
    const addToCart = (productId) => {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            const existingProduct = cart.find(item => item.id === product.id);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCart();
        }
    };

    // Показувати повідомлення про додавання товару
    function showAddToCartMessage() {
        const messageElement = document.getElementById('addToCartMessage');
        messageElement.classList.add('show'); // Показати повідомлення

        // Прибрати повідомлення через 1 секунду
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 1000);
    }

    // Update cart display
    const updateCart = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            const cartItem = document.createElement('div');
            cartItem.className = 'card mb-3';
            cartItem.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <img src="${item.image}" alt="${item.name}" class="me-3" style="width: 50px; height: auto;">
                            <div>
                                <h6 class="mb-0">${item.name}</h6>
                                <small class="text-muted">Кількість: ${item.quantity}</small>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="me-3">${item.price * item.quantity} грн</span>
                            <button class="btn btn-sm btn-danger removeButton" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartTotal.textContent = total;
    };

    // Remove from cart
    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== parseInt(productId));
        updateCart();
    };

    // Кнопка "Вгору"

    // Показувати кнопку, коли сторінка прокручена вниз
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollToTopButton.classList.add('show');
        } else {
            scrollToTopButton.classList.remove('show');
        }
    });

    // Прокручування догори при кліку
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // Scroll to top functionality
    const toggleScrollToTopButton = () => {
        if (window.scrollY > 300) {
            scrollToTopButton.classList.remove('d-none');
        } else {
            scrollToTopButton.classList.add('d-none');
        }
    };

    // Event listeners
    productList.addEventListener('click', (e) => {
        if (e.target.classList.contains('addToCartButton') || e.target.parentElement.classList.contains('addToCartButton')) {
            const button = e.target.classList.contains('addToCartButton') ? e.target : e.target.parentElement;
            addToCart(button.dataset.id);
            showAddToCartMessage();
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('removeButton') || e.target.parentElement.classList.contains('removeButton')) {
            const button = e.target.classList.contains('removeButton') ? e.target : e.target.parentElement;
            removeFromCart(button.dataset.id);
        }
    });

    cartIcon.addEventListener('click', () => cartModal.show());
    closeCart.addEventListener('click', () => cartModal.hide());

    priceRange.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    searchButton.addEventListener('click', applyFilters);
    searchInput.addEventListener('input', applyFilters);
    scrollToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', toggleScrollToTopButton);

    // Initialize
    scrollToTopButton.classList.add('d-none');
    fetchProducts();
});