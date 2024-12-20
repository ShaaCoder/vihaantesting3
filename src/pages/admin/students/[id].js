import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";

export default function StudentDetails() {
    const router = useRouter();
    const { id } = router.query; // Get the student ID from the URL
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false); // State to track whether the form is in edit mode
    const [formData, setFormData] = useState({
        fullname: "",
        class: "",
        emailId: "",
        balance: "",
        enrollmentNumber: "",
        address: "",
        mobileNumber: "",
        courses: [], // Array to hold multiple courseCode and subject pairs
    });

    useEffect(() => {
        if (!id) return; // If ID is not yet available, do not fetch

        const fetchStudentDetails = async () => {
            try {
                const res = await fetch(`/api/students/${id}`);
                const data = await res.json();
                setStudent(data);
                setFormData({
                    fullname: data.fullname || "",
                    class: data.class || "",
                    emailId: data.emailId || "",
                    balance: data.balance || "",
                    enrollmentNumber: data.enrollmentNumber || "",
                    address: data.address || "",
                    mobileNumber: data.mobileNumber || "",
                    courses: data.courses || [], // Set courses to the student's courses
                });
            } catch (error) {
                console.error("Error fetching student details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [id]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle course-specific input changes
    const handleCourseChange = (e, index) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updatedCourses = [...prev.courses];
            updatedCourses[index] = { ...updatedCourses[index], [name]: value };
            return { ...prev, courses: updatedCourses };
        });
    };

    // Add a new course
    const handleAddCourse = () => {
        setFormData((prev) => ({
            ...prev,
            courses: [...prev.courses, { courseCode: "", subject: "" }],
        }));
    };

    // Remove a course
    const handleRemoveCourse = (index) => {
        setFormData((prev) => ({
            ...prev,
            courses: prev.courses.filter((_, i) => i !== index),
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/students/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const updatedStudent = await res.json();
                setStudent(updatedStudent);
                setEditing(false);
            } else {
                console.error("Failed to update student");
            }
        } catch (error) {
            console.error("Error updating student details:", error);
        }
    };

    if (loading) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    if (!student) {
        return <div className="text-center mt-8">Student not found</div>;
    }

    return (
        <AdminLayout>
            <div className="container mx-auto py-8 px-4 text-black">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Student Details</h2>
                    <button
                        onClick={() => setEditing(!editing)}
                        className="bg-blue-500 text-white px-6 py-2 rounded mb-4"
                    >
                        {editing ? "Cancel Edit" : "Edit Student"}
                    </button>

                    {editing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                placeholder="Full Name"
                                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                            />

                            <input
                                type="text"
                                name="class"
                                value={formData.class}
                                onChange={handleInputChange}
                                placeholder="Class"
                                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                            />

                            <input
                                type="email"
                                name="emailId"
                                value={formData.emailId}
                                onChange={handleInputChange}
                                placeholder="Email"
                                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                            />

                            <input
                                type="text"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleInputChange}
                                placeholder="Mobile Number"
                                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                            />

                            <input
                                type="number"
                                name="balance"
                                value={formData.balance}
                                onChange={handleInputChange}
                                placeholder="Balance"
                                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                            />

                            <input
                                type="text"
                                name="enrollmentNumber"
                                value={formData.enrollmentNumber}
                                onChange={handleInputChange}
                                placeholder="Enrollment Number"
                                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                            />

                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Address"
                                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                            />

                            <h3 className="mt-4 font-medium">Courses:</h3>
                            {formData.courses.map((course, index) => (
                                <div key={index} className="flex space-x-4 mb-4">
                                    <input
                                        type="text"
                                        name="courseCode"
                                        value={course.courseCode}
                                        onChange={(e) => handleCourseChange(e, index)}
                                        placeholder="Course Code"
                                        className="w-1/2 border border-gray-300 px-3 py-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="subject"
                                        value={course.subject}
                                        onChange={(e) => handleCourseChange(e, index)}
                                        placeholder="Subject"
                                        className="w-1/2 border border-gray-300 px-3 py-2 rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCourse(index)}
                                        className="bg-red-500 text-white px-3 py-2 rounded-md"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddCourse}
                                className="bg-green-500 text-white px-6 py-2 rounded"
                            >
                                Add Course
                            </button>

                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-6 py-2 rounded mt-4"
                            >
                                Save Changes
                            </button>
                        </form>
                    ) : (
                        <div>
                            <table className="table-auto w-full border-collapse">
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2 font-semibold">Full Name:</td>
                                        <td className="border px-4 py-2">{student.fullname}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2 font-semibold">Class:</td>
                                        <td className="border px-4 py-2">{student.class}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2 font-semibold">Email:</td>
                                        <td className="border px-4 py-2">{student.emailId}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2 font-semibold">Mobile:</td>
                                        <td className="border px-4 py-2">{student.mobileNumber}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2 font-semibold">Balance:</td>
                                        <td className="border px-4 py-2">{student.balance}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2 font-semibold">Enrollment Number:</td>
                                        <td className="border px-4 py-2">{student.enrollmentNumber}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2 font-semibold">Address:</td>
                                        <td className="border px-4 py-2">{student.address}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2 font-semibold">Courses:</td>
                                        <td className="border px-4 py-2">
                                            {student.courses.map((course, index) => (
                                                <div key={index}>
                                                    {course.courseCode} - {course.subject}
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
