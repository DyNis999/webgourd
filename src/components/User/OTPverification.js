import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OTPModal = ({ show, userId, onHide }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
        console.log("Verifying OTP:", { otp, userId });
      await axios.post(`${process.env.REACT_APP_API}/api/v1/users/verifyOTP`, {
        otp,
        userId,
      });
      setLoading(false);
      onHide();
      navigate("/login");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMsg("");
    setError("");
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/users/resendOTP`, {
        userId,
      });
      setResendMsg(res.data.message || "OTP resent successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }
    setResending(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Verify OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Enter the OTP sent to your email</Form.Label>
          <Form.Control
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
        </Form.Group>
        <div className="mt-2">
          <span>Didn't receive the code? </span>
          <span
            style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline" }}
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Resending..." : "Resend OTP"}
          </span>
        </div>
        {resendMsg && <div className="text-success mt-2">{resendMsg}</div>}
        {error && <div className="text-danger mt-2">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleVerify} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Verify"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OTPModal;