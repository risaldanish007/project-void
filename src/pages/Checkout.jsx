import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; // Added useEffect
import apiClient from "../api/apiClient";
import { clearCart } from "../store/cartSlice";

const Checkout = () => {
    const { items, totalPrice } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const [isProcessing, setIsProcessing] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Safety redirect if cart is empty
    useEffect(() => {
        if (!isProcessing && (!items || items.length === 0)) {
            navigate("/cart");
        }
    }, [items, navigate, isProcessing]);

    const handleConfirmOrder = (e) => {
        e.preventDefault();
        setIsProcessing(true)

        const options = {
            key: "rzp_test_edrzdb8Gbx5U5M", 
            amount: totalPrice * 100, 
            currency: "INR", 
            name: "VOID ENERGY",
            description: "Signal Deployment Protocol",
            // Inside Checkout.jsx handler
            handler: async function (response) {
    try {
        // 1. Prepare the Data Migration (Cart -> Orders)
        const newOrder = {
            id: `VOID-${Math.floor(1000 + Math.random() * 9000)}`,
            items: items,
            total: totalPrice,
            paymentId: response.razorpay_payment_id,
            status: "Deployed",
            date: new Date().toISOString().split('T')[0]
        };

        const updatedOrders = [...(user.orders || []), newOrder];

        // 2. Update the Database FIRST
        await apiClient.patch(`/users/${user.id}`, {
            orders: updatedOrders,
            cart: { items: [], totalQuantity: 0, totalPrice: 0 }
        });

        // 3. Update Redux so the UI knows the cart is empty
        dispatch(clearCart());
        
        // 4. THE JUMP: Redirect to the Success Page
        console.log("UPLINK SUCCESSFUL: Redirecting to Success Terminal...");
        navigate("/success"); 

    } catch (error) {
        setIsProcessing(false)
        console.error(error);
        alert("Payment received, but database sync failed. Do not refresh.");
    }
},
            prefill: {
                name: user?.name,
                email: user?.email,
            },
            theme: {
                color: "#22d3ee",
            },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 bg-[#050505]">
            <div className="max-w-2xl mx-auto">
                <div className="mb-10 flex items-center gap-6">
                    <div className="h-16 w-1 bg-cyan-500 shadow-[0_0_15px_cyan]"></div>
                    <div>
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                            Finalize <span className="text-cyan-400">Signal</span>
                        </h2>
                        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-500">
                            Authorized Operative: {user?.name}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleConfirmOrder} className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="space-y-8 relative z-10">
                        {/* Section 1: Logistics */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-cyan-500/70 ml-2">Destination Matrix</label>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="First Name" required className="bg-black/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-cyan-500" />
                                <input type="text" placeholder="Last Name" required className="bg-black/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-cyan-500" />
                            </div>
                            <input type="text" placeholder="Full Shipping Address" required className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-cyan-500" />
                        </div>

                        {/* Section 2: Payment Protocol (Moved Up) */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-cyan-500/70 ml-2">Payment Protocol</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex items-center gap-4 bg-black/40 border border-white/10 p-4 rounded-2xl cursor-pointer hover:border-cyan-500/50">
                                    <input type="radio" name="payment" value="credit" defaultChecked className="accent-cyan-500" />
                                    <div className="flex flex-col text-white">
                                        <span className="text-sm font-bold uppercase">Credit Uplink</span>
                                        <span className="text-[10px] text-gray-500">Visa / Mastercard</span>
                                    </div>
                                </label>
                                <label className="flex items-center gap-4 bg-black/40 border border-white/10 p-4 rounded-2xl cursor-pointer hover:border-cyan-500/50">
                                    <input type="radio" name="payment" value="crypto" className="accent-cyan-500" />
                                    <div className="flex flex-col text-white">
                                        <span className="text-sm font-bold uppercase">Crypto Node</span>
                                        <span className="text-[10px] text-gray-500">BTC / ETH / SOL</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Section 3: Summary */}
                        <div className="pt-8 border-t border-white/5 text-white">
                            <div className="bg-black/40 rounded-3xl p-6 border border-white/5 space-y-3">
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-[10px] font-black uppercase text-gray-500">Total Liability</span>
                                    <span className="text-5xl font-black italic tracking-tighter">${totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Action */}
                        <button type="submit" className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-400 transition-all">
                            Confirm & Deploy Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;