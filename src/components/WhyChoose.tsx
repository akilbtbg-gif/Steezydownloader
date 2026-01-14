import { motion } from "framer-motion";
import { Rocket, Smartphone, Film, Lock, Sparkles, Zap } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Super Fast Downloads",
    description: "Optimized servers ensure your downloads complete in seconds, not minutes.",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description: "Perfectly optimized for mobile, tablet, and desktop devices.",
  },
  {
    icon: Film,
    title: "Videos & Shorts",
    description: "Full support for YouTube long-form videos and Shorts content.",
  },
  {
    icon: Lock,
    title: "No Sign-Up Required",
    description: "Start downloading immediately — no accounts, no hassle.",
  },
  {
    icon: Sparkles,
    title: "Clean Interface",
    description: "No annoying popups, ads, or distractions. Just pure functionality.",
  },
  {
    icon: Zap,
    title: "Optimized for Speed",
    description: "Lightning-fast processing with minimal waiting time.",
  },
];

const WhyChoose = () => {
  return (
    <section className="py-24 px-4 relative" id="features">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Why Use <span className="gradient-text">Steezy Downloader</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            The best way to download your favorite YouTube content
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glass rounded-2xl p-6 group hover:glow transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
