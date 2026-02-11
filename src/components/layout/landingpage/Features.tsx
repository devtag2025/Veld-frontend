import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  CalendarDays,
  FileText,
  Users,
  BarChart3,
  Shield,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: CalendarDays,
    title: 'Smart Booking Management',
    description:
      'Manage all your hunt bookings in one place. Automated scheduling, availability tracking, and client coordination.',
    color: 'blue',
  },
  {
    icon: FileText,
    title: 'Digital Contracts',
    description:
      'Generate, send, and track contracts digitally. E-signatures, templates, and automated reminders built in.',
    color: 'indigo',
  },
  {
    icon: Users,
    title: 'Lead Tracking & CRM',
    description:
      'Never lose a lead again. Track prospects through your pipeline with automated follow-ups and scoring.',
    color: 'violet',
  },
  {
    icon: BarChart3,
    title: 'Revenue Analytics',
    description:
      'Real-time dashboards showing revenue, occupancy rates, and booking trends to make smarter decisions.',
    color: 'emerald',
  },
  {
    icon: Shield,
    title: 'Compliance & Permits',
    description:
      'Stay compliant with automated firearm permit tracking, licence management, and regulatory documentation.',
    color: 'amber',
  },
  {
    icon: Zap,
    title: 'Instant Notifications',
    description:
      'Get real-time alerts for new bookings, payment confirmations, contract signatures, and deadline reminders.',
    color: 'rose',
  },
];

const colorMap: Record<string, { bg: string; icon: string; shadow: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', shadow: 'group-hover:shadow-blue-100' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', shadow: 'group-hover:shadow-indigo-100' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', shadow: 'group-hover:shadow-violet-100' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', shadow: 'group-hover:shadow-emerald-100' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', shadow: 'group-hover:shadow-amber-100' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-600', shadow: 'group-hover:shadow-rose-100' },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};


const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              run your operation
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            From first inquiry to final trophy, Veld covers every step of your outfitting workflow.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature) => {
            const colors = colorMap[feature.color];
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className={`group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl ${colors.shadow} transition-all duration-300 hover:-translate-y-1 cursor-default`}
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${colors.bg} mb-6`}
                >
                  <Icon className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
