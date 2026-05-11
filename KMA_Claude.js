// ===== SCROLL BEHAVIOR =====
const topBar = document.getElementById('topBar');
const navBar = document.getElementById('mainNav');
let lastScrollY = window.scrollY;
const headerHeight = 37;

function handleScroll() {
  if (!topBar || !navBar) return;
  const currentScrollY = window.scrollY;
  if (currentScrollY > headerHeight) {
    topBar.classList.add('slide-up');
    navBar.classList.remove('slide-up');
    navBar.classList.add('slide-down');
  } else {
    topBar.classList.remove('slide-up');
    navBar.classList.remove('slide-up');
    navBar.classList.remove('slide-down');
  }
  lastScrollY = currentScrollY;
}
if (topBar && navBar) {
  window.addEventListener('scroll', handleScroll);
}

// ===== REVEAL ON SCROLL =====
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));
}

// ===== HERO SLIDESHOW =====
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.indicator-dot');
  const heroSection = document.querySelector('.hero');
  if (!slides.length || !dots.length || !heroSection) return;

  let current = 0;
  function showSlide(i) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[i].classList.add('active');
    dots[i].classList.add('active');
  }

  let auto = setInterval(() => { current = (current + 1) % slides.length; showSlide(current); }, 5000);
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    current = i; showSlide(i);
    clearInterval(auto);
    auto = setInterval(() => { current = (current + 1) % slides.length; showSlide(current); }, 5000);
  }));
  heroSection.addEventListener('mouseenter', () => clearInterval(auto));
  heroSection.addEventListener('mouseleave', () => {
    auto = setInterval(() => { current = (current + 1) % slides.length; showSlide(current); }, 5000);
  });
});

// ===== CART =====
const cartElement = document.getElementById('cart');
const cartItemsList = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const cartButton = document.querySelector('.cart-btn');
let cart = [];

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('kma_oushadhashala_cart')) || [];
  } catch (err) {
    return [];
  }
}

function updateCartDisplay() {
  if (!cartItemsList || !cartTotalSpan) return;
  let total = 0;
  cartItemsList.innerHTML = '';

  if (!cart.length) {
    cartItemsList.innerHTML = '<li style="color:var(--text-muted); font-size:0.85rem; padding:12px 0;">Your cart is empty.</li>';
  } else {
    cart.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${item.image || ''}" alt="${item.name}" style="width:32px;height:32px;border-radius:6px;object-fit:cover;">
        <span style="flex:1;font-size:0.8rem;">${item.name}</span>
        <span class="cart-qty-controls">
          <button class="cart-qty-btn" onclick="event.stopPropagation();changeQuantity('${item.id}',-1)">−</button>
          <span class="cart-qty-num">${item.quantity}</span>
          <button class="cart-qty-btn" onclick="event.stopPropagation();changeQuantity('${item.id}',1)">+</button>
        </span>
        <span class="cart-item-price">₹${item.price * item.quantity}</span>
        <button class="cart-item-remove" onclick="event.stopPropagation();removeFromCart('${item.id}')" title="Remove">🗑</button>`;
      cartItemsList.appendChild(li);
      total += item.price * item.quantity;
    });
  }

  cartTotalSpan.textContent = total;
  localStorage.setItem('kma_oushadhashala_cart', JSON.stringify(cart));
}

function changeQuantity(id, delta) {
  const item = cart.find(i => String(i.id) === String(id));
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) removeFromCart(id); else updateCartDisplay();
}

function addToCart(product) {
  if (!product || !product.id) return;
  cart = loadCart();
  const ex = cart.find(i => i.id === product.id);
  if (ex) {
    ex.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartDisplay();
  toggleCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => String(i.id) !== String(id));
  updateCartDisplay();
}

function toggleCart() {
  if (!cartElement) return;
  cartElement.classList.toggle('open');
}

function checkout() {
  if (!cart || !cart.length) {
    alert('Your cart is empty. Add some products first!');
    return;
  }
  localStorage.setItem('checkout_cart', JSON.stringify(cart));
  window.open('Checkout_KMA.html', '_blank');
}

if (cartElement && cartButton) {
  document.addEventListener('click', e => {
    if (cartElement.classList.contains('open') && !cartElement.contains(e.target) && !cartButton.contains(e.target)) {
      cartElement.classList.remove('open');
    }
  });
}

window.addEventListener('load', () => {
  cart = loadCart();
  updateCartDisplay();
});
