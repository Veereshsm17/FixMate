import { motion } from "framer-motion";

export default function DashboardHeader({ user }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
        <p className="text-blue-500">Welcome, {user.name}!</p>
      </div>
    </motion.header>
  );
}
