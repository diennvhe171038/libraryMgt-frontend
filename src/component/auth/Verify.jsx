import React, { useState, useEffect, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import "../../assets/style/Verify.css";
import Logo from "../../assets/image/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useNotification from "../../hooks/useNotification.js";
import Notification from "../../component/common/Notification";

const Verify = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [resendLoading, setResendLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const { verify, resend} = useAuth();
  const { showSuccess, showError } = useNotification();
  


  const handleChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value;

    if (/^[0-9]$/.test(value)) {
      setOtp(newOtp);
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === "" && index > 0) {
      setOtp(newOtp);
      inputRefs.current[index - 1].focus();
    } else if (value === "" && index === 0) {
      setOtp(newOtp);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpNumber = otp.join("");
    try {
      const response = await verify(email, otpNumber);
      if (response.status === 200) {
        setVerified(true);
      }
    } catch (error) {
      showError("Error", error);
    }
  };


  const handleResendOtp = async (e) => {
    e.preventDefault();
    setResendLoading(true);

    try {
      const response = await resend(email);
      if (response.status === 200) {
        showSuccess("Success", response.message);
        setOtp(Array(6).fill(""));
        inputRefs.current[0].focus();
      }
    } catch (error) {
      showError("Error", error);
    } finally {
      setResendLoading(false);
    }
  };


  useEffect(() => {
    if (verified) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [verified, navigate]);



  return (
    <div className="verify-container">
      <Notification />
      <div className="verify">
        <div className="verify-logo">
          <img src={Logo} alt="logo" />
        </div>
        <div className="verify-title">
          <h6>Verification</h6>
          {verified ? (
            <div className="sub-title">Thank you</div>
          ) : (
            <div className="sub-title">Check your E-mail for OTP</div>
          )}
        </div>
        {!verified ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="label">Enter your OTP here</Form.Label>
              <div className="input-container">
                {otp.map((digit, index) => (
                  <Form.Control
                    key={index}
                    className="input-item"
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    style={{ fontSize: "small" }}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Button
                className="btn-verify"
                type="submit"
                style={{
                  backgroundColor: "#F87555",
                  border: "none",
                  fontSize: "small",
                }}
              >
                Verify
              </Button>
            </Form.Group>
            <div className="resend">
              <span>
                Not yet received?
                <Link
                  href="/verify"
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  style={{ cursor: resendLoading ? "not-allowed" : "pointer" }}
                >
                  {resendLoading ? "Resending..." : "Resend"}
                </Link>
              </span>
              <Link to="/register">Back</Link>
            </div>
          </Form>
        ) : (
          // Nếu đã được xác minh, hiển thị thông báo đã xác minh thành công
          <div className="verify-success">
            <h6>You are verified</h6>
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" fill="#21c179" r="10" />
              <path
                clip-rule="evenodd"
                d="m16.6766 8.58327c.1936.19698.1908.51355-.0062.70708l-5.7054 5.60545c-.1914.1881-.4972.1915-.6927.0078l-2.67382-2.5115c-.20128-.189-.21118-.5055-.02212-.7067.18906-.2013.50548-.2112.70676-.0222l2.32368 2.1827 5.3628-5.26888c.1969-.19353.5135-.19073.707.00625z"
                fill="#fff"
                fill-rule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
