import toast from "react-hot-toast";

export const showSuccess = (msg) => toast.success(msg, { duration: 3000 });
export const showError = (msg) => toast.error(msg, { duration: 4000 });
