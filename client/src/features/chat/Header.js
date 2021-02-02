import { ReactComponent as LogoutImg } from "../../assets/logout.svg";
import { ReactComponent as AdminPageImg } from "../../assets/adminPage.svg";
import { openModal } from "../modal/confirmationSlice";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectRole } from "../auth/authSlice";
import {
  selectDescription,
  selectIsBurgerMenuOpen,
  selectName,
} from "./chatSlice";

const Header = () => {
  const history = useHistory();
  const description = useSelector(selectDescription);
  const isAdmin = useSelector(selectRole).includes("admin");
  const dispatch = useDispatch();
  const name = useSelector(selectName);
  const isBurgerMenuOpen = useSelector(selectIsBurgerMenuOpen);

  return (
    <div className="border-b flex p-3 h-16 items-center">
      <span
        title="Go to Channels"
        onClick={() => history.push("/channels")}
        className={`text-2xl ${
          isBurgerMenuOpen ? "hidden" : "hidden sm:block"
        } tracking-widest ml-12 cursor-pointer px-2 font-extrabold flex justify-between`}
      >
        Chatter:
      </span>
      <div className="flex flex-col w-2/3 ml-12 sm:ml-0">
        <h3 className="text-grey-900 text-md mb-1 truncate font-extrabold">
          {name}
        </h3>
        <div className="text-grey font-light truncate text-sm">
          {description}
        </div>
      </div>
      <div className="inline-flex absolute top-0 right-0 inline-flex ">
        <button
          title="Log Out"
          onClick={() => dispatch(openModal())}
          className="my-3 flex justify-center p-1 border text-sm font-medium rounded-md text-white bg-gray-400 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <LogoutImg className="mx-auto h-7 w-auto" />
        </button>
        {isAdmin ? (
          <button
            onClick={() => history.push("/admin")}
            className="my-3 mr-3 flex rounded-l-none justify-center p-1 border text-sm font-medium rounded-md text-white bg-gray-400 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <AdminPageImg className="mx-auto h-7 w-auto" />
          </button>
        ) : (
          false
        )}
      </div>
    </div>
  );
};

export default Header;
