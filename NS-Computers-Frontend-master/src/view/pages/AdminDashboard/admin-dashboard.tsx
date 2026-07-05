import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchOrders } from "@/slices/orderSlice"
import { getAllProducts } from "@/slices/productSlice"
import { fetchUsers } from "@/slices/userSlice"
import { useAuth } from "@/contexts/AuthContext"
import {
    Search,
    Download,
    TrendingUp,
    ShoppingCart,
    DollarSign,
    Users,
    Package,
    Bell,
    User,
    LogOut,
    MoreHorizontal,
    Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"


const AnimatedBackground = ({ isDarkMode }: { isDarkMode: boolean }) => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {}
            {[...Array(35)].map((_, i) => (
                <div
                    key={i}
                    className={`absolute rounded-full animate-pulse ${
                        i % 4 === 0
                            ? isDarkMode ? "bg-red-400/50" : "bg-red-400/20"
                            : i % 4 === 1
                                ? isDarkMode ? "bg-red-500/40" : "bg-red-500/15"
                                : i % 4 === 2
                                    ? isDarkMode ? "bg-cyan-400/35" : "bg-cyan-400/15"
                                    : isDarkMode ? "bg-red-600/30" : "bg-red-600/10"
                    }`}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 4}s`,
                        animationDuration: `${2 + Math.random() * 4}s`,
                    }}
                />
            ))}

            {}
            <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
                isDarkMode ? "bg-gradient-to-r from-red-500/15 to-pink-500/15" : "bg-gradient-to-r from-red-500/5 to-pink-500/5"
            }`} />
            <div
                className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl animate-pulse ${
                    isDarkMode ? "bg-gradient-to-r from-cyan-500/10 to-red-500/12" : "bg-gradient-to-r from-cyan-500/3 to-red-500/4"
                }`}
                style={{ animationDelay: "1s" }}
            />
        </div>
    )
}

export default function AdminDashboardPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const dispatch = useAppDispatch();
    const { logout } = useAuth();
    
    
    const products = useAppSelector((state) => state.product.list || []);
    const orders = useAppSelector((state) => state.orders.orders || []);
    const users = useAppSelector((state) => state.users.users || []);

    
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') !== 'light';
    });

    useEffect(() => {
        dispatch(fetchOrders());
        dispatch(getAllProducts());
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (!isDarkMode) {
            localStorage.setItem('theme', 'light');
            document.body.style.backgroundColor = '#f8fafc';
            document.body.style.color = '#0f172a';
        } else {
            localStorage.setItem('theme', 'dark');
            document.body.style.backgroundColor = 'black';
            document.body.style.color = 'white';
        }
    }, [isDarkMode]);

    
    const realTotalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalPrice || o.totalAmount || 0), 0);

    const realTotalOrders = orders.length;
    const realTotalCustomers = users.filter(u => u.role === 'customer').length;
    const realTotalProducts = products.length;

    
    const recentOrders = orders.slice(0, 8).map(o => ({
        id: `#${o._id || o.orderNumber}`,
        customer: o.username || o.customerName || 'Customer',
        status: o.status ? o.status.charAt(0).toUpperCase() + o.status.slice(1) : 'Pending',
        total: `LKR ${(o.totalPrice || o.totalAmount || 0).toLocaleString()}`
    }));

    
    const productSalesMap: Record<string, { sales: number; units: number }> = {};
    orders.forEach(order => {
        if (order.status !== 'cancelled') {
            const name = order.itemName || 'Unknown Product';
            const price = order.itemPrice || order.totalPrice || 0;
            const qty = (order.itemPrice && order.itemPrice > 0) ? Math.round(order.totalPrice / order.itemPrice) : 1;
            if (!productSalesMap[name]) {
                productSalesMap[name] = { sales: 0, units: 0 };
            }
            productSalesMap[name].sales += price * qty;
            productSalesMap[name].units += qty;
        }
    });

    const calculatedTopProducts = Object.entries(productSalesMap)
        .map(([name, data]) => ({
            name,
            sales: `LKR ${data.sales.toLocaleString()}`,
            units: data.units
        }))
        .sort((a, b) => b.units - a.units)
        .slice(0, 5);

    const topProducts = calculatedTopProducts.length > 0
        ? calculatedTopProducts
        : products.slice(0, 5).map(p => ({
            name: p.name,
            sales: `LKR ${(p.price || 0).toLocaleString()} (Price)`,
            units: p.stock || 0
        }));

    
    const userActivity = users.slice(0, 5).map(u => ({
        user: u.name || u.email,
        action: u.role === 'admin' ? "registered as admin" : "registered as customer",
        time: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recently"
    }));

    const generateReport = () => {
        if (orders.length === 0) {
            alert("No orders available to generate report.");
            return;
        }
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Order ID,Customer Name,Status,Total Amount,Date\n";
        orders.forEach(o => {
            csvContent += `"${o._id || o.orderNumber}","${o.username || 'Guest'}","${o.status}","${o.totalPrice || 0}","${o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}"\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `NS_Computers_Orders_Report_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "Delivered":
            case "delivered":
                return "bg-green-500/20 text-green-400 border-green-500/30"
            case "Processing":
            case "processing":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "Pending":
            case "pending":
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            case "Shipped":
            case "shipped":
                return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
            case "Cancelled":
            case "cancelled":
                return "bg-red-500/20 text-red-400 border-red-500/30"
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }
    }

    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
            isDarkMode ? "bg-black text-white" : "bg-slate-50 text-slate-900"
        }`}>
            <AnimatedBackground isDarkMode={isDarkMode} />

            {}
            <div className={`fixed left-0 top-0 h-full w-64 backdrop-blur-xl border-r transition-all duration-300 z-10 ${
                isDarkMode ? "bg-slate-800/90 border-slate-700/50 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-red-400">NS Computers</span>
                    </div>

                    <nav className="space-y-2">
                        {[
                            { icon: TrendingUp, label: "Dashboard", href: "/admin-dashboard", active: true },
                            { icon: Users, label: "Users", href: "/admin-users", active: false },
                            { icon: ShoppingCart, label: "Orders", href: "/admin-orders", active: false },
                            { icon: Package, label: "Products", href: "/admin-products", active: false },
                            { icon: DollarSign, label: "Analytics", href: "/admin-dashboard", active: false },
                        ].map((item) => (
                            <Link to={item.href} key={item.label} className="block">
                                <div
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                                        item.active
                                            ? "bg-red-500/25 border border-red-500/40 text-red-400 shadow-lg shadow-red-500/15 animate-pulse"
                                            : isDarkMode
                                                ? "hover:bg-slate-700/50 text-slate-300 hover:shadow-md hover:shadow-red-500/5"
                                                : "hover:bg-slate-100 text-slate-600 hover:shadow-md"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            </Link>
                        ))}
                    </nav>

                    <div className="absolute bottom-6 left-6 right-6">
                        <div className={`rounded-lg p-4 mb-4 border transition-all duration-300 ${
                            isDarkMode 
                                ? "bg-slate-700/50 border-red-500/15 shadow-lg shadow-red-500/10" 
                                : "bg-slate-100 border-slate-200 shadow-lg"
                        }`}>
                            <p className="text-sm font-semibold mb-2">Need help?</p>
                            <p className={`text-xs mb-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Our support team is here to help you</p>
                            <Button className="w-full bg-red-500 hover:bg-red-600 text-white text-sm shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105">
                                Contact Support
                            </Button>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Dark Mode</span>
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${
                                    isDarkMode ? "bg-red-500 shadow-lg shadow-red-500/40" : "bg-slate-300"
                                }`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${
                                    isDarkMode ? "right-1" : "left-1"
                                }`}></div>
                            </button>
                        </div>

                        {}
                        <Button
                            variant="outline"
                            className={`w-full transition-all duration-300 bg-transparent border-red-500/40 text-red-500 hover:bg-red-500/15 hover:border-red-500/60 shadow-lg ${
                                isDarkMode ? "shadow-red-500/10 hover:shadow-red-500/20" : "shadow-sm hover:shadow-md"
                            }`}
                            onClick={logout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {}
            <div className="ml-64">
                {}
                <div className={`backdrop-blur-xl border-b px-8 py-4 transition-colors duration-300 ${
                    isDarkMode ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Search..."
                                    className={`pl-10 transition-all duration-300 ${
                                        isDarkMode 
                                            ? "bg-slate-700/50 border-slate-600 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/25" 
                                            : "bg-white border-slate-300 text-slate-800 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/15"
                                    }`}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="relative hover:bg-red-500/15">
                                <Bell className="w-5 h-5" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/60 animate-ping"></div>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-red-500/15">
                                        <User className="w-5 h-5" />
                                        <span>Admin</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className={isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}>
                                    <DropdownMenuItem className="hover:bg-slate-700/50 cursor-pointer">Profile</DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-slate-700/50 cursor-pointer">Settings</DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-red-500/20 text-red-500 cursor-pointer" onClick={logout}>
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                            <p className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Welcome back, Admin</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                className={`transition-all duration-300 bg-transparent border-slate-600 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/25 ${
                                    isDarkMode ? "text-white border-slate-700" : "text-slate-800 border-slate-300"
                                }`}
                                onClick={generateReport}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            {
                                title: "Total Revenue",
                                value: `LKR ${realTotalRevenue.toLocaleString()}`,
                                icon: DollarSign,
                                change: "12.5% from last week",
                                changeColor: "text-green-500",
                                iconColor: "text-cyan-400",
                                bgGlow: "shadow-cyan-500/15",
                            },
                            {
                                title: "Total Orders",
                                value: realTotalOrders.toString(),
                                icon: ShoppingCart,
                                change: "8.2% from last week",
                                changeColor: "text-green-500",
                                iconColor: "text-red-400",
                                bgGlow: "shadow-red-500/15",
                            },
                            {
                                title: "Total Customers",
                                value: realTotalCustomers.toString(),
                                icon: Users,
                                change: "2.1% from last week",
                                changeColor: "text-red-500",
                                iconColor: "text-purple-400",
                                bgGlow: "shadow-purple-500/15",
                            },
                            {
                                title: "Total Products",
                                value: realTotalProducts.toString(),
                                icon: Package,
                                change: "5.3% from last week",
                                changeColor: "text-green-500",
                                iconColor: "text-yellow-400",
                                bgGlow: "shadow-yellow-500/15",
                            },
                        ].map((stat) => (
                            <Card
                                key={stat.title}
                                className={`backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105 ${
                                    isDarkMode 
                                        ? "bg-slate-800/50 border-slate-700/50 text-white " + stat.bgGlow
                                        : "bg-white border-slate-200 text-slate-800 shadow-sm"
                                }`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} text-sm font-medium`}>{stat.title}</p>
                                            <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                            <p className={`text-sm mt-1 ${stat.changeColor}`}>
                                                {stat.change.includes("-") ? "↓" : "↑"} {stat.change}
                                            </p>
                                        </div>
                                        <div
                                            className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-lg animate-pulse ${
                                                isDarkMode ? "bg-slate-700/50 " + stat.bgGlow : "bg-slate-100 shadow-sm"
                                            }`}
                                        >
                                            <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {}
                        <Card className={`backdrop-blur-xl shadow-xl transition-all duration-300 ${
                            isDarkMode ? "bg-slate-800/50 border-slate-700/50 shadow-red-500/5 text-white" : "bg-white border-slate-200 text-slate-800"
                        }`}>
                            <CardHeader className={`border-b ${isDarkMode ? "border-slate-700/50" : "border-slate-200"}`}>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Top Selling Products</CardTitle>
                                    <Link to="/admin-products">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={isDarkMode ? "text-red-400 hover:text-red-300 hover:bg-red-500/15" : "text-red-600 hover:text-red-700 hover:bg-red-500/10"}
                                        >
                                            View All
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className={`border-b ${isDarkMode ? "border-slate-700/50" : "border-slate-200"}`}>
                                            <th className={`text-left p-4 font-medium text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>PRODUCT</th>
                                            <th className={`text-left p-4 font-medium text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>SALES</th>
                                            <th className={`text-left p-4 font-medium text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>UNITS</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {topProducts.length > 0 ? (
                                            topProducts.map((product, index) => (
                                                <tr
                                                    key={index}
                                                    className={`border-b last:border-b-0 hover:bg-slate-700/10 transition-colors ${
                                                        isDarkMode ? "border-slate-700/50" : "border-slate-200"
                                                    }`}
                                                >
                                                    <td className="p-4 text-sm font-medium">{product.name}</td>
                                                    <td className="p-4 text-sm">{product.sales}</td>
                                                    <td className="p-4 text-sm">{product.units}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-slate-400">No product sales yet</td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {}
                        <Card className={`backdrop-blur-xl shadow-xl transition-all duration-300 ${
                            isDarkMode ? "bg-slate-800/50 border-slate-700/50 shadow-red-500/5 text-white" : "bg-white border-slate-200 text-slate-800"
                        }`}>
                            <CardHeader className={`border-b ${isDarkMode ? "border-slate-700/50" : "border-slate-200"}`}>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Recent User Activity</CardTitle>
                                    <Link to="/admin-users">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={isDarkMode ? "text-red-400 hover:text-red-300 hover:bg-red-500/15" : "text-red-600 hover:text-red-700 hover:bg-red-500/10"}
                                        >
                                            View All
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                {userActivity.length > 0 ? (
                                    userActivity.map((activity, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <Activity className="w-5 h-5 text-red-500 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-sm">
                                                    <span className="font-semibold">{activity.user}</span> {activity.action}
                                                </p>
                                                <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{activity.time}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 text-center py-4">No recent activity</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {}
                        <div className="lg:col-span-3">
                            <Card className={`backdrop-blur-xl shadow-xl transition-all duration-300 ${
                                isDarkMode ? "bg-slate-800/50 border-slate-700/50 shadow-red-500/5 text-white" : "bg-white border-slate-200 text-slate-800"
                            }`}>
                                <CardHeader className={`border-b ${isDarkMode ? "border-slate-700/50" : "border-slate-200"}`}>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Recent Orders</CardTitle>
                                        <Link to="/admin-orders">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={isDarkMode ? "text-red-400 hover:text-red-300 hover:bg-red-500/15" : "text-red-600 hover:text-red-700 hover:bg-red-500/10"}
                                            >
                                                View All
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                            <tr className={`border-b ${isDarkMode ? "border-slate-700/50" : "border-slate-200"}`}>
                                                <th className={`text-left p-4 font-medium text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>ORDER ID</th>
                                                <th className={`text-left p-4 font-medium text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>CUSTOMER</th>
                                                <th className={`text-left p-4 font-medium text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>STATUS</th>
                                                <th className={`text-left p-4 font-medium text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>TOTAL</th>
                                                <th className={`text-left p-4 font-medium text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>ACTIONS</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {recentOrders.length > 0 ? (
                                                recentOrders.map((order) => (
                                                    <tr
                                                        key={order.id}
                                                        className={`border-b last:border-b-0 hover:bg-slate-700/10 transition-colors ${
                                                            isDarkMode ? "border-slate-700/50" : "border-slate-200"
                                                        }`}
                                                    >
                                                        <td className="p-4 text-sm font-medium">{order.id}</td>
                                                        <td className="p-4 text-sm">{order.customer}</td>
                                                        <td className="p-4 text-sm">
                                                            <Badge variant="outline" className={`border ${getStatusBadgeColor(order.status)}`}>
                                                                {order.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4 text-sm font-medium">{order.total}</td>
                                                        <td className="p-4 text-sm">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-700/50">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent className={isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 text-slate-800"}>
                                                                    <Link to="/admin-orders">
                                                                        <DropdownMenuItem className="hover:bg-slate-700/50 cursor-pointer">View Details</DropdownMenuItem>
                                                                    </Link>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="p-12 text-center text-slate-400">
                                                        <div className="flex flex-col items-center gap-4">
                                                            <ShoppingCart className="w-12 h-12 text-slate-600" />
                                                            <p>No recent orders found</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {}
                        <div className="space-y-6">
                            <Card className={`backdrop-blur-xl shadow-xl transition-all duration-300 ${
                                isDarkMode ? "bg-slate-800/50 border-slate-700/50 shadow-red-500/5 text-white" : "bg-white border-slate-200 text-slate-800"
                            }`}>
                                <CardHeader>
                                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Total Sales</span>
                                        <span className="font-semibold">LKR {realTotalRevenue.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Total Orders</span>
                                        <span className="font-semibold">{realTotalOrders}</span>
                                    </div>
                                    <Button 
                                        className="w-full bg-red-500 hover:bg-red-600 text-white mt-4 shadow-lg shadow-red-500/40 hover:shadow-red-500/60 transition-all duration-300 transform hover:scale-105"
                                        onClick={generateReport}
                                    >
                                        Generate Report
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}