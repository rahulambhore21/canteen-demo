// localStorage utility functions for the canteen app

export const storage = {
  // Cart operations
  getCart: () => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('canteen_cart');
    return cart ? JSON.parse(cart) : [];
  },

  setCart: (cart) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('canteen_cart', JSON.stringify(cart));
  },

  addToCart: (item) => {
    const cart = storage.getCart();
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    storage.setCart(cart);
    return cart;
  },

  removeFromCart: (itemId) => {
    const cart = storage.getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    storage.setCart(updatedCart);
    return updatedCart;
  },

  updateQuantity: (itemId, quantity) => {
    const cart = storage.getCart();
    const item = cart.find(cartItem => cartItem.id === itemId);
    
    if (item) {
      if (quantity <= 0) {
        return storage.removeFromCart(itemId);
      }
      item.quantity = quantity;
      storage.setCart(cart);
    }
    
    return cart;
  },

  clearCart: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('canteen_cart');
  },

  // Order operations
  getOrders: () => {
    if (typeof window === 'undefined') return [];
    const orders = localStorage.getItem('canteen_orders');
    return orders ? JSON.parse(orders) : [];
  },

  addOrder: (orderData) => {
    const orders = storage.getOrders();
    const orderId = `ORD${Date.now()}`;
    const newOrder = {
      id: orderId,
      ...orderData,
      timestamp: new Date().toISOString(),
      status: 'preparing' // preparing, ready, delivered
    };
    
    orders.unshift(newOrder); // Add to beginning
    localStorage.setItem('canteen_orders', JSON.stringify(orders));
    return newOrder;
  },

  updateOrderStatus: (orderId, status) => {
    const orders = storage.getOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
      order.status = status;
      localStorage.setItem('canteen_orders', JSON.stringify(orders));
    }
    
    return order;
  },

  // User/Admin operations
  getUser: () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('canteen_user');
    return user ? JSON.parse(user) : null;
  },

  setUser: (userData) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('canteen_user', JSON.stringify(userData));
  },

  logout: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('canteen_user');
  },

  // Admin login
  adminLogin: (username, password) => {
    // Simple mock admin authentication
    if (username === 'admin' && password === '1234') {
      const adminData = { 
        username: 'admin', 
        role: 'admin', 
        loginTime: new Date().toISOString() 
      };
      storage.setUser(adminData);
      return adminData;
    }
    return null;
  }
};

// Utility functions
export const generateOrderId = () => {
  return `ORD${Date.now()}`;
};

export const calculateTotal = (cart) => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartItemCount = (cart) => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};

export const formatCurrency = (amount) => {
  return `₹${amount}`;
};