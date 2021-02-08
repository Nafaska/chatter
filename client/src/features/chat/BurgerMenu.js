import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectName, selectIsBurgerMenuOpen } from "./chatSlice";
import { selectChannelList } from "../channel/channelSlice";
import Spinner from "../helpers/Spinner";

const BurgerMenu = () => {
  const history = useHistory();
  const name = useSelector(selectName);
  const listOfChannels = useSelector(selectChannelList);
  const isBurgerMenuOpen = useSelector(selectIsBurgerMenuOpen);

  return (
    <div
      className={`${
        isBurgerMenuOpen ? "translate-x-0" : "-translate-x-full"
      } transform z-20 h-screen absolute top-0 box-content left-0 w-full sm:w-1/4 bg-gradient-to-r from-gray-400 to-blue-500 pb-6 transition ease-in-out duration-300`}
    >
      {name && listOfChannels ? (
        <div className="h-5/6">
          <div
            title="Go to Channels"
            onClick={() => history.push("/channels")}
            className="cursor-pointer px-4 mb-2 mt-16 text-2xl tracking-wide text-white font-bold"
          >
            Channels
          </div>
          <div
            title={name}
            className="bg-peach mb-1 py-1 truncate px-4 text-white font-semi-bold"
          >
            # {name}
          </div>
          <div className="overflow-y-auto h-4/5">
            {listOfChannels
              .filter((ch) => ch !== name)
              .map((ch, index) => {
                return (
                  <div
                    onClick={() => {
                      history.push(`/channels/${ch}`);
                    }}
                    key={`${ch}_${index}`}
                    title={ch}
                    className="mb-1 truncate py-1 px-4 text-white font-semi-bold cursor-pointer"
                  >
                    # {ch}
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <Spinner height="h-4/5" />
      )}
    </div>
  );
};

export default BurgerMenu;
