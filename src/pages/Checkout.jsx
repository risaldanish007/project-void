import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; 
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import apiClient from "../api/apiClient";
import { clearCart } from "../store/cartSlice";

const Checkout = () => {
    const { items, totalPrice } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const [isProcessing, setIsProcessing] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // INTELLIGENCE_GATHERING: Fetch latest user data to prevent overwriting history
    const { data: userData } = useQuery({
        queryKey: ["userProfile", user?.id],
        queryFn: async () => {
            const response = await apiClient.get(`/users/${user.id}`);
            return response.data;
        },
        enabled: !!user?.id,
    });

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
            handler: async function (response) {
                try {
                    // 1. Prepare the Data Migration (Cart -> Orders)
                    const newOrder = {
                        id: `VOID-${Math.floor(1000 + Math.random() * 9000)}`,
                        items: items,
                        total: totalPrice,
                        paymentId: response.razorpay_payment_id,
                        status: "pending",
                        date: new Date().toISOString().split('T')[0]
                    };

                    const updatedOrders = [...(userData?.orders || []), newOrder];

                    // 2. INVENTORY_DEDUCTION_LOGIC
                    // We generate a list of patch requests for each item to decrease stock
                    const inventoryUpdates = items.map(item => {
                        const currentStock = Number(item.stock || 0);
                        const newStock = currentStock - item.quantity;
                        
                        return apiClient.patch(`/products/${item.id}`, { 
                            stock: Math.max(0, newStock) 
                        });
                    });

                    // 3. EXECUTE SIMULTANEOUS UPLINK
                    // We update the products, user orders, and clear cart in one wave
                    await Promise.all([
                        ...inventoryUpdates,
                        apiClient.patch(`/users/${user.id}`, {
                            orders: updatedOrders,
                            cart: { items: [], totalQuantity: 0, totalPrice: 0 }
                        })
                    ]);

                    // 4. THE SYNC: Refresh all relevant data caches
                    queryClient.invalidateQueries(["userProfile", user.id]);
                    queryClient.invalidateQueries(["adminProducts"]); // Updates the Shop/Inventory lists

                    // 5. Update Redux so the UI knows the cart is empty
                    dispatch(clearCart());
                    
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
  <div className="min-h-screen pt-28 pb-20 px-6 bg-[#050505] text-white">
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-14 flex items-end gap-6">
        <div className="h-14 w-[2px] bg-cyan-500 shadow-[0_0_12px_cyan]"></div>
        <div>
          <h2 className="text-3xl font-extralight uppercase tracking-tight">
            Finalize <span className="text-cyan-400 italic">Signal</span>
          </h2>
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mt-1">
            Authorized: {user?.name}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleConfirmOrder}
        className="bg-[#0d0d0d] border border-white/5 p-10 relative overflow-hidden"
      >
        <div className="space-y-10">

          {/* Logistics */}
          <section className="space-y-5">
            <label className="text-[10px] uppercase tracking-[0.5em] text-cyan-500/70">
              Destination Matrix
            </label>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                required
                className="bg-black/40 border border-white/10 px-4 py-3 text-sm outline-none focus:border-cyan-500 transition"
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                className="bg-black/40 border border-white/10 px-4 py-3 text-sm outline-none focus:border-cyan-500 transition"
              />
            </div>

            <input
              type="text"
              placeholder="Full Shipping Address"
              required
              className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm outline-none focus:border-cyan-500 transition"
            />
          </section>

          {/* Payment Protocol */}
          <section className="space-y-5">
            <label className="text-[10px] uppercase tracking-[0.5em] text-cyan-500/70">
              Payment Protocol
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-4 border border-white/10 p-4 cursor-pointer hover:border-cyan-500/50 transition">
                <input
                  type="radio"
                  name="payment"
                  defaultChecked
                  className="accent-cyan-500"
                />
                <div>
                  <p className="text-sm uppercase tracking-wide">
                    Credit Uplink
                  </p>
                  <p className="text-[10px] text-white/40">
                    Visa / Mastercard
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* Summary */}
          <section className="border-t border-white/5 pt-8">
            <div className="flex justify-between text-white/40 text-xs uppercase tracking-[0.3em]">
              <span>Total Liability</span>
              <span>INR</span>
            </div>

            <div className="flex justify-between items-end mt-2">
              <span className="text-3xl font-extralight uppercase">
                Total
              </span>
              <span className="text-4xl font-light italic tracking-tight text-cyan-400">
                ₹{totalPrice}
              </span>
            </div>
          </section>

          {/* Action */}
          <button
            type="submit"
            className="w-full h-16 border border-white text-[11px] uppercase tracking-[0.5em] relative overflow-hidden group"
          >
            <span className="relative z-10 group-hover:text-black transition">
              Confirm & Deploy
            </span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>

        </div>
      </form>
    </div>
  </div>
);
};

export default Checkout;