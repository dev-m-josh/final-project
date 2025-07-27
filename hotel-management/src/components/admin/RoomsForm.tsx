import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { RoomType, NewRoomType, UpdateRoomType } from '../../features/roomsSlice';

interface RoomFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (room: NewRoomType | UpdateRoomType) => void;
  room?: RoomType | null;
  loading?: boolean;
}

const RoomsForm: React.FC<RoomFormProps> = ({ isOpen, onClose, onSubmit, room, loading }) => {
  const [formData, setFormData] = useState({
    hotelId: 1,
    roomType: '',
    pricePerNight: '',
    capacity: 1,
    amenities: '',
    isAvailable: true,
  });

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
    <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {room ? 'Edit Room' : 'Add New Room'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hotel ID
            </label>
            <input
              type="number"
              name="hotelId"
              value={formData.hotelId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Type
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Night ($)
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
            <label className="ml-2 text-sm text-gray-700">
              Room is available
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2">Loading</div>
              )}
              Save
            </button>
        </div>
    </form>
    </div>
</div>
)}

export default RoomsForm