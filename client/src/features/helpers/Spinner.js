import "./Loader.css";

const Spinner = (props) => {
  return (
    <div className={`items-center overflow z-20 flex justify-center ${props.height}`}>
      <div className="Loader ease-linear rounded-full border-2 border-t-3 border-gray-200 h-6 w-6"></div>
    </div>
  );
};

export default Spinner;