import { motion } from "framer-motion";
import logo from "../../../assets/matbudjettet_logo.svg";

export function SplashScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F0E8]">
      <motion.img
        alt="Matbudsjettet"
        animate={{ opacity: [0, 1, 1, 0], scale: [0.98, 1, 1, 0.985] }}
        className="w-[12.5rem] max-w-[52vw]"
        initial={{ opacity: 0, scale: 0.98 }}
        src={logo}
        transition={{
          duration: 0.95,
          ease: "easeInOut",
          times: [0, 0.28, 0.72, 1]
        }}
      />
    </div>
  );
}
