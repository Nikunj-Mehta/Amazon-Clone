import {validDeliveryOption} from './deliveryOptions.js';

export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart')) || []; // localStorage stores every item in string to bring it back in array we use JSON.parse
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart)); // setItem takes 2 param first the name in which it stores and sec the value it stores eg let cart = "value of cart variable"
}

const addedMessageTimeouts = {};

export function addToCart(productId) {
  // Safely find the quantity selector
  const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
  
  // If quantitySelector is found, use the selected quantity, otherwise default to 1
  const quantity = quantitySelector ? Number(quantitySelector.value) : 1;

  // If quantity is less than or equal to 0, you can log an error or set it to 1
  if (quantity <= 0) {
    console.error(`Quantity must be greater than 0. Received: ${quantity}`);
    return;
  }

  let matchingItem;

  // Find the matching cart item
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) { // iterates over cart and check if product is already present in cart
      matchingItem = cartItem;
    }
  });

  // Update cart
  if (matchingItem) {
    matchingItem.quantity += quantity; // Add to existing quantity
  } else {
    cart.push({ // else adds a new product with these values in cart array
      productId,
      quantity,
      deliveryOptionId: '1', // Default delivery option
    });
  }

    // Timeout message "Added"
      const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
      if (addedMessage) {
        addedMessage.classList.add('added-to-cart-visible'); // Safe update  changes the opacity from 0 to 1
      } else {
        console.warn(`Element .js-added-to-cart-${productId} not found.`);
      }   


      const previousTimeoutId = addedMessageTimeouts[productId]; // It will not run first time but after first execution we will add addedMessageTimeouts[product]
      if(previousTimeoutId) { // so in the next iteration of the same object we will clearTimeout and then again wait 2 sec and remove class.
        clearTimeout(previousTimeoutId);
      }

      const timeoutId = setTimeout(() => {
        addedMessage.classList.remove('added-to-cart-visible'); // changes the opacity form 1 to 0 after 2 sec.
        }, 2000);

        // Save the timeoutId for this product
        // so we can stop it later if we need to.
        addedMessageTimeouts[productId] = timeoutId;

  console.log('Cart updated:', cart); // Debugging log
  saveToStorage(); // Assuming saveToStorage is a function that persists the cart
}


export function removeFromCart(productId) 
{
  // Step 1: Create a new array
  const newCart = [];
  // Step 2: Loop through the cart
  cart.forEach((cartItem) => {
  // Step 3: Add each product to the new array, except for this productId
  if (cartItem.productId !== productId) 
    {
      newCart.push(cartItem);
    }
  });

  cart = newCart; // old cart will be removed by JS garbage collector as it is no longer referenced.

  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) { // updates quantity of specific product in cart array
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = newQuantity;

  saveToStorage();
}

export function updateDeliveryOption(productId, newdeliveryOptionId) {
  // step 1: Loop through the cart and find the product
  let matchingItem;

  cart.forEach((cartItem) => 
  {
    if (productId === cartItem.productId) 
    {
      matchingItem = cartItem;
    }
  });

  if(!matchingItem) {
    return;
  }

  if (!validDeliveryOption(newdeliveryOptionId)) {
    return;
  }

  // Step 2: Update the deliveryOptionId of the product
  matchingItem.deliveryOptionId = newdeliveryOptionId;

  saveToStorage();
}

// need to work on it
export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {

    console.log(xhr.response);
    fun(); // Callback - a function to run in the future.
  });

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send(); // This is Asynchronous i.e. it will just send the request and not wait for response
}

export async function loadCartFetch() {
  const response = await fetch('https://supersimplebackend.dev/cart');
  const text = await response.text();
  console.log(text);
  return text;
}

// Extra feature: make the cart empty after creating an order.
export function resetCart() {
  cart = [];
  saveToStorage();
}