import React, { useState } from "react";
import { Edit, Trash2, Eye, Search, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { SupportTicketType, SupportTicketStatus } from "../../features/supportTickets";

interface TicketTableProps {
    tickets: SupportTicketType[];
    loading: boolean;
    onEdit: (ticket: SupportTicketType) => void;
    onDelete: (ticketId: number) => void;
    onView: (ticket: SupportTicketType) => void;
    onAdd: () => void;
}

const TicketTable: React.FC<TicketTableProps> = ({ tickets, loading, onEdit, onDelete, onView, onAdd }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;

    return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status: SupportTicketStatus) => {
        switch (status) {
            case "Open":
                return <AlertCircle className="w-4 h-4" />;
            case "In Progress":
                return <Clock className="w-4 h-4" />;
            case "Resolved":
                return <CheckCircle className="w-4 h-4" />;
            case "Closed":
                return <XCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: SupportTicketStatus) => {
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="animate-pulse">
                    <div className="h-8 mb-4 bg-gray-200 rounded"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
                    <button
                        onClick={onAdd}
                        className="inline-flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Ticket
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
                    <div className="relative">
                        <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>

                    <div className="flex items-center text-sm text-gray-500">
                        Showing {filteredTickets.length} of {tickets.length} tickets
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Ticket Details
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                User ID
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Created
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Updated
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTickets.map((ticket) => (
                            <tr key={ticket.ticketId} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                                        <div className="max-w-xs text-sm text-gray-500 truncate">
                                            {ticket.description}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">#{ticket.userId}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                            ticket.status
                                        )}`}
                                    >
                                        {getStatusIcon(ticket.status)}
                                        <span className="ml-1">{ticket.status}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {formatDate(ticket.createdAt)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {formatDate(ticket.updatedAt)}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onView(ticket)}
                                            className="p-1 text-gray-600 transition-colors rounded hover:text-gray-900"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(ticket)}
                                            className="p-1 text-blue-600 transition-colors rounded hover:text-blue-900"
                                            title="Edit Ticket"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(ticket.ticketId)}
                                            className="p-1 text-red-600 transition-colors rounded hover:text-red-900"
                                            title="Delete Ticket"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredTickets.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="text-gray-500">
                            {searchTerm || filterStatus !== "all"
                               ? "No tickets match your search criteria."
                                : "No support tickets found."}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketTable;
