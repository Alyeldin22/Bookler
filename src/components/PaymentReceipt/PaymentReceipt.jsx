import { Card, Badge } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faReceipt, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';

function PaymentReceipt({ receipt, onClose }) {
  const getPaymentMethodIcon = (method) => {
    try {
      switch (method) {
        case 'credit_card':
          return <FontAwesomeIcon icon={faCreditCard} className="text-blue-600" />;
        case 'paypal':
          return <FontAwesomeIcon icon={faPaypal} className="text-blue-600" />;
        case 'apple_pay':
          return <span className="text-2xl">🍎</span>;
        case 'google_pay':
          return <span className="text-2xl">🤖</span>;
        default:
          return <FontAwesomeIcon icon={faCreditCard} className="text-gray-600" />;
      }
    } catch (error) {
      // Fallback to emoji if icon fails to load
      switch (method) {
        case 'credit_card':
          return <span className="text-blue-600">💳</span>;
        case 'paypal':
          return <span className="text-blue-600">🔵</span>;
        case 'apple_pay':
          return <span className="text-2xl">🍎</span>;
        case 'google_pay':
          return <span className="text-2xl">🤖</span>;
        default:
          return <span className="text-gray-600">💳</span>;
      }
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'paypal':
        return 'PayPal';
      case 'apple_pay':
        return 'Apple Pay';
      case 'google_pay':
        return 'Google Pay';
      default:
        return 'Payment';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: receipt.currency || 'USD'
      }).format(amount);
    } catch (error) {
      return `$${amount || 0}`;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-600">Your booking has been confirmed and payment processed.</p>
      </div>

      <div className="space-y-6">
        {/* Receipt Header */}
        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Receipt</h3>
            <p className="text-sm text-gray-600">Receipt ID: {receipt.receiptId}</p>
            <p className="text-sm text-gray-600">Transaction ID: {receipt.transactionId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{formatDate(receipt.timestamp)}</p>
            <Badge color="success" className="mt-1">
              {receipt.status}
            </Badge>
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <FontAwesomeIcon icon={faReceipt} className="text-blue-600" />
            Booking Details
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Booking ID</p>
              <p className="font-medium">{receipt.bookingId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hotel</p>
              <p className="font-medium">{receipt.hotelName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-in</p>
              <p className="font-medium">{formatDate(receipt.checkIn)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-out</p>
              <p className="font-medium">{formatDate(receipt.checkOut)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Guests</p>
              <p className="font-medium">{receipt.guests}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <div className="flex items-center gap-2">
                {getPaymentMethodIcon(receipt.paymentMethod)}
                <span className="font-medium">{getPaymentMethodName(receipt.paymentMethod)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Payment Summary</h4>
          
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>{formatCurrency(receipt.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Fee:</span>
              <span>{formatCurrency(receipt.fees)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span className="text-blue-600">{formatCurrency(receipt.total)}</span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h5 className="font-semibold text-blue-800 mb-2">What's Next?</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• You will receive a confirmation email shortly</li>
            <li>• Check your booking details in "My Bookings"</li>
            <li>• Contact the hotel directly for any special requests</li>
            <li>• Save this receipt for your records</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => window.print()}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </Card>
  );
}

export default PaymentReceipt; 