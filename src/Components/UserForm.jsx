import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';

const StudentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobileno: '',
    enrollment: '',
    email: '',
    institute: '',
  });
  const [error, setError] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [uuid, setUuid] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'mobileno') {
      formattedValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate mobile number
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.mobileno)) {
      setError('Mobile number must be exactly 10 digits.');
      setIsSubmitting(false);
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email address.');
      setIsSubmitting(false);
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.enrollment || !formData.institute) {
      setError('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    const generatedUuid = uuidv4();

    try {
      const response = await axios.post('http://localhost:3001/api/student/create', {
        uuid: generatedUuid,
        name: formData.name,
        mobileno: formData.mobileno,
        enrollment: formData.enrollment,
        email: formData.email,
        institute: formData.institute,
      }, {
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if required by backend
          // 'Authorization': 'Bearer your-token-here'
        }
      });

      if (response.data.success) {
        setUuid(generatedUuid); // Show QR code only after successful API response
        setIsDisabled(true);
        // Reset form
        setFormData({
          name: '',
          mobileno: '',
          enrollment: '',
          email: '',
          institute: '',
        });
        // Navigate to success page after a delay to show QR code
        setTimeout(() => {
        //   navigate('/success', { state: { uuid: generatedUuid, name: formData.name } });
        }, 3000); // 3-second delay to allow user to see QR code
      } else {
        setError(response.data.message || 'Failed to create student.');
      }
    } catch (error) {
      if (error.response) {
        // Handle specific backend errors
        if (error.response.status === 400) {
          setError('All fields are required, including UUID.');
        } else if (error.response.status === 409) {
          setError('Student with this UUID, enrollment, or email already exists.');
        } else {
          setError(error.response.data.message || 'Failed to create student.');
        }
      } else {
        setError('Failed to connect to the server. Please check your network.');
      }
      console.error('Create student error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <input
          autoComplete="off"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
          required
          disabled={isDisabled || isSubmitting}
        />
        <label className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
          Full Name
        </label>
      </div>

      <div className="relative">
        <input
          autoComplete="off"
          name="mobileno"
          type="text"
          value={formData.mobileno}
          onChange={handleChange}
          placeholder="Mobile Number"
          className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
          required
          disabled={isDisabled || isSubmitting}
        />
        <label className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
          Mobile Number
        </label>
      </div>

      <div className="relative">
        <input
          autoComplete="off"
          name="enrollment"
          type="text"
          value={formData.enrollment}
          onChange={handleChange}
          placeholder="Enrollment Number"
          className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
          required
          disabled={isDisabled || isSubmitting}
        />
        <label className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
          Enrollment Number
        </label>
      </div>

      <div className="relative">
        <input
          autoComplete="off"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
          required
          disabled={isDisabled || isSubmitting}
        />
        <label className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
          Email Address
        </label>
      </div>

      <div className="relative">
        <input
          autoComplete="off"
          name="institute"
          type="text"
          value={formData.institute}
          onChange={handleChange}
          placeholder="Institute"
          className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
          required
          disabled={isDisabled || isSubmitting}
        />
        <label className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
          Institute
        </label>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {uuid && (
        <div className="mt-6 flex flex-col items-center">
          <p className="text-green-600 font-semibold mb-2">Student Registered Successfully!</p>
          <QRCode value={uuid} size={128} />
          <p className="text-sm text-gray-600 mt-2">Scan this QR code for attendance.</p>
        </div>
      )}

      <button
        type="submit"
        className={`w-full py-2 rounded-md transition-colors duration-300 ${
          isDisabled || isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        disabled={isDisabled || isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

const DynamicForm = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-gray-500 flex items-center justify-center py-12 px-6">
      <div className="bg-white shadow-lg rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <img
            src="./Gandhinagar University Logo - Final.png"
            alt="University Logo"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-4">Student Registration</h1>
          <StudentForm />
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;