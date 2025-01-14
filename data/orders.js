export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order){
  orders.unshift(order); // we want most recent orders first, this will shift the new added orders in front
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function getOrder(orderId) {
  let matchingOrder;

  orders.forEach((order) => {
    if (order.id === orderId) {
      matchingOrder = order;
    }
  });

  return matchingOrder;
}