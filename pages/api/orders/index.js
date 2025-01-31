import fetch from "isomorphic-fetch";
import { DOMParser } from '@xmldom/xmldom';
import crypto from 'crypto';
import PouchDB from "pouchdb";
import MemoryAdapter from "pouchdb-adapter-memory";
import { formatPhoneForAPI } from '../../../utils/phoneUtils';

PouchDB.plugin(MemoryAdapter);

// Initialize databases
const goods = new PouchDB("goods", { adapter: "memory" });
const orders = new PouchDB("orders", { adapter: "memory" });

function calculateTotal(cart) {
  return cart.reduce(
    (acc, item) => ({
      description:
        acc.description === null
          ? item.title
          : `${acc.description}, ${item.title}`,
      amount: acc.amount + item.amount,
      currency: item.currency
    }),
    {
      description: null,
      amount: 0,
      currency: null
    }
  );
}

async function handleCreateOrder(req, res) {
  try {
    if (!process.env.MW_API_KEY || !process.env.MW_API_PASSPHRASE || !process.env.MW_MERCHANT_UUID) {
      throw new Error('Merchant Warrior credentials are not configured');
    }
    
    // Get cart items from database
    const result = await goods.allDocs({
      include_docs: true,
      keys: req.body.cart
    });

    const cart = result.rows
      .filter(row => row.doc)
      .map(row => row.doc);

    if (cart.length === 0) {
      throw new Error('No items found in cart');
    }

    const total = calculateTotal(cart);
    const linkReferenceID = `order_${Date.now()}`;

    // Prepare PayLink request based on documentation
    const payload = {
      merchantUUID: process.env.MW_MERCHANT_UUID.trim(),
      apiKey: process.env.MW_API_KEY.trim(),
      transactionAmount: total.amount.toFixed(2),
      transactionCurrency: 'AUD',
      transactionProduct: total.description || 'Order Payment',
      returnURL: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      notifyURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/notify`,
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: formatPhoneForAPI(req.body.customerPhone, req.body.phoneCode),
      customerCountry: req.body.customerCountry,
      customerState: req.body.customerState || '',
      customerCity: req.body.customerCity,
      customerAddress: req.body.customerAddress,
      customerPostCode: req.body.customerPostCode,
      linkReferenceID,
      referenceText: 'Order #',
      expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      sendEmail: '1',
      reminderFrequency: '7',
      method: 'cc' // Credit card payment method
    };

    // Generate URL hash per documentation
    const urlHashString = [
      crypto.createHash('md5').update(process.env.MW_API_PASSPHRASE.trim()).digest('hex'),
      payload.merchantUUID,
      payload.returnURL,
      payload.notifyURL
    ].join('').toLowerCase();
    
    payload.urlHash = crypto.createHash('md5').update(urlHashString).digest('hex');

    // Generate transaction hash per documentation
    const transHashString = [
      crypto.createHash('md5').update(process.env.MW_API_PASSPHRASE.trim()).digest('hex'),
      payload.merchantUUID,
      payload.transactionAmount,
      payload.transactionCurrency
    ].join('').toLowerCase();
    
    payload.hash = crypto.createHash('md5').update(transHashString).digest('hex');

    // Call Merchant Warrior PayLink API
    const response = await fetch('https://base.merchantwarrior.com/paylink/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(payload).toString()
    });

    const responseText = await response.text();
    
    // Parse XML response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(responseText, "text/xml");
    
    const getXmlValue = (tagName) => {
      const elements = xmlDoc.getElementsByTagName(tagName);
      return elements.length > 0 ? elements[0].textContent : null;
    };

    const responseCode = getXmlValue('responseCode');
    const responseMessage = getXmlValue('responseMessage');
    const uniqueCode = getXmlValue('uniqueCode');
    const paymentLink = getXmlValue('paymentLink');

    if (responseCode !== '0') {
      throw new Error(responseMessage || 'Failed to generate payment link');
    }

    // Create order in database
    const order = await orders.post({
      _id: linkReferenceID,
      payment: {
        responseCode,
        responseMessage,
        uniqueCode,
        paymentLink,
        linkReferenceID
      },
      isCompleted: false,
      isFailed: false,
      cart,
      total,
      customerInfo: {
        name: req.body.customerName,
        email: req.body.customerEmail,
        phone: formatPhoneForAPI(req.body.customerPhone, req.body.phoneCode),
        country: req.body.customerCountry,
        state: req.body.customerState,
        city: req.body.customerCity,
        address: req.body.customerAddress,
        postCode: req.body.customerPostCode
      },
      createdAt: new Date().toISOString()
    });

    res.json({ 
      id: order.id,
      paymentLink,
      uniqueCode
    });
  } catch (error) {
    console.error('Full error details:', error);
    res.status(500).json({
      error: error.message || "Order creation failed"
    });
  }
}

export default handleCreateOrder;
