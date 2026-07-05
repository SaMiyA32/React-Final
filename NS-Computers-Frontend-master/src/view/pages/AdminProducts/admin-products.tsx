"use client"

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Search,
    Plus,
    Save,
    X,
    Loader2,
    AlertCircle,
    RefreshCw,
    Package,
    Pencil,
    Trash2,
    Download,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    TrendingUp,
    Users,
    ShoppingCart,
    DollarSign,
    Bell,
    User,
    Heart,
    Edit,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "@/slices/productSlice";
import type { ProductData } from "@/model/ProductData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";


interface ProductFormData {
    id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
}


const AnimatedBackground = ({ isDarkMode }: { isDarkMode: boolean }) => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {}
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full animate-pulse ${
                        i % 3 === 0
                            ? isDarkMode ? "bg-red-400/50" : "bg-red-400/20"
                            : i % 3 === 1
                                ? isDarkMode ? "bg-cyan-400/30" : "bg-cyan-400/15"
                                : isDarkMode ? "bg-red-500/20" : "bg-red-500/10"
                    }`}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${3 + Math.random() * 2}s`,
                    }}
                />
            ))}

            {}
            <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
                isDarkMode ? "bg-gradient-to-r from-cyan-500/5 to-blue-500/5" : "bg-gradient-to-r from-cyan-500/2 to-blue-500/2"
            }`} />
            <div
                className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
                    isDarkMode ? "bg-gradient-to-r from-teal-500/5 to-cyan-500/5" : "bg-gradient-to-r from-teal-500/2 to-cyan-500/2"
                }`}
                style={{ animationDelay: "1s" }}
            />
        </div>
    )
}

