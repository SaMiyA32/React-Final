import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { selectCartItems, selectTotalPrice, clearCart } from '@/features/cart/cartSlice';
import { useAuth } from '@/contexts/AuthContext';

export default function OrderSuccess() {
  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectTotalPrice);
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const totalBeforeClear = useRef(totalPrice);
  const itemsBeforeClear = useRef<any[]>([...cartItems]);

  const orderId = Math.floor(Math.random() * 900000 + 100000);
  const orderDate = new Date().toLocaleString();
  const paymentMethod = 'Cash on Delivery';
  const address = (user as any)?.address || '123 Main Street, Colombo, Sri Lanka';
  const shipping: number = 0;

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const downloadReceipt = () => {
    const receiptContent = `=========================================
               NS COMPUTERS
        Your Ultimate Tech Partner
=========================================
Receipt for Order #${orderId}
Date: ${orderDate}
Payment Method: ${paymentMethod}
Shipping Address: ${address}

Items:
-----------------------------------------
${itemsBeforeClear.current.map(item => `${item.name} x ${item.quantity} - LKR ${(item.price * item.quantity).toFixed(2)}`).join('\n')}

-----------------------------------------
Subtotal: LKR ${totalBeforeClear.current.toFixed(2)}
Shipping: Free
Total Amount: LKR ${totalBeforeClear.current.toFixed(2)}
=========================================
Thank you for your purchase!
`;
    const element = document.createElement("a");
    const file = new Blob([receiptContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Receipt_${orderId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.13, scale: 1.1, x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-red-500 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.10, scale: 1.2, x: [0, -30, 30, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
        className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] bg-red-700 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.09, scale: 1.15, x: [0, 20, -20, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 17, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 w-80 h-80 bg-red-400 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-10 border border-gray-700 flex flex-col items-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1.1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
          className="mb-6"
        >
          <FaCheckCircle className="text-6xl text-red-500 drop-shadow-lg animate-pulse" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-3xl md:text-4xl font-extrabold text-white text-center mb-2 tracking-tight drop-shadow-lg"
        >
          Order Placed Successfully!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="text-lg text-gray-200 text-center mb-6"
        >
          Thank you for shopping with us. Your order has been received and is being processed.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="w-full bg-gray-800 rounded-xl shadow-inner px-6 py-6 mb-6 mt-2"
        >
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <div className="bg-gray-900 rounded-xl px-6 py-3 text-gray-300 shadow-md">
              <span className="block text-xs uppercase tracking-wider text-gray-400">Order ID</span>
              <span className="font-bold text-lg text-red-400">#{orderId}</span>
            </div>
            <div className="bg-gray-900 rounded-xl px-6 py-3 text-gray-300 shadow-md">
              <span className="block text-xs uppercase tracking-wider text-gray-400">Order Date</span>
              <span className="font-semibold text-base">{orderDate}</span>
            </div>
            <div className="bg-gray-900 rounded-xl px-6 py-3 text-gray-300 shadow-md">
              <span className="block text-xs uppercase tracking-wider text-gray-400">Payment</span>
              <span className="font-semibold text-base">{paymentMethod}</span>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl px-6 py-4 text-gray-300 shadow-md text-center mb-4">
            <span className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Shipping Address</span>
            <span className="font-semibold text-base">{address}</span>
          </div>
          <ul className="mb-4 divide-y divide-gray-700">
            {itemsBeforeClear.current.map((item) => (
              <li
                key={item.id}
                className="py-3 flex justify-between items-center text-lg text-gray-200"
              >
                <span className="font-medium text-gray-100">{item.name} <span className="text-gray-400">x {item.quantity}</span></span>
                <span className="font-semibold text-red-400">LKR {(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center font-bold text-xl mb-2 px-2">
            <span className="text-gray-300">Subtotal:</span>
            <span className="text-red-400">LKR {totalBeforeClear.current.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center font-semibold text-lg px-2">
            <span className="text-gray-400">Shipping:</span>
            <span className="text-gray-200">{shipping === 0 ? 'Free' : `LKR ${shipping.toFixed(2)}`}</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          className="text-4xl mt-2"
        >
          <span role="img" aria-label="party">🎉</span>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center items-center">
          <motion.button
            onClick={downloadReceipt}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, type: 'spring' }}
            className="bg-gray-800 hover:bg-gray-755 text-white py-3 px-8 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-700 cursor-pointer w-full sm:w-auto text-center"
          >
            Download Receipt
          </motion.button>
          <motion.a
            href="/"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, type: 'spring' }}
            className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-3 px-8 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-center w-full sm:w-auto"
          >
            Continue Shopping
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}
