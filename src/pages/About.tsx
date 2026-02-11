import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users } from 'lucide-react';

const team = [
  {
    name: 'Marcus de Klerk',
    role: 'Founder & CEO',
    bio: 'Former outfitter with 15 years in the field. Built Veld to solve problems he experienced firsthand.',
    initials: 'MK',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    name: 'Sarah Thompson',
    role: 'Head of Product',
    bio: 'Previously led product at a top SaaS company. Passionate about creating tools that empower small businesses.',
    initials: 'ST',
    gradient: 'from-violet-500 to-pink-500',
  },
  {
    name: 'David Nkosi',
    role: 'Lead Engineer',
    bio: 'Full-stack engineer with a decade of experience building scalable, beautiful web applications.',
    initials: 'DN',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Emily van Wyk',
    role: 'Customer Success',
    bio: 'Dedicated to ensuring every outfitter gets the most out of Veld. Your success is her mission.',
    initials: 'EW',
    gradient: 'from-orange-500 to-amber-500',
  },
];

const values = [
  {
    icon: Target,
    title: 'Mission-Driven',
    description: 'We exist to empower outfitters with technology that simplifies their operations and amplifies their success.',
    color: 'blue',
  },
  {
    icon: Eye,
    title: 'Visionary',
    description: 'We see a future where every outfitter — big or small — has access to world-class management tools.',
    color: 'violet',
  },
  {
    icon: Heart,
    title: 'Customer-First',
    description: 'Every feature we build starts with a real problem faced by a real outfitter. Your feedback shapes our roadmap.',
    color: 'rose',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We are building more than software. We are building a community of modern, forward-thinking outfitters.',
    color: 'emerald',
  },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  violet: 'bg-violet-50 text-violet-600',
  rose: 'bg-rose-50 text-rose-600',
  emerald: 'bg-emerald-50 text-emerald-600',
};

const About = () => {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
              About Veld
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Built by outfitters,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                for outfitters
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-500 leading-relaxed">
              We understand the unique challenges of running an outfitting operation because we have lived them. Veld was born from real-world experience and a passion for the outdoors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-gray-500">What drives us every day.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${colorMap[value.color]} mb-5`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Meet the Team
            </h2>
            <p className="mt-4 text-lg text-gray-500">The people behind Veld.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}>
                  <span className="text-white text-xl font-bold">{member.initials}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-blue-600 font-medium mt-1">{member.role}</p>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
