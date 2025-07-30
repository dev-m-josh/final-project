import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchHotels, hotelDetails, type HotelType } from '../../features/hotelsAuth';
import { MapPin, Star, Phone, Loader2, Calendar, X } from 'lucide-react';
import BookingForm from '../BookingForm';
import BookingSuccess from '../BookingSuccess';
import { useNavigate } from "react-router-dom";

const Hotels = () => {
    const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { hotels, loading, error, selectedHotel } = useAppSelector((state) => state.hotels);
  const [showPopup, setShowPopup] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState<HotelType | null>(null);
  // Define a type for booking details matching BookingSuccessProps
  type BookingDetailsType = {
    guestName: string;
    email: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    roomType: string;
    totalAmount: number;
  };
  const [bookingDetails, setBookingDetails] = useState<BookingDetailsType | null>(null);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating) || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= numRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  const HotelCard = ({ hotel }: { hotel: HotelType }) => (
      <div
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
          data-testid={`hotel-card-${hotel.hotelId}`}
      >
          <div className="relative h-64 overflow-hidden">
              <img
                  src={
                      hotel.imageUrl ||
                      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800"
                  }
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                  <span className="text-sm font-semibold text-gray-800">{hotel.category}</span>
              </div>
          </div>

          <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                  <h3
                      className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200"
                      data-testid={`hotel-name-${hotel.hotelId}`}
                  >
                      {hotel.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                      {renderStars(hotel.rating)}
                      <span className="text-sm text-gray-600 ml-1" data-testid={`hotel-rating-${hotel.hotelId}`}>
                          ({hotel.rating})
                      </span>
                  </div>
              </div>

              <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm" data-testid={`hotel-location-${hotel.hotelId}`}>
                      {hotel.location}
                  </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.address}</p>

              <div className="flex items-center text-gray-600 mb-4">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm" data-testid={`hotel-phone-${hotel.hotelId}`}>
                      {hotel.contactPhone}
                  </span>
              </div>

              <div className="flex flex-col space-y-3 md:flex-column md:space-y-2">
                  <button
                      onClick={() => handleBookNow(hotel)}
                      data-testid={`book-now-${hotel.hotelId}`}
                      className="cursor-pointer flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center md: w-full"
                  >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Now
                  </button>
                  <button
                      onClick={() => handleViewDetails(hotel)}
                      data-testid={`view-details-${hotel.hotelId}`}
                      className="cursor-pointer px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 md:w-full"
                  >
                      View Details
                  </button>
              </div>
          </div>
      </div>
  );

  const handleViewDetails = (hotel: HotelType) => {
    dispatch(hotelDetails(hotel.hotelId));
    setShowPopup(true);
  };

  const handleBookNow = (hotel: HotelType) => {
    setSelectedHotelForBooking(hotel);
    setShowBookingForm(true);
  };

  const handleBookingSuccess = (details: BookingDetailsType) => {
    setBookingDetails(details);
    setShowBookingForm(false);
    setShowBookingSuccess(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const closeBookingForm = () => {
    setShowBookingForm(false);
    setSelectedHotelForBooking(null);
  };

  const closeBookingSuccess = () => {
    setShowBookingSuccess(false);
    setBookingDetails(null);
    setSelectedHotelForBooking(null);
  };

  return (
      <section
          id="hotels"
          className={`w-full py-20 bg-gray-50 min-h-screen relative ${
              showPopup || showBookingForm || showBookingSuccess ? "overflow-hidden" : ""
          }`}
      >
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div
                  className={`text-center mb-12 transition-all duration-300 ${
                      showPopup || showBookingForm || showBookingSuccess ? "blur-sm" : ""
                  }`}
              >
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Hotel</h1>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      Discover amazing hotels worldwide and book your perfect room with ease. Compare prices, read
                      reviews, and enjoy seamless booking experiences.
                  </p>
              </div>

              {/* Loading State */}
              {loading && !showPopup && !showBookingForm && !showBookingSuccess && (
                  <div className="flex justify-center items-center py-20" data-testid="loading-state">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">Loading hotels...</span>
                  </div>
              )}

              {/* Error State */}
              {error && !showPopup && !showBookingForm && !showBookingSuccess && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                      <p className="text-red-600">{error}</p>
                      <button
                          onClick={() => dispatch(fetchHotels())}
                          className="cursor-pointer mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                          Try Again
                      </button>
                  </div>
              )}

              {/* Hotels Grid */}
              {!loading && !error && (
                  <>
                      {hotels.length > 0 ? (
                          <div
                              className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-300 ${
                                  showPopup || showBookingForm || showBookingSuccess ? "blur-sm" : ""
                              }`}
                          >
                              {hotels.map((hotel) => (
                                  <HotelCard key={hotel.hotelId} hotel={hotel} />
                              ))}
                          </div>
                      ) : (
                          <div
                              className={`text-center py-20 transition-all duration-300 ${
                                  showPopup || showBookingForm || showBookingSuccess ? "blur-sm" : ""
                              }`}
                          >
                              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels found</h3>
                              <p className="text-gray-600">No hotels are currently available.</p>
                          </div>
                      )}
                  </>
              )}
          </div>

          {/* Hotel Details Popup */}
          {showPopup && selectedHotel && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closePopup}></div>
                  <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                      {/* Close Button */}
                      <button
                          onClick={closePopup}
                          className="cursor-pointer absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                          <X className="h-5 w-5 text-gray-600" />
                      </button>

                      {/* Hotel Image */}
                      <div className="relative h-64 overflow-hidden rounded-t-2xl">
                          <img
                              src={
                                  selectedHotel.imageUrl ||
                                  "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800"
                              }
                              alt={selectedHotel.name}
                              className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
                              <span className="text-sm font-semibold text-gray-800">{selectedHotel.category}</span>
                          </div>
                      </div>

                      {/* Hotel Details */}
                      <div className="p-8">
                          <div className="flex justify-between items-start mb-6">
                              <h2 className="text-3xl font-bold text-gray-900" data-testid="details-name">
                                  {selectedHotel.name}
                              </h2>
                              <div className="flex items-center space-x-1">
                                  {renderStars(selectedHotel.rating)}
                                  <span className="text-lg font-semibold text-gray-700 ml-2">
                                      ({selectedHotel.rating})
                                  </span>
                              </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6 mb-8">
                              <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Contact</h3>
                                  <div className="space-y-3">
                                      <div className="flex items-start">
                                          <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                                          <div>
                                              <p className="font-medium text-gray-900" data-testid="details-location">
                                                  {selectedHotel.location}
                                              </p>
                                              <p className="text-gray-600 text-sm" data-testid="details-address">
                                                  {selectedHotel.address}
                                              </p>
                                          </div>
                                      </div>
                                      <div className="flex items-center">
                                          <Phone className="h-5 w-5 text-blue-600 mr-3" />
                                          <span className="text-gray-700" data-testid="details-phone">
                                              {selectedHotel.contactPhone}
                                          </span>
                                      </div>
                                  </div>
                              </div>

                              <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Information</h3>
                                  <div className="space-y-3">
                                      <div className="flex justify-between">
                                          <span className="text-gray-600">Category:</span>
                                          <span className="font-medium text-gray-900" data-testid="details-category">
                                              {selectedHotel.category}
                                          </span>
                                      </div>
                                      <div className="flex justify-between">
                                          <span className="text-gray-600">Rating:</span>
                                          <span className="font-medium text-gray-900" data-testid="details-rating">
                                              {selectedHotel.rating}/5
                                          </span>
                                      </div>
                                      <div className="flex justify-between">
                                          <span className="text-gray-600">Hotel ID:</span>
                                          <span className="font-medium text-gray-900" data-testid="details-hotel-id">
                                              #{selectedHotel.hotelId}
                                          </span>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-4 justify-end">
                              <button className="cursor-pointer px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-semibold"
                              onClick={() => navigate("/hotels")}>
                                  Back
                              </button>
                              <button
                                  onClick={() => handleBookNow(selectedHotel)}
                                  data-testid="details-book-now"
                                  className="cursor-pointer  bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-semibold"
                              >
                                  <Calendar className="h-5 w-5 mr-2" />
                                  Book Now
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* Booking Form Modal */}
          {showBookingForm && selectedHotelForBooking && (
              <BookingForm
                  data-testid="booking-form"
                  hotel={selectedHotelForBooking}
                  onClose={closeBookingForm}
                  onSuccess={handleBookingSuccess}
              />
          )}

          {/* Booking Success Modal */}
          {showBookingSuccess && selectedHotelForBooking && bookingDetails && (
              <BookingSuccess
                  data-testid="booking-success"
                  hotel={selectedHotelForBooking}
                  bookingDetails={bookingDetails}
                  onClose={closeBookingSuccess}
              />
          )}
      </section>
  );
};

export default Hotels;