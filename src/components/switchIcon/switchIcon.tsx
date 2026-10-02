import { motion } from "framer-motion";

export const SwitchIcon = ({ active }: { active: boolean }) => {
  return (
    <svg
      width="40"
      height="20"
      viewBox="0 0 51 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-all"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.420898 12.9963C0.420898 9.50455 1.65542 6.52416 4.12446 4.05512C6.59349 1.58608 9.57389 0.351562 13.0656 0.351562H38.3551C41.8469 0.351562 44.8272 1.58608 47.2963 4.05512C49.7653 6.52416 50.9998 9.50455 50.9998 12.9963C50.9998 16.488 49.7653 19.4684 47.2963 21.9375C44.8272 24.4065 41.8469 25.641 38.3551 25.641H13.0656C9.57389 25.641 6.59349 24.4065 4.12446 21.9375C1.65542 19.4684 0.420898 16.488 0.420898 12.9963Z"
        fill={active ? "#1AD598" : "#AEC2D0"}
      />
      <motion.circle
        cx={active ? 38.35 : 13.88}
        cy={13}
        r={10.22}
        fill="white"
        animate={{ cx: active ? 38.35 : 13.88 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </svg>
  );
};
