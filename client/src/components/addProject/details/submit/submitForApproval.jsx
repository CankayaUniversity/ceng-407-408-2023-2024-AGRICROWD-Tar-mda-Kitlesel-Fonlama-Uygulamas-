import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './submitForm.css';

const SubmitForm = () => {
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [remainingTime, setRemainingTime] = useState(15);
    const [userId, setUserID] = useState('');

    useEffect(() => {
        const authTokenFromCookie = Cookies.get('authToken');
        const fetchUserID = async () => {
            try {
                const response = await axios.post(
                    'http://localhost:3001/api/auth',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authTokenFromCookie}`,
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );
                if (response.data.user) {
                    setUserID(response.data.user._id);
                } else {
                    console.error("User not found");
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserID();
    }, []);

    useEffect(() => {
        let countdownInterval;

        if (remainingTime > 0) {
            countdownInterval = setInterval(() => {
                setRemainingTime(prevTime => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(countdownInterval);
                        return 0;
                    }
                });
            }, 1000);
        }

        return () => clearInterval(countdownInterval);
    }, [remainingTime]);

    const handleCheckboxChange = () => {
        setIsCheckboxChecked(!isCheckboxChecked);
    };

    const handleApprovalSubmit = async () => {
        try {
            const basicInfo = JSON.parse(localStorage.getItem(userId));
            const response = await axios.post('http://localhost:3001/api/admin/projects/add-pending', {
                userId,
                basicInfo
            });
            setSubmitMessage(response.data.message);
            setTimeout(() => {
                setSubmitMessage('');
            }, 15000);
            localStorage.removeItem(userId);
            localStorage.removeItem("isInformCompleted");
            localStorage.removeItem("isBasicsCompleted");
        } catch (error) {
            console.error('Error submitting project for approval:', error);
            setSubmitMessage('Bir hata oluştu, lütfen tekrar deneyin.');
        }
    };

    return (
        <div className="submit-form-container">
            <h2>Submit Your Project for Approval</h2>
            <div className="approval-info">
                {!isCheckboxChecked ? (
                    <p>
                        Please review the information you provided carefully. By checking the box below, you confirm that the information is accurate and complete. Upon submission, your project will be sent to Agricrowd for approval.
                    </p>
                ) : (
                    <p>
                        If everything is in order, your project will be approved and will appear in the Projects section. If there are any issues, you will be contacted with details. You can track the status of your project in the "My Projects" section of your dashboard.
                    </p>
                )}
            </div>
            <div className="form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="approvalCheckbox"
                    checked={isCheckboxChecked}
                    onChange={handleCheckboxChange}
                    disabled={remainingTime > 0 && !isCheckboxChecked}
                />
                <label className="form-check-label" htmlFor="approvalCheckbox">
                    {remainingTime > 0 ? `You can check the box in ${remainingTime} seconds.` : 'I confirm my project.'}
                </label>
            </div>
            {submitMessage && <div className="submit-message">{submitMessage}</div>}
            <button
                type="button"
                className="btn btn-primary"
                onClick={handleApprovalSubmit}
                disabled={!isCheckboxChecked}
            >
                Submit For Approval
            </button>
        </div>
    );
};

export default SubmitForm;