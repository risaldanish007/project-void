import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; 
import { useQueryClient } from "@tanstack/react-query"; 
import apiClient from "../api/apiClient";
import { clearCart } from "../store/cartSlice";

const Checkout = () => {
    const { items, totalPrice } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // 1.LOGISTICS STATE
    const [shippingDetails, setShippingDetails] = useState({
        firstName: '',
        lastName: '',
        phone: '', 
        address: '',
        city: '',
        state: '',
        zip: '',
        instructions: '' 
    });

    // 2. ERROR STATE
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Safety redirect if cart is empty
    useEffect(() => {
        if (!isProcessing && (!items || items.length === 0)) {
            navigate("/cart");
        }
    }, [items, navigate, isProcessing]);

    // 3. VALIDATION PROTOCOL
    const validateForm = () => {
        let newErrors = {};
        
        // Validation 
        const nameRegex = /^[A-Za-z\s]{2,50}$/; 
        const phoneRegex = /^[6-9]\d{9}$/;      
        const zipRegex = /^\d{6}$/;             

        if (!nameRegex.test(shippingDetails.firstName.trim())) {
            newErrors.firstName = "ERR_INVALID_IDENTITY: Requires letters only (min 2).";
        }
        if (!nameRegex.test(shippingDetails.lastName.trim())) {
            newErrors.lastName = "ERR_INVALID_IDENTITY: Requires letters only (min 2).";
        }
        if (!phoneRegex.test(shippingDetails.phone.trim())) {
            newErrors.phone = "ERR_COMMS_FAILURE: Requires 10-digit active link.";
        }
        if (shippingDetails.address.trim().length < 5) {
            newErrors.address = "ERR_VAGUE_COORDINATES: Requires detailed routing (min 5 chars).";
        }
        if (!nameRegex.test(shippingDetails.city.trim())) {
            newErrors.city = "ERR_SECTOR_UNKNOWN: Requires valid city name.";
        }
        if (!nameRegex.test(shippingDetails.state.trim())) {
            newErrors.state = "ERR_REGION_UNKNOWN: Requires valid state name.";
        }
        if (!zipRegex.test(shippingDetails.zip.trim())) {
            newErrors.zip = "ERR_INVALID_GRID_CODE: Requires 6-digit numerical code.";
        }

        setErrors(newErrors);
        
        
        return Object.keys(newErrors).length === 0;
    };

    // Helper to handle input changes and clear errors on the fly
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
        
        // Clear specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleConfirmOrder = (e) => {
        e.preventDefault();

        // RUN VALIDATION GATE
        if (!validateForm()) return; 

        setIsProcessing(true);

        const options = {
            key: "rzp_test_edrzdb8Gbx5U5M", 
            amount: totalPrice * 100, 
            currency: "INR", 
            name: "VOID ENERGY",
            description: "Signal Deployment Protocol",
            handler: async function (response) {
                try {
                    // CONSTRUCT THE DEPLOYMENT PAYLOAD
                    const newOrder = {
                        id: `VOID-${Math.floor(1000 + Math.random() * 9000)}`,
                        userId: user.id,
                        customerName: user.name,
                        customerEmail: user.email,
                        items: items,
                        total: totalPrice,
                        paymentId: response.razorpay_payment_id,
                        status: "pending",
                        date: new Date().toISOString().split('T')[0],
                        shippingAddress: { 
                            ...shippingDetails,
                            fullFormatted: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} - ${shippingDetails.zip}`
                        }
                    };

                    // INVENTORY_DEDUCTION_LOGIC
                    const inventoryUpdates = items.map(item => {
                        const currentStock = Number(item.stock || 0);
                        const newStock = currentStock - item.quantity;
                        return apiClient.patch(`/products/${item.id}`, { 
                            stock: Math.max(0, newStock) 
                        });
                    });

                    // SIMULTANEOUS UPLINK
                    await Promise.all([
                        apiClient.post('/orders', newOrder), 
                        ...inventoryUpdates,
                        apiClient.patch(`/users/${user.id}`, {
                            cart: { items: [], totalQuantity: 0, totalPrice: 0 }
                        })
                    ]);

                    // GLOBAL CACHE SYNC
                    queryClient.invalidateQueries(["adminOrders"]);
                    queryClient.invalidateQueries(["userProfile", user.id]);
                    queryClient.invalidateQueries(["adminProducts"]); 

                    dispatch(clearCart());
                    console.log("UPLINK SUCCESSFUL: Logistics chain established.");
                    navigate("/success"); 

                } catch (error) {
                    setIsProcessing(false);
                    console.error("CRITICAL_UPLINK_FAILURE:", error);
                    alert("System desync. Payment verified but database update failed. Do not refresh.");
                }
            },
            prefill: {
                name: user?.name,
                email: user?.email,
                contact: shippingDetails.phone
            },
            theme: {
                color: "#22d3ee",
            },
            modal: {
                // Reset processing state if user closes Razorpay modal
                ondismiss: function() {
                    setIsProcessing(false);
                }
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 bg-[#050505] text-white">
            <div className="max-w-3xl mx-auto">
                {/* Header Section */}
                <div className="mb-14 flex items-end gap-6">
                    <div className="h-14 w-[2px] bg-cyan-500 shadow-[0_0_12px_cyan]"></div>
                    <div>
                        <h2 className="text-3xl font-extralight uppercase tracking-tight">
                            Finalize <span className="text-cyan-400 italic">Signal</span>
                        </h2>
                        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mt-1">
                            Operative: {user?.name} // Clearance: Level_1
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleConfirmOrder}
                    noValidate // Disables default HTML5 popups so our custom UI takes over
                    className="bg-[#0d0d0d] border border-white/5 p-8 md:p-12 relative overflow-hidden rounded-3xl"
                >
                    <div className="space-y-12">
                        {/* Logistics Sector */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                                <label className="text-[10px] uppercase tracking-[0.5em] text-cyan-500/70 font-bold">
                                    Destination_Coordinates
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={shippingDetails.firstName}
                                        onChange={handleInputChange}
                                        className={`bg-black/60 border px-5 py-4 text-sm outline-none transition rounded-xl ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-cyan-500'}`}
                                    />
                                    {errors.firstName && <span className="text-red-500 text-[9px] font-mono mt-2 ml-2 uppercase tracking-wider">{errors.firstName}</span>}
                                </div>
                                <div className="flex flex-col">
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={shippingDetails.lastName}
                                        onChange={handleInputChange}
                                        className={`bg-black/60 border px-5 py-4 text-sm outline-none transition rounded-xl ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-cyan-500'}`}
                                    />
                                    {errors.lastName && <span className="text-red-500 text-[9px] font-mono mt-2 ml-2 uppercase tracking-wider">{errors.lastName}</span>}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Contact Phone (Signal Link)"
                                    value={shippingDetails.phone}
                                    onChange={handleInputChange}
                                    className={`w-full bg-black/60 border px-5 py-4 text-sm outline-none transition rounded-xl ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-cyan-500'}`}
                                />
                                {errors.phone && <span className="text-red-500 text-[9px] font-mono mt-2 ml-2 uppercase tracking-wider">{errors.phone}</span>}
                            </div>

                            <div className="flex flex-col">
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Street Address"
                                    value={shippingDetails.address}
                                    onChange={handleInputChange}
                                    className={`w-full bg-black/60 border px-5 py-4 text-sm outline-none transition rounded-xl ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-cyan-500'}`}
                                />
                                {errors.address && <span className="text-red-500 text-[9px] font-mono mt-2 ml-2 uppercase tracking-wider">{errors.address}</span>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="flex flex-col">
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={shippingDetails.city}
                                        onChange={handleInputChange}
                                        className={`bg-black/60 border px-5 py-4 text-sm outline-none transition rounded-xl ${errors.city ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-cyan-500'}`}
                                    />
                                    {errors.city && <span className="text-red-500 text-[9px] font-mono mt-2 ml-2 uppercase tracking-wider">{errors.city}</span>}
                                </div>
                                <div className="flex flex-col">
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={shippingDetails.state}
                                        onChange={handleInputChange}
                                        className={`bg-black/60 border px-5 py-4 text-sm outline-none transition rounded-xl ${errors.state ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-cyan-500'}`}
                                    />
                                    {errors.state && <span className="text-red-500 text-[9px] font-mono mt-2 ml-2 uppercase tracking-wider">{errors.state}</span>}
                                </div>
                                <div className="flex flex-col">
                                    <input
                                        type="text"
                                        name="zip"
                                        placeholder="ZIP Code"
                                        value={shippingDetails.zip}
                                        onChange={handleInputChange}
                                        className={`bg-black/60 border px-5 py-4 text-sm outline-none transition rounded-xl ${errors.zip ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-cyan-500'}`}
                                    />
                                    {errors.zip && <span className="text-red-500 text-[9px] font-mono mt-2 ml-2 uppercase tracking-wider">{errors.zip}</span>}
                                </div>
                            </div>

                            <textarea
                                name="instructions"
                                placeholder="Special Instructions (Optional)"
                                rows="2"
                                value={shippingDetails.instructions}
                                onChange={handleInputChange}
                                className="w-full bg-black/60 border border-white/10 px-5 py-4 text-sm outline-none focus:border-cyan-500 transition rounded-xl resize-none"
                            />
                        </section>

                        {/* Payment Sector */}
                        <section className="space-y-6">
                            <label className="text-[10px] uppercase tracking-[0.5em] text-cyan-500/70 font-bold">
                                Payment_Protocol
                            </label>

                            <div className="grid md:grid-cols-1 gap-4">
                                <div className="flex items-center gap-4 border border-cyan-500/20 bg-cyan-500/5 p-6 rounded-2xl">
                                    <div className="w-4 h-4 rounded-full border-4 border-cyan-500 bg-black" />
                                    <div>
                                        <p className="text-sm uppercase tracking-wide font-bold">Credit Uplink</p>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Razorpay Secure Gateway</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Summary Sector */}
                        <section className="border-t border-white/5 pt-10">
                            <div className="flex justify-between text-white/40 text-[10px] uppercase tracking-[0.4em] font-mono">
                                <span>Total Liability</span>
                                <span>Deployment_Currency: INR</span>
                            </div>

                            <div className="flex justify-between items-end mt-4">
                                <span className="text-4xl font-extralight uppercase tracking-tighter">Total</span>
                                <span className="text-5xl font-light italic tracking-tight text-cyan-400">
                                    ${totalPrice}
                                </span>
                            </div>
                        </section>

                        {/* Execution Trigger */}
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full h-20 border text-[12px] font-black uppercase tracking-[0.6em] relative overflow-hidden group transition-all duration-300
                                ${Object.keys(errors).length > 0 ? 'border-red-500/50 text-red-500/50' : 'border-white text-white hover:text-black'}
                                ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            <span className="relative z-10 transition duration-500">
                                {isProcessing ? "PROCESSING_UPLINK..." : 
                                 Object.keys(errors).length > 0 ? "RESOLVE_ERRORS_TO_PROCEED" : "Confirm & Deploy"}
                            </span>
                            {!isProcessing && Object.keys(errors).length === 0 && (
                                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;