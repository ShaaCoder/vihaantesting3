import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";

export default function AdminIndex() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ totalStudents: 0, newEnrollments: 0 });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchStats() {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      setStats(data);
    }
    fetchStats();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100">
        <motion.header
          className="bg-white p-6 rounded-lg shadow-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-3xl font-bold text-blue-800">
            Welcome to the Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Hello, {session?.user?.name || "Admin"}! Welcome back.
          </p>
        </motion.header>

        <section>
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-xl font-semibold text-blue-700">Important Updates</h2>
            <p className="mt-2 text-gray-700">
              Stay tuned for upcoming features and improvements. We're working hard to
              make your experience better.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-blue-700">Total Students</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-blue-700">New Enrollments</h3>
              <p className="text-2xl font-bold text-green-600">{stats.newEnrollments}</p>
            </motion.div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}