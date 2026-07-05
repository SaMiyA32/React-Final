import { Outlet } from 'react-router-dom';
import Navbar from "../Navbar/Navbar.tsx";
import Footer from "../Footer/Footer.tsx";

interface DefaultLayoutProps {
    children?: React.ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                {children || <Outlet />}
            </main>
            <Footer />
        </div>
    );
}