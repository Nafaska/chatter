import React from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/catAvatar.png";
import { useHistory } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  selectEmail,
  selectPassword,
  createUser,
  selectUsername,
} from "./authSlice";
import LoginViaGoogle from "./LoginViaGoogle";

const Registration = () => {
  const history = useHistory();

  const dispatch = useDispatch();

  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);
  const username = useSelector(selectUsername);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src={logo} alt="Workflow" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
        </div>
        <form className="mt-8 space-y-6">
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  dispatch(validateEmail(e.target.value));
                }}
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                value={username}
                onChange={(e) => {
                  dispatch(validateUsername(e.target.value));
                }}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  dispatch(validatePassword(e.target.value));
                }}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={(e) => {
                dispatch(createUser(email, password, username));
              }}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register
            </button>
            <h2 className="my-3 text-center text-gray-500">Or</h2>
            <LoginViaGoogle />
            <button
              type="button"
              onClick={() => history.push("/login")}
              className="mt-2 group relative w-full flex justify-center py-2 px-4 border bosrder-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
