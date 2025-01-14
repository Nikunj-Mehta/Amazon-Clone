import { validDeliveryOption } from "./deliveryOptions.js";

class Cart {
  cartItems;
  #localStorageKey; // Private property = can be used inside of class only.

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey; // this points to the object that we generate.
    this.#loadFromStorage();
  }

  #loadFromStorage() { // private method
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));
  
    if (!this.cartItems) {
      this.cartItems = [
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 2,
          deliveryOptionId: '1'
        }, 
        {
          productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
          quantity: 1,
          deliveryOptionId: '2'
        }
      ];
    }
  }

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId) {
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
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    // Update cart
    if (matchingItem) {
      matchingItem.quantity += quantity; // Add to existing quantity
    } else {
      this.cartItems.push({
        productId,
        quantity,
        deliveryOptionId: '1', // Default delivery option
      });
    }

    console.log('Cart updated:', cart); // Debugging log
    this.saveToStorage(); // Assuming saveToStorage is a function that persists the cart
  }

  removeFromCart(productId) 
  {
    // Step 1: Create a new array
    const newCart = [];
    // Step 2: Loop through the cart
    this.cartItems.forEach((cartItem) => {
    // Step 3: Add each product to the new array, except for this productId
    if (cartItem.productId !== productId) 
      {
        newCart.push(cartItem);
      }
    });

    this.cartItems = newCart;

    this.saveToStorage();
  }

  calculateCartQuantity() {
    let cartQuantity = 0;
  
    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
  
    return cartQuantity;
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    // step 1: Loop through the cart and find the product
    let matchingItem;
  
    this.cartItems.forEach((cartItem) => 
    {
      if (productId === cartItem.productId) 
      {
        matchingItem = cartItem;
      }
    });
  
    if(!matchingItem) {
      return;
    }
  
    if (!validDeliveryOption(deliveryOptionId)) {
      return;
    }
  
    // Step 2: Update the deliveryOptionId of the product
    matchingItem.deliveryOptionId = deliveryOptionId;
  
    this.saveToStorage();
  }
}

// Converted to class from a function.
const cart = new Cart('cart-oop'); // Instead of copy-pasting we can create a function and call it.
const businessCart = new Cart('cart-business'); // Instead of loading in same storage use parameter so that they can be stored in 2 different storages.

//cart.#localStorageKey = 'test'; // to prevent this make it private

console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart);