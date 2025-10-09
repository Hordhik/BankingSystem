import React, { useState } from 'react';
import '../SupportTicket/SupportTicket.css';
import { FiPlus, FiMessageSquare, FiChevronLeft } from 'react-icons/fi';

// --- MOCK DATA ---
// In a real application, this would come from an API call.
const mockTickets = [
    { id: '#84315', subject: 'Issue with recent fund transfer', lastUpdated: '2025-10-08', status: 'Open' },
    { id: '#84299', subject: 'Cannot log in on mobile app', lastUpdated: '2025-10-05', status: 'Closed' },
    { id: '#84250', subject: 'Question about monthly statement', lastUpdated: '2025-09-28', status: 'Closed' },
];

// --- CREATE TICKET FORM COMPONENT ---
const CreateTicketForm = ({ onCancel }) => (
    <div className="create-ticket-form">
        <div className="form-header">
            <button onClick={onCancel} className="back-button"><FiChevronLeft /> Back to Tickets</button>
            <h2>Create New Support Ticket</h2>
            <p>Please provide as much detail as possible so we can assist you promptly.</p>
        </div>
        <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category">
                <option>Transaction Issue</option>
                <option>Account Access</option>
                <option>Technical Problem</option>
                <option>General Inquiry</option>
            </select>
        </div>
        <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" name="subject" placeholder="e.g., Unauthorized transaction on my account" />
        </div>
        <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows="8" placeholder="Please describe the issue in detail..."></textarea>
        </div>
        <div className="form-actions">
            <button className="cancel-button" onClick={onCancel}>Cancel</button>
            <button className="save-button">Submit Ticket</button>
        </div>
    </div>
);

// --- TICKET LIST COMPONENT ---
const TicketList = ({ tickets, onCreate }) => (
    <div>
        <div className="page-header">
            <h1 className="main-title">Support Tickets</h1>
            <button className="create-ticket-button" onClick={onCreate}>
                <FiPlus /> Create New Ticket
            </button>
        </div>
        <div className="tickets-list">
            {tickets.map(ticket => (
                <div key={ticket.id} className="ticket-card">
                    <div className="ticket-icon">
                        <FiMessageSquare />
                    </div>
                    <div className="ticket-details">
                        <span className="ticket-id">{ticket.id}</span>
                        <h3 className="ticket-subject">{ticket.subject}</h3>
                        <p className="ticket-date">Last updated: {ticket.lastUpdated}</p>
                    </div>
                    <div className="ticket-status-wrapper">
                         <span className={`ticket-status status-${ticket.status.toLowerCase()}`}>{ticket.status}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


// --- MAIN SUPPORT TICKETS COMPONENT ---
const SupportTickets = () => {
    const [view, setView] = useState('list'); // 'list' or 'create'

    return (
        <div className="support-tickets-container">
            {view === 'list' ? (
                <TicketList tickets={mockTickets} onCreate={() => setView('create')} />
            ) : (
                <CreateTicketForm onCancel={() => setView('list')} />
            )}
        </div>
    );
};

export default SupportTickets;