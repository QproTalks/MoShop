document.addEventListener('DOMContentLoaded', function () {
  const productData = [
  //{ name: "Brown Sugar and Red Bean Mochi", image: "bS+rB.jpg", weight: 210, price: 4.99, originalPrice: 4.99, type: "s" },
  //{ name: "Bubble Tea Mochi", image: "bubT.jpg", weight: 210, price: 4.99, originalPrice: 4.99, type: "s" },
  { name: "Custard White Peach Mochi", image: "c-wP.jpg", weight: 168, price: 3.99, originalPrice: 4.49, type: "tmL" },
  { name: "Custard Lemon Mochi", image: "c-lem.jpg", weight: 168, price: 3.99, originalPrice: 4.49, type: "tmL" },
  { name: "Green Tea Mochi", image: "greT.jpg", weight: 210, price: 4.99, originalPrice: 4.99, type: "tmL" },
  { name: "Peanut Mochi", image: "pea.jpg", weight: 210, price: 4.99, originalPrice: 4.99, type: "tmL" },
  { name: "Red Bean Mochi", image: "rB.jpg", weight: 210, price: 3.99, originalPrice: 4.99, type: "tmL" },
  { name: "Sesame Mochi", image: "ses.jpg", weight: 210, price: 3.99, originalPrice: 4.99, type: "tmL" },
  { name: "Tiramisu Mochi", image: "tms.jpg", weight: 120, price: 3.49, originalPrice: 3.99, type: "tmL" },

  // Mini mochi
  { name: "Milk Tea, Matcha and Brown Sugar Mini Mochi Mix", image: "mil+mat+bS.jpg", weight: 510, price: 7.49, originalPrice: 8.99, type: "tmL" },
  { name: "Mini Chestnut Mochi", image: "m-kas.jpg", weight: 120, price: 3.49, originalPrice: 4.49, type: "tmS" },
  { name: "Mini Cherry Blossom Mochi", image: "m-kB.jpg", weight: 120, price: 3.49, originalPrice: 4.49, type: "tmS" },
  { name: "Mini Chocolate Mochi", image: "m-choc.jpg", weight: 80, price: 2.99, originalPrice: 3.49, type: "tmS" },
  { name: "Mini Chocolate Banana Mochi", image: "m-ch+bn.jpg", weight: 80, price: 4.49, originalPrice: 5.49, type: "tmS" },
  { name: "Mini Mango Mochi", image: "m-man.jpg", weight: 80, price: 2.99, originalPrice: 3.49, type: "tmS" },
  { name: "Mini Matcha Mochi", image: "m-mat.jpg", weight: 80, price: 2.99, originalPrice: 3.49, type: "tmS" },
  { name: "Mini Marshmallow Strawberry Mochi", image: "m-ma+str.jpg", weight: 120, price: 3.49, originalPrice: 4.49, type: "tmS" },
  { name: "Mini Strawberry Mochi", image: "m-stra.jpg", weight: 80, price: 2.99, originalPrice: 3.49, type: "tmS" },
  { name: "Mini Seiki Orange Mochi", image: "m-sei.jpg", weight: 130, price: 5.25, originalPrice: 5.99, type: "tmS" },

    
    // Deal
    {
      name: "Special Goodness",
      image: ["tms.jpg", "m-ch+bn.jpg", "m-ma+str.jpg", "m-kB.jpg", "m-kas.jpg", "m-stra.jpg", "m-sei.jpg"],
      weight: 770,
      price: 21.99,
      originalPrice: 28.94,
      type: "deal"
    },
    {
      name: "Daifuku Pack",
      image: ["greT.jpg", "ses.jpg", "pea.jpg", "rB.jpg"],
      weight: 840,
      price: 15.49,
      originalPrice: 19.96,
      type: "deal"
    },
    {
      name: "Fruity Pack",
      image: ["c-wP.jpg", "c-lem.jpg", "m-stra.jpg", "m-man.jpg", "m-ma+str", "m-sei"],
      weight: 840,
      price: 20.99,
      originalPrice: 26.44,
      type: "deal"
    },
    
  ];

  const cart = [];
  const cartItemsList = document.getElementById('cart-items');
  const cartTotal = document.getElementById('total');
  const checkoutButton = document.getElementById('checkout');

  function renderProducts() {
    productData.forEach(product => {
      const containerId = product.type === "tmL" ? "tmL-container" :
                          product.type === "tmS" ? "tmS-container" : "deal-container"

      const container = document.getElementById(containerId);
      const div = document.createElement('div');
      div.className = product.originalPrice > product.price ? "saleproduct" : "product";

      let images = Array.isArray(product.image)
  ? `<div class="deal-images">${product.image.map(img => `<img src="${img}" alt="${product.name}">`).join("")}</div>`
  : `<img src="${product.image}" alt="${product.name}">`; 
      
      div.innerHTML = `
      ${images}
      <h2 class="title">${product.name}</h2>
      <h4 class="weight" data-weight="${product.weight}">(${product.weight}g)</h4>
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
        item.price < item.originalPrice ? ` - Discount: € ${formatCurrency((item.originalPrice - item.price) * item.quantity)}` : ''
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
      <p class="gray-text">Shipping: € ${formatCurrency(shippingPrice)}</p>
      <p class="gray-text">Including € ${formatCurrency((totalPrice - shippingPrice) * 0.21)} Tax</p>
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
Tax (9%): € ${formatCurrency(totalPrice * 0.09)},
Products: ${summary}`;

    alert("Thanks for placing a order! Order:\n" + info);
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
