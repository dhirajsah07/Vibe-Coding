const API_BASE_URL = '';

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initIntersectionObserver();
    initCart();
    initChat();
    
    // Page specific initializations
    if (document.getElementById('products-container')) {
        loadProducts();
    }
    
    if (document.getElementById('contact-form')) {
        initContactForm();
    }
    
    if (document.getElementById('checkout-form')) {
        initCheckoutForm();
    }
});

// --- Glassmorphism Header ---
function initHeaderScroll() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// --- Intersection Observer (Fade-in) ---
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial elements
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
    
    // We also return it so dynamically added products can be observed
    window.globalObserver = observer;
}

// --- Cart Logic ---
let cart = JSON.parse(localStorage.getItem('aurelia_cart')) || [];

function initCart() {
    updateCartCount();
    renderCartDrawer();
    
    const cartIcon = document.querySelector('.cart-icon');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartDrawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('overlay');

    if(cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartDrawer.classList.add('open');
            overlay.classList.add('active');
        });
    }

    if(closeCartBtn && overlay) {
        const closeCart = () => {
            cartDrawer.classList.remove('open');
            overlay.classList.remove('active');
        };
        closeCartBtn.addEventListener('click', closeCart);
        overlay.addEventListener('click', closeCart);
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    renderCartDrawer();
    
    // Open drawer
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('overlay').classList.add('active');
}

function saveCart() {
    localStorage.setItem('aurelia_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const countEl = document.querySelector('.cart-count');
    if (countEl) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countEl.textContent = totalItems;
    }
}

function renderCartDrawer() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalEl = document.getElementById('cart-total-amount');
    
    if (!cartItemsContainer || !cartTotalEl) return;
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <img src="${item.image_url}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }
    
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// --- Product Loading ---
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();
        const container = document.getElementById('products-container');
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}" class="product-image">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn btn-outline add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            `;
            container.appendChild(card);
            
            // Add click listener
            card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                addToCart(product);
            });
            
            // Observe for fade in
            if (window.globalObserver) {
                window.globalObserver.observe(card);
            }
        });
    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

// --- Chat Concierge ---
function initChat() {
    const chatFab = document.getElementById('chat-fab');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.querySelector('.close-chat');
    const sendBtn = document.getElementById('chat-send');
    const inputField = document.getElementById('chat-input');
    
    if (!chatFab) return;
    
    chatFab.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            // Optional: send initial hello implicitly or wait for user
            inputField.focus();
        }
    });
    
    closeChatBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });
    
    const sendMessage = async () => {
        const message = inputField.value.trim();
        if (!message) return;
        
        appendMessage('user', message);
        inputField.value = '';
        
        try {
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            appendMessage('bot', data.reply);
        } catch (error) {
            appendMessage('bot', 'Apologies, our concierge service is currently unavailable.');
        }
    };
    
    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function appendMessage(sender, text) {
    const messagesContainer = document.getElementById('chat-messages');
    const msgEl = document.createElement('div');
    msgEl.className = `message ${sender}`;
    msgEl.textContent = text;
    messagesContainer.appendChild(msgEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// --- Contact Form ---
function initContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const btn = form.querySelector('button');
        btn.textContent = 'Sending...';
        btn.disabled = true;
        
        try {
            const response = await fetch(`${API_BASE_URL}/contact-submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            alert(result.message);
            form.reset();
        } catch (error) {
            alert('An error occurred while sending your inquiry.');
        } finally {
            btn.textContent = 'Send Inquiry';
            btn.disabled = false;
        }
    });
}

// --- Checkout Form ---
function initCheckoutForm() {
    const form = document.getElementById('checkout-form');
    const orderSummary = document.getElementById('order-summary');
    
    // Render order summary
    if (cart.length === 0) {
        orderSummary.innerHTML = '<p>Your cart is empty.</p>';
        form.querySelector('button').disabled = true;
    } else {
        let summaryHtml = '';
        cart.forEach(item => {
            summaryHtml += `<div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem;">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>`;
        });
        summaryHtml += `<hr style="margin: 1rem 0;">`;
        summaryHtml += `<div style="display:flex; justify-content:space-between; font-weight:bold;">
                <span>Total</span>
                <span>$${getCartTotal().toFixed(2)}</span>
            </div>`;
        orderSummary.innerHTML = summaryHtml;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button');
        btn.textContent = 'Processing...';
        btn.disabled = true;
        
        // Prepare cart data matching Pydantic model
        const cartPayload = cart.map(item => ({ product_id: item.id, quantity: item.quantity }));
        
        try {
            const response = await fetch(`${API_BASE_URL}/process-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cart: cartPayload,
                    total_amount: getCartTotal()
                })
            });
            const result = await response.json();
            alert(result.message);
            
            // Clear cart
            cart = [];
            saveCart();
            window.location.href = 'index.html';
        } catch (error) {
            alert('An error occurred during payment processing.');
            btn.textContent = 'Complete Purchase';
            btn.disabled = false;
        }
    });
}
