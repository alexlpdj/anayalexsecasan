import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

export default function AnimatedInput({ className = '', ...props }) {
    return (
        <motion.div
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
        >
            <Input
                className={`transition-all duration-300 focus:shadow-lg focus:shadow-[#8b7355]/10 ${className}`}
                {...props}
            />
        </motion.div>
    );
}
