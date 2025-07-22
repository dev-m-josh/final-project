import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchBookingsByUserId, updateBooking, type BookingType } from "../../features/bookingsSlice";
import { fetchPayments, addPayment, type NewPaymentType } from "../../features/paymentSlice";
import UserSidebar from "../user/UserSidebar";
import UserHeader from "../user/UserHeader";
import UserBookings from "../user/UserBookings";
import UserPayments from "../user/UserPayments";
import UserProfile from "../user/UserProfile";
import PaymentModal from "../user/PaymentModal";

const UserDashboard = () => {
    const dispatch = useAppDispatch();
    const { bookings, loading: bookingsLoading, error: bookingsError } = useAppSelector((state) => state.bookings);
    const { payments, loading: paymentsLoading, error: paymentsError } = useAppSelector((state) => state.payments);

    // Mock current user - in real app, get from auth context
    const currentUser = JSON.parse(localStorage.getItem("myUser") || "{}");

    const [activeTab, setActiveTab] = useState("bookings");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);

    useEffect(() => {
        // Fetch user's bookings and payments
        dispatch(fetchBookingsByUserId(currentUser.userId.toString()));
        dispatch(fetchPayments());
    }, [dispatch, currentUser.userId]);

    const handleMakePayment = (booking: BookingType) => {
        setSelectedBooking(booking);
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async (paymentData: { paymentMethod: string; transactionId: string }) => {
        if (!selectedBooking) return;

        try {
            // Create payment record
            const newPayment: NewPaymentType = {
                bookingId: selectedBooking.bookingId,
                userId: currentUser.userId,
                amount: selectedBooking.totalAmount.toString(),
                isPaid: true,
                paymentMethod: paymentData.paymentMethod,
                transactionId: paymentData.transactionId,
                paymentDate: new Date().toISOString(),
            };

            await dispatch(addPayment(newPayment)).unwrap();

            // Update booking status to confirmed
            const updatedBooking: BookingType = {
                ...selectedBooking,
                isConfirmed: true,
                updatedAt: new Date().toISOString()  ,
            };

            await dispatch(updateBooking(updatedBooking)).unwrap();

            // Close modal and refresh data
            setShowPaymentModal(false);
            setSelectedBooking(null);
            dispatch(fetchBookingsByUserId(currentUser.userId.toString()));
            dispatch(fetchPayments());
        } catch (error) {
            console.error("Payment failed:", error);
            alert("Payment failed. Please try again.");
        }
    };

    // Filter payments for current user
    const userPayments = payments.filter((payment) => payment.userId === currentUser.userId);

    const renderContent = () => {
        switch (activeTab) {
            case "bookings":
                return (
                    <UserBookings
                        bookings={bookings}
                        loading={bookingsLoading}
                        error={bookingsError}
                        onMakePayment={handleMakePayment}
                    />
                );
            case "payments":
                return <UserPayments payments={userPayments} loading={paymentsLoading} error={paymentsError} />;
            case "profile":
                return <UserProfile user={currentUser} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <div className="flex-1 ml-64">
                {/* Header */}
                <UserHeader activeTab={activeTab} userName={currentUser.name} />

                {/* Content */}
                <main className="p-6">{renderContent()}</main>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedBooking && (
                <PaymentModal
                    booking={selectedBooking}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setSelectedBooking(null);
                    }}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default UserDashboard;
