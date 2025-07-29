import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { RoomType, NewRoomType, UpdateRoomType } from '../../features/roomsSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchHotels } from "../../features/hotelsAuth";

interface RoomFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (room: NewRoomType | UpdateRoomType) => void;
    room?: RoomType | null;
    loading?: boolean;
    hotels: { hotelId: number; name: string }[];
}

const RoomsForm: React.FC<RoomFormProps> = ({ isOpen, onClose, onSubmit, room, loading }) => {
const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    hotelId: 1,
    roomType: '',
    pricePerNight: '',
    capacity: 1,
    amenities: '',
    isAvailable: true,
  });

    const { hotels } = useAppSelector((state) => state.hotels);
  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  useEffect(() => {
    if (room) {
      setFormData({
        hotelId: room.hotelId,
        roomType: room.roomType,
        pricePerNight: room.pricePerNight,
        capacity: room.capacity,
        amenities: room.amenities,
        isAvailable: room.isAvailable,
      });
    } else {
      setFormData({
        hotelId: 1,
        roomType: '',
        pricePerNight: '',
        capacity: 1,
        amenities: '',
        isAvailable: true,
      });
    }
  }, [room]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (room) {
      onSubmit({ ...formData, roomId: room.roomId } as UpdateRoomType);
    } else {
      onSubmit(formData as NewRoomType);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked
               : type === 'number' ? Number(value)
               : value
    }));
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600 bg-opacity-75">
          <div className="w-full max-w-md overflow-y-auto bg-white rounded-lg shadow-xl max-h-90vh">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">{room ? "Edit Room" : "Add New Room"}</h3>
                  <button
                      onClick={onClose}
                      className="text-gray-400 transition-colors duration-150 hover:text-gray-600"
                  >
                      <X className="w-6 h-6" />
                  </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <select
                      name="hotelId"
                      value={formData.hotelId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                  >
                      <option value="">Select hotel</option>
                      {hotels.map((hotel) => (
                          <option key={hotel.hotelId} value={hotel.hotelId}>
                              {hotel.name}
                          </option>
                      ))}
                  </select>

                  <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Room Type</label>
                      <select
                          name="roomType"
                          value={formData.roomType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                      >
                          <option value="">Select room type</option>
                          <option value="Standard">Standard</option>
                          <option value="Deluxe">Deluxe</option>
                          <option value="Suite">Suite</option>
                          <option value="Presidential">Presidential</option>
                      </select>
                  </div>

                  <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Price per Night ($)</label>
                      <input
                          type="text"
                          name="pricePerNight"
                          value={formData.pricePerNight}
                          onChange={handleChange}
                          placeholder="150.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                      />
                  </div>

                  <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Capacity</label>
                      <input
                          type="number"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          min="1"
                          max="10"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                      />
                  </div>

                  <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                          Amenities (<i>enter comma separated items</i>)
                      </label>
                      <textarea
                          name="amenities"
                          value={formData.amenities}
                          onChange={handleChange}
                          rows={3}
                          placeholder="WiFi, Air Conditioning, Room Service... "
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                      />
                  </div>

                  <div className="flex items-center">
                      <input
                          type="checkbox"
                          name="isAvailable"
                          checked={formData.isAvailable}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">Room is available</label>
                  </div>

                  <div className="flex justify-end pt-4 space-x-3">
                      <button
                          type="button"
                          onClick={onClose}
                          className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
                      >
                          Cancel
                      </button>
                      <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors duration-150 bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {loading && (
                              <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full cursor-pointer animate-spin">
                                  Loading
                              </div>
                          )}
                          Save
                      </button>
                  </div>
              </form>
          </div>
      </div>
  );}

export default RoomsForm