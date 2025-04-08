document.addEventListener('DOMContentLoaded', function () {
  const productData = [
    // Grote mochi
    { name: "Sesame Mochi", image: "ses.jpg", weight: 210, quantity: 6, price: 4.25, originalPrice: 4.99, type: "tmL" },
    { name: "Red Bean Mochi", image: "rB.jpg", weight: 210, quantity: 6, price: 4.25, originalPrice: 4.99, type: "tmL" },
    { name: "Peanut Mochi", image: "pea.jpg", weight: 210, quantity: 6, price: 4.99, originalPrice: 4.99, type: "tmL" },
    { name: "Green Tea Mochi", image: "greT.jpg", weight: 210, quantity: 6, price: 4.99, originalPrice: 4.99, type: "tmL" },

    // Mini mochi
    { name: "Mini Strawberry Mochi", image: "m-stra.jpg", weight: 80, quantity: 8, price: 2.79, originalPrice: 3.49, type: "tmS" },
    { name: "Mini Mango Mochi", image: "m-man.jpg", weight: 80, quantity: 8, price: 2.99, originalPrice: 3.49, type: "tmS" },
    { name: "Mini Chocolate Mochi", image: "m-choc.jpg", weight: 80, quantity: 8, price: 2.99, originalPrice: 3.49, type: "tmS" },

    // Deal
    {
      name: "Toki Mochi Deal",
      image: ["ses.jpg", "rB.jpg", "greT.jpg", "m-choc.jpg", "m-man.jpg", "m-stra.jpg"],
      weight: 870,
      quantity: 6,
      price: 19.99,
      originalPrice: 25.44,
      type: "deal"
    }
  ];

  const cart = [];
  const cartItemsList = document.getElementById('cart-items');
  const cartTotal = document.getElementById('total');
  const checkoutButton = document.getElementById('checkout');

  function renderProducts() {
    productData.forEach(product => {
      const containerId = product.type === "tmL" ? "tmL-container" :
                          product.type === "tmS" ? "tmS-container" : "deal-container";

      const container = document.getElementById(containerId);
      const div = document.createElement('div');
      div.className = product.originalPrice > product.price ? "saleproduct" : "product";

      let images = Array.isArray(product.image)
  ? `<div class="deal-images">${product.image.map(img => `<img src="${img}" alt="${product.name}">`).join("")}</div>`
  : `<img src="${product.image}" alt="${product.name}">`; 
      
      div.innerHTML = `
      ${images}
      <h2 class="title">${product.name}</h2>
      <h4 class="weight" data-weight="${product.weight}">${product.quantity} pieces (${product.weight}g)</h4>
      ${product.originalPrice > product.price ? `<h3 class="original-price">€ ${product.originalPrice}</h3>` : ''}
      <h3 class="price" data-price-eur="${product.price}" data-original-price-eur="${product.originalPrice}">€ ${product.price}</h3>
      <button class="add-to-cart" data-product="${product.name}">Add to cart</button>
`;


      container.appendChild(div);
    });

    // Knoppen activeren
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        const name = button.getAttribute('data-product');
        const product = productData.find(p => p.name === name);
        const existingItem = cart.find(i => i.product === name);

        if (existingItem) {
          existingItem.quantity++;
        } else {
          cart.push({ product: name, ...product, quantity: 1 });
        }

        updateCart();
      });
    });
  }

  function updateCart() {
    cartItemsList.innerHTML = '';
    let totalPrice = 0, noDiscountPrice = 0, totalWeight = 0;

    cart.forEach(item => {
      totalPrice += item.price * item.quantity;
      noDiscountPrice += item.originalPrice * item.quantity;
      totalWeight += item.weight * item.quantity;

      const li = document.createElement('li');
      li.textContent = `${item.product} - € ${formatCurrency(item.price * item.quantity)} (${item.quantity}x)${
        item.price < item.originalPrice ? ` - Korting: € ${formatCurrency((item.originalPrice - item.price) * item.quantity)}` : ''
      }`;
      cartItemsList.appendChild(li);
    });

    const shippingPrice = determineShippingPrice(totalWeight);
    totalPrice += shippingPrice;
    noDiscountPrice += shippingPrice;

    cartTotal.innerHTML = `
      <p class="gray-text">Subtotal: € ${formatCurrency(noDiscountPrice - shippingPrice)}</p>
      <p class="gray-text">Total Discount: € ${formatCurrency(noDiscountPrice - totalPrice)}</p>
      <p class="gray-text">Total Price: € ${formatCurrency(totalPrice)}</p>
      <p class="gray-text">Including € ${formatCurrency((totalPrice - shippingPrice) * 0.21)} Tax + Shipping: € ${formatCurrency(shippingPrice)}</p>
    `;
  }

  checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) return;
    let summary = "|";
    let totalPrice = 0, noDiscountPrice = 0, totalWeight = 0;

    cart.forEach(item => {
      summary += `${item.quantity}x ${item.product}|`;
      totalPrice += item.price * item.quantity;
      noDiscountPrice += item.originalPrice * item.quantity;
      totalWeight += item.weight * item.quantity;
    });

    const shipping = determineShippingPrice(totalWeight);
    totalPrice += shipping;
    noDiscountPrice += shipping;

    const info = `Subtotal: € ${formatCurrency(noDiscountPrice)},
Total Discount: € ${formatCurrency(noDiscountPrice - totalPrice)},
Shipping: € ${formatCurrency(shipping)},
Total: € ${formatCurrency(totalPrice)},
Tax (21%): € ${formatCurrency(totalPrice * 0.21)},
Products: ${summary}`;

    alert("Thanks for buying!\n" + info);
    cart.length = 0;
    updateCart();
  });

  function formatCurrency(amount) {
    return amount.toFixed(2).replace('.', ',');
  }

  function determineShippingPrice(weight) {
    if (weight < 1) return 0.00;
    if (weight < 3001) return 5.95;
    if (weight < 10001) return 6.95;
    if (weight < 23001) return 13.90;
    return (Math.floor(weight / 23000) * 13.90);
  }

  renderProducts();
  updateCart();
});
