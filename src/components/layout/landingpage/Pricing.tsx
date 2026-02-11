import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small outfitters just getting started.',
    monthlyPrice: 49,
    yearlyPrice: 39,
    popular: false,
    features: [
      'Up to 50 bookings/year',
      '3 team members',
      'Basic contract templates',
      'Email support',
      'Lead tracking',
      'Basic analytics',
    ],
  },
  {
    name: 'Professional',
    description: 'For growing operations that need more power.',
    monthlyPrice: 99,
    yearlyPrice: 79,
    popular: true,
    features: [
      'Unlimited bookings',
      '10 team members',
      'Custom contract templates',
      'Priority support',
      'Advanced CRM & pipeline',
      'Revenue analytics',
      'E-signature integration',
      'Automated reminders',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For large-scale operations and multi-property outfitters.',
    monthlyPrice: 199,
    yearlyPrice: 159,
    popular: false,
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Multi-property support',
      'Dedicated account manager',
      'Custom integrations',
      'API access',
      'White-label options',
      'SLA guarantee',
    ],
  },
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Simple, transparent{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            No hidden fees. Start free and scale as you grow.
          </p>
        </motion.div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              isYearly ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                isYearly ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-400'}`}>
            Yearly
          </span>
          {isYearly && (
            <span className="ml-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full">
              Save 20%
            </span>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                plan.popular
                  ? 'bg-white border-blue-200 shadow-2xl shadow-blue-500/10 scale-[1.03] z-10'
                  : 'bg-white border-gray-200 shadow-lg hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-500/25">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
              </div>

              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold text-gray-900">
                  ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="ml-2 text-gray-500">/month</span>
              </div>

              <Link
                to="/auth/signup"
                className={`mt-8 block w-full py-3.5 text-center text-sm font-semibold rounded-xl transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5'
                    : 'bg-gray-900 text-white hover:bg-gray-800 hover:-translate-y-0.5'
                }`}
              >
                Get started
              </Link>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
