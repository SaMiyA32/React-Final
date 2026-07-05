import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { backendApi } from '@/services/api';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ShoppingBag, Calendar, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Order {
  _id: number;
  userId: number;
  username: string;
  itemName: string;
  itemPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
  createdAt: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return;
      try {
        const userId = (user as any)._id || (user as any).id;
        const response = await backendApi.get(`/orders/orders/user/${userId}`);
        if (response.data && response.data.success) {
          setOrders(response.data.data || []);
        } else {
          setError('Failed to fetch orders.');
        }
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || 'Error connecting to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user]);

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'shipped':
        return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-28 pb-16 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
            My <span className="text-red-500">Profile</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Manage your account information and track order delivery status.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-950/80 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col items-center text-center pb-6 border-b border-gray-800">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-red-600/30 mb-4">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <h2 className="text-2xl font-bold text-white">{user?.name || 'Customer'}</h2>
                <span className="text-xs uppercase tracking-widest font-bold text-red-500 mt-1 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                  {user?.role || 'Customer'}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start space-x-3 text-gray-300">
                  <Mail className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Email Address</span>
                    <span className="text-sm truncate block">{user?.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-gray-300">
                  <Phone className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Phone Number</span>
                    <span className="text-sm block">{(user as any)?.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Delivery Address</span>
                    <span className="text-sm block">{(user as any)?.address || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-950/80 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-2xl min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-red-500" />
                  Order History & Status
                </h3>
                <span className="text-xs font-semibold bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700">
                  Total Orders: {orders.length}
                </span>
              </div>

              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
                  <p className="text-gray-400">Loading your order details...</p>
                </div>
              ) : error ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <p className="text-red-400 mb-2 font-semibold">Error Loading Orders</p>
                  <p className="text-gray-500 text-sm max-w-md">{error}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-300 font-semibold mb-2">No Orders Placed Yet</p>
                  <p className="text-gray-500 text-sm max-w-sm mb-6">
                    You haven't placed any orders with us. Add products to your cart and place an order to track it here.
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Start Shopping <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 bg-gray-900/60 hover:bg-gray-900 border border-gray-850 rounded-xl transition-all duration-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-red-500 text-lg">
                            #{order._id}
                          </span>
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-white mt-1 truncate">
                          {order.itemName}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Total Price: <span className="text-white font-semibold">LKR {order.totalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0">
                        <span className={`text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-full ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
