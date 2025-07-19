import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  fetchHotels,
  addHotel,
  updateHotel,
  deleteHotel,
  type HotelType,
  type NewHotelType
} from '../../features/hotelsAuth';
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
  userDetails,
  type UserType,
  type NewUserType
} from '../../features/usersSlice';
import {
  fetchBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  bookingDetails,
  type BookingType,
  type NewBookingType
} from '../../features/bookingsSlice';

// Import components
import Sidebar from '../admin/Sidebar';
import Header from '../admin/Header';
import StatsCards from '../admin/StatsCards';
import HotelsTable from '../admin/HotelsTable';
import HotelForm from '../admin/HotelForm';
import CustomersTable from '../admin/CustomersTable';
import CustomerForm from '../admin/CustomerForm';
import CustomerDetails from '../admin/CustomerDetails';
import BookingsTable from '../admin/BookingsTable';
import BookingForm from '../admin/BookingForm';
import BookingDetails from '../admin/BookingDetails';
import Modal from '../admin/Modal';

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { hotels, loading, error } = useAppSelector((state) => state.hotels);
  const { users, loading: usersLoading, error: usersError, selectedUser } = useAppSelector((state) => state.users);
  const { bookings, loading: bookingsLoading, error: bookingsError, selectedBooking } = useAppSelector((state) => state.bookings);

  const [activeTab, setActiveTab] = useState('hotels');

  // Hotel states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<HotelType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<NewHotelType>({
    name: '',
    imageUrl: '',
    location: '',
    address: '',
    contactPhone: '',
    category: '',
    rating: '',
  });

  // Customer states
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<UserType | null>(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [customerFormData, setCustomerFormData] = useState<NewUserType>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    contactPhone: '',
    address: '',
    isAdmin: 'false',
    verificationCode: '',
    isVerified: 'false'
  });

  // Booking states
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [showEditBookingModal, setShowEditBookingModal] = useState(false);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingType | null>(null);
  const [bookingSearchTerm, setBookingSearchTerm] = useState('');
  const [bookingFormData, setBookingFormData] = useState<NewBookingType>({
    userId: 0,
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    totalAmount: 0,
    isConfirmed: false,
  });

  useEffect(() => {
    dispatch(fetchHotels());
    dispatch(fetchUsers());
    dispatch(fetchBookings());
  }, [dispatch]);

  // Hotel handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Customer handlers
  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerFormData(prev => ({ ...prev, [name]: value }));
  };

  // Booking handlers
  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingFormData(prev => ({
      ...prev,
      [name]: name === 'isConfirmed' ? value === 'true' :
               name === 'userId' || name === 'roomId' || name === 'totalAmount' ? Number(value) :
               value
    }));
  };

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(addHotel(formData)).unwrap();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add hotel:', error);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(addUser(customerFormData)).unwrap();
      setShowAddCustomerModal(false);
      resetCustomerForm();
    } catch (error) {
      console.error('Failed to add customer:', error);
    }
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(addBooking(bookingFormData)).unwrap();
      setShowAddBookingModal(false);
      resetBookingForm();
    } catch (error) {
      console.error('Failed to add booking:', error);
    }
  };

  const handleEditHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotel) return;

    try {
      const updatedHotel: HotelType = {
        ...editingHotel,
        ...formData,
        updatedAt: new Date().toISOString()
      };
      await dispatch(updateHotel(updatedHotel)).unwrap();
      setShowEditModal(false);
      setEditingHotel(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update hotel:', error);
    }
  };

  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    try {
      const updatedCustomer: UserType = {
        ...editingCustomer,
        ...customerFormData,
        updatedAt: new Date().toISOString()
      };
      await dispatch(updateUser(updatedCustomer)).unwrap();
      setShowEditCustomerModal(false);
      setEditingCustomer(null);
      resetCustomerForm();
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  const handleEditBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    try {
      const updatedBooking: BookingType = {
        ...editingBooking,
        ...bookingFormData,
        updatedAt: new Date().toISOString()
      };
      await dispatch(updateBooking(updatedBooking)).unwrap();
      setShowEditBookingModal(false);
      setEditingBooking(null);
      resetBookingForm();
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const handleDeleteHotel = async (hotelId: number) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await dispatch(deleteHotel(hotelId)).unwrap();
      } catch (error) {
        console.error('Failed to delete hotel:', error);
      }
    }
  };

  const handleDeleteCustomer = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
      } catch (error) {
        console.error('Failed to delete customer:', error);
      }
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await dispatch(deleteBooking(bookingId)).unwrap();
      } catch (error) {
        console.error('Failed to delete booking:', error);
      }
    }
  };

  const handleToggleBookingStatus = async (booking: BookingType) => {
    try {
      const updatedBooking: BookingType = {
        ...booking,
        isConfirmed: !booking.isConfirmed,
        updatedAt: new Date().toISOString()
      };
      await dispatch(updateBooking(updatedBooking)).unwrap();
    } catch (error) {
      console.error('Failed to toggle booking status:', error);
    }
  };

  const openEditModal = (hotel: HotelType) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      imageUrl: hotel.imageUrl,
      location: hotel.location,
      address: hotel.address,
      contactPhone: hotel.contactPhone,
      category: hotel.category,
      rating: hotel.rating,
    });
    setShowEditModal(true);
  };

  const openEditCustomerModal = (customer: UserType) => {
    setEditingCustomer(customer);
    setCustomerFormData({
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      password: customer.password,
      contactPhone: customer.contactPhone,
      address: customer.address,
      isAdmin: customer.isAdmin,
      verificationCode: customer.verificationCode,
      isVerified: customer.isVerified
    });
    setShowEditCustomerModal(true);
  };

  const handleViewCustomer = async (customer: UserType) => {
    await dispatch(userDetails(customer.userId));
    setShowCustomerDetails(true);
  };

  const openEditBookingModal = (booking: BookingType) => {
    setEditingBooking(booking);
    setBookingFormData({
      userId: booking.userId,
      roomId: booking.roomId,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      totalAmount: booking.totalAmount,
      isConfirmed: booking.isConfirmed,
    });
    setShowEditBookingModal(true);
  };

  const handleViewBooking = async (booking: BookingType) => {
    await dispatch(bookingDetails(booking.bookingId));
    setShowBookingDetails(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      imageUrl: '',
      location: '',
      address: '',
      contactPhone: '',
      category: '',
      rating: '',
    });
  };

  const resetCustomerForm = () => {
    setCustomerFormData({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      contactPhone: '',
      address: '',
      isAdmin: 'false',
      verificationCode: '',
      isVerified: 'false'
    });
  };

  const resetBookingForm = () => {
    setBookingFormData({
      userId: 0,
      roomId: '',
      checkInDate: '',
      checkOutDate: '',
      totalAmount: 0,
      isConfirmed: false,
    });
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingHotel(null);
    resetForm();
  };

  const handleCustomerCancel = () => {
    setShowAddCustomerModal(false);
    setShowEditCustomerModal(false);
    setEditingCustomer(null);
    resetCustomerForm();
  };

  const handleBookingCancel = () => {
    setShowAddBookingModal(false);
    setShowEditBookingModal(false);
    setEditingBooking(null);
    resetBookingForm();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <Header activeTab={activeTab} />

        {/* Content */}
        <main className="p-6">
          {activeTab === 'hotels' && (
            <>
              {/* Stats Cards */}
              <StatsCards hotelCount={hotels.length} customerCount={users.length} bookingsCount={bookings.length} />

              {/* Hotels Management */}
              <HotelsTable
                hotels={hotels}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddClick={() => setShowAddModal(true)}
                onEditClick={openEditModal}
                onDeleteClick={handleDeleteHotel}
                onRetry={() => dispatch(fetchHotels())}
              />
            </>
          )}

          {activeTab === 'bookings' && (
            <>
              {/* Stats Cards */}
              <StatsCards hotelCount={hotels.length} customerCount={users.length} bookingsCount={bookings.length} />

              {/* Bookings Management */}
              <BookingsTable
                bookings={bookings}
                loading={bookingsLoading}
                error={bookingsError}
                searchTerm={bookingSearchTerm}
                onSearchChange={setBookingSearchTerm}
                onAddClick={() => setShowAddBookingModal(true)}
                onEditClick={openEditBookingModal}
                onDeleteClick={handleDeleteBooking}
                onViewClick={handleViewBooking}
                onToggleStatus={handleToggleBookingStatus}
                onRetry={() => dispatch(fetchBookings())}
              />
            </>
          )}

          {activeTab === 'customers' && (
            <>
              {/* Stats Cards */}
              <StatsCards hotelCount={hotels.length} customerCount={users.length} bookingsCount={bookings.length} />

              {/* Customers Management */}
              <CustomersTable
                users={users}
                loading={usersLoading}
                error={usersError}
                searchTerm={customerSearchTerm}
                onSearchChange={setCustomerSearchTerm}
                onAddClick={() => setShowAddCustomerModal(true)}
                onEditClick={openEditCustomerModal}
                onDeleteClick={handleDeleteCustomer}
                onViewClick={handleViewCustomer}
                onRetry={() => dispatch(fetchUsers())}
              />
            </>
          )}

          {activeTab === 'settings' && (
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Settings</h2>
              <p className="text-gray-600">Settings functionality coming soon...</p>
            </div>
          )}
        </main>
      </div>

      {/* Add Hotel Modal */}
      <Modal isOpen={showAddModal} onClose={handleCancel}>
        <HotelForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleAddHotel}
          onCancel={handleCancel}
          title="Add New Hotel"
        />
      </Modal>

      {/* Edit Hotel Modal */}
      <Modal isOpen={showEditModal} onClose={handleCancel}>
        <HotelForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleEditHotel}
          onCancel={handleCancel}
          title="Edit Hotel"
        />
      </Modal>

      {/* Add Customer Modal */}
      <Modal isOpen={showAddCustomerModal} onClose={handleCustomerCancel}>
        <CustomerForm
          formData={customerFormData}
          onInputChange={handleCustomerInputChange}
          onSubmit={handleAddCustomer}
          onCancel={handleCustomerCancel}
          title="Add New Customer"
        />
      </Modal>

      {/* Edit Customer Modal */}
      <Modal isOpen={showEditCustomerModal} onClose={handleCustomerCancel}>
        <CustomerForm
          formData={customerFormData}
          onInputChange={handleCustomerInputChange}
          onSubmit={handleEditCustomer}
          onCancel={handleCustomerCancel}
          title="Edit Customer"
        />
      </Modal>

      {/* Add Booking Modal */}
      <Modal isOpen={showAddBookingModal} onClose={handleBookingCancel}>
        <BookingForm
          formData={bookingFormData}
          onInputChange={handleBookingInputChange}
          onSubmit={handleAddBooking}
          onCancel={handleBookingCancel}
          title="Add New Booking"
        />
      </Modal>

      {/* Edit Booking Modal */}
      <Modal isOpen={showEditBookingModal} onClose={handleBookingCancel}>
        <BookingForm
          formData={bookingFormData}
          onInputChange={handleBookingInputChange}
          onSubmit={handleEditBooking}
          onCancel={handleBookingCancel}
          title="Edit Booking"
        />
      </Modal>

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedUser && (
        <CustomerDetails
          customer={selectedUser}
          onClose={() => setShowCustomerDetails(false)}
        />
      )}

      {/* Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          onClose={() => setShowBookingDetails(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;