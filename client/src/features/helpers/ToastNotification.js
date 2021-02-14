import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = () => {
  return <ToastContainer
    autoClose={5000}
    toastClassName={() =>
      "flex relative min-h-10 p-1 box-border bg-red-500 rounded-md justify-between cursor-pointer overflow-hidden"
    }
    bodyClassName={() => "text-sm p-2 font-med block"}
    position="top-center"
  />;
};

export default ToastNotification;
