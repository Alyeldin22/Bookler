import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, TextInput, Select, Button, Modal, Alert, Spinner } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCreditCard, faUser, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faPaypal, faApple, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { ApiUrl } from '../../network/interceptor/ApiUrl';
import { addBooking } from '../../store/BookingSlice';
import CustomButton from '../../components/Button/Button';
import NavigationHeader from '../../components/Header/Header';
import SideNavigation from '../../components/SideBar/SideBar';
import PaymentReceipt from '../../components/PaymentReceipt/PaymentReceipt';
import paymentService from '../../services/paymentService';

function BookHotel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    totalPrice: 0
  });

  const { register, handleSubmit, watch, formState: { errors }, setValue, setError } = useForm();
  const watchCheckIn = watch('checkIn');
  const watchCheckOut = watch('checkOut');
  const watchGuests = watch('guests');
  const watchCardNumber = watch('cardNumber');

  // Fetch hotel details
  useEffect(() => {
    if (id) {
      ApiUrl.get(`/hotels/${id}`)
        .then((res) => {
          setHotel(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching hotel:', err);
          setLoading(false);
        });
    }
  }, [id]);

  // Calculate total price when dates or guests change
  useEffect(() => {
    if (hotel && watchCheckIn && watchCheckOut) {
      try {
        const checkIn = new Date(watchCheckIn);
        const checkOut = new Date(watchCheckOut);
        const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const basePrice = hotel?.pricing?.[0]?.discountedPrice || hotel?.pricing?.[0]?.originalPrice || 100;
        const totalPrice = basePrice * days * (watchGuests || 1);
        
        setBookingData({
          ...bookingData,
          checkIn: watchCheckIn,
          checkOut: watchCheckOut,
          guests: watchGuests || 1,
          totalPrice
        });
      } catch (error) {
        console.error('Error calculating total price:', error);
        // Set default values if calculation fails
        setBookingData({
          ...bookingData,
          checkIn: watchCheckIn,
          checkOut: watchCheckOut,
          guests: watchGuests || 1,
          totalPrice: 100
        });
      }
    }
  }, [watchCheckIn, watchCheckOut, watchGuests, hotel]);

  // Pre-fill user data
  useEffect(() => {
    if (currentUser) {
      setValue('name', currentUser.name || '');
      setValue('email', currentUser.email || '');
      setValue('phone', currentUser.phone || '');
      setValue('country', currentUser.country || '');
    }
  }, [currentUser, setValue]);

  // Format card number as user types
  useEffect(() => {
    if (watchCardNumber) {
      const formatted = paymentService.formatCardNumber(watchCardNumber);
      if (formatted !== watchCardNumber) {
        setValue('cardNumber', formatted);
      }
    }
  }, [watchCardNumber, setValue]);

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setPaymentError(null);
  };

  const processPayment = async (formData) => {
    setProcessingPayment(true);
    setPaymentError(null);

    try {
      let paymentResult;

      switch (selectedPaymentMethod) {
        case 'credit_card':
          paymentResult = await paymentService.processCreditCardPayment({
            cardNumber: formData.cardNumber,
            cardholderName: formData.cardholderName,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv
          }, bookingData.totalPrice);
          break;

        case 'paypal':
          paymentResult = await paymentService.processPayPalPayment({
            email: formData.paypalEmail
          }, bookingData.totalPrice);
          break;

        case 'apple_pay':
        case 'google_pay':
          paymentResult = await paymentService.processPayment({
            paymentMethod: selectedPaymentMethod,
            amount: bookingData.totalPrice
          });
          break;

        default:
          throw new Error('Invalid payment method');
      }

      return paymentResult;
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    } finally {
      setProcessingPayment(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const paymentResult = await processPayment(data);
      
      const receipt = paymentService.generateReceipt(paymentResult, {
        bookingId: `BK${Date.now()}`,
        hotelName: hotel?.name || 'Selected Hotel',
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests
      });

      const booking = {
        ...data,
        hotelId: id,
        hotelName: hotel?.name || 'Selected Hotel',
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        totalPrice: bookingData.totalPrice,
        status: 'confirmed',
        bookingId: receipt.bookingId,
        bookingDate: new Date().toISOString(),
        paymentDetails: paymentResult,
        receipt: receipt
      };

      dispatch(addBooking(booking));
      setPaymentReceipt(receipt);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Booking failed:', error);
      // Error is already set in processPayment
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/my-bookings');
  };

  const getPaymentMethods = () => {
    try {
      return paymentService.getPaymentMethods();
    } catch (error) {
      console.error('Error getting payment methods:', error);
      // Fallback payment methods with emoji icons
      return [
        {
          id: 'credit_card',
          name: 'Credit Card',
          description: 'Pay with your credit or debit card',
          icon: '💳'
        },
        {
          id: 'paypal',
          name: 'PayPal',
          description: 'Pay with your PayPal account',
          icon: '🔵'
        },
        {
          id: 'apple_pay',
          name: 'Apple Pay',
          description: 'Pay with Apple Pay',
          icon: '🍎'
        },
        {
          id: 'google_pay',
          name: 'Google Pay',
          description: 'Pay with Google Pay',
          icon: '🤖'
        }
      ];
    }
  };

  if (loading) {
    return (
      <>
        <NavigationHeader />
        <SideNavigation />
        <div className="w-[calc(100vw-320px)] ml-72 p-6 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="xl" className="mb-4" />
            <p>Loading hotel details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!hotel) {
    return (
      <>
        <NavigationHeader />
        <SideNavigation />
        <div className="w-[calc(100vw-320px)] ml-72 p-6">
          <Card className="text-center">
            <h2 className="text-xl font-semibold text-red-600">Hotel not found</h2>
            <p className="text-gray-600 mt-2">The hotel you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/hotelssearch')} className="mt-4">
              Back to Hotels
            </Button>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <NavigationHeader />
      <SideNavigation />
      
      <section className="w-full max-w-full md:w-[calc(100vw-320px)] md:ml-72 p-2 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Book Hotel</h1>
          <p className="text-gray-600">Complete your booking for {hotel?.name || 'Selected Hotel'}</p>
        </div>
        {/* Total Price Display */}
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <span className="text-lg font-semibold text-gray-700">Total Price</span>
            <span className="text-2xl font-bold text-blue-600">${bookingData.totalPrice}</span>
          </div>
        </div>

        {paymentError && (
          <Alert color="failure" className="mb-6">
            <span className="font-medium">Payment Error!</span> {paymentError}
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="md:col-span-2 space-y-6">
            {/* User Details Form */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                <h2 className="text-xl font-semibold">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <TextInput
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <TextInput
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                        message: 'Enter a valid email'
                      }
                    })}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <TextInput
                    {...register('phone', { 
                      required: 'Phone is required',
                      pattern: {
                        value: /^\d{1,12}$/,
                        message: 'Enter a valid phone number (max 12 digits)'
                      }
                    })}
                    placeholder="Phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <Select {...register('country', { required: 'Country is required' })}>
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="MA">Morocco</option>
                    <option value="EG">Egypt</option>
                    <option value="GR">Greece</option>
                  </Select>
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                </div>
              </div>
            </Card>

            {/* Booking Details */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faCalendar} className="text-blue-600" />
                <h2 className="text-xl font-semibold">Booking Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                  <TextInput
                    type="date"
                    {...register('checkIn', { required: 'Check-in date is required' })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                  <TextInput
                    type="date"
                    {...register('checkOut', { required: 'Check-out date is required' })}
                    min={watchCheckIn || new Date().toISOString().split('T')[0]}
                  />
                  {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                  <Select {...register('guests', { required: 'Number of guests is required' })}>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                  </Select>
                  {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests.message}</p>}
                </div>
              </div>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faCreditCard} className="text-blue-600" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {getPaymentMethods().map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePaymentMethodChange(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <h3 className="font-semibold">{method.name}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Form Fields */}
              {selectedPaymentMethod === 'credit_card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <TextInput
                      {...register('cardNumber', { 
                        required: 'Card number is required',
                        validate: (value) => paymentService.validateCardNumber(value) || 'Invalid card number'
                      })}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <TextInput
                      {...register('cardholderName', { required: 'Cardholder name is required' })}
                      placeholder="Name on card"
                    />
                    {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <TextInput
                      {...register('expiryDate', { 
                        required: 'Expiry date is required',
                        validate: (value) => paymentService.validateExpiryDate(value) || 'Invalid expiry date'
                      })}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                    {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <TextInput
                      {...register('cvv', { 
                        required: 'CVV is required',
                        validate: (value) => paymentService.validateCVV(value, paymentService.getCardType(watchCardNumber)) || 'Invalid CVV'
                      })}
                      placeholder="123"
                      maxLength="4"
                    />
                    {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv.message}</p>}
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'paypal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PayPal Email</label>
                  <TextInput
                    type="email"
                    {...register('paypalEmail', { 
                      required: 'PayPal email is required',
                      pattern: {
                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                        message: 'Enter a valid email'
                      }
                    })}
                    placeholder="your@paypal.com"
                  />
                  {errors.paypalEmail && <p className="text-red-500 text-xs mt-1">{errors.paypalEmail.message}</p>}
                </div>
              )}

              {(selectedPaymentMethod === 'apple_pay' || selectedPaymentMethod === 'google_pay') && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">
                    {selectedPaymentMethod === 'apple_pay' ? '🍎' : '🤖'}
                  </div>
                  <p className="text-gray-600">
                    {selectedPaymentMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay'} will be processed securely.
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hotel:</span>
                  <span className="font-medium">{hotel.name}</span>
                </div>
                
                {bookingData.checkIn && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span>{new Date(bookingData.checkIn).toLocaleDateString()}</span>
                  </div>
                )}
                
                {bookingData.checkOut && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span>{new Date(bookingData.checkOut).toLocaleDateString()}</span>
                  </div>
                )}
                
                {bookingData.guests && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span>{bookingData.guests}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per night:</span>
                  <span>${hotel.pricing[0]?.discountedPrice || 100}</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${bookingData.totalPrice}</span>
                </div>
              </div>
              
              <CustomButton
                onClick={handleSubmit(onSubmit)}
                title={processingPayment ? "Processing..." : "Confirm Booking"}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                disabled={processingPayment}
              />
              
              {processingPayment && (
                <div className="flex items-center justify-center mt-4">
                  <Spinner size="sm" className="mr-2" />
                  <span className="text-sm text-gray-600">Processing payment...</span>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onClose={handleSuccessModalClose} size="md">
        <Modal.Header>Booking Successful!</Modal.Header>
        <Modal.Body>
          <div className="space-y-4 p-2 md:p-4">
            <PaymentReceipt receipt={paymentReceipt} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleSuccessModalClose}>
            Go to My Bookings
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BookHotel; 