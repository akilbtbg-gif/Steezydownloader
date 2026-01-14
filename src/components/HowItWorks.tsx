import { motion } from "framer-motion";
import { Link2, ClipboardPaste, Settings2, Download } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Copy the Link",
    description: "Copy the YouTube video or Shorts link from your browser or app",
  },
  {
    icon: ClipboardPaste,
    title: "Paste It Here",
    description: "Paste it into the Steezy Downloader input field above",
  },
  {
    icon: Settings2,
    title: "Choose Format",
    description: "Select your preferred format — MP4 video or MP3 audio",
  },
  {
    icon: Download,
    title: "Download Instantly",
    description: "Hit download and save directly to your device",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Fast. Simple. Steezy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative glass rounded-2xl p-6 text-center group hover:glow transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 gradient-bg rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                {index + 1}
              </div>
              
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <step.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
