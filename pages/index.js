import fetch from "isomorphic-fetch";
import Router from "next/router";
import { useState, useEffect } from "react";
import { ShoppingCart, Filter } from 'react-feather';
import { getOrderCart } from '../utils/helpers';

function GoodsPage({ goods, initialCart }) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState(goods);
  const [cart, setCart] = useState(initialCart);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load products if empty
  useEffect(() => {
    async function loadProducts() {
      if (!products || products.length === 0) {
        try {
          const response = await fetch('/api/goods');
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error('Error loading products:', error);
        }
      }
      setIsLoading(false);
    }
    loadProducts();
  }, []);

  // Get unique categories from goods and filter out any undefined values
  const categories = [
    { id: 'all', name: 'All Products' },
    ...Array.from(new Set(products.map(item => item.category)))
      .filter(Boolean)
      .map(category => ({
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1) + 's'
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  ];

  // Filter products based on category
  const filteredGoods = products.filter(item => 
    selectedCategory === 'all' ? true : item.category === selectedCategory
  );

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleCheckout = () => {
    Router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`flex items-center px-6 py-2 rounded-lg transition-all duration-200 ${
              cart.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className={`w-5 h-5 mr-2 ${cart.length > 0 ? 'animate-bounce' : ''}`} />
            <span className="mr-2">
              {cart.length > 0 ? `${cart.length} items` : 'Cart empty'}
            </span>
            Checkout
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Sidebar - Updated styling */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                Categories
              </h2>
              <div className="flex flex-col gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-sm transform scale-105'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600 border border-transparent hover:border-blue-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="flex-1 text-left">{category.name}</span>
                      <span className="text-sm ml-2">
                        ({products.filter(item => category.id === 'all' ? true : item.category === category.id).length})
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Category Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {categories.find(c => c.id === selectedCategory)?.name || 'All Products'}
                <span className="text-gray-500 text-sm ml-2">
                  ({filteredGoods.length} items)
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGoods.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 hover:border-blue-200"
                >
                  {/* Product Details */}
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 truncate max-w-[70%]">
                        {item.title}
                      </h3>
                      <span className="text-lg font-bold text-blue-600 ml-2 whitespace-nowrap">
                        {new Intl.NumberFormat('en-AU', {
                          style: 'currency',
                          currency: item.currency
                        }).format(item.amount)}
                      </span>
                    </div>

                    <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-3 self-start border border-blue-100">
                      {item.category}
                    </span>

                    <p className="text-gray-600 text-sm mb-6 overflow-hidden text-ellipsis display-webkit-box [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                      {item.description}
                    </p>

                    <button
                      onClick={() => {
                        if (cart.includes(item.id)) {
                          setCart(cart.filter(id => id !== item.id));
                        } else {
                          setCart([...cart, item.id]);
                        }
                      }}
                      className={`mt-auto w-full py-3 px-4 rounded-lg transition-all duration-200 font-medium border ${
                        cart.includes(item.id)
                          ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                          : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      {cart.includes(item.id) ? 'Remove from cart' : 'Add to cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredGoods.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500 text-lg">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ query, req }) {
  const baseUrl = `http://${req.headers.host}`;

  try {
    // Fetch goods from your API
    const response = await fetch(`${baseUrl}/api/goods`);
    const goods = response.ok ? await response.json() : [];

    // Get cart from query if available
    const cart = query.order ? await getOrderCart(baseUrl, query.order) : [];

    return {
      props: {
        goods,
        initialCart: cart || []
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        goods: [],
        initialCart: []
      }
    };
  }
}

export default GoodsPage;
