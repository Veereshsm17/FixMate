import { motion, AnimatePresence } from "framer-motion";

export default function FlashMessage({ message, type, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50
            ${type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
