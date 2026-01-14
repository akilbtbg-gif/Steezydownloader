import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is Steezy Downloader free to use?",
    answer: "Yes, Steezy Downloader is completely free. No hidden fees, no premium tiers — just free downloads for everyone.",
  },
  {
    question: "Can I download YouTube Shorts?",
    answer: "Absolutely. Steezy Downloader supports both Shorts and long-form videos. Just paste the Shorts link and download away.",
  },
  {
    question: "Do I need to create an account?",
    answer: "Nope. Just paste the link and download. No sign-up, no email verification, no passwords to remember.",
  },
  {
    question: "Does this work on mobile phones?",
    answer: "Yes. Steezy Downloader is fully optimized for mobile, tablet, and desktop. Download from any device, anywhere.",
  },
  {
    question: "What formats are supported?",
    answer: "MP4 for videos and MP3 for audio. We give you the options you need for the content you want.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 px-4" id="faq">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Got questions? We've got answers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass rounded-2xl px-6 border-0 overflow-hidden"
              >
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
