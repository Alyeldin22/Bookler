export const paymentService = {
  validateCardNumber: (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleanNumber)) return false;
    let sum = 0;
    let isEven = false;
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  },
  getCardType: (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6/.test(cleanNumber)) return 'discover';
    return 'unknown';
  },
  formatCardNumber: (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    const cardType = paymentService.getCardType(cleanNumber);
    if (cardType === 'amex') {
      return cleanNumber.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    } else {
      return cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
  },
  validateExpiryDate: (expiryDate) => {
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    if (expMonth < 1 || expMonth > 12) return false;
    return true;
  },
  validateCVV: (cvv, cardType = 'unknown') => {
    const cvvLength = cardType === 'amex' ? 4 : 3;
    return /^\d{3,4}$/.test(cvv) && cvv.length === cvvLength;
  },
  processPayment: async (paymentData) => {
    try {
  
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          
          if (Math.random() > 0.05) {
            resolve({
              success: true,
              transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
              amount: paymentData.amount,
              currency: paymentData.currency || 'USD',
              timestamp: new Date().toISOString(),
              paymentMethod: paymentData.paymentMethod,
              status: 'completed'
            });
          } else {
            reject(new Error('Payment failed. Please try again.'));
          }
                  }, 2000);
      });
      return response;
    } catch (error) {
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  },
  processCreditCardPayment: async (cardData, amount, currency = 'USD') => {

    if (!paymentService.validateCardNumber(cardData.cardNumber)) {
      throw new Error('Invalid card number');
    }
    if (!paymentService.validateExpiryDate(cardData.expiryDate)) {
      throw new Error('Invalid expiry date');
    }
    if (!paymentService.validateCVV(cardData.cvv, paymentService.getCardType(cardData.cardNumber))) {
      throw new Error('Invalid CVV');
    }
    const paymentData = {
      paymentMethod: 'credit_card',
      amount,
      currency,
      cardType: paymentService.getCardType(cardData.cardNumber),
      maskedCardNumber: `**** **** **** ${cardData.cardNumber.slice(-4)}`,
      cardholderName: cardData.cardholderName
    };
    return await paymentService.processPayment(paymentData);
  },
  processPayPalPayment: async (paypalData, amount, currency = 'USD') => {
    const paymentData = {
      paymentMethod: 'paypal',
      amount,
      currency,
      paypalEmail: paypalData.email
    };
    return await paymentService.processPayment(paymentData);
  },
  getPaymentMethods: () => {
    return [
      {
        id: 'credit_card',
        name: 'Credit Card',
        icon: '💳',
        description: 'Visa, Mastercard, American Express, Discover',
        fields: ['cardNumber', 'cardholderName', 'expiryDate', 'cvv']
      },
      {
        id: 'paypal',
        name: 'PayPal',
        icon: '🔵',
        description: 'Pay with your PayPal account',
        fields: ['email']
      },
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        icon: '🍎',
        description: 'Quick and secure payment with Apple Pay',
        fields: []
      },
      {
        id: 'google_pay',
        name: 'Google Pay',
        icon: '🤖',
        description: 'Quick and secure payment with Google Pay',
        fields: []
      }
    ];
  },
  calculateFees: (amount, paymentMethod) => {
    const fees = {
              credit_card: 0.029,
      paypal: 0.029,
      apple_pay: 0.015,
      google_pay: 0.015
    };
    const feeRate = fees[paymentMethod] || 0.029;
    const fee = amount * feeRate;
    const total = amount + fee;
    return {
      subtotal: amount,
      fee,
      total,
      feeRate: feeRate * 100
    };
  },
  generateReceipt: (paymentResult, bookingData) => {
    return {
      receiptId: `RCP${Date.now()}`,
      transactionId: paymentResult.transactionId,
      bookingId: bookingData.bookingId,
      hotelName: bookingData.hotelName,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      subtotal: paymentResult.amount,
      fees: paymentService.calculateFees(paymentResult.amount, paymentResult.paymentMethod).fee,
      total: paymentResult.amount + paymentService.calculateFees(paymentResult.amount, paymentResult.paymentMethod).fee,
      paymentMethod: paymentResult.paymentMethod,
      status: paymentResult.status,
      timestamp: paymentResult.timestamp,
      currency: paymentResult.currency
    };
  }
};

export default paymentService; 