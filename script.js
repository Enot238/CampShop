document.addEventListener("DOMContentLoaded", function () {
    // Масив з продуктами та їхніми цінами
    const products = [
        { name: "Маленькі круасани", price: 10, image: "img/Remove-bg.ai_1706196095825.png" },
        { name: "Печиво Lovita", price: 30, image: "img/Remove-bg.ai_1706195976999.png" },
        { name: "Снікерс", price: 25, image: "img/Remove-bg.ai_1706195800677.png" },
        { name: "Батончики Рошен", price: 17, image: "img/Remove-bg.ai_1706195749763.png" },
        { name: "Батончик lion", price: 20, image: "img/Remove-bg.ai_1706196062429.png" },
        { name: "Баунті", price: 25, image: "img/Remove-bg.ai_1706196057682.png" },
        { name: "Рошен вайфля", price: 10, image: "img/Remove-bg.ai_1706195758998.png" },
        { name: "Круасан Великий", price: 30, image: "img/Remove-bg.ai_1706195812518.png" },
        { name: "Чіпси", price: 50, image: "img/Remove-bg.ai_1706195782114.png" },
        { name: "Хрум теам", price: 20, image: "img/Remove-bg.ai_1706195770953.png" },
        { name: "Семки", price: 40, image: "img/Remove-bg.ai_1706195733060.png" },
        { name: "Соняшник Санич", price: 40, image: "img/Remove-bg.ai_1706196255595.png" },
        { name: "Арахіс", price: 25, image: "img/Remove-bg.ai_1706196264924.png" },
        { name: "Cola/Fanta/Spriyte", price: 25, image: "img/Remove-bg.ai_1706196317645.png" },
        { name: "Моршинська газована", price: 25, image: "img/Remove-bg.ai_1706196139013.png" },
        { name: "Вода Девайт", price: 20, image: "img/Remove-bg.ai_1706196242269.png" },
        { name: "Кава", price: 15, image: "img/Remove-bg.ai_1706197267369.png" },
        { name: "Кава з молоком", price: 25, image: "img/Remove-bg.ai_1706196212973.png" },
        { name: "Чай", price: 10, image: "img/Remove-bg.ai_1706196123401.png" },
        { name: "Маккава", price: 10, image: "img/Remove-bg.ai_1706196215551.png" },
        { name: "Жуйки", price: 25, image: "img/Remove-bg.ai_1706196108851.png" },
    ];

    // Загальна ціна
    let totalPrice = 0;

    // Корзина
    const cart = {};

    // Елемент корзини
    const cartElement = document.getElementById("cart");
    const cartTableBody = document.getElementById("cartBody");

    // Функція для виведення вмісту корзини
function displayCart() {
    cartTableBody.innerHTML = '';

    // Переглядаємо вибрані товари
    for (const product in cart) {
        const cartItem = cart[product];

        const cartRow = document.createElement("tr");
        const productNameCell = document.createElement("td");
        productNameCell.textContent = product;
        const priceCell = document.createElement("td");
        priceCell.textContent = cartItem.price + " грн";
        const quantityCell = document.createElement("td");
        quantityCell.textContent = cartItem.quantity;

        const removeButtonCell = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.textContent = "Видалити";
        removeButton.classList.add("removeButton");
        removeButton.onclick = function () {
            removeFromCart(product);
        };

        removeButtonCell.appendChild(removeButton);

        cartRow.appendChild(productNameCell);
        cartRow.appendChild(priceCell);
        cartRow.appendChild(quantityCell);
        cartRow.appendChild(removeButtonCell);

        cartTableBody.appendChild(cartRow);
    }
}

    // Функція для видалення товару з кошика
    function removeFromCart(productName) {
        const removedItem = cart[productName];
        if (removedItem) {
            totalPrice -= removedItem.price * removedItem.quantity;
            updateTotalPrice();

            delete cart[productName];

            // Вивести вміст корзини
            displayCart();

            // Вивести повідомлення про видалення товару
            showMessage(`Товар "${productName}" видалено з кошика!`);
        }
    }

     // Елемент для виведення повідомлень
     const messageElement = document.getElementById("message");

     // Функція для виведення повідомлення
     function showMessage(message) {
         messageElement.textContent = message;
         messageElement.style.opacity = 1;
 
         // Зникнення повідомлення через 3 секунди
         setTimeout(() => {
             messageElement.style.opacity = 0;
         }, 3000);
     }

    // Функція для додавання товару до корзини
    function addToCart(product) {
        const productName = product.name;

        if (cart[productName]) {
            cart[productName].quantity++;
        } else {
            cart[productName] = { price: product.price, quantity: 1 };
        }

        totalPrice += product.price;
        updateTotalPrice();
        displayCart();

        // Вивести повідомлення про додавання товару
        alert(`Товар "${productName}" додано до кошика!`);
    }

    // Функція для оновлення відображення загальної ціни
    function updateTotalPrice() {
        const totalPriceElement = document.getElementById("totalPrice");
        totalPriceElement.textContent = `Загальна ціна: ${totalPrice} грн`;
    }

    // Функція для виведення продуктів на сторінку
    function displayProducts(productsToDisplay) {
        const productList = document.getElementById("product-list");
        productList.innerHTML = '';

        productsToDisplay.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");

            const productName = document.createElement("h3");
            productName.textContent = product.name;

            const productImage = document.createElement("img");
            productImage.src = product.image;
            productImage.alt = product.name;

            const productPrice = document.createElement("div");
            productPrice.classList.add("productPrice");

            const priceParagraph = document.createElement("p");
            priceParagraph.textContent = `Ціна: ${product.price} грн`;

            const addToCartButton = document.createElement("button");
            addToCartButton.textContent = "Додати до кошика";
            addToCartButton.classList.add("addToCartButton");
            addToCartButton.onclick = function () {
                addToCart(product);
            };

            productPrice.appendChild(priceParagraph);
            productPrice.appendChild(addToCartButton);

            productDiv.appendChild(productName);
            productDiv.appendChild(productImage);
            productDiv.appendChild(productPrice);

            productList.appendChild(productDiv);
        });
    }

    // Функція для пошуку продуктів за назвою
    function searchProducts() {
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery));
        displayProducts(filteredProducts);
    }

    // Вивести всі продукти при завантаженні сторінки
    displayProducts(products);

    // Додати обробник події для кнопки пошуку
    const searchButton = document.getElementById("searchButton");
    if (searchButton) {
        searchButton.addEventListener("click", searchProducts);
    }
});
