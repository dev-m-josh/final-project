import React, { useState } from 'react';
import { X, CreditCard, Shield } from 'lucide-react';
import type { BookingType } from '../../features/bookingsSlice';

interface PaymentModalProps {
  booking: BookingType;
  onClose: () => void;
  onSuccess: (paymentData: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ booking, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNights = () => {
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const generateTransactionId = () => {
    return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate payment data
      const paymentData = {
          bookingId: booking.bookingId,
          userId: booking.userId,
          amount: booking.totalAmount,
          paymentMethod: paymentMethod,
          transactionId: generateTransactionId(),
      };

      console.log(booking)
      console.log(paymentData)

      onSuccess(paymentData);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Booking Summary Side */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Payment Summary</h2>

            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Booking ID:</span>
                  <span>#{booking.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Room ID:</span>
                  <span>#{booking.roomId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span>{formatDate(booking.checkInDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span>{formatDate(booking.checkOutDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nights:</span>
                  <span>{calculateNights()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Payment Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Room Rate ({calculateNights()} nights):</span>
                  <span>{formatCurrency(booking.totalAmount * 0.85)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Fees:</span>
                  <span>{formatCurrency(booking.totalAmount * 0.15)}</span>
                </div>
                <div className="border-t border-white/20 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(booking.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center text-blue-100">
              <Shield className="h-5 w-5 mr-2" />
              <span className="text-sm">Your payment is secured with 256-bit SSL encryption</span>
            </div>
          </div>

          {/* Payment Form Side */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h3>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="mobile_money">Mobile Money</option>
                  </select>
                </div>

                {/* Payment Confirmation */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Confirm Payment</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID:</span>
                      <span className="font-medium">#{booking.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium capitalize">{paymentMethod.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-lg text-green-600">{formatCurrency(booking.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 mr-3"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I agree to the <span className="text-blue-600 underline cursor-pointer">Terms and Conditions</span> and
                      <span className="text-blue-600 underline cursor-pointer"> Privacy Policy</span>.
                      I understand that this payment is non-refundable.
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-semibold disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Pay {formatCurrency(booking.totalAmount)}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;