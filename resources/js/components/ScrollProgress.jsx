import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-[#8b7355] via-[#c4a571] to-[#8b7355]"
            style={{ scaleX }}
        />
    );
}
