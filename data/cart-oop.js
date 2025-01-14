import { validDeliveryOption } from "./deliveryOptions.js";

function Cart(localStorageKey) 
{
  const cart = {
    cartItems: undefined,
  
    loadFromStorage() {
      this.cartItems = JSON.parse(localStorage.getItem(localStorageKey));
    
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
    },
  
    saveToStorage() {
      localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
    },
    
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
      },
  
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
    },
  
    calculateCartQuantity() {
      let cartQuantity = 0;
    
      this.cartItems.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
      });
    
      return cartQuantity;
    },
  
    updateQuantity(productId, newQuantity) {
      let matchingItem;
    
      this.cartItems.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });
    
      matchingItem.quantity = newQuantity;
    
      this.saveToStorage();
    },
  
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
  
  };

  return cart;
}

const cart = Cart('cart-oop'); // Instead of copy-pasting we can create a function and call it.
const businessCart = Cart('cart-business'); // Instead of loading in same storage use parameter so that they can be stored in 2 different storages.

cart.loadFromStorage();

businessCart.loadFromStorage();

console.log(cart);
console.log(businessCart);