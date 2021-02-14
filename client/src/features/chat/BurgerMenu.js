import { useSelector } from "react-redux";
import { selectName, selectIsBurgerMenuOpen } from "./chatSlice";
import { selectChannelList } from "../channel/channelSlice";
import ChannelsList from "./ChannelsList";
import Spinner from "../helpers/Spinner";

const BurgerMenu = () => {
  const name = useSelector(selectName);
  const listOfChannels = useSelector(selectChannelList);
  const isBurgerMenuOpen = useSelector(selectIsBurgerMenuOpen);

  return (
    <div
      className={`${
        isBurgerMenuOpen ? "translate-x-0" : "-translate-x-full"
      } transform z-20 h-screen absolute top-0 box-content left-0 w-full sm:w-1/4 bg-gradient-to-r from-gray-400 to-blue-500 pb-6 transition ease-in-out duration-300`}
    >
      {name && listOfChannels ? <ChannelsList /> : <Spinner height="h-4/5" />}
    </div>
  );
};

export default BurgerMenu;
