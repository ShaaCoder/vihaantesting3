import dbConnect from '../../../lib/mongodb';
import Student from '../../../models/Student';

export default async function handler(req, res) {
    await dbConnect();

    const { id } = req.query;

    // Check if the ID is provided and valid
    if (!id) {
        return res.status(400).json({ message: 'Student ID is required' });
    }

    try {
        // Handling GET request (Get specific student by ID)
        if (req.method === 'GET') {
            const student = await Student.findById(id);

            // If no student found, return 404 error
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }

            return res.status(200).json(student);
        }

        // Handling PUT request (Update student)
        else if (req.method === 'PUT') {
            const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });

            // If no student found, return 404 error
            if (!updatedStudent) {
                return res.status(404).json({ message: 'Student not found' });
            }

            return res.status(200).json(updatedStudent);
        }

        // Handling DELETE request (Delete student)
        else if (req.method === 'DELETE') {
            const deletedStudent = await Student.findByIdAndDelete(id);

            // If no student found, return 404 error
            if (!deletedStudent) {
                return res.status(404).json({ message: 'Student not found' });
            }

            return res.status(200).json({ message: 'Student deleted successfully' });
        }

        // Method Not Allowed for other HTTP methods
        else {
            return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
}
