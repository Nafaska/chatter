import { ReactComponent as GoogleIcon } from "../../assets/googleIcon.svg";
import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";
import { googleAuthUser } from "./authSlice";

const LoginViaGoogle = () => {
  const dispatch = useDispatch();
  const handleLogin = (data) => dispatch(googleAuthUser(data));

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText="Log in with Google"
      onSuccess={handleLogin}
      onFailure={handleLogin}
      cookiePolicy={"single_host_origin"}
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <GoogleIcon className="mx-2 h-5 w-auto" />
          Log in with Google
        </button>
      )}
    />
  );
};

export default LoginViaGoogle;
