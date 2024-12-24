import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const OutsiderForm = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        "Guest Name": "",
        "Guest Contact": "",
        "Aadhaar Details": "",
        "Reference Enrollment Number": ""
    });
    const [error, setError] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === "Aadhaar Details") {
            const numericValue = value.replace(/\D/g, "");
    
            formattedValue = numericValue
                .match(/.{1,4}/g)
                ?.join(" ") 
                .slice(0, 14) || "";
        }
        setFormData({
            ...formData,
            [name]: formattedValue,
        });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(formData["Guest Contact"])) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }

        try {
            await axios.post('https://2047-27-56-180-134.ngrok-free.app/add_outsider_data', formData);
            setIsDisabled(true);
            navigate("/succes")
        } catch (error) {
            setError('Failed to send data to the server.');
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
                <input
                    autoComplete="off"
                    name="Guest Name"
                    type="text"
                    value={formData["Guest Name"]}
                    onChange={handleChange}
                    placeholder="Guest Name"
                    className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    required
                />
                <label className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                    Guest Name
                </label>
            </div>

            <div className="relative">
                <input
                    autoComplete="off"
                    name="Guest Contact"
                    type="text"
                    value={formData["Guest Contact"]}
                    onChange={handleChange}
                    placeholder="98765*****"
                    className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    required
                />
                <label className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                    Guest Contact
                </label>
            </div>

            <div className="relative">
                <input
                    autoComplete="off"
                    name="Aadhaar Details"
                    type="text"
                    value={formData["Aadhaar Details"]}
                    onChange={handleChange}
                    placeholder="Aadhaar Details"
                    className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    required
                />
                <label className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                    Aadhaar Details
                </label>
            </div>

            <div className="relative">
                <input
                    autoComplete="off"
                    name="Reference Enrollment Number"
                    type="text"
                    value={formData["Reference Enrollment Number"]}
                    onChange={handleChange}
                    placeholder="Reference Enrollment"
                    className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    required
                />
                <label className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                    Reference Enrollment Number
                </label>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                disabled={isDisabled}
            >
                Submit
            </button>

        </form>
    );
};

const StudentForm = () => {
    const [formData, setFormData] = useState({
        "Student Name": "",
        "Student Contact": "",
        "Student Email": "",
        "Student Enrollment": "",
        "Course": ""
    });
    const [error, setError] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData["Student Email"])) {
            setError('Invalid email format.');
            return;
        }

        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(formData["Student Contact"])) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }

        try {
            await axios.post('https://2047-27-56-180-134.ngrok-free.app/add_student_data', formData);
            setIsDisabled(true);
            navigate("/succes")
        } catch (error) {
            setError('Failed to send data to the server.');
            console.error(error);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
                <input
                    autoComplete="off"
                    name="Student Name"
                    type="text"
                    value={formData["Student Name"]}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    required
                />
                <label className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                    Student Name
                </label>
            </div>

            <div className="relative">
                <input
                    autoComplete="off"
                    name="Student Contact"
                    type="text"
                    value={formData["Student Contact"]}
                    onChange={handleChange}
                    placeholder="98765*****"
                    className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    required
                />
                <label className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                    Student Contact
                </label>
            </div>

            <div className="relative">
                <input
                    autoComplete="off"
                    name="Student Email"
                    type="email"
                    value={formData["Student Email"]}
                    onChange={handleChange}
                    placeholder="mail@example.com"
                    className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    required
                />
                <label className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                    Student Email
                </label>
            </div>

            <div className="relative">
                <input
                    autoComplete="off"
                    name="Student Enrollment"
                    type="text"
                    value={formData["Student Enrollment"]}
                    onChange={handleChange}
                    placeholder="Student ID"
                    className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    required
                />
                <label className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                    Student Enrollment
                </label>
            </div>

            <div className="relative">
                <input
                    autoComplete="off"
                    name="Course"
                    type="text"
                    value={formData["Course"]}
                    onChange={handleChange}
                    placeholder="Current Course"
                    className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    required
                />
                <label className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                    Course
                </label>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                disabled={isDisabled}
            >
                Submit
            </button>

        </form>
    );
};

const DynamicForm = () => {
    const [formType, setFormType] = useState('student');

    return (
        <div className="min-h-screen bg-gradient-to-r from-black to-gray-500 flex items-center justify-center py-12 px-6">
            <div className="bg-white shadow-lg rounded-3xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <img src='./Gandhinagar University Logo - Final.png' alt="University Logo" className="h-16 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold mb-4">Registration</h1>
                    
                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            onClick={() => setFormType('student')}
                            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                                formType === 'student'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            GU Student
                        </button>
                        <button
                            onClick={() => setFormType('outsider')}
                            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                                formType === 'outsider'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Outside GU
                        </button>
                    </div>
                </div>
                
                {formType === 'student' ? <StudentForm /> : <OutsiderForm />}
            </div>
        </div>
    );
};

export default DynamicForm;