document.addEventListener('DOMContentLoaded', function() {
    const allProducts = [
        ["Custard White Peach", "c-wP.jpg", 168, 3.95, 4.39, "cst"],
        ["Custard Lemon", "c-lem.jpg", 168, 3.95, 4.39, "cst"],
        ["Green Tea", "greT.jpg", 210, 4.29, 4.75, "dfk"],
        ["Peanut", "pea.jpg", 210, 4.29, 4.75, "dfk"],
        ["Red Bean ", "rB.jpg", 210, 4.29, 4.75, "dfk"],
        ["Sesame", "ses.jpg", 210, 4.29, 4.75, "dfk"],
        ["Tiramisu", "tms.jpg", 120, 3.49, 4.29, "spec"],
        ["Mini Milk Tea, Matcha and Brown Sugar Mix", "mil+mat+bS.jpg", 510, 6.89, 8.49, "spec"],
        ["Mini Chestnut", "m-kas.jpg", 120, 3.49, 4.29, "spec"],
        ["Mini Cherry Blossom", "m-kB.jpg", 120, 3.49, 4.29, "spec"],
        ["Mini Chocolate", "m-choc.jpg", 80, 3.15, 3.49, "clas"],
        ["Mini Chocolate Banana", "m-ch+bn.jpg", 80, 4.45, 5.49, "spec"],
        ["Mini Mango", "m-man.jpg", 80, 3.15, 3.49, "clas"],
        ["Mini Matcha", "m-mat.jpg", 80, 3.15, 3.49, "clas"],
        ["Mini Marshmallow Strawberry", "m-ma+str.jpg", 120, 3.49, 4.29, "spec"],
        ["Mini Strawberry", "m-stra.jpg", 80, 3.15, 3.49, "clas"],
        ["Mini Seiki Orange", "m-sei.jpg", 130, 4.85, 5.99, "spec"],
        ["Special Goodness", ["spec-p.jpg"], 770, 21.99, 28.94],
        ["Daifuku Pack", ["dfk-p.jpg"], 840, 15.49, 19.96],
        ["Fruity Pack", ["fr-p.jpg"], 846, 20.99, 26.44]
    ];

    // Discord Webhook URL - Replace with your actual webhook URL
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/your-webhook-id/your-webhook-token';

    // Separate products and deals
    const products = allProducts.slice(0, 17);
    const deals = allProducts.slice(17);

    // DOM elements
    const productsGrid = document.getElementById('products-grid');
    const dealsGrid = document.getElementById('deals-grid');
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCount = document.querySelector('.cart-count');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const ctaButton = document.querySelector('.cta-button');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Cart state
    let cart = [];

    // Initialize the shop
    function initShop() {
        renderProducts(products);
        renderDeals(deals);
        setupEventListeners();
        updateCartCount();
    }

    // Render products
    function renderProducts(productsToRender) {
        productsGrid.innerHTML = '';
        
        productsToRender.forEach(product => {
            const [name, image, weight, price, originalPrice, category] = product;
            const discount = calculateDiscount(price, originalPrice);
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.category = category;
            
            productCard.innerHTML = `
                <img src="img/${image}" alt="${name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${name}</h3>
                    <p class="product-weight">${weight}g</p>
                    <div class="product-price">
                        <span class="current-price">€${price.toFixed(2)}</span>
                        <span class="original-price">€${originalPrice.toFixed(2)}</span>
                        ${discount > 0 ? `<span class="discount">${discount}% OFF</span>` : ''}
                    </div>
                    <button class="add-to-cart" data-id="${name}">Add to Cart</button>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
    }

    // Render deals with improved image grid
    function renderDeals(dealsToRender) {
        dealsGrid.innerHTML = '';
        
        dealsToRender.forEach(deal => {
            const [name, image, weight, price, originalPrice] = deal;
            const discount = calculateDiscount(price, originalPrice);
            
            const dealCard = document.createElement('div');
            dealCard.className = 'deal-card';
            
            dealCard.innerHTML = `
                <img src="img/${image}" alt="${name}" class="deal-image">
                <div class="deal-info">
                    <h3 class="deal-title">${name}</h3>
                    <p class="deal-weight">${weight}g</p>
                    <div class="deal-price">
                        <span class="current-price">€${price.toFixed(2)}</span>
                        <span class="original-price">€${originalPrice.toFixed(2)}</span>
                        ${discount > 0 ? `<span class="discount">${discount}% OFF</span>` : ''}
                    </div>
                    <button class="add-to-cart" data-id="${name}">Add to Cart</button>
                </div>
            `;
            
            dealsGrid.appendChild(dealCard);
        });
    }

    // Calculate discount percentage
    function calculateDiscount(price, originalPrice) {
        return Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Cart icon click
        cartIcon.addEventListener('click', () => {
            cartModal.style.display = 'flex';
            renderCartItems();
        });

        // Close cart
        closeCart.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productName = e.target.dataset.id;
                addToCart(productName);
            }
        });

        // Filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const category = button.dataset.category;
                filterProducts(category);
            });
        });

        // CTA button
        ctaButton.addEventListener('click', () => {
            document.querySelector('#products').scrollIntoView({
                behavior: 'smooth'
            });
        });

        // Checkout button
        checkoutBtn.addEventListener('click', processCheckout);
    }

    // Filter products by category
    function filterProducts(category) {
        if (category === 'all') {
            document.querySelectorAll('.product-card').forEach(card => {
                card.style.display = 'block';
            });
        } else {
            document.querySelectorAll('.product-card').forEach(card => {
                if (card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    }

    // Find product by name
    function findProductByName(name) {
        return allProducts.find(product => product[0] === name);
    }
    
    // Update the addToCart function to handle simplified deal format:
    function addToCart(productName) {
        const product = findProductByName(productName);
        if (!product) return;
    
        const existingItem = cart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: productName,
                price: product[3], // Price is always at index 3 now
                quantity: 1,
                image: product[1] // Image is always at index 1 now
            });
        }
        
        updateCartCount();
        showAddToCartAnimation();
    }

    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Show add to cart animation
    function showAddToCartAnimation() {
        const animation = document.createElement('div');
        animation.className = 'add-to-cart-animation';
        animation.textContent = '+1';
        animation.style.position = 'fixed';
        animation.style.right = '100px';
        animation.style.bottom = '20px';
        animation.style.backgroundColor = 'var(--primary-color)';
        animation.style.color = 'white';
        animation.style.padding = '10px 15px';
        animation.style.borderRadius = '50%';
        animation.style.zIndex = '1000';
        animation.style.fontWeight = 'bold';
        animation.style.animation = 'fadeOut 1s forwards';
        
        document.body.appendChild(animation);
        
        setTimeout(() => {
            animation.remove();
        }, 1000);
    }

    // Render cart items
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            cartTotalPrice.textContent = '€0.00';
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">€${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                    <span class="remove-item" data-index="${index}">✕</span>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                updateQuantity(index, -1);
            });
        });
        
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                updateQuantity(index, 1);
            });
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                removeItem(index);
            });
        });
        
        cartTotalPrice.textContent = `€${total.toFixed(2)}`;
    }

    // Update item quantity
    function updateQuantity(index, change) {
        const newQuantity = cart[index].quantity + change;
        
        if (newQuantity < 1) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = newQuantity;
        }
        
        updateCartCount();
        renderCartItems();
    }

    // Remove item from cart
    function removeItem(index) {
        cart.splice(index, 1);
        updateCartCount();
        renderCartItems();
    }

    // Process checkout with Discord webhook
    async function processCheckout() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Create order summary
        const orderItems = cart.map(item => {
            return {
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: (item.price * item.quantity).toFixed(2)
            };
        });

        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

        // Create Discord message
        const discordMessage = {
            content: `**New Mochi Order** �`,
            embeds: [{
                title: "Order Details",
                color: 0xFF6B6B,
                fields: [
                    ...orderItems.map(item => ({
                        name: `${item.name} (x${item.quantity})`,
                        value: `€${item.total}`,
                        inline: true
                    })),
                    {
                        name: "Total Amount",
                        value: `€${totalAmount}`,
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString()
            }]
        };

        try {
            // Show loading state
            checkoutBtn.textContent = 'Processing...';
            checkoutBtn.disabled = true;

            // Send to Discord webhook
            const response = await fetch("https://discord.com/api/webhooks/1357292434547282025/P_U-glFsqcLROJG5516h84aHXcnJbqp6CA1g6dVjUIXI8YXDtmi_oiksQSCCZaaZg5px", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(discordMessage)
            });

            if (response.ok) {
                alert('Order placed successfully! Check your Discord for confirmation.');
                cart = [];
                updateCartCount();
                renderCartItems();
                cartModal.style.display = 'none';
            } else {
                throw new Error('Failed to send to Discord');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your order. Please try again.');
        } finally {
            checkoutBtn.textContent = 'Checkout';
            checkoutBtn.disabled = false;
        }
    }

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-50px); }
        }
    `;
    document.head.appendChild(style);

    // Initialize the shop
    initShop();
});