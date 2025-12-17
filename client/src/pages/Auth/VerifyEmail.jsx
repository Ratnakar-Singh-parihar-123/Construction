import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const VerifyEmail = () => {
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { verifyEmail, resendVerification, user } = useAuth();

    const email = localStorage.getItem("pendingVerificationEmail") || user?.email;

    useEffect(() => {
        // Check if token is in URL
        const token = searchParams.get("token");
        if (token) {
            handleVerification(token);
        }
    }, [searchParams]);

    const handleInputChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);
            
            // Auto focus next input
            if (value && index < 5) {
                document.getElementById(`code-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
            document.getElementById(`code-${index - 1}`).focus();
        }
    };

    const handleVerification = async (token = verificationCode.join("")) => {
        if (token.length !== 6) {
            setError("Please enter the complete 6-digit code");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        const result = await verifyEmail(token);
        
        if (result.success) {
            setSuccess("Email verified successfully! Redirecting to dashboard...");
            localStorage.removeItem("pendingVerificationEmail");
            
            setTimeout(() => {
                navigate("/admin-dashboard");
            }, 2000);
        } else {
            setError(result.message || "Invalid verification code");
        }
        
        setLoading(false);
    };

    const handleResendVerification = async () => {
        if (!email) {
            setError("No email found. Please register again.");
            return;
        }

        setResendLoading(true);
        setError("");

        const result = await resendVerification(email);
        
        if (result.success) {
            setSuccess("Verification code sent to your email!");
        } else {
            setError(result.message);
        }
        
        setResendLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-gray-50 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-yellow-100 p-8"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Mail className="text-white" size={32} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Verify Your Email
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Enter the 6-digit code sent to:
                        <br />
                        <span className="font-medium text-gray-800">{email}</span>
                    </p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                    >
                        <div className="flex items-center space-x-2 text-red-700">
                            <XCircle size={20} />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
                    >
                        <div className="flex items-center space-x-2 text-green-700">
                            <CheckCircle size={20} />
                            <span className="text-sm font-medium">{success}</span>
                        </div>
                    </motion.div>
                )}

                {/* Verification Code Input */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                        Enter Verification Code
                    </label>
                    <div className="flex justify-between space-x-2">
                        {verificationCode.map((digit, index) => (
                            <input
                                key={index}
                                id={`code-${index}`}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                                disabled={loading}
                            />
                        ))}
                    </div>
                </div>

                {/* Verify Button */}
                <button
                    onClick={() => handleVerification()}
                    disabled={loading || verificationCode.some(d => d === "")}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mb-4"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                            Verifying...
                        </>
                    ) : (
                        "Verify Email"
                    )}
                </button>

                {/* Resend Code */}
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                        Didn't receive the code?
                    </p>
                    <button
                        onClick={handleResendVerification}
                        disabled={resendLoading}
                        className="text-yellow-600 hover:text-yellow-700 font-medium text-sm flex items-center justify-center mx-auto space-x-2"
                    >
                        {resendLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <RefreshCw size={16} />
                                <span>Resend Verification Code</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-center text-gray-500">
                        Check your spam folder if you don't see the email.
                        <br />
                        Code expires in 24 hours.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;