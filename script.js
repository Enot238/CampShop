document.addEventListener("DOMContentLoaded", async function() {
    let products = [];
    let cart = {};
    let categories = new Set();

    // Завантаження товарів з JSON файлу
    async function loadProducts() {
        try {
            const response = await fetch('products.json');
            const data = await response.json();
            products = data.products;

            // Збір усіх категорій
            products.forEach(product => categories.add(product.category));
            populateCategories();
            displayProducts(products);
        } catch (error) {
            console.error('Помилка завантаження товарів:', error);
        }
    }

    // Заповнення випадаючого списку категорій
    function populateCategories() {
        const categorySelect = document.getElementById('categoryFilter');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Фільтрація та сортування товарів
    function filterAndSortProducts() {
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        const maxPrice = document.getElementById('priceRange').value;
        const sortBy = document.getElementById('sortSelect').value;

        let filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery);
            const matchesCategory = category === '' || product.category === category;
            const matchesPrice = product.price <= maxPrice;
            return matchesSearch && matchesCategory && matchesPrice;
        });

        // Сортування
        filtered.sort((a, b) => {
            switch(sortBy) {
                case 'priceAsc':
                    return a.price - b.price;
                case 'priceDesc':
                    return b.price - a.price;
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        displayProducts(filtered);
    }

    // Відображення товарів
    function displayProducts(productsToDisplay) {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.inStock ? '' : '<span class="out-of-stock">Немає в наявності</span>'}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">${product.price} грн</p>
                    <button class="add-to-cart" ${!product.inStock ? 'disabled' : ''} 
                            onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> До кошика
                    </button>
                </div>
            `;
            productList.appendChild(productCard);
        });
    }

    // Функції кошика
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.querySelector('.close-cart');

    // Функція додавання товару до корзини
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            if (cart[productId]) {
                cart[productId].quantity++;
            } else {
                cart[productId] = {
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.image
                };
            }
            updateCart();
            showCart();
        }
    }

    // Функція оновлення відображення корзини
    function updateCart() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        cartItems.innerHTML = '';
        let total = 0;

        Object.entries(cart).forEach(([productId, item]) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} грн</div>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${productId}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${productId}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-total">${itemTotal} грн</div>
                <button onclick="removeFromCart(${productId})" class="remove-item">×</button>
            `;
            cartItems.appendChild(cartItem);
        });

        cartTotal.textContent = total;
        updateCartIcon();
    }

    // Функція оновлення кількості товару
    function updateQuantity(productId, change) {
        if (cart[productId]) {
            cart[productId].quantity += change;
            if (cart[productId].quantity <= 0) {
                removeFromCart(productId);
            } else {
                updateCart();
            }
        }
    }

    // Функція видалення товару з корзини
    function removeFromCart(productId) {
        delete cart[productId];
        updateCart();
    }

    // Функція показу корзини
    function showCart() {
        cartModal.style.display = 'block';
    }

    // Функція приховування корзини
    function hideCart() {
        cartModal.style.display = 'none';
    }

    // Функція оновлення іконки корзини
    function updateCartIcon() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Обробники подій
    closeCart.addEventListener('click', hideCart);

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            hideCart();
        }
    });

    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (Object.keys(cart).length === 0) {
            alert('Ваш кошик порожній!');
            return;
        }
        // Тут можна додати логіку оформлення замовлення
        alert('Дякуємо за замовлення!');
        cart = {};
        updateCart();
        hideCart();
    });

    // Оновлення відображення товарів з кнопкою додавання до корзини
    function displayProducts(productsToDisplay) {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        productsToDisplay.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price} грн</p>
                <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                    Додати до кошика
                </button>
            `;
            productList.appendChild(productDiv);
        });
    }

    // Ініціалізація подій
    document.getElementById('searchInput').addEventListener('input', filterAndSortProducts);
    document.getElementById('categoryFilter').addEventListener('change', filterAndSortProducts);
    document.getElementById('priceRange').addEventListener('input', filterAndSortProducts);
    document.getElementById('sortSelect').addEventListener('change', filterAndSortProducts);

    // Кнопка прокрутки вгору
    window.onscroll = function() {
        const scrollButton = document.getElementById('scrollToTop');
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    };

    // Завантаження товарів при старті
    await loadProducts();
});