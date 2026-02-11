import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40" />

      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-gradient-to-r from-blue-100/20 to-violet-100/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Content */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-blue-700">
                Now in Public Beta
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Manage your
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                outfitting business
              </span>
              effortlessly.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-lg">
              Streamline bookings, contracts, leads, and operations in one beautiful platform. Built for modern outfitters who want to scale.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/auth/signup"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#pricing"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 rounded-2xl border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5 text-blue-600" />
                View Pricing
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[
                  'bg-gradient-to-br from-orange-400 to-pink-400',
                  'bg-gradient-to-br from-blue-400 to-cyan-400',
                  'bg-gradient-to-br from-green-400 to-emerald-400',
                  'bg-gradient-to-br from-purple-400 to-pink-400',
                ].map((color, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full ${color} border-2 border-white flex items-center justify-center`}
                  >
                    <span className="text-white text-xs font-bold">
                      {['JD', 'MK', 'AS', 'RL'][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  Trusted by <span className="font-semibold text-gray-700">500+</span> outfitters
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/20 border border-gray-200/50 bg-white">
              {/* Mock browser chrome */}
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 ml-3">
                  <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-gray-400 max-w-xs">
                    app.veld.io/dashboard
                  </div>
                </div>
              </div>
              {/* Dashboard content placeholder */}
              <div className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 min-h-[320px] lg:min-h-[400px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-32 bg-gray-200 rounded-lg" />
                    <div className="h-8 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['blue', 'emerald', 'violet'].map((color) => (
                      <div key={color} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className={`h-3 w-16 bg-${color}-100 rounded mb-2`} />
                        <div className="h-6 w-20 bg-gray-200 rounded" />
                        <div className="h-2 w-12 bg-gray-100 rounded mt-2" />
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
                    {[1, 2, 3, 4].map((row) => (
                      <div key={row} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <div className="h-8 w-8 bg-blue-50 rounded-lg" />
                        <div className="flex-1 h-3 bg-gray-100 rounded" />
                        <div className="h-3 w-16 bg-gray-100 rounded" />
                        <div className="h-6 w-16 bg-green-50 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">+34%</p>
                  <p className="text-xs text-gray-500">Booking growth</p>
                </div>
              </div>
            </motion.div>

            {/* Floating badge right */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">12 new</p>
                  <p className="text-xs text-gray-500">Contracts signed</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
