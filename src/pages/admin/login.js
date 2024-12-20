import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Simple form validation
    if (!form.username || !form.password) {
      setError("Both fields are required.");
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      ...form,
    });

    if (!result?.ok) {
      setError(result?.error || "Invalid credentials");
    } else {
      router.push("/admin");
    }
  };

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex justify-center items-center w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <form
          onSubmit={handleLogin}
          className="w-full space-y-6 text-black"
        >
          <h2 className="text-3xl font-semibold text-center text-gray-800">Admin Login</h2>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="block w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="block w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && <p className="text-center text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
