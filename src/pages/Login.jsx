import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import apiClient from "../api/apiClient";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { replaceCart } from "../store/cartSlice";
import { store } from "../store/store";
import { toast } from 'react-toastify'; // Added for official feedback
import Banned from "./Banned";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const mutation = useMutation({
        mutationFn: async (credentials) => {
            const response = await apiClient.get(`/users?email=${encodeURIComponent(credentials.email)}`);
            return response.data;
        },
    
        onSuccess: async (data) => {
            console.log('Database Response: ', data);
            
            if (data.length > 0) {
                const user = data[0];

                if (String(password) === String(user.password)) {

                  // NEW: THE BAN CHECK
                    if (user.status === 'Banned') {
                        // 1. You MUST log them into Redux so the Banned page knows they are banned
                        dispatch(setCredentials(user));
                        
                        navigate("/banned");
                        return; // Halt the login sequence immediately
                    }
                    // --- THE MERGE PROTOCOL STARTS HERE ---

                    const guestCart = store.getState().cart; 
                    const dbCart = user.cart || { items: [], totalQuantity: 0, totalPrice: 0 };

                    let mergedItems = [...dbCart.items];

                    guestCart.items.forEach((guestItem) => {
                        const existingItem = mergedItems.find(item => item.id === guestItem.id);
                        if (existingItem) {
                            existingItem.quantity += guestItem.quantity;
                            existingItem.totalItemPrice += guestItem.totalItemPrice;
                        } else {
                            mergedItems.push(guestItem);
                        }
                    });

                    const finalCart = {
                        items: mergedItems,
                        totalQuantity: guestCart.totalQuantity + dbCart.totalQuantity,
                        totalPrice: guestCart.totalPrice + dbCart.totalPrice
                    };
                    

                    // 5. UPDATE REDUX (Auth & Cart)
                    dispatch(setCredentials(user));
                    dispatch(replaceCart(finalCart));

                    // 6. UPDATE DATABASE (Make the merge permanent in db.json)
                    await apiClient.patch(`/users/${user.id}`, { cart: finalCart });

                    // --- END OF MERGE PROTOCOL ---
                    

                    // --- OFFICIAL LANDING LOGIC ---
                    if (user.role === 'admin') {
                        toast.success("ADMIN_RECOGNIZED: Initializing Command Center...");
                        navigate("/admin");
                    } else {
                        toast.success("CITIZEN_UPLINK: Data Sync Complete.");
                        const origin = location.state?.from?.pathname || "/";
                        navigate(origin);
                    }
                    
                } else {
                    toast.error('CRITICAL_AUTH_FAILURE: Wrong password');
                }
            } else {
                toast.error('SIGNAL_NOT_FOUND: User does not exist');
            }
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("SENDING TO VOID:", { email, password });
        mutation.mutate({ email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* subtle gradient glow */}
            <div className="absolute w-[600px] h-[600px] bg-white/5 blur-3xl rounded-full -top-40 -left-40" />
            <div className="absolute w-[500px] h-[500px] bg-white/5 blur-3xl rounded-full bottom-0 right-0" />
            
            <form
                onSubmit={handleSubmit}
                className="relative z-10 w-[350px] p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-4"
            >
                <h2 className="text-white text-2xl font-semibold tracking-wide">Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/30 transition"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/30 transition"
                    required
                />

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="mt-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg border border-white/10 backdrop-blur-md transition active:scale-[0.98]"
                >
                    {mutation.isPending ? "Authenticating..." : "Login"}
                </button>

                <div className="mt-4 text-center">
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-mono">
                        New Operative?{' '}
                        <Link 
                            to="/register" 
                            className="text-white hover:text-green-500 transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-green-500/50"
                        >
                            Initialize Account
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;