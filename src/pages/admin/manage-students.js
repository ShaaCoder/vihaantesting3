import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/solid"; // Corrected import for Heroicons v2
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/solid"; // Corrected import for Heroicons v2
import AdminLayout from "@/components/AdminLayout";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStream, setSelectedStream] = useState(""); // Default is no stream selected

  const [formData, setFormData] = useState({
    fullname: "",
    class: "",
    mobileNumber: "",
    enrollmentNumber: "",
    referenceNumber: "",
    emailId: "",
    balance: "",
    address: "",
    stream: "",
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
      ...updatedCourses[index],
      [name]: value,
    };
    setFormData((prevState) => ({
      ...prevState,
      courses: updatedCourses,
      ...prevState,
      courses: updatedCourses,
    }));
  };

  const handleAddCourse = () => {
    setFormData((prevState) => ({
      ...prevState,
      courses: [...prevState.courses, { courseCode: "", subject: "" }],
      ...prevState,
      courses: [...prevState.courses, { courseCode: "", subject: "" }],
    }));
  };

  const handleRemoveCourse = (index) => {
    const updatedCourses = formData.courses.filter((_, i) => i !== index);
    setFormData((prevState) => ({
      ...prevState,
      courses: updatedCourses,
      ...prevState,
      courses: updatedCourses,
    }));
  };

  // Fetch students data
  useEffect(() => {
    fetch("/api/students")
      .then((response) => response.json())
      .then((data) => {
        let filteredData = data;
  
        // If a stream is selected, filter students by stream
        if (selectedStream) {
          filteredData = data.filter((student) => student.stream === selectedStream);
        }
  
        setStudents(data); // Set all students
        setFilteredStudents(filteredData); // Set filtered students based on stream selection
      });
  }, [selectedStream]); // Dependency on selectedStream to refetch and filter data
  

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
      stream:"",
      courses: [],
    }); // Clear form data for a new student
    setEditingStudent(null); // Reset editing state
  };

  // Submit form data (POST/PUT)
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validation logic if necessary
    if (!formData.stream) {
      alert("Please select a stream.");
      return;
    }
  
    const method = editingStudent ? "PUT" : "POST"; 
    const url = editingStudent ? `/api/students/${editingStudent._id}` : "/api/students";
  
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
      stream:student.stream,
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
      stream:"",
      courses: [],
    });
    setEditingStudent(null);
    setShowForm(false);
  };
  

  return (
    <AdminLayout>
      <h1 className="text-3xl font-semibold text-blue-600 mb-6">
        Manage Students
      </h1>
      <h1 className="text-3xl font-semibold text-blue-600 mb-6">
        Manage Students
      </h1>

      <div className="flex flex-wrap items-center justify-between mb-6 space-y-4 sm:space-y-0 sm:flex-row">
  {/* Search Input */}
  <div className="w-full sm:w-1/3">
    <input
      type="text"
      value={searchQuery}
      onChange={handleSearch}
      placeholder="Search by Full Name or Enrollment Number"
      className="border-2 border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    />
  </div>

  {/* Stream Filter Dropdown */}
  <div className="w-full sm:w-1/3">
    <select
      value={selectedStream}
      onChange={(e) => setSelectedStream(e.target.value)}
      className="border-2 border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    >
      <option value="">Select Stream</option>
      <option value="Stream-1">Stream-1</option>
      <option value="Stream-2">Stream-2</option>
    </select>
  </div>

  {/* Add Student Button */}
  <div className="w-full sm:w-auto">
    <button
      onClick={handleAddStudentClick}
      className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg w-full sm:w-auto hover:bg-green-600 transition duration-200 transform hover:scale-105"
    >
      Add Student
    </button>
  </div>
</div>



{showForm && (
  <motion.form
    onSubmit={handleSubmit}
    className="bg-white text-black p-6 rounded-lg shadow-md"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Form Fields */}
    <div className="space-y-6">
      {/* Full Name */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Full Name</label>
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Class */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Class</label>
        <input
          type="text"
          name="class"
          value={formData.class}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Mobile Number */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Mobile Number</label>
        <input
          type="text"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Enrollment Number */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Enrollment Number</label>
        <input
          type="text"
          name="enrollmentNumber"
          value={formData.enrollmentNumber}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Reference Number */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Reference Number</label>
        <input
          type="text"
          name="referenceNumber"
          value={formData.referenceNumber}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          name="emailId"
          value={formData.emailId}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Balance */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Balance</label>
        <input
          type="number"
          name="balance"
          value={formData.balance}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Address */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md"
          rows="4"
          required
        />
      </div>

      {/* Stream Dropdown */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Stream</label>
        <select
          name="stream"
          value={formData.stream}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Stream</option>
          <option value="Stream-1">Stream-1</option>
          <option value="Stream-2">Stream-2</option>
        </select>
      </div>

      {/* Courses Section */}
      <div className="space-y-4">
        <label className="text-sm font-medium mb-2">Courses</label>
        {formData.courses.map((course, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              name="courseCode"
              placeholder="Course Code"
              value={course.courseCode}
              onChange={(e) => handleCourseChange(index, e)}
              className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={course.subject}
              onChange={(e) => handleCourseChange(index, e)}
              className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={() => handleRemoveCourse(index)}
              className="text-red-500 hover:text-red-700 mt-2 sm:mt-0"
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

    {/* Form Buttons */}
    <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
      <button
        type="button"
        onClick={resetForm}
        className="bg-gray-300 text-black px-4 py-2 rounded-lg w-full sm:w-auto"
      >
        Reset
      </button>
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
      >
        {editingStudent ? "Update" : "Add"} Student
      </button>
    </div>
  </motion.form>
)}

<br />

<div className="overflow-x-auto bg-white rounded-lg shadow-lg">
  <table className="min-w-full table-auto">
    <thead className="bg-gray-100 text-sm text-gray-500">
      <tr>
        <th className="px-4 py-3 text-left">Full Name</th>
        <th className="px-4 py-3 text-left">Enrollment No</th>
        <th className="px-4 py-3 text-left">Email</th>
        <th className="px-4 py-3 text-left">Subjects</th>
        <th className="px-4 py-3 text-left">Actions</th>
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
          <td className="px-4 py-4 text-sm">{student.fullname}</td>
          <td className="px-4 py-4 text-sm">{student.enrollmentNumber}</td>
          <td className="px-4 py-4 text-sm">{student.emailId}</td>
          <td className="px-4 py-4 text-sm">
            {/* Display subjects as a comma-separated list */}
            {student.courses.map((course, index) => (
              <span key={index}>
                {course.subject}
                {index < student.courses.length - 1 && ", "}
              </span>
            ))}
          </td>
          <td className="px-4 py-4 text-sm flex space-x-2">
            <button
              onClick={() => handleView(student._id)}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleEdit(student)}
              className="text-yellow-500 hover:text-yellow-700 transition-colors duration-200"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(student._id)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </td>
        </motion.tr>
      ))}
    </tbody>
  </table>
</div>


<div className="overflow-x-auto bg-white rounded-lg shadow-lg">
  <table className="min-w-full table-auto">
    <thead className="bg-gray-100 text-sm text-gray-500">
      <tr>
        <th className="px-4 py-3 text-left">Full Name</th>
        <th className="px-4 py-3 text-left">Enrollment No</th>
        <th className="px-4 py-3 text-left">Email</th>
        <th className="px-4 py-3 text-left">Subjects</th>
        <th className="px-4 py-3 text-left">Actions</th>
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
          <td className="px-4 py-4 text-sm">{student.fullname}</td>
          <td className="px-4 py-4 text-sm">{student.enrollmentNumber}</td>
          <td className="px-4 py-4 text-sm">{student.emailId}</td>
          <td className="px-4 py-4 text-sm">
            {/* Display subjects as a comma-separated list */}
            {student.courses.map((course, index) => (
              <span key={index}>
                {course.subject}
                {index < student.courses.length - 1 && ", "}
              </span>
            ))}
          </td>
          <td className="px-4 py-4 text-sm flex space-x-2">
            <button
              onClick={() => handleView(student._id)}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleEdit(student)}
              className="text-yellow-500 hover:text-yellow-700 transition-colors duration-200"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(student._id)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
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
