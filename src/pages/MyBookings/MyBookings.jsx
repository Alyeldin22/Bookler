import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Card, Badge, Modal, Button } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faHotel, faMoneyBill, faCreditCard, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import NavigationHeader from '../../components/Header/Header';
import SideNavigation from '../../components/SideBar/SideBar';
import PaymentReceipt from '../../components/PaymentReceipt/PaymentReceipt';


function MyBookings() {
  const { bookings } = useSelector((state) => state.booking);
  const { currentUser } = useSelector((state) => state.user);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'failure';
      default:
        return 'gray';
    }
  };

  const getPaymentMethodIcon = (method) => {
    try {
      switch (method) {
        case 'credit_card':
          return <FontAwesomeIcon icon={faCreditCard} className="text-blue-600" />;
        case 'paypal':
          return <FontAwesomeIcon icon={faPaypal} className="text-blue-600" />;
        case 'apple_pay':
          return <span>🍎</span>;
        case 'google_pay':
          return <span>🤖</span>;
        default:
          return <FontAwesomeIcon icon={faCreditCard} className="text-gray-600" />;
      }
    } catch (error) {
      
      switch (method) {
        case 'credit_card':
          return <span className="text-blue-600">💳</span>;
        case 'paypal':
          return <span className="text-blue-600">🔵</span>;
        case 'apple_pay':
          return <span>🍎</span>;
        case 'google_pay':
          return <span>🤖</span>;
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

  const handleViewReceipt = (booking) => {
    if (booking.receipt) {
      setSelectedReceipt(booking.receipt);
      setShowReceiptModal(true);
    }
  };

  const closeReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedReceipt(null);
  };

  const totalPrice = bookings.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

  return (
    <>
      <NavigationHeader />
      <SideNavigation />
      
      <section className="w-[calc(100vw-320px)] ml-72 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">Welcome back, {currentUser?.name || currentUser?.email}</p>
        </div>
        {bookings.length > 0 && (
          <div className="mb-6 flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <span className="text-lg font-semibold text-gray-700">Total Price of All Bookings:</span>
            <span className="text-2xl font-bold text-blue-600">${totalPrice}</span>
          </div>
        )}

        {bookings.length === 0 ? (
          <Card className="text-center p-8">
            <div className="text-gray-500">
              <FontAwesomeIcon icon={faHotel} className="text-6xl mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
              <p>You haven't made any bookings yet. Start exploring hotels to make your first booking!</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{booking.hotelName}</h3>
                      <Badge color={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendar} className="text-blue-500" />
                        <span>Check-in: {formatDate(booking.checkIn)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendar} className="text-blue-500" />
                        <span>Check-out: {formatDate(booking.checkOut)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faMoneyBill} className="text-green-500" />
                        <span>Total: ${booking.totalPrice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>👥</span>
                        <span>{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {/* Payment Information */}
                    {booking.paymentDetails && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getPaymentMethodIcon(booking.paymentDetails.paymentMethod)}
                            <span className="text-sm font-medium">
                              {getPaymentMethodName(booking.paymentDetails.paymentMethod)}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Transaction ID</p>
                            <p className="text-xs font-mono">{booking.paymentDetails.transactionId}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      {booking.bookingId && (
                        <p className="text-xs text-gray-500">
                          Booking ID: {booking.bookingId}
                        </p>
                      )}
                      
                      {booking.receipt && (
                        <Button
                          size="sm"
                          color="gray"
                          onClick={() => handleViewReceipt(booking)}
                          className="flex items-center gap-2"
                        >
                          <FontAwesomeIcon icon={faReceipt} />
                          View Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Receipt Modal */}
      <Modal show={showReceiptModal} onClose={closeReceiptModal} size="4xl">
        <Modal.Body className="p-0">
          {selectedReceipt && (
            <PaymentReceipt 
              receipt={selectedReceipt} 
              onClose={closeReceiptModal} 
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default MyBookings; 