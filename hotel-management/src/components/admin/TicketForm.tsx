import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type {
    SupportTicketType,
    NewSupportTicketType,
    UpdateSupportTicketType,
    SupportTicketStatus,
} from "../../features/supportTickets";

interface TicketFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (ticket: NewSupportTicketType | UpdateSupportTicketType) => void;
    ticket?: SupportTicketType | null;
    loading?: boolean;
}

const TicketForm: React.FC<TicketFormProps> = ({ isOpen, onClose, onSubmit, ticket, loading }) => {
    const [userId, setUserId] = useState(0);
    useEffect(() => {
        const user = localStorage.getItem("myUser");
        const userId = user && JSON.parse(user).userId;
        setUserId(userId);
    }, [userId]);

    console.log(userId);

    const [formData, setFormData] = useState({
        userId: userId,
        subject: "",
        description: "",
        status: "Open" as SupportTicketStatus,
    });

    useEffect(() => {
        if (ticket) {
            setFormData({
                userId: ticket.userId,
                subject: ticket.subject,
                description: ticket.description,
                status: ticket.status,
            });
        } else {
            setFormData({
                userId: userId,
                subject: "",
                description: "",
                status: "Open",
            });
        }
    }, [ticket]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (ticket) {
            onSubmit({ ...formData, ticketId: ticket.ticketId } as UpdateSupportTicketType);
        } else {
            onSubmit(formData as NewSupportTicketType);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600 bg-opacity-75">
            <div className="w-full max-w-md overflow-y-auto bg-white rounded-lg shadow-xl max-h-90vh">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        {ticket ? "Edit Support Ticket" : "Add New Support Ticket"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 transition-colors duration-150 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">User ID</label>
                        <input
                            type="number"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Brief description of the issue"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Detailed description of the issue..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors duration-150 bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && (
                                <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                            )}
                            {ticket ? "Update Ticket" : "Add Ticket"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TicketForm;
