import "./Button.css";
import { useSelector, useDispatch } from "react-redux";
import { selectIsBurgerMenuOpen, openBurgerMenu } from "./chatSlice";

const BurgerButton = () => {
  const dispatch = useDispatch();
  const isBurgerMenuOpen = useSelector(selectIsBurgerMenuOpen);
  return (
    <div
      open={isBurgerMenuOpen}
      onClick={() => dispatch(openBurgerMenu(!isBurgerMenuOpen))}
      className={`absolute top-0 left-0 mt-4 ml-4 flex flex-col justify-around w-8 h-8 cursor-pointer z-10 focus: outline-none bg-transparent`}
    >
      <span
        className={`rounded transform w-8 h-1 origin-left transition-all relative ease-linear duration-300 ${
          isBurgerMenuOpen ? "bg-peach rotate-45" : "bg-blue-500 rotate-0"
        } `}
      ></span>
      <span
        className={`rounded transform w-8 h-1 origin-left transition-all relative ease-linear duration-300 ${
          isBurgerMenuOpen
            ? "bg-peach translate-x-20 opacity-0"
            : "bg-blue-500 translate-x-0 opacity-100"
        } `}
      ></span>
      <span
        className={`rounded transform w-8 h-1 origin-left translate-y-px transition-all relative ease-linear duration-300 ${
          isBurgerMenuOpen ? "bg-peach -rotate-45" : "bg-blue-500 rotate-0"
        } `}
      ></span>
    </div>
  );
};

export default BurgerButton;
