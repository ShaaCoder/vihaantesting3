import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/solid'; // Corrected import for Heroicons v2
import AdminLayout from "@/components/AdminLayout";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    class: "",
    mobileNumber: "",
    enrollmentNumber: "",
    referenceNumber: "",
    emailId: "",
    balance: "",
    address: "",
    courses: [],
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false); // Controls form visibility
  const [dropdownOpen, setDropdownOpen] = useState(null); // Track which dropdown is open
  const router = useRouter();
  
  // Handle course changes
  const handleCourseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCourses = [...formData.courses];
    updatedCourses[index] = {
        ...updatedCourses[index],
        [name]: value,
    };
    setFormData((prevState) => ({
        ...prevState,
        courses: updatedCourses,
    }));
  };

  const handleAddCourse = () => {
    setFormData((prevState) => ({
        ...prevState,
        courses: [...prevState.courses, { courseCode: "", subject: "" }],
    }));
  };

  const handleRemoveCourse = (index) => {
    const updatedCourses = formData.courses.filter((_, i) => i !== index);
    setFormData((prevState) => ({
        ...prevState,
        courses: updatedCourses,
    }));
  };

  // Fetch students data
  useEffect(() => {
    fetch("/api/students")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
        setFilteredStudents(data); // Initially, all students are displayed
      });
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filtered = students.filter(
        (student) =>
          student.fullname.toLowerCase().includes(query) ||
          student.enrollmentNumber.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students); // If query is empty, show all students
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Add new student or toggle form visibility
  const handleAddStudentClick = () => {
    setShowForm(!showForm); // Toggle the form visibility
    setFormData({
      fullname: "",
      class: "",
      mobileNumber: "",
      enrollmentNumber: "",
      referenceNumber: "",
      emailId: "",
      balance: "",
      address: "",
      courses: [],
    }); // Clear form data for a new student
    setEditingStudent(null); // Reset editing state
  };

  // Submit form data (POST/PUT)
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingStudent ? "PUT" : "POST"; // Use PUT if editing, POST if adding
    const url = editingStudent
      ? `/api/students/${editingStudent._id}`
      : "/api/students";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setStudents((prevStudents) =>
          editingStudent
            ? prevStudents.map((student) =>
                student._id === data._id ? data : student
              )
            : [...prevStudents, data]
        );
        setFilteredStudents((prevStudents) =>
          editingStudent
            ? prevStudents.map((student) =>
                student._id === data._id ? data : student
              )
            : [...prevStudents, data]
        );
        setShowForm(false); // Hide form after submission
        setEditingStudent(null); // Clear the editing student
      })
      .catch((error) => {
        console.error("Error saving student:", error);
      });
  };

  // Edit student
  const handleEdit = (student) => {
    setFormData({
        fullname: student.fullname,
        class: student.class,
        mobileNumber: student.mobileNumber,
        enrollmentNumber: student.enrollmentNumber,
        referenceNumber: student.referenceNumber,
        emailId: student.emailId,
        balance: student.balance,
        address: student.address,
        courses: student.courses || [],
    });
    setEditingStudent(student);
    setShowForm(true);
  };

  // Delete student
  const handleDelete = (studentId) => {
    fetch(`/api/students/${studentId}`, {
      method: "DELETE",
    })
      .then(() => {
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student._id !== studentId)
        );
        setFilteredStudents((prevStudents) =>
          prevStudents.filter((student) => student._id !== studentId)
        );
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
      });
  };

  // View student details
  const handleView = (id) => {
    router.push(`/admin/students/${id}`);
};

  // Toggle dropdown visibility for actions
  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id); // Toggle dropdown for the clicked student
  };

  // Reset form
  const resetForm = () => {
    setFormData({
        fullname: "",
        class: "",
        mobileNumber: "",
        enrollmentNumber: "",
        referenceNumber: "",
        emailId: "",
        balance: "",
        address: "",
        courses: [],
    });
    setEditingStudent(null);
    setShowForm(false);
};

  return (
    <AdminLayout>
      <h1 className="text-3xl font-semibold text-blue-600 mb-6">Manage Students</h1>

      <div className="flex flex-wrap items-center justify-between mb-6">
        <button
          onClick={handleAddStudentClick}
          className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-600 transition duration-200 transform hover:scale-105"
        >
          Add Student
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by Full Name or Enrollment Number"
          className="border-2 border-gray-300 px-4 py-2 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 transform hover:scale-105"
        />
      </div>

      {showForm && (
        <motion.form
          onSubmit={handleSubmit}
          className="text-black mb-6 bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[["Full Name", "fullname"], ["Class", "class"], ["Mobile Number", "mobileNumber"], ["Enrollment Number", "enrollmentNumber"], ["Reference Number", "referenceNumber"], ["Email", "emailId"], ["Balance", "balance"], ["Address", "address"]].map(([label, name]) => (
              <div key={name} className="mb-4">
                <label className="block text-sm font-medium">{label}</label>
                <input
                  type={name === "balance" ? "number" : "text"}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-black border rounded-md"
                  required
                />
              </div>
            ))}

            {/* Courses */}
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium mb-2">Courses</label>
              {formData.courses.map((course, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="text"
                    name="courseCode"
                    placeholder="Course Code"
                    value={course.courseCode}
                    onChange={(e) => handleCourseChange(index, e)}
                    className="w-full sm:w-1/2 px-4 py-2 border rounded-md"
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={course.subject}
                    onChange={(e) => handleCourseChange(index, e)}
                    className="w-full sm:w-1/2 px-4 py-2 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCourse(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddCourse}
                className="text-blue-500 hover:text-blue-700"
              >
                + Add Course
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg"
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              {editingStudent ? "Update" : "Add"} Student
            </button>
          </div>
        </motion.form>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-sm text-gray-500">
            <tr>
              <th className="px-6 py-3">Full Name</th>
              <th className="px-6 py-3">Enrollment No</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Balance</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <motion.tr
                key={student._id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm">{student.fullname}</td>
                <td className="px-6 py-4 text-sm">{student.enrollmentNumber}</td>
                <td className="px-6 py-4 text-sm">{student.emailId}</td>
                <td className="px-6 py-4 text-sm">{student.balance}</td>
                <td className="px-6 py-4 text-sm flex space-x-2">
                  <button
                    onClick={() => handleView(student._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(student)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
