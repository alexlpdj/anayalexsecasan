import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';

export default function AnimatedCheckbox({ checked, onCheckedChange, ...props }) {
    return (
        <motion.div
            whileTap={{ scale: 0.9 }}
            animate={checked ? { rotate: [0, -10, 10, -10, 0] } : {}}
            transition={{ duration: 0.3 }}
        >
            <Checkbox
                checked={checked}
                onCheckedChange={onCheckedChange}
                {...props}
            />
        </motion.div>
    );
}
