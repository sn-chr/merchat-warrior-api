// Card type patterns
const cardPatterns = {
  visa: /^4/,
  mastercard: /^5[1-5]/,
  amex: /^3[47]/,
  discover: /^6(?:011|5)/,
  dinersclub: /^3(?:0[0-5]|[68])/,
  jcb: /^(?:2131|1800|35)/
};

// Format card number with spaces
export function formatCardNumber(value) {
  if (!value) return value;
  
  // Remove all non-digits
  const v = value.replace(/\D/g, '');
  
  // Check card type for proper spacing
  if (cardPatterns.amex.test(v)) {
    return v.replace(/(\d{4})(\d{6})?(\d{5})?/, '$1 $2 $3').trim();
  }
  return v.replace(/(\d{4})(\d{4})?(\d{4})?(\d{4})?/, '$1 $2 $3 $4').trim();
}

// Format expiry date
export function formatExpiry(value) {
  if (!value) return value;
  
  const v = value.replace(/\D/g, '');
  if (v.length >= 2) {
    return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
  }
  return v;
}

// Get card type from number
export function getCardType(number) {
  if (!number) return null;
  
  for (const [type, pattern] of Object.entries(cardPatterns)) {
    if (pattern.test(number.replace(/\D/g, ''))) {
      return type;
    }
  }
  return null;
} 