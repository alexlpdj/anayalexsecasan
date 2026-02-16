import { motion, AnimatePresence } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';

export default function FaqAccordion({ faqs }) {
    if (!faqs || faqs.length === 0) {
        return null;
    }

    return (
        <Accordion.Root type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
                <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                    <Accordion.Item
                        value={`item-${faq.id}`}
                        className="overflow-hidden rounded-xl border border-[#e2dbd3]/60 bg-white/70 backdrop-blur-sm transition-all hover:shadow-md"
                    >
                        <Accordion.Header>
                            <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left transition-all hover:bg-[#faf8f5]">
                                <span className="pr-4 font-medium text-[#8b7355] group-data-[state=open]:text-[#7a6448]">
                                    {faq.question}
                                </span>
                                <motion.svg
                                    className="h-5 w-5 flex-shrink-0 text-[#8b7355] transition-transform group-data-[state=open]:rotate-180"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    animate={{ rotate: 0 }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                </motion.svg>
                            </Accordion.Trigger>
                        </Accordion.Header>

                        <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t border-[#e2dbd3]/30 bg-[#faf8f5]/50 px-5 py-4"
                            >
                                <p className="text-sm leading-relaxed text-[#8b7355] whitespace-pre-wrap">
                                    {faq.answer}
                                </p>
                            </motion.div>
                        </Accordion.Content>
                    </Accordion.Item>
                </motion.div>
            ))}
        </Accordion.Root>
    );
}
