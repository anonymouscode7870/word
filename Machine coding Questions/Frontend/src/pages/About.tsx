import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Mail, Phone, MapPin, Send } from "lucide-react";

interface AboutProps {
  isDark: boolean;
}

export const About = ({ isDark }: AboutProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <div
      className={`pt-20 min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}
    >
      {/* Hero Section */}
      <section
        className={`py-12 md:py-16 lg:py-20 px-4 ${isDark ? "bg-slate-900/50" : "bg-slate-50"}`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              About Me & My Mission
            </h1>
            <p
              className={`text-base sm:text-lg md:text-xl ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              From student struggles to helping thousands achieve their dreams
            </p>
          </motion.div>
        </div>
      </section>

      {/* Journey Story */}
      <section className={`py-12 md:py-16 lg:py-20 px-4 ${isDark ? "bg-slate-950" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`rounded-2xl border ${
              isDark
                ? "bg-slate-800/50 border-slate-700"
                : "bg-slate-50 border-slate-200"
            } p-12`}
          >
            <div className="flex gap-4 mb-6">
              <Heart className="text-red-500 flex-shrink-0" size={32} />
              <h2
                className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
              >
                My Journey
              </h2>
            </div>

            <div className="space-y-6">
              <p
                className={`text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                I started my tech journey like many others — struggling with
                DSA, confused about operating systems concepts, and overwhelmed
                by the vastness of placement preparation. Despite having good
                theoretical knowledge, I couldn't crack interviews because I
                didn't know the right approach.
              </p>

              <p
                className={`text-base sm:text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                After months of self-study, solving countless problems, and
                making mistakes, I finally cracked interviews at top tech
                companies. That's when I realized — I didn't just solve my own
                problem; I learned what works and what doesn't in placement
                preparation.
              </p>

              <p
                className={`text-base sm:text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                I decided to start this YouTube channel and platform to help
                students who face the same struggles. Over the years, I've
                distilled 5+ years of experience into structured video lectures,
                comprehensive notes, and real interview insights that actually
                work.
              </p>

              <p
                className={`text-base sm:text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                Today, 150K+ students trust my content, and hundreds of them get
                placed every year. My mission is simple:{" "}
                <span className="font-bold text-indigo-600">
                  Make quality placement preparation accessible to everyone.
                </span>
              </p>
            </div>
          </motion.div>

          {/* Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                year: "2019",
                title: "Started YouTube",
                desc: "First DSA video uploaded",
              },
              {
                year: "2021",
                title: "Reached 100K",
                desc: "Growing community",
              },
              {
                year: "2024",
                title: "150K+ Students",
                desc: "Transforming careers",
              },
            ].map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`rounded-xl border p-6 text-center ${
                  isDark
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-slate-200"
                }`}
              >
                <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {milestone.year}
                </p>
                <h3
                  className={`font-bold text-lg mt-2 ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {milestone.title}
                </h3>
                <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                  {milestone.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className={`py-12 md:py-16 lg:py-20 px-4 ${isDark ? "bg-slate-900/50" : "bg-slate-50"}`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Get In Touch
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3
                  className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  Let's Connect
                </h3>
                <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                  Have questions, suggestions, or want to collaborate? I'd love
                  to hear from you!
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    content: "contact@placementjourney.com",
                  },
                  { icon: Phone, title: "Phone", content: "+91 9876543210" },
                  { icon: MapPin, title: "Location", content: "India" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      viewport={{ once: true }}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        isDark
                          ? "bg-slate-800 border-slate-700"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-600/20 to-purple-600/20 flex items-center justify-center">
                        <Icon className="text-indigo-600" size={24} />
                      </div>
                      <div>
                        <p
                          className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                        >
                          {item.title}
                        </p>
                        <p
                          className={
                            isDark ? "text-slate-400" : "text-slate-600"
                          }
                        >
                          {item.content}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className={`rounded-2xl border p-8 ${
                isDark
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-slate-200"
              } space-y-6`}
            >
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white focus:border-indigo-600"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600"
                  }`}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white focus:border-indigo-600"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600"
                  }`}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white focus:border-indigo-600"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600"
                  }`}
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors resize-none ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white focus:border-indigo-600"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600"
                  }`}
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitted ? (
                  "Message Sent! ✓"
                ) : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 px-4 ${isDark ? "bg-slate-950" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`rounded-3xl border text-center p-12 ${
              isDark
                ? "bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700"
                : "bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700"
            }`}
          >
            <h3 className="text-4xl font-bold text-white mb-4">
              Subscribe to Our YouTube Channel
            </h3>
            <p className="text-slate-300 mb-8 text-lg max-w-2xl mx-auto">
              Get daily updates on placement preparation, coding tutorials, and
              interview tips
            </p>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-primary"
            >
              Subscribe Now
              <MessageSquare size={20} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
