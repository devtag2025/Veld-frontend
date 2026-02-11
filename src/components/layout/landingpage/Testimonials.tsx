import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'James Mitchell',
    role: 'Owner, Outback Trophy Hunts',
    quote: 'Veld transformed how we manage our bookings. We went from spreadsheets to a fully digital operation in a week. Our clients love the professional contracts.',
    initials: 'JM',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Sarah van der Merwe',
    role: 'Operations Manager, Karoo Safaris',
    quote: 'The lead tracking alone has increased our conversion rate by 40%. We never miss a follow up now. Best investment we have made for the business.',
    initials: 'SM',
    gradient: 'from-violet-500 to-pink-500',
  },
  {
    name: 'Robert Kruger',
    role: 'Head Guide, Highland Lodge',
    quote: 'Beautiful interface, incredibly easy to use. Even our less tech-savvy staff picked it up immediately. The contract templates save us hours every week.',
    initials: 'RK',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Emily Thompson',
    role: 'Director, Great Plains Outfitters',
    quote: 'The analytics dashboard gives us insights we never had before. We can see exactly which packages are performing and optimise our offering accordingly.',
    initials: 'ET',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    name: 'David Botha',
    role: 'Founder, Bushveld Expeditions',
    quote: 'Switching to Veld cut our admin time in half. Automated reminders, digital contracts, and real-time booking status — it is everything we needed.',
    initials: 'DB',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    name: 'Lisa Chen',
    role: 'Marketing Lead, Pacific Hunt Co',
    quote: 'Our clients are impressed by the professional touch. From the initial inquiry to the signed contract, everything feels seamless and modern.',
    initials: 'LC',
    gradient: 'from-pink-500 to-rose-500',
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-50 text-violet-600 text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Loved by outfitters{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              worldwide
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Join hundreds of outfitters who have modernised their operations with Veld.
          </p>
        </motion.div>
      </div>

      {/* Infinite scroll marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10" />

        <div className="flex gap-6 animate-marquee">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[380px] bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed text-sm mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 mt-auto">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee CSS animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
