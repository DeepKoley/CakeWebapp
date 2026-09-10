/* =========================================================
   CAKERMAKER - CART, CHECKOUT, TOAST & POPUP MODAL LOGIC
   ========================================================= */

// Active modal state
let activeModalCake = null;
let activeModalMultiplier = 1.0;
let activeModalWeight = '1 kg';

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  if (document.getElementById('cartItems')) {
    renderCart();
  }
});

/* =========================================================
   1. GLOBAL TOAST NOTIFICATION
   ========================================================= */
function showToastNotification(cakeName, imageSrc) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'cake-toast';
  toast.innerHTML = `
    <img src="${imageSrc || '/images/cake1.jpg'}" alt="${cakeName}" class="toast-img" />
    <div class="toast-text">
      <strong>Added to Cart! 🍰</strong>
      <span>${cakeName}</span>
    </div>
    <a href="/cart" class="toast-link">View Cart &rarr;</a>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 50);

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* =========================================================
   2. CAKE POPUP MODAL ("ADD POP UP BOX NEAR CAKE ADD")
   ========================================================= */
function openCakeModalFromData(cardElem) {
  if (!cardElem) return;

  const id = cardElem.getAttribute('data-id') || 'cake_' + Date.now();
  const name = cardElem.getAttribute('data-name') || 'Artisan Cake';
  const category = cardElem.getAttribute('data-category') || 'Fresh Bakery';
  const price = parseFloat(cardElem.getAttribute('data-price')) || 550;
  const image = cardElem.getAttribute('data-image') || '/images/cake1.jpg';
  const desc = cardElem.getAttribute('data-desc') || 'Artisan handcrafted cake made fresh with pure ingredients.';
  const rating = cardElem.getAttribute('data-rating') || '4.9';
  const amazon = cardElem.getAttribute('data-amazon') || `https://www.amazon.in/s?k=${encodeURIComponent(name)}`;

  activeModalCake = { id, name, category, basePrice: price, image, desc, rating, amazon };
  activeModalMultiplier = 1.0;
  activeModalWeight = '1 kg';

  // Fill in modal DOM elements
  const modalImg = document.getElementById('modalCakeImg');
  const modalTitle = document.getElementById('modalCakeTitle');
  const modalCat = document.getElementById('modalCakeCategory');
  const modalRating = document.getElementById('modalCakeRating');
  const modalDesc = document.getElementById('modalCakeDesc');
  const modalPrice = document.getElementById('modalCakePrice');
  const modalQty = document.getElementById('modalQtyNum');
  const modalMsg = document.getElementById('modalCakeMsg');
  const modalAmazon = document.getElementById('modalAmazonLink');

  if (modalImg) modalImg.src = image;
  if (modalTitle) modalTitle.innerText = name;
  if (modalCat) modalCat.innerText = category;
  if (modalRating) modalRating.innerText = `⭐⭐⭐⭐⭐ (${rating} / 5)`;
  if (modalDesc) modalDesc.innerText = desc;
  if (modalPrice) modalPrice.innerText = `₹${price}`;
  if (modalQty) modalQty.innerText = '1';
  if (modalMsg) modalMsg.value = '';
  if (modalAmazon) modalAmazon.href = amazon;

  // Reset weight chips
  document.querySelectorAll('#weightSelector .weight-chip').forEach(c => {
    if (c.dataset.weight === '1 kg') c.classList.add('active');
    else c.classList.remove('active');
  });

  // Display modal
  const backdrop = document.getElementById('cakeModalBackdrop');
  if (backdrop) {
    backdrop.classList.add('show');
  }
}

function closeCakeModal() {
  const backdrop = document.getElementById('cakeModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('show');
  }
}

function handleBackdropClick(e) {
  if (e.target.id === 'cakeModalBackdrop') {
    closeCakeModal();
  }
}

function selectWeight(btn) {
  document.querySelectorAll('#weightSelector .weight-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');

  activeModalMultiplier = parseFloat(btn.dataset.multiplier) || 1.0;
  activeModalWeight = btn.dataset.weight || '1 kg';

  if (activeModalCake) {
    const updatedPrice = Math.round(activeModalCake.basePrice * activeModalMultiplier);
    const modalPrice = document.getElementById('modalCakePrice');
    if (modalPrice) modalPrice.innerText = `₹${updatedPrice}`;
  }
}

function adjustModalQty(delta) {
  const qtyElem = document.getElementById('modalQtyNum');
  if (!qtyElem) return;
  let current = parseInt(qtyElem.innerText) || 1;
  current += delta;
  if (current < 1) current = 1;
  qtyElem.innerText = current;
}

