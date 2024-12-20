import React from 'react'

const Contact = () => (
    <section id="contact" className="py-16 bg-gray-100 text-center">
      <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
      <p className="text-lg mb-6">Feel free to reach out to us for any queries or information</p>
      <form className="max-w-lg mx-auto">
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 mb-4 border rounded-md"
        />
        <textarea
          placeholder="Your Message"
          className="w-full p-3 mb-4 border rounded-md"
        />
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md">Submit</button>
      </form>
    </section>
  );
  
  export default Contact;
  