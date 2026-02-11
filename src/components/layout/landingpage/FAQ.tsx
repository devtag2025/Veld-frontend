import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How quickly can I get started with Veld?',
    answer:
      'You can be up and running in under 10 minutes. Simply create an account, import your existing bookings (or start fresh), and begin managing your operation. We provide guided onboarding and pre-built templates to accelerate setup.',
  },
  {
    question: 'Can I migrate my existing data from spreadsheets?',
    answer:
      'Absolutely. Veld supports CSV imports for bookings, contacts, and leads. Our support team can also assist with bulk data migration for larger operations. We ensure no data is lost during the transition.',
  },
  {
    question: 'Is Veld suitable for multi-property operations?',
    answer:
      'Yes! Our Enterprise plan supports multiple properties under a single account. You can manage separate locations, staff, and bookings while maintaining a unified overview and consolidated analytics.',
  },
  {
    question: 'How does the digital contract system work?',
    answer:
      'Choose from our professionally designed templates or create your own. Fill in client details, customise terms, and send contracts for e-signature — all within Veld. Signed contracts are stored securely and accessible anytime.',
  },
  {
    question: 'What kind of support do you offer?',
    answer:
      'All plans include email support with a 24-hour response time. Professional and Enterprise plans include priority support with live chat and phone access. Enterprise customers also get a dedicated account manager.',
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer:
      'Yes, you can cancel anytime with no penalties. Your data remains accessible for 30 days after cancellation. We also offer a 14-day free trial on all plans — no credit card required to start.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 lg:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Frequently asked{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Everything you need to know about Veld. Can&apos;t find an answer? Contact us.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:border-gray-300 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-base font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-500 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
