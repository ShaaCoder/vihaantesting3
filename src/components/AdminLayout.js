import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

export default function AdminLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (status === "loading") {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (status === "unauthenticated") {
        router.push("/");
        return null;
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };

    return (
        <div className="min-h-screen  text-red-600 flex overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-900 text-white p-4 transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 transition-transform duration-300 ease-in-out h-screen`}
            >
                <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <Link href="/admin" className="block px-4 py-2 rounded hover:bg-blue-700">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/manage-students" className="block px-4 py-2 rounded hover:bg-blue-700">
                                Manage Students
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/reports" className="block px-4 py-2 rounded hover:bg-blue-700">
                                Reports
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={handleSignOut}
                                className="w-full text-left px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden p-4 text-white bg-blue-900 fixed top-4 right-4 z-40"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* Overlay for Sidebar on Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-6 overflow-auto">
                <header className="bg-white p-4 rounded shadow mb-6">
                    <h1 className="text-2xl font-bold">
                        Welcome, {session?.user?.name || "Admin"}!
                    </h1>
                </header>

                {/* Children Content */}
                {children}
            </main>
        </div>
    );
}
