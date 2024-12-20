// pages/api/course-options.js
import dbConnect from "../../../lib/mongodb"; // Assume this is your DB connection file
import Course from "../../../models/Student"; // Your Course model (replace with your actual model)

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            // Fetch course and subject data from the database
            const courses = await Course.find();
            const courseOptions = courses.map(course => course.code); // Assuming 'code' is the field for course code
            const subjectOptions = courses.map(course => course.subject); // Assuming 'subject' is the field for subject name

            res.status(200).json({
                courseCodes: courseOptions,
                subjects: subjectOptions,
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching course options', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
