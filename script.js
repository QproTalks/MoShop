document.addEventListener('DOMContentLoaded', function() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const priceElements = document.querySelectorAll('.price');
  const weightElements = document.querySelectorAll('.weight')
  const cartItemsList = document.getElementById('cart-items');
  const cartTotal = document.getElementById('total');
  const checkoutButton = document.getElementById('checkout');
  let cart = [];

  // Event listeners toevoegen aan de knoppen om producten aan het winkelwagentje toe te voegen
  addToCartButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
          const productName = button.getAttribute('data-product');
          const priceElement = priceElements[index];
          const weightElement = weightElements[index];
          const price = parseFloat(priceElement.getAttribute('data-price-eur'));
          const originalPrice = priceElement ? parseFloat(priceElement.getAttribute('data-original-price-eur')) : price;
          const weight = parseFloat(weightElement.getAttribute('data-weight'));
          const existingItem = cart.find(item => item.product === productName);

          if (existingItem) {
              existingItem.quantity++;
          } else {
              cart.push({ product: productName, price, originalPrice, quantity: 1, weight });
          }

          updateCart();
      });
  });

  // Event listener toevoegen aan de checkout-knop
  checkoutButton.addEventListener('click', () => {
  let totalPrice = 0;
  let noDiscountPrice = 0;
  let productString = `|`;
  let totalWeight = 0;

  cart.forEach(item => {
      totalPrice += item.price * item.quantity;
      noDiscountPrice += item.originalPrice * item.quantity;
      totalWeight += item.weight * item.quantity;
      productString += `${item.quantity}x ${item.product}|`;
  });

  let shippingPrice = determineShippingPrice(totalWeight);
  noDiscountPrice += shippingPrice;
  totalPrice += shippingPrice;

  let info = `Subtotal: € ${formatCurrency(noDiscountPrice)},
Total Discount: € ${formatCurrency(noDiscountPrice - totalPrice)},
Shipping Price: € ${formatCurrency(shippingPrice)},
Total Price: € ${formatCurrency(totalPrice)},
Including € ${formatCurrency(totalPrice * 0.21)} Tax. Bought products: ${productString}`;

  if (totalPrice > 0) {
      alert(`Thanks for buying this. ${info}`);
  }

  message(info)

  // Leeg de winkelwagen
  cart = [];
  updateCart();
});


  // Functie om de winkelwagen bij te werken
  function updateCart() {
      cartItemsList.innerHTML = '';
      let totalPrice = 0;
      let noDiscountPrice = 0;
      let totalWeight = 0;

      cart.forEach(item => {
          const tPrice = parseFloat(priceElements[Array.from(addToCartButtons).findIndex(button => button.getAttribute('data-product') === item.product)].getAttribute('data-price-eur'));
          const nDPrice = parseFloat(priceElements[Array.from(addToCartButtons).findIndex(button => button.getAttribute('data-product') === item.product)].getAttribute('data-original-price-eur'));
          const weight = parseFloat(weightElements[Array.from(addToCartButtons).findIndex(button => button.getAttribute('data-product') === item.product)].getAttribute('data-weight'));
          totalPrice += tPrice * item.quantity;
          noDiscountPrice += nDPrice * item.quantity;
          totalWeight += weight * item.quantity;
          const li = document.createElement('li');
          if (tPrice == nDPrice) {
              li.textContent = `${item.product} - € ${formatCurrency(tPrice * item.quantity)} (${item.quantity}x)`;
          } else {
              li.textContent = `${item.product} - € ${formatCurrency(tPrice * item.quantity)} (${item.quantity}x)
      - Korting: € ${formatCurrency((nDPrice - tPrice) * item.quantity)} (${item.quantity}x)`;
          }

          cartItemsList.appendChild(li);
      });
      const shippingPrice = determineShippingPrice(totalWeight);
      totalPrice += shippingPrice;
      noDiscountPrice += shippingPrice;

      const subtotal = formatCurrency(noDiscountPrice - shippingPrice);
      const discount = formatCurrency(noDiscountPrice - totalPrice);
      const total = formatCurrency(totalPrice);
      const tax = formatCurrency((totalPrice - shippingPrice) * 0.21);
      const shipping = formatCurrency(shippingPrice);
      // Bijwerken van tekst in plaats van een alert
      cartTotal.innerHTML = `
      <p class="gray-text">Subtotal: € ${subtotal}</p>
      <p class="gray-text">Total Discount: € ${discount}</p>
      <p class="gray-text">Total Price: € ${total}</p>
      <p class="gray-text">Including € ${tax} Tax + Shipping: € ${shipping}</p>
  `;
  }

  // Functie om valuta op de juiste manier te formatteren
  function formatCurrency(amount) {
      return amount.toFixed(2).replace('.', ','); // Aanpassen aan de lokale valuta-notatie indien nodig
  };

  function determineShippingPrice(amount) {
      if (amount < 1) { return 0.00; }
      if (amount < 3001) { return 5.95; }
      if (amount < 10001) { return 6.95; }
      if (amount < 23001) { return 13.90; }
      if (amount > 23000) { return (Math.floor(amount / 23000) * 13.90); }
  };

  function message(boep) {
    const boep = "Testbericht van mijn webshop 🚀"
    const webhookURL = "https://discord.com/api/webhooks/...."; // jouw webhook hier
    fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: boep })  // LET OP: msg zit in een object
    }).then(response => {
        if (response.ok) {
            alert("Order placed! Notification sent to Discord.");
        } else {
            alert("Failed to send order notification.");
        }
    }).catch(error => {
        console.error("Error:", error);
    });
}

