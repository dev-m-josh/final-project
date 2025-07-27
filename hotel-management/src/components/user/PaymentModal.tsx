import React, { useState } from 'react';
import { X, CreditCard, Shield } from 'lucide-react';
import type { BookingType } from '../../features/bookingsSlice';
import { ToastContainer, toast } from "react-toastify";

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

        onSuccess(paymentData);
        toast.success("Payment completed successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error("Payment failed. Please try again.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
          />
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                  onClick={onClose}
                  className="absolute z-10 p-2 transition-colors duration-200 bg-white rounded-full shadow-lg top-4 right-4 hover:bg-gray-100"
              >
                  <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="grid gap-0 md:grid-cols-2">
                  {/* Booking Summary Side */}
                  <div className="p-8 text-white bg-gradient-to-br from-blue-600 to-indigo-600">
                      <h2 className="mb-6 text-2xl font-bold">Payment Summary</h2>

                      <div className="p-4 mb-6 rounded-lg bg-white/10">
                          <h3 className="mb-3 text-lg font-semibold">Booking Details</h3>
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

                      <div className="p-4 rounded-lg bg-white/10">
                          <h3 className="mb-3 text-lg font-semibold">Payment Breakdown</h3>
                          <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                  <span>Room Rate ({calculateNights()} nights):</span>
                                  <span>{formatCurrency(booking.totalAmount * 0.85)}</span>
                              </div>
                              <div className="flex justify-between">
                                  <span>Taxes & Fees:</span>
                                  <span>{formatCurrency(booking.totalAmount * 0.15)}</span>
                              </div>
                              <div className="pt-2 mt-2 border-t border-white/20">
                                  <div className="flex justify-between text-lg font-bold">
                                      <span>Total Amount:</span>
                                      <span>{formatCurrency(booking.totalAmount)}</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="flex items-center mt-6 text-blue-100">
                          <Shield className="w-5 h-5 mr-2" />
                          <span className="text-sm">Your payment is secured with 256-bit SSL encryption</span>
                      </div>
                  </div>

                  {/* Payment Form Side */}
                  <div className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                          <div>
                              <h3 className="mb-4 text-xl font-semibold text-gray-900">Payment Information</h3>

                              {/* Payment Method */}
                              <div className="mb-6">
                                  <label className="block mb-2 text-sm font-medium text-gray-700">Payment Method</label>
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
                              <div className="p-6 rounded-lg bg-gray-50">
                                  <h4 className="mb-4 text-lg font-semibold text-gray-900">Confirm Payment</h4>
                                  <div className="space-y-3">
                                      <div className="flex justify-between">
                                          <span className="text-gray-600">Booking ID:</span>
                                          <span className="font-medium">#{booking.bookingId}</span>
                                      </div>
                                      <div className="flex justify-between">
                                          <span className="text-gray-600">Payment Method:</span>
                                          <span className="font-medium capitalize">
                                              {paymentMethod.replace("_", " ")}
                                          </span>
                                      </div>
                                      <div className="flex justify-between">
                                          <span className="text-gray-600">Amount:</span>
                                          <span className="text-lg font-bold text-green-600">
                                              {formatCurrency(booking.totalAmount)}
                                          </span>
                                      </div>
                                  </div>
                              </div>

                              {/* Terms and Conditions */}
                              <div className="p-4 rounded-lg bg-blue-50">
                                  <div className="flex items-start">
                                      <input type="checkbox" id="terms" required className="mt-1 mr-3" />
                                      <label htmlFor="terms" className="text-sm text-gray-700">
                                          I agree to the{" "}
                                          <span className="text-blue-600 underline cursor-pointer">
                                              Terms and Conditions
                                          </span>{" "}
                                          and
                                          <span className="text-blue-600 underline cursor-pointer">
                                              {" "}
                                              Privacy Policy
                                          </span>
                                          . I understand that this payment is non-refundable.
                                      </label>
                                  </div>
                              </div>
                          </div>

                          {/* Submit Button */}
                          <div className="flex pt-4 space-x-4">
                              <button
                                  type="submit"
                                  disabled={loading}
                                  className="flex items-center justify-center flex-1 px-6 py-3 font-semibold text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                              >
                                  {loading ? (
                                      <>
                                          <div className="w-5 h-5 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                                          Processing Payment...
                                      </>
                                  ) : (
                                      <>
                                          <CreditCard className="w-5 h-5 mr-2" />
                                          Pay {formatCurrency(booking.totalAmount)}
                                      </>
                                  )}
                              </button>
                              <button
                                  type="button"
                                  onClick={onClose}
                                  className="px-6 py-3 font-semibold text-gray-700 transition-colors duration-200 border border-gray-300 rounded-lg hover:bg-gray-50"
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