export default function AdminProductPage() {
    
    const dispatch = useAppDispatch();
    const products = useAppSelector((state) => state.product.list || []);
    const orders = useAppSelector((state) => state.orders.orders || []);
    const users = useAppSelector((state) => state.users.users || []);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const { logout } = useAuth();

    
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') !== 'light';
    });

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

    
    const generateReport = () => {
        if (orders.length === 0) {
            alert("No orders available to generate report.");
            return;
        }
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Order ID,Customer Name,Status,Total Amount,Date\n";
        orders.forEach(o => {
            csvContent += `"${o._id || o.orderNumber}","${o.username || 'Guest'}","${o.status}","${o.totalPrice || o.totalAmount || 0}","${o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}"\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `NS_Computers_Orders_Report_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    
    useEffect(() => {
        console.log('🔄 Products updated:', {
            products,
            loading: false,
            error: null
        });
    }, [products]);

    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDebug, setShowDebug] = useState(false);

    
    const [currentProduct, setCurrentProduct] = useState<Partial<ProductFormData>>({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "laptops",
        imageUrl: ""
    });

    
    const filteredProducts = useMemo(() => {
        if (!products) return [];

        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' ||
                                 product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    
    useEffect(() => {
        console.log('🔄 Product state changed:', {
            loading: false,
            error: null,
            products: products, 
            productCount: products?.length || 0,
            filteredProducts: filteredProducts, 
            filteredCount: filteredProducts.length
        });

        
        if (products && products.length > 0) {
            console.log('📊 First product structure:', {
                keys: Object.keys(products[0]),
                values: Object.values(products[0]).map(v => ({
                    type: typeof v,
                    value: v
                }))
            });
        }
    }, [products, filteredProducts]);

    
    const logReduxState = () => {
        console.group('Redux State Dump');
        console.log('Products:', products);
        console.log('Filtered Products:', filteredProducts);
        console.log('Loading:', false);
        console.log('Error:', null);
        console.groupEnd();
    };

    
    console.log('🎬 Component render:', {
        products,
        filteredProducts,
        loading: false,
        error: null,
        productsType: typeof products,
        isArray: Array.isArray(products),
        keys: products ? Object.keys(products) : []
    });

    
    useEffect(() => {
        console.log('🔍 Products state changed:', {
            products,
            filteredProducts,
            loading: false,
            error: null
        });
    }, [products, filteredProducts]);

    
    const fetchProductsDirectly = async () => {
        try {
            console.log('🔄 [Direct Fetch] Fetching products directly...');
            const response = await fetch('http://localhost:3000/api/products/get-all-products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ [Direct Fetch] Products data:', data);

            
            let productsData = [];
            if (Array.isArray(data)) {
                productsData = data;
            } else if (data && Array.isArray(data.data)) {
                productsData = data.data;
            } else if (data && Array.isArray(data.products)) {
                productsData = data.products;
            }

            console.log(`✅ [Direct Fetch] Found ${productsData.length} products`);

            
            dispatch({
                type: 'product/getAllProducts/fulfilled',
                payload: productsData
            });

            return productsData;

        } catch (error) {
            console.error('❌ [Direct Fetch] Error:', error);
            toast.error('Failed to load products');
            return [];
        }
    };

    
    useEffect(() => {
        if (isInitialLoad) {
            console.log('🔄 [Component] Fetching products...');

            
            fetchProductsDirectly()
                .then(products => {
                    if (!products || products.length === 0) {
                        
                        console.log('🔄 [Component] Trying Redux thunk...');
                        return dispatch(getAllProducts());
                    }
                    return products;
                })
                .then(() => {
                    console.log('✅ [Component] Products loaded successfully');
                    setIsInitialLoad(false);
                })
                .catch((err) => {
                    console.error('❌ [Component] Error loading products:', err);
                    setIsInitialLoad(false);
                });
        }
    }, [dispatch, isInitialLoad]);

    
    const testDirectFetch = async () => {
        try {
            console.log('🔍 [Direct Fetch] Testing direct API call...');
            const token = localStorage.getItem('token');
            console.log('🔑 [Direct Fetch] Token:', token ? 'Exists' : 'Missing');

            const response = await fetch('http://localhost:3000/api/products/get-all-products', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 [Direct Fetch] Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ [Direct Fetch] Error response:', errorText);
                return;
            }

            const data = await response.json();
            console.log('✅ [Direct Fetch] Success! Data:', {
                dataType: typeof data,
                isArray: Array.isArray(data),
                keys: Object.keys(data || {}),
                data: data
            });

            
            let products = [];
            if (Array.isArray(data)) {
                products = data;
            } else if (data && Array.isArray(data.data)) {
                products = data.data;
            } else if (data && Array.isArray(data.products)) {
                products = data.products;
            }

            console.log(`📦 [Direct Fetch] Extracted ${products.length} products`);
            if (products.length > 0) {
                console.log('📝 [Direct Fetch] First product:', products[0]);
            }

        } catch (error) {
            console.error('❌ [Direct Fetch] Error:', error);
        }
    };

    
    useEffect(() => {
        console.log('🔄 filteredProducts updated:', {
            count: filteredProducts?.length,
            firstItem: filteredProducts?.[0]
        });

        
        testDirectFetch();
    }, [filteredProducts]);

    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('🔄 [Component] Fetching products...');
                const result = await dispatch(getAllProducts()).unwrap();
                console.log('✅ [Component] Products loaded successfully:', result);
            } catch (error) {
                console.error('❌ [Component] Failed to fetch products:', error);
                toast.error('Failed to load products. Please check your connection and try again.');
            } finally {
                setIsInitialLoad(false);
            }
        };

        if (isInitialLoad) {
            fetchProducts();
        }

        
        const intervalId = setInterval(fetchProducts, 30000);
        return () => clearInterval(intervalId);
    }, [dispatch, isInitialLoad]);

    
    const resetForm = () => {
        setCurrentProduct({
            name: "",
            description: "",
            price: 0,
            stock: 0,
            category: "laptops",
            imageUrl: ""
        });
        setIsEditMode(false);
    };

    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock'
                ? Number(value)
                : value
        }));
    };

    
    const handleSelectChange = (value: string) => {
        setCurrentProduct(prev => ({
            ...prev,
            category: value
        }));
    };

    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (isEditMode && currentProduct.id) {
                await dispatch(updateProduct(currentProduct as ProductData)).unwrap();
                toast.success("Product updated successfully");
            } else {
                await dispatch(createProduct(currentProduct)).unwrap();
                toast.success("Product created successfully");
            }
            setIsAddModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error("Failed to save product. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    
    const handleEditProduct = (product: ProductData) => {
        setCurrentProduct({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            imageUrl: product.imageUrl || ""
        });
        setIsEditMode(true);
        setIsAddModalOpen(true);
    };

    
    const handleDeleteProduct = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
                toast.success("Product deleted successfully");
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product. Please try again.");
            }
        }
    };

    

    
    if (isInitialLoad) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-slate-300">Loading products...</p>
                </div>
            </div>
        );
    }

    
    if (false) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center p-6 bg-slate-800/80 rounded-lg">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Products</h2>
                    <p className="text-slate-300 mb-4">We couldn't load the products. </p>
                    <Button
                        onClick={() => {
                            setIsInitialLoad(true);
                            dispatch(getAllProducts())
                                .unwrap()
                                .catch(() => {})
                                .finally(() => setIsInitialLoad(false));
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    // Get unique categories for filter - safely handle when products is undefined
    const categories = ["all"];
    if (products && Array.isArray(products)) {
        const validCategories = products
            .map(p => p?.category)
            .filter((category): category is string => Boolean(category));
        categories.push(...new Set(validCategories));
    }

    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
            isDarkMode ? "bg-black text-white" : "bg-slate-50 text-slate-900"
        }`}>
            <AnimatedBackground isDarkMode={isDarkMode} />

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-64 backdrop-blur-xl border-r transition-all duration-300 z-10 ${
                isDarkMode ? "bg-slate-800/90 border-slate-700/50 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-red-400">NS Computers</span>
                    </div>

                    <nav className="space-y-2">
                        {[
                            { icon: TrendingUp, label: "Dashboard", link: "/admin-dashboard" },
                            { icon: Users, label: "Users", link: "/admin-users" },
                            { icon: Package, label: "Products", link: "/admin-products" },
                            { icon: ShoppingCart, label: "Orders", link: "/admin-orders" },
                            { icon: DollarSign, label: "Analytics", link: "/admin-dashboard" },
                        ].map((item) => {
                            const isActive = window.location.pathname === item.link;
                            return (
                                <Link
                                    key={item.label}
                                    to={item.link}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                                        isActive
                                            ? "bg-red-500/20 border border-red-500/30 text-red-400 shadow-lg shadow-red-500/10"
                                            : isDarkMode
                                                ? "hover:bg-slate-700/50 text-slate-300 hover:shadow-md"
                                                : "hover:bg-slate-100 text-slate-600 hover:shadow-md"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
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

                        {/* Logout Button */}
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

            {/* Main Content */}
            <div className="ml-64">
                {/* Top Header */}
                <div className={`backdrop-blur-xl border-b px-8 py-4 transition-colors duration-300 ${
                    isDarkMode ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex-1 max-w-md flex gap-4 items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Search products..."
                                    className={`pl-10 transition-all duration-300 ${
                                        isDarkMode 
                                            ? "bg-slate-700/50 border-slate-600 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/25" 
                                            : "bg-white border-slate-300 text-slate-800 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/15"
                                    }`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className={`w-[180px] ${
                                    isDarkMode 
                                        ? "bg-slate-700/50 border-slate-600 text-white" 
                                        : "bg-white border-slate-300 text-slate-800"
                                }`}>
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent className={isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Products</h1>
                            <p className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Manage your catalog</p>
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
                            <Dialog open={isAddModalOpen} onOpenChange={(open) => {
                                if (!open) {
                                    resetForm();
                                }
                                setIsAddModalOpen(open);
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add New
                                    </Button>
                                </DialogTrigger>
                            </Dialog>
                        </div>
                    </div>

                    {/* Stats Cards */}
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

                    {/* Products Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Main Products Table */}
                        <div className="lg:col-span-3">
                            <Card className={`backdrop-blur-xl shadow-xl transition-all duration-300 ${
                                isDarkMode ? "bg-slate-800/50 border-slate-700/50 shadow-red-500/5 text-white" : "bg-white border-slate-200 text-slate-800"
                            }`}>
                                <CardHeader className={`border-b ${isDarkMode ? "border-slate-700/50" : "border-slate-200"}`}>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Products</CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={isDarkMode ? "text-red-400 hover:text-red-300 hover:bg-red-500/15" : "text-red-600 hover:text-red-700 hover:bg-red-500/10"}
                                            onClick={() => {
                                                resetForm();
                                                setIsAddModalOpen(true);
                                            }}
                                        >
                                            <Plus className="w-4 h-4 mr-1" /> Add Product
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                            <tr className={`border-b ${isDarkMode ? "border-slate-700/50" : "border-slate-200"}`}>
                                                <th className={`text-left p-4 font-medium text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>PRODUCT</th>
                                                <th className={`text-left p-4 font-medium text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>DESCRIPTION</th>
                                                <th className={`text-left p-4 font-medium text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>PRICE</th>
                                                <th className={`text-left p-4 font-medium text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>STOCK</th>
                                                <th className={`text-left p-4 font-medium text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>CATEGORY</th>
                                                <th className={`text-right p-4 font-medium text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>ACTIONS</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {filteredProducts.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="p-12 text-center">
                                                        <div className="flex flex-col items-center gap-4">
                                                            <Package className="w-12 h-12 text-slate-600" />
                                                            <p className={isDarkMode ? "text-slate-400" : "text-slate-500"}>No products found</p>
                                                            <Button
                                                                variant="outline"
                                                                className={isDarkMode ? "text-red-400 border-red-400 hover:bg-red-400/10" : "text-red-600 border-red-600 hover:bg-red-600/10"}
                                                                onClick={() => {
                                                                    resetForm();
                                                                    setIsAddModalOpen(true);
                                                                }}
                                                            >
                                                                <Plus className="w-4 h-4 mr-2" /> Add Your First Product
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredProducts.map((product) => (
                                                    <tr key={product.id} className={`border-b last:border-b-0 hover:bg-slate-700/10 transition-colors ${
                                                        isDarkMode ? "border-slate-700/50" : "border-slate-200"
                                                    }`}>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                {product.imageUrl && (
                                                                    <img
                                                                        src={product.imageUrl}
                                                                        alt={product.name}
                                                                        className="w-10 h-10 rounded-md object-cover"
                                                                    />
                                                                )}
                                                                <p className="font-medium">{product.name}</p>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 max-w-[400px]">
                                                            <p className={`text-sm line-clamp-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                                                                {product.description || 'No description available'}
                                                            </p>
                                                        </td>
                                                        <td className="p-4 font-semibold">
                                                            LKR {product.price.toFixed(2)}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                product.stock > 10 
                                                                    ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                                                                    : product.stock > 0 
                                                                        ? isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                                                                        : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                                {product.stock} in stock
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 text-xs rounded-md ${
                                                                isDarkMode ? "bg-slate-700/50 text-cyan-400" : "bg-slate-100 text-slate-800"
                                                            }`}>
                                                                {product.category}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className={isDarkMode ? "text-cyan-400 hover:bg-cyan-900/20" : "text-cyan-600 hover:bg-cyan-100"}
                                                                    onClick={() => handleEditProduct(product)}
                                                                >
                                                                    <Pencil className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className={isDarkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-100"}
                                                                    onClick={() => product.id && handleDeleteProduct(product.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Stats Sidebar */}
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

            {/* Add Product Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={(open) => {
                if (!open) {
                    resetForm();
                }
                setIsAddModalOpen(open);
            }}>
                <DialogContent className={`backdrop-blur-xl border-slate-700/50 max-w-2xl transition-colors duration-300 ${
                    isDarkMode ? "bg-slate-800/95 text-white" : "bg-white text-slate-800"
                }`}>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader className={`border-b pb-4 ${isDarkMode ? "border-slate-700/50" : "border-slate-200"}`}>
                            <div className="flex items-center justify-between">
                                <DialogTitle className="text-xl font-bold">
                                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                                </DialogTitle>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        resetForm();
                                        setIsAddModalOpen(false);
                                    }}
                                    className={isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </DialogHeader>

                        <div className="py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name" className={`font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                                            Product Name *
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={currentProduct.name}
                                            onChange={handleInputChange}
                                            className={`mt-2 ${
                                                isDarkMode 
                                                    ? "bg-slate-700/50 border-slate-600 focus:border-red-500 text-white placeholder:text-slate-400" 
                                                    : "bg-white border-slate-300 focus:border-red-500 text-slate-800 placeholder:text-slate-400"
                                            }`}
                                            placeholder="Enter product name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="category" className={`font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                                            Category
                                        </Label>
                                        <Select
                                            value={currentProduct.category}
                                            onValueChange={handleSelectChange}
                                        >
                                            <SelectTrigger className={`mt-2 ${
                                                isDarkMode 
                                                    ? "bg-slate-700/50 border-slate-600 text-white" 
                                                    : "bg-white border-slate-300 text-slate-800"
                                            }`}>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent className={isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"}>
                                                <SelectItem value="laptops">Laptops</SelectItem>
                                                <SelectItem value="desktops">Desktops</SelectItem>
                                                <SelectItem value="monitors">Monitors</SelectItem>
                                                <SelectItem value="accessories">Accessories</SelectItem>
                                                <SelectItem value="components">Components</SelectItem>
                                                <SelectItem value="peripherals">Peripherals</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="price" className={`font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                                            Price (LKR)
                                        </Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={currentProduct.price || ''}
                                            onChange={handleInputChange}
                                            className={`mt-2 ${
                                                isDarkMode 
                                                    ? "bg-slate-700/50 border-slate-600 focus:border-red-500 text-white placeholder:text-slate-400" 
                                                    : "bg-white border-slate-300 focus:border-red-500 text-slate-800 placeholder:text-slate-400"
                                            }`}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="stock" className={`font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                                            Stock Quantity
                                        </Label>
                                        <Input
                                            id="stock"
                                            name="stock"
                                            type="number"
                                            min="0"
                                            value={currentProduct.stock || ''}
                                            onChange={handleInputChange}
                                            className={`mt-2 ${
                                                isDarkMode 
                                                    ? "bg-slate-700/50 border-slate-600 focus:border-red-500 text-white placeholder:text-slate-400" 
                                                    : "bg-white border-slate-300 focus:border-red-500 text-slate-800 placeholder:text-slate-400"
                                            }`}
                                            placeholder="0"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="imageUrl" className={`font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                                            Image URL (Optional)
                                        </Label>
                                        <Input
                                            id="imageUrl"
                                            name="imageUrl"
                                            type="url"
                                            value={currentProduct.imageUrl || ''}
                                            onChange={handleInputChange}
                                            className={`mt-2 ${
                                                isDarkMode 
                                                    ? "bg-slate-700/50 border-slate-600 focus:border-red-500 text-white placeholder:text-slate-400" 
                                                    : "bg-white border-slate-300 focus:border-red-500 text-slate-800 placeholder:text-slate-400"
                                            }`}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        {currentProduct.imageUrl && (
                                            <div className="mt-2">
                                                <p className="text-xs text-slate-400 mb-1">Image Preview:</p>
                                                <img
                                                    src={currentProduct.imageUrl}
                                                    alt="Preview"
                                                    className={`h-20 w-20 object-cover rounded-md border ${isDarkMode ? "border-slate-600" : "border-slate-300"}`}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <Label htmlFor="description" className={`font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={currentProduct.description || ''}
                                            onChange={handleInputChange}
                                            className={`mt-2 ${
                                                isDarkMode 
                                                    ? "bg-slate-700/50 border-slate-600 focus:border-red-500 text-white placeholder:text-slate-400 min-h-[100px]" 
                                                    : "bg-white border-slate-300 focus:border-red-500 text-slate-800 placeholder:text-slate-400 min-h-[100px]"
                                            }`}
                                            placeholder="Enter product description"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`flex justify-end gap-3 pt-4 border-t ${isDarkMode ? "border-slate-700/50" : "border-slate-200"}`}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    resetForm();
                                    setIsAddModalOpen(false);
                                }}
                                className={`bg-transparent ${isDarkMode ? "border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white" : "border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-800"}`}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-red-500 hover:bg-red-600 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {isEditMode ? 'Updating...' : 'Saving...'}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        {isEditMode ? 'Update Product' : 'Save Product'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}