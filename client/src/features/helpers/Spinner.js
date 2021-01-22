import "./Loader.css";

const Spinner = () => {
  return (
    <div className="items-center flex justify-center h-4/5">
      <div className="Loader ease-linear rounded-full border-2 border-t-3 border-gray-200 h-6 w-6"></div>
    </div>
  );
}

export default Spinner;