function addModalCakeToCart() {
  if (!activeModalCake) return;

  const qty = parseInt(document.getElementById('modalQtyNum').innerText) || 1;
  const msgInput = document.getElementById('modalCakeMsg');
  const cakeMsg = msgInput ? msgInput.value.trim() : '';
  const finalPrice = Math.round(activeModalCake.basePrice * activeModalMultiplier);

  const cartItem = {
    id: activeModalCake.id,
    itemKey: `${activeModalCake.id}_${activeModalWeight}_${cakeMsg}`,
    name: `${activeModalCake.name} (${activeModalWeight})`,
    rawName: activeModalCake.name,
    price: finalPrice,
    image: activeModalCake.image,
    quantity: qty,
    weight: activeModalWeight,
    cakeMessage: cakeMsg,
    amazonUrl: activeModalCake.amazon
  };

  addToCart(cartItem);
  closeCakeModal();
  showToastNotification(cartItem.name, cartItem.image);
}

/* =========================================================
   3. CART STATE MANAGEMENT (LOCALSTORAGE)
   ========================================================= */
function quickAddToCart(id, name, price, image) {
  const cartItem = {
    id: id,
    itemKey: `${id}_1 kg_`,
    name: `${name} (1 kg)`,
    rawName: name,
    price: Number(price),
    image: image,
    quantity: 1,
    weight: '1 kg',
    cakeMessage: '',
    amazonUrl: `https://www.amazon.in/s?k=${encodeURIComponent(name)}`
  };

  addToCart(cartItem);
  showToastNotification(cartItem.name, image);
}

function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem('cakeCart')) || [];
  const existingIdx = cart.findIndex(c => c.itemKey === item.itemKey);

  if (existingIdx > -1) {
    cart[existingIdx].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem('cakeCart', JSON.stringify(cart));
  updateCartCount();

  if (document.getElementById('cartItems')) {
    renderCart();
  }
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cakeCart')) || [];
  const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const countBadge = document.getElementById('cart-count');
  if (countBadge) {
    countBadge.innerText = totalCount;
  }
}

let activeDiscountMultiplier = 0.0;

function renderCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyMsg = document.getElementById('emptyCartMsg');
  const cartContent = document.getElementById('cartContent');
  const subtotalElem = document.getElementById('cartSubtotal');
  const grandTotalElem = document.getElementById('grandTotal');
  const discountRow = document.getElementById('discountRow');
  const discountAmountElem = document.getElementById('discountAmount');
  const deliveryFeeText = document.getElementById('deliveryFeeText');

  if (!cartItemsContainer) return;

  const cart = JSON.parse(localStorage.getItem('cakeCart')) || [];

  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';
  if (cartContent) cartContent.style.display = 'grid';

  let html = '';
  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    html += `
      <tr>
        <td>
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        </td>
        <td>
          <span class="cart-item-title">${item.name}</span>
          ${item.cakeMessage ? `<div style="font-size: 0.78rem; color: var(--coral);">📝 "${item.cakeMessage}"</div>` : ''}
          <div style="margin-top: 4px;">
            <a href="${item.amazonUrl || `https://www.amazon.in/s?k=${encodeURIComponent(item.name)}`}" target="_blank" rel="noopener noreferrer" style="font-size: 0.75rem; color: #C2410C; text-decoration: underline;">
              Buy on Amazon 🛍️
            </a>
          </div>
        </td>
        <td class="cart-item-price">₹${item.price}</td>
        <td>
          <div class="qty-control">
            <button type="button" class="qty-btn" onclick="changeCartQty(${index}, -1)">−</button>
            <span class="qty-number">${item.quantity}</span>
            <button type="button" class="qty-btn" onclick="changeCartQty(${index}, 1)">+</button>
          </div>
        </td>
        <td class="cart-item-price">₹${itemTotal}</td>
        <td>
          <button type="button" class="cart-remove-btn" onclick="removeCartItem(${index})" title="Remove item">
            🗑️
          </button>
        </td>
      </tr>
    `;
  });

  cartItemsContainer.innerHTML = html;

  // Calculate fees and discounts
  const deliveryFee = subtotal >= 499 ? 0 : 50;
  if (deliveryFeeText) {
    deliveryFeeText.innerText = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
    deliveryFeeText.style.color = deliveryFee === 0 ? '#16A34A' : 'var(--text-dark)';
  }

  const discountAmount = Math.round(subtotal * activeDiscountMultiplier);
  if (discountRow && discountAmountElem) {
    if (discountAmount > 0) {
      discountRow.style.display = 'flex';
      discountAmountElem.innerText = discountAmount;
    } else {
      discountRow.style.display = 'none';
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  if (subtotalElem) subtotalElem.innerText = subtotal;
  if (grandTotalElem) grandTotalElem.innerText = grandTotal;
}

function changeCartQty(index, change) {
  let cart = JSON.parse(localStorage.getItem('cakeCart')) || [];
  if (cart[index]) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  }
  localStorage.setItem('cakeCart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function removeCartItem(index) {
  let cart = JSON.parse(localStorage.getItem('cakeCart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cakeCart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function clearCart() {
  if (confirm('Are you sure you want to clear your entire cart?')) {
    localStorage.removeItem('cakeCart');
    updateCartCount();
    renderCart();
  }
}

function applyPromoCode() {
  const promoInput = document.getElementById('promoInput');
  const promoMsg = document.getElementById('promoMessage');
  if (!promoInput || !promoMsg) return;

  const code = promoInput.value.trim().toUpperCase();
  if (code === 'SWEET20') {
    activeDiscountMultiplier = 0.20;
    promoMsg.style.color = '#16A34A';
    promoMsg.innerText = '🎉 Coupon SWEET20 applied! 20% discount added.';
  } else if (code === '') {
    activeDiscountMultiplier = 0.0;
    promoMsg.innerText = '';
  } else {
    activeDiscountMultiplier = 0.0;
    promoMsg.style.color = '#DC2626';
    promoMsg.innerText = '❌ Invalid coupon code. Try SWEET20!';
  }
  renderCart();
}

/* =========================================================
   4. PAYMENT GATEWAY MODAL & ORDER SUBMISSION
   ========================================================= */
let activePaymentMethod = 'UPI';

function openPaymentGatewayModal() {
  const cart = JSON.parse(localStorage.getItem('cakeCart')) || [];
  if (cart.length === 0) {
    alert('Your cart is empty! Please add some cakes first.');
    return;
  }

  const grandTotal = document.getElementById('grandTotal')?.innerText || '0';
  const payModalAmount = document.getElementById('payModalAmount');
  const btnPayAmount = document.getElementById('btnPayAmount');

  if (payModalAmount) payModalAmount.innerText = grandTotal;
  if (btnPayAmount) btnPayAmount.innerText = grandTotal;

  // Show modal
  const modal = document.getElementById('paymentModalBackdrop');
  if (modal) modal.classList.add('show');
}

function closePaymentGatewayModal() {
  const modal = document.getElementById('paymentModalBackdrop');
  if (modal) modal.classList.remove('show');
}

function switchPayTab(method, btn) {
  activePaymentMethod = method.toUpperCase();

  document.querySelectorAll('.pay-tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.pay-tab-content').forEach(c => c.classList.remove('active'));
  const targetContent = document.getElementById(`payTab-${method}`);
  if (targetContent) targetContent.classList.add('active');
}

async function processPaymentAndOrder() {
  const name = document.getElementById('custName')?.value.trim();
  const phone = document.getElementById('custPhone')?.value.trim();
  const email = document.getElementById('custEmail')?.value.trim();
  const address = document.getElementById('custAddress')?.value.trim();
  const city = document.getElementById('custCity')?.value.trim() || 'Kolkata';
  const pincode = document.getElementById('custPincode')?.value.trim() || '700001';

  if (!name || !phone || !email || !address) {
    alert('Please complete all required customer details (Name, Phone, Email, Address).');
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cakeCart')) || [];
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const subtotal = parseFloat(document.getElementById('cartSubtotal')?.innerText) || 0;
  const grandTotal = parseFloat(document.getElementById('grandTotal')?.innerText) || 0;
  const discount = Math.round(subtotal * activeDiscountMultiplier);
  const deliveryFee = subtotal >= 499 ? 0 : 50;

  const btnConfirm = document.getElementById('btnConfirmPayment');
  if (btnConfirm) {
    btnConfirm.disabled = true;
    btnConfirm.innerHTML = '<span>⏳</span> Processing with Secure Bank Gateway...';
  }

  const orderPayload = {
    customer: {
      name,
      phone,
      email,
      address,
      city,
      pincode,
      cakeMessage: cart.map(i => i.cakeMessage).filter(Boolean).join(' | '),
      deliveryDate: 'Today (Express)'
    },
    items: cart.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      weight: item.weight
    })),
    subtotal,
    discount,
    deliveryFee,
    totalAmount: grandTotal,
    paymentMethod: activePaymentMethod
  };

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    const result = await response.json();

    if (result.success && result.order) {
      // Clear cart
      localStorage.removeItem('cakeCart');
      updateCartCount();

      // Show receipt
      const formSection = document.getElementById('checkoutFormSection');
      const successSection = document.getElementById('orderSuccessSection');
      const receiptId = document.getElementById('receiptOrderId');
      const receiptTotal = document.getElementById('receiptTotalAmount');
      const receiptStatus = document.getElementById('receiptPaymentStatus');

      if (formSection) formSection.style.display = 'none';
      if (successSection) successSection.style.display = 'block';
      if (receiptId) receiptId.innerText = `Order #${result.order.orderId}`;
      if (receiptTotal) receiptTotal.innerText = result.order.totalAmount;
      if (receiptStatus) receiptStatus.innerText = `${result.order.paymentStatus} (${result.order.paymentMethod})`;
      
      const trackBtn = document.getElementById('trackOrderLiveBtn');
      if (trackBtn) {
        trackBtn.href = `/track/${result.order.orderId}`;
      }
    } else {
      alert('Order failed: ' + (result.message || 'Unknown error'));
      if (btnConfirm) {
        btnConfirm.disabled = false;
        btnConfirm.innerHTML = 'Pay & Place Order';
      }
    }
  } catch (error) {
    console.error('Order error:', error);
    alert('Could not submit order to server. Please try again.');
    if (btnConfirm) {
      btnConfirm.disabled = false;
      btnConfirm.innerHTML = 'Pay & Place Order';
    }
  }
}
