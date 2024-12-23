import dbConnect from '../../../lib/mongodb';
import Student from '../../../models/Student';

export default async function handler(req, res) {
    await dbConnect();

    const { id } = req.query;

    // Validate if the ID is provided
    if (!id) {
        return res.status(400).json({ message: 'Student ID is required' });
    }

    try {
        // Handle GET request (Fetch specific student by ID)
        if (req.method === 'GET') {
            const student = await Student.findById(id);

            // Return 404 if student not found
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }

            return res.status(200).json(student);
        }

        // Handle PUT request (Update specific student)
        else if (req.method === 'PUT') {
            const { stream, ...updateData } = req.body;

            // Validate the `stream` field if provided
            if (stream) {
                const validStreams = ['Stream-1', 'Stream-2'];
                if (!validStreams.includes(stream)) {
                    return res.status(400).json({ message: 'Invalid stream. Allowed values are Stream-1 and Stream-2.' });
                }
                updateData.stream = stream; // Include validated stream in update data
            }

            // Update the student record
            const updatedStudent = await Student.findByIdAndUpdate(id, updateData, { new: true });

            // Return 404 if student not found
            if (!updatedStudent) {
                return res.status(404).json({ message: 'Student not found' });
            }

            return res.status(200).json(updatedStudent);
        }

        // Handle DELETE request (Remove specific student)
        else if (req.method === 'DELETE') {
            const deletedStudent = await Student.findByIdAndDelete(id);

            // Return 404 if student not found
            if (!deletedStudent) {
                return res.status(404).json({ message: 'Student not found' });
            }

            return res.status(200).json({ message: 'Student deleted successfully' });
        }

        // Method not allowed for unsupported HTTP methods
        else {
            return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}
