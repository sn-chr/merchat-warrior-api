export async function getOrderCart(baseUrl, orderId) {
  try {
    const response = await fetch(`${baseUrl}/api/orders/${orderId}`);
    if (response.ok) {
      const order = await response.json();
      return order.cart.map(item => item._id);
    }
    return [];
  } catch (error) {
    console.error('Error fetching order:', error);
    return [];
  }
} 