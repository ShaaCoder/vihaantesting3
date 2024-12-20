const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    class: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    enrollmentNumber: { type: String, required: true },
    referenceNumber: { type: String },
    emailId: { type: String, required: true },
    balance: { type: Number, required: true },
    address: { type: String, required: true },
    courses: [
        {
            courseCode: { type: String, required: true },
            subject: { type: String, required: true }
        }
    ]
});

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
