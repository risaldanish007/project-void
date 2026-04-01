import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import apiClient from "../api/apiClient";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
    // --- STATE MANAGEMENT ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    /**
     * @function mutation
     * @description Orchestrates the asynchronous creation of a new operative profile.
     */
    const mutation = useMutation({
        mutationFn: async (newUser) => {
            // Verification: Ensure the email signature is unique within the database.
            const checkUser = await apiClient.get(`/users?email=${encodeURIComponent(newUser.email)}`);
            
            if (checkUser.data.length > 0) {
                throw new Error("OPERATIVE_EXISTS: Email already registered.");
            }

            // Persistence: Commit the new operative entity to the VOID database.
            const response = await apiClient.post('/users', newUser);
            return response.data;
        },
        onSuccess: (data) => {
            // Synchronization: Update global authentication state.
            dispatch(setCredentials(data));
            
            toast.success("[+] PROTOCOL_INITIALIZED: Welcome to VOID.");
            navigate("/");
        },
        onError: (error) => {
            toast.error(`[!] SYSTEM_FAILURE: ${error.message}`);
        }
    });

    /**
     * @function handleSubmit
     * @description Validates data integrity before initializing the mutation sequence.
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation: Verify password synchronization.
        if (password !== confirmPassword) {
            toast.error("[!] VALIDATION_ERROR: Passwords do not match.");
            return;
        }

        // Execution: Transmit the standardized operative object.
        mutation.mutate({
            name,
            email,
            password: String(password),
            role: "user",
            cart: { items: [], totalQuantity: 0, totalPrice: 0 },
            orders: []
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            
            {/* --- AMBIENT DESIGN ELEMENTS --- */}
            <div className="absolute w-[600px] h-[600px] bg-white/5 blur-3xl rounded-full -top-40 -left-40" />
            <div className="absolute w-[500px] h-[500px] bg-white/5 blur-3xl rounded-full bottom-0 right-0" />

            {/* --- REGISTRATION FORM --- */}
            <form
                onSubmit={handleSubmit}
                className="
                    relative z-10
                    w-[350px]
                    p-8
                    rounded-2xl
                    bg-white/5
                    backdrop-blur-xl
                    border border-white/10
                    shadow-2xl
                    flex flex-col gap-4
                "
            >
                <h2 className="text-white text-2xl font-semibold tracking-wide">
                    Register
                </h2>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="
                        bg-white/5
                        border border-white/10
                        rounded-lg
                        px-4 py-3
                        text-white
                        placeholder-white/40
                        outline-none
                        focus:border-white/30
                        transition
                    "
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                        bg-white/5
                        border border-white/10
                        rounded-lg
                        px-4 py-3
                        text-white
                        placeholder-white/40
                        outline-none
                        focus:border-white/30
                        transition
                    "
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                        bg-white/5
                        border border-white/10
                        rounded-lg
                        px-4 py-3
                        text-white
                        placeholder-white/40
                        outline-none
                        focus:border-white/30
                        transition
                    "
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="
                        bg-white/5
                        border border-white/10
                        rounded-lg
                        px-4 py-3
                        text-white
                        placeholder-white/40
                        outline-none
                        focus:border-white/30
                        transition
                    "
                    required
                />

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="
                        mt-2
                        bg-white/10
                        hover:bg-white/20
                        text-white
                        py-3
                        rounded-lg
                        border border-white/10
                        backdrop-blur-md
                        transition
                        active:scale-[0.98]
                    "
                >
                    {mutation.isPending ? "Initializing..." : "Register"}
                </button>

                <div className="mt-4 text-center">
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-mono">
                        Existing Operative?{' '}
                        <Link 
                            to="/login" 
                            className="text-white hover:text-green-500 transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-green-500/50"
                        >
                            Access Terminal
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Register;