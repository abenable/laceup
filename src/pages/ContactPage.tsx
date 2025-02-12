import { useState } from "react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Alert from "../components/Alert";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setStatus({
      type: "success",
      message: "Message sent successfully! We will get back to you soon.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-mono-light dark:bg-mono-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mono-dark dark:text-mono-light mb-4">
            Contact Us
          </h1>
          <p className="text-mono-dark-600 dark:text-mono-light-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-mono-light-800 dark:bg-mono-dark-800 p-8 rounded-lg border-2 border-mono-light-400 dark:border-mono-dark-400 shadow-card">
              <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light mb-6">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPinIcon className="w-6 h-6 text-mono-dark dark:text-mono-light" />
                  <div>
                    <h3 className="font-medium text-mono-dark dark:text-mono-light">
                      Our Location
                    </h3>
                    <p className="text-mono-dark-600 dark:text-mono-light-600">
                      123 Sneaker Street
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <PhoneIcon className="w-6 h-6 text-mono-dark dark:text-mono-light" />
                  <div>
                    <h3 className="font-medium text-mono-dark dark:text-mono-light">
                      Phone
                    </h3>
                    <p className="text-mono-dark-600 dark:text-mono-light-600">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <EnvelopeIcon className="w-6 h-6 text-mono-dark dark:text-mono-light" />
                  <div>
                    <h3 className="font-medium text-mono-dark dark:text-mono-light">
                      Email
                    </h3>
                    <p className="text-mono-dark-600 dark:text-mono-light-600">
                      support@laceup.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-mono-light-800 dark:bg-mono-dark-800 p-8 rounded-lg border-2 border-mono-light-400 dark:border-mono-dark-400 shadow-card">
              <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light mb-6">
                Business Hours
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-mono-dark-600 dark:text-mono-light-600">
                    Monday - Friday
                  </span>
                  <span className="text-mono-dark dark:text-mono-light">
                    9:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mono-dark-600 dark:text-mono-light-600">
                    Saturday
                  </span>
                  <span className="text-mono-dark dark:text-mono-light">
                    10:00 AM - 4:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mono-dark-600 dark:text-mono-light-600">
                    Sunday
                  </span>
                  <span className="text-mono-dark dark:text-mono-light">
                    Closed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-mono-light-800 dark:bg-mono-dark-800 p-8 rounded-lg border-2 border-mono-light-400 dark:border-mono-dark-400 shadow-card">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light mb-6">
              Send us a Message
            </h2>

            {status && (
              <Alert
                type={status.type}
                className="mb-6"
                onClose={() => setStatus(null)}
              >
                {status.message}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-mono-dark dark:text-mono-light mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-mono-light dark:bg-mono-dark border-2 border-mono-light-400 dark:border-mono-dark-400 focus:border-mono-dark dark:focus:border-mono-light focus:outline-none transition-colors text-mono-dark dark:text-mono-light"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-mono-dark dark:text-mono-light mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-mono-light dark:bg-mono-dark border-2 border-mono-light-400 dark:border-mono-dark-400 focus:border-mono-dark dark:focus:border-mono-light focus:outline-none transition-colors text-mono-dark dark:text-mono-light"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-mono-dark dark:text-mono-light mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-mono-light dark:bg-mono-dark border-2 border-mono-light-400 dark:border-mono-dark-400 focus:border-mono-dark dark:focus:border-mono-light focus:outline-none transition-colors text-mono-dark dark:text-mono-light"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark rounded-lg font-semibold hover:bg-mono-dark-800 dark:hover:bg-mono-light-800 transition-all duration-300 border-2 border-mono-dark dark:border-mono-light shadow-button hover:shadow-button-hover"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
