import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
    fetchSupportTickets,
    addSupportTicket,
    updateSupportTicket,
    deleteSupportTicket,
} from "../../features/supportTickets.ts";
import type { SupportTicketType, NewSupportTicketType, UpdateSupportTicketType } from "../../features/supportTickets";
import TicketTable from "./TicketTable";
import TicketForm from "./TicketForm";
import { X } from "lucide-react";

const SupportTickets: React.FC = () => {
    const dispatch = useAppDispatch();
    const { tickets, loading, error } = useAppSelector((state) => state.supportTickets);
    const [showForm, setShowForm] = useState(false);
    const [editingTicket, setEditingTicket] = useState<SupportTicketType | null>(null);
    const [viewingTicket, setViewingTicket] = useState<SupportTicketType | null>(null);

    useEffect(() => {
        dispatch(fetchSupportTickets());
    }, [dispatch]);

    const handleAddTicket = () => {
        setEditingTicket(null);
        setShowForm(true);
    };

    const handleEditTicket = (ticket: SupportTicketType) => {
        setEditingTicket(ticket);
        setShowForm(true);
    };

    const handleViewTicket = (ticket: SupportTicketType) => {
        setViewingTicket(ticket);
    };

    const handleDeleteTicket = async (ticketId: number) => {
        if (window.confirm("Are you sure you want to delete this support ticket?")) {
            await dispatch(deleteSupportTicket(ticketId));
        }
    };

    const handleFormSubmit = async (ticketData: NewSupportTicketType | UpdateSupportTicketType) => {
        if (editingTicket) {
            await dispatch(updateSupportTicket(ticketData as UpdateSupportTicketType));
        } else {
            await dispatch(addSupportTicket(ticketData as NewSupportTicketType));
        }
        setShowForm(false);
        setEditingTicket(null);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingTicket(null);
    };

    const handleCloseView = () => {
        setViewingTicket(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Open":
                return "bg-red-100 text-red-800";
            case "In Progress":
                return "bg-yellow-100 text-yellow-800";
            case "Resolved":
                return "bg-green-100 text-green-800";
            case "Closed":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
                    <p className="mt-1 text-gray-600">Manage customer support requests and issues</p>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="text-red-800">{error}</div>
                </div>
            )}

            {/* Tickets Table */}
            <TicketTable
                tickets={tickets}
                loading={loading}
                onAdd={handleAddTicket}
                onEdit={handleEditTicket}
                onView={handleViewTicket}
                onDelete={handleDeleteTicket}
            />

            {/* Ticket Form Modal */}
            <TicketForm
                isOpen={showForm}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
                ticket={editingTicket}
                loading={loading}
            />

            {/* Ticket View Modal */}
            {viewingTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600 bg-opacity-75">
                    <div className="w-full max-w-2xl overflow-y-auto bg-white rounded-lg shadow-xl max-h-90vh">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                Ticket Details - #{viewingTicket.ticketId}
                            </h3>
                            <button
                                onClick={handleCloseView}
                                className="text-gray-400 transition-colors duration-150 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <h4 className="mb-2 text-sm font-medium tracking-wider text-gray-500 uppercase">
                                        Ticket Information
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Ticket ID:</span>
                                            <span className="ml-2 text-sm text-gray-600">
                                                #{viewingTicket.ticketId}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">User ID:</span>
                                            <span className="ml-2 text-sm text-gray-600">#{viewingTicket.userId}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Status:</span>
                                            <span
                                                className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                    viewingTicket.status
                                                )}`}
                                            >
                                                {viewingTicket.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-2 text-sm font-medium tracking-wider text-gray-500 uppercase">
                                        Timeline
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Created:</span>
                                            <span className="ml-2 text-sm text-gray-600">
                                                {new Date(viewingTicket.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Last Updated:</span>
                                            <span className="ml-2 text-sm text-gray-600">
                                                {new Date(viewingTicket.updatedAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 text-sm font-medium tracking-wider text-gray-500 uppercase">
                                    Subject
                                </h4>
                                <div className="p-4 rounded-lg bg-gray-50">
                                    <p className="text-sm font-medium text-gray-900">{viewingTicket.subject}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 text-sm font-medium tracking-wider text-gray-500 uppercase">
                                    Description
                                </h4>
                                <div className="p-4 rounded-lg bg-gray-50">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {viewingTicket.description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        handleCloseView();
                                        handleEditTicket(viewingTicket);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white transition-colors duration-150 bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Edit Ticket
                                </button>
                                <button
                                    onClick={handleCloseView}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportTickets;
