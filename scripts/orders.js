import {getProduct, loadProductsFetch} from '../data/products.js';
import {orders} from '../data/orders.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import formatCurrency from './utils/money.js';
import {addToCart, calculateCartQuantity} from '../data/cart.js';

async function loadPage() {
  await loadProductsFetch();

  if (orders.length === 0) {
    // If no orders, display a message and a button
    document.querySelector('.js-orders-grid').innerHTML = `
      <div class="no-orders-message">
        <div>
          <img src="images/sad-pup-no-orders.jpg" alt="No orders" class="no-orders-image">
        </div>
        <br>
        <p>Looks like you haven't placed any orders yet.</p>
        <button class="start-shopping-button" onclick="window.location.href='index.html'">
          Start Shopping
        </button>
      </div>
    `;
    return;
  }
  
  
  let ordersHTML = '';

  orders.forEach((order) => {
    const orderTimeString = dayjs(order.orderTime).format('MMMM D');

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderTimeString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        
        <!-- Check if there are products in the order before rendering them -->
        <div class="order-details-grid">
          ${
            order.products && order.products.length > 0
              ? productsListHTML(order) // Run the loop if there are products
              : '<div>No products available for this order.</div>' // If no products, display a message
          }
        </div>
      </div>
    `;
  });

  function productsListHTML(order) {
    let productsListHTML = '';

    order.products.forEach((productDetails) => {
      const product = getProduct(productDetails.productId);
      
      const deliveryDate = dayjs(productDetails.estimatedDeliveryTime); // to write Arrived by for the orders arrived earlies and arriving on for orders yet to arrive.
      const today = dayjs();
      const deliveryText = today.isAfter(deliveryDate, 'day')
        ? `Delivered by: ${deliveryDate.format('MMMM D')}`
        : `Arriving on: ${deliveryDate.format('MMMM D')}`;
      
      productsListHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>
        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            ${deliveryText}
          </div>
          <div class="product-quantity">
            Quantity: ${productDetails.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.id}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>
        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    return productsListHTML;
  }

  document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

  document.querySelectorAll('.js-buy-again').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.productId);

      // (Optional) display a message that the product was added,
      // then change it back after a second.
      button.innerHTML = 'Added';
      setTimeout(() => {
        button.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
      }, 1000);
    });
  });

  function updateCartQuantity() // Updates cart Quantity at top right of website
  {
    const cartQuantity = calculateCartQuantity();
      document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }
  updateCartQuantity();

}

loadPage();