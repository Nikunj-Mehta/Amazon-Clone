import {cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js'; // removed {} because we used Default Export.
// import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption, calculateDeliveryDate} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

// hello();

// const today = dayjs();
// const deliveryDate = today.add(7, 'days');
// // console.log(deliveryDate);
// console.log(deliveryDate.format('dddd, MMMM D'));

export function renderOrderSummary() {

  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId); // in products.js It's work is to find matching product from products array using productId.

    //  console.log(matchingProduct);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId); // in deliveryOptions.js find complete delivery option using deliveryOptionId

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name js-product-name-${matchingProduct.id}">
            ${matchingProduct.name}
          </div>
          <div class="product-price js-product-price-${matchingProduct.id}">
            ${matchingProduct.getPrice()}
          </div>
          <div class="product-quantity js-product-quantity-${matchingProduct.id}">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-link"data-product-id="${matchingProduct.id}">
              Save
            </span>

            <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id=${matchingProduct.id}>
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem)
  {
    let html = '';
    // Step 1: Loop through deliveryOptions
    deliveryOptions.forEach((deliveryOption) =>{
      
      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0
      ? 'FREE'
      : `$${formatCurrency(deliveryOption.priceCents)} -`;

      // Step 2: for each option, generate some HTML

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
          <div class="delivery-option js-delivery-option js-delivery-option-${matchingProduct.id}-${deliveryOption.id}" 
            data-product-id="${matchingProduct.id}"
            data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}"
            name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString} Shipping
              </div>
            </div>
          </div>
      `
    });
    // Step 3: Combine the HTML together
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
      link.addEventListener('click', () => {
        //    console.log('delete');
  // step 1: Remove the product from cart 
  const productId = link.dataset.productId;
  //      console.log(productId);
        removeFromCart(productId);
  //      console.log(cart);

        renderOrderSummary(); // Instead of using DOM in all the below lines we used MVC by just regenerating HTML.
        
  //       const container = document.querySelector(`.js-cart-item-container-${productId}`);
  // //    console.log(container);  
  //       // step 2: Use .remove() method to remove the element form cart
  //       container.remove();

  //       updateCartQuantity();

        renderPaymentSummary();
      });
    });

    // console.log(cartSummaryHTML);

    // Checkout items number at the top of checkout page.
    function updateCartQuantity() {
      const cartQuantity = calculateCartQuantity(); // Calculate the total cart quantity.
    
      // Check if the element exists before trying to modify it.
      const homeLink = document.querySelector('.js-return-to-home-link');
      if (homeLink) {
        homeLink.innerHTML = `${cartQuantity} items`;
      } else {
        console.warn('.js-return-to-home-link not found in the DOM.');
      }
    }

    updateCartQuantity();

    document.querySelectorAll('.js-update-link')
      .forEach((link) => {
        link.addEventListener('click', () => {
          const productId = link.dataset.productId;
          // console.log(productId);
          const container = document.querySelector(
            `.js-cart-item-container-${productId}`
          );
          container.classList.add('is-editing-quantity');
      });
    });

    document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        // Here's an example of a feature we can add: validation.
        // Note: we need to move the quantity-related code up
        // because if the new quantity is not valid, we should
        // return early and NOT run the rest of the code. This
        // technique is called an "early return".
        
        const quantityInput = document.querySelector(
          `.js-quantity-input-${productId}`
        );
        const newQuantity = Number(quantityInput.value);

        if (newQuantity < 0 || newQuantity >= 1000) 
        {
          alert('Quantity must be at least 0 and less than 1000');
          return;
        }

        updateQuantity(productId, newQuantity);

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.remove('is-editing-quantity'); // remove save link to remove block and save and show update there. As our updation is finished.

        const quantityLabel = document.querySelector(
          `.js-quantity-label-${productId}`
        );
        quantityLabel.innerHTML = newQuantity;

        updateCartQuantity(); // updates cart quantity at the top of the checkout page

        renderPaymentSummary();
      });
    });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);

      // Inside renderOrderSummary() function we can call renderOrderSummary() again (RECURSION)
      renderOrderSummary(); // re run the code to update the page (instead of using DOM we just 1)Updated the data and then 2)Regenerate all the HTML) 
      renderPaymentSummary(); // to regenerate all the HTML
    });
  });

  // Helper function to check if the cart is empty
    const emptyCartMessageContainer = document.querySelector('.js-empty-cart');

    if (cart.length === 0) {
      if (emptyCartMessageContainer) {
        emptyCartMessageContainer.innerHTML = `
          <p>It looks like your cart is empty.</p>
          <a href="index.html" class="view-products-btn">View Products</a>
        `;
      }
    }
}