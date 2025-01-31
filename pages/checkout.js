import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import fetch from "isomorphic-fetch";
import { ArrowLeft, Search, ChevronDown, CreditCard, Lock } from 'react-feather';
import { sortedCountries } from '../utils/constants/countries';
import { phoneCodes } from '../utils/constants/phoneCodes';
import { PhoneInput } from '../components/checkout/PhoneInput';
import { CountrySelect } from '../components/checkout/CountrySelect/CountrySelect';
import { formatCardNumber, formatExpiry, getCardType } from '../utils/cardUtils';
import { validatePhone } from '../utils/phoneUtils';

function PhoneCodeSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCodes = phoneCodes.filter(country => 
    !country.disabled && 
    (country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     country.phoneCode.includes(searchTerm))
  );

  const selectedCountry = phoneCodes.find(c => c.code === value);

  return (
    <div className="relative">
      <div
        className="w-full p-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {selectedCountry ? (
            <>
              <img 
                src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                alt={`${selectedCountry.name} flag`}
                className="w-6 h-4 object-cover rounded-sm shadow-sm"
              />
              <span className="text-gray-900 font-medium">+{selectedCountry.phoneCode}</span>
            </>
          ) : (
            <span className="text-gray-500">Select code</span>
          )}
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400 ml-2" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto country-select-dropdown">
          <div className="sticky top-0 bg-white p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search country code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="py-1">
            {filteredCodes.map((country, index) => (
              <div
                key={index}
                className={`px-4 py-3 flex items-center gap-3 hover:bg-blue-50 cursor-pointer ${
                  value === country.code ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  onChange({ target: { name: 'phoneCode', value: country.code }});
                  setIsOpen(false);
                }}
              >
                <img 
                  src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                  alt={`${country.name} flag`}
                  className="w-6 h-4 object-cover rounded-sm shadow-sm"
                />
                <span className="text-gray-900 font-medium">+{country.phoneCode}</span>
                <span className="flex-1 text-gray-500">{country.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutForm() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    phoneCode: 'AU',
    customerCountry: 'AU',
    customerState: '',
    customerCity: '',
    customerAddress: '',
    customerPostCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState({ amount: 0, currency: 'AUD' });
  const [cardType, setCardType] = useState(null);

  // Optional: Set default state when component mounts
  useEffect(() => {
    if (formData.customerCountry === 'AU' && !formData.customerState) {
      setFormData(prev => ({
        ...prev,
        customerState: ''  // You can set a default state here if needed
      }));
    }
  }, []);

  // Update cart loading logic
  useEffect(() => {
    const loadCart = async () => {
      const savedCart = localStorage.getItem('cart');
      if (!savedCart) {
        router.push('/');
        return;
      }

      try {
        const cartIds = JSON.parse(savedCart);
        // Fetch cart items details from your API
        const response = await fetch(`/api/goods`);
        const allGoods = await response.json();
        
        // Filter goods to get only cart items
        const items = allGoods.filter(item => cartIds.includes(item.id));
        setCartItems(items);
        setCart(cartIds);

        // Calculate total
        const cartTotal = items.reduce((acc, item) => ({
          amount: acc.amount + (item.amount || 0),
          currency: item.currency || 'AUD'
        }), { amount: 0, currency: 'AUD' });
        setTotal(cartTotal);
      } catch (err) {
        console.error('Error loading cart:', err);
        setError('Failed to load cart items');
      }
    };

    loadCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle card input formatting
  const handleCardInput = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      setCardType(getCardType(value));
    } else if (name === 'cardExpiry') {
      formattedValue = formatExpiry(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate phone
    if (!validatePhone(formData.customerPhone, formData.phoneCode)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      // First create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart,
          ...formData
        })
      });

      const orderData = await orderResponse.json();

      if (orderData.error) {
        throw new Error(orderData.error);
      }

      // Generate payment link
      const paymentResponse = await fetch('/api/orders/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderItems: cartItems,
          customerInfo: formData,
          orderId: orderData.orderId
        })
      });

      const paymentData = await paymentResponse.json();

      if (paymentData.error) {
        throw new Error(paymentData.error);
      }

      // Clear cart after successful order creation
      localStorage.removeItem('cart');

      // Redirect to the payment page
      if (paymentData.paymentLink) {
        window.location.href = paymentData.paymentLink;
      } else {
        throw new Error('No payment link received');
      }

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  // Show loading state while checking cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout Information</h1>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 gap-8">
                    {/* Name and Email */}
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    {/* Phone and Country */}
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <PhoneInput
                          countryCode={formData.phoneCode}
                          phone={formData.customerPhone}
                          onPhoneChange={(value) => handleInputChange({ target: { name: 'customerPhone', value }})}
                          onCountryChange={(code) => handleInputChange({ target: { name: 'phoneCode', value: code }})}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <CountrySelect
                          value={formData.customerCountry}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* State and City */}
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="customerState"
                          value={formData.customerState}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="California"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="customerCity"
                          value={formData.customerCity}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="San Francisco"
                        />
                      </div>
                    </div>

                    {/* Address and Post Code */}
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          name="customerAddress"
                          value={formData.customerAddress}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="1234 Main St"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Post Code *
                        </label>
                        <input
                          type="text"
                          name="customerPostCode"
                          value={formData.customerPostCode}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="12345"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payment Information
                      </div>
                      {cardType && (
                        <img 
                          src={`/images/cards/${cardType}.svg`} 
                          alt={cardType}
                          className="h-8"
                        />
                      )}
                    </div>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2 relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardInput}
                        required
                        maxLength="19"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      <CreditCard className="absolute left-3 top-[38px] w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleCardInput}
                        required
                        maxLength="5"
                        placeholder="MM/YY"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC *
                      </label>
                      <input
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        required
                        maxLength="4"
                        placeholder="123"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Lock className="w-5 h-5 mr-2" />
                      Pay {new Intl.NumberFormat('en-AU', {
                        style: 'currency',
                        currency: total.currency || 'AUD'
                      }).format(total.amount || 0)}
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-start py-4 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-medium mb-1">{item.title}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="inline-block bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-gray-900 font-medium">
                      {new Intl.NumberFormat('en-AU', {
                        style: 'currency',
                        currency: item.currency || 'AUD'
                      }).format(item.amount || 0)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>
                    {new Intl.NumberFormat('en-AU', {
                      style: 'currency',
                      currency: total.currency || 'AUD'
                    }).format(total.amount || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat('en-AU', {
                      style: 'currency',
                      currency: total.currency || 'AUD'
                    }).format(total.amount || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ query, req }) {
  const baseUrl = `http://${req.headers.host}`;

  const response = await fetch(`${baseUrl}/api/orders/${query.order}`);
  const order = response.ok ? await response.json() : null;

  return {
    props: {
      order
    }
  };
}
