import React, { useState, useEffect } from 'react';
import { getCardApplications, approveCardApplication, rejectCardApplication } from '../../../services/adminApi';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import './CardRequests.css';

const CardRequests = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const data = await getCardApplications();
            console.log("Fetched applications:", data);
            setApplications(data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (window.confirm("Are you sure you want to approve this application?")) {
            try {
                await approveCardApplication(id);
                alert("Application approved!");
                fetchApplications();
            } catch (error) {
                alert("Failed to approve application");
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm("Are you sure you want to reject this application?")) {
            try {
                await rejectCardApplication(id);
                alert("Application rejected!");
                fetchApplications();
            } catch (error) {
                alert("Failed to reject application");
            }
        }
    };

    if (loading) return <div>Loading requests...</div>;

    return (
        <div className="card-requests-container">
            <h2>Card Applications</h2>
            <div className="requests-table">
                <div className="table-header">
                    <div>User</div>
                    <div>Card Type</div>
                    <div>Network</div>
                    <div>Status</div>
                    <div>Date</div>
                    <div>Actions</div>
                </div>
                <div className="table-body">
                    {applications.length > 0 ? (
                        applications.map(app => (
                            <div key={app.id} className="table-row">
                                <div>{app.user.fullname}</div>
                                <div>{app.cardType}</div>
                                <div>{app.network}</div>
                                <div>
                                    <span className={`status-badge ${app.status.toLowerCase()}`}>
                                        {app.status}
                                    </span>
                                </div>
                                <div>{new Date(app.createdAt).toLocaleDateString()}</div>
                                <div className="actions">
                                    {app.status === 'PENDING' && (
                                        <>
                                            <button className="btn-approve" onClick={() => handleApprove(app.id)}>
                                                <CheckCircle size={18} />
                                            </button>
                                            <button className="btn-reject" onClick={() => handleReject(app.id)}>
                                                <XCircle size={18} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No card applications found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardRequests;
