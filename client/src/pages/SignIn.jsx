import { useEffect, useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineClose,
} from "react-icons/ai";
import { TfiHelpAlt } from "react-icons/tfi";
import { isEmail, isPassword, isUsername } from "../utils/validation";
export const SignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, setLoginUser] = useState({ username: "", password: "" });
  const [regUser, setRegUser] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [isEmptyEmail, setIsEmptyEmail] = useState(true);
  const [isEmptyUsername, setIsEmptyUsername] = useState(true);
  const [isEmptyPassword, setIsEmptyPassword] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidUsername, setIsValidUsername] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [showMailHelp, setShowMailHelp] = useState(false);
  const [showUsernameHelp, setShowUsernameHelp] = useState(false);
  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const container = document.querySelector(".box");

    signUpButton.addEventListener("click", () => {
      container.classList.toggle("right-panel-active");
      setIsSignUp((prev) => !prev);
      setShowPassword(false);
      setLoginUser({ username: "", password: "" });
      setRegUser({ email: "", username: "", password: "" });
      setIsEmptyEmail(true);
      setIsEmptyUsername(true);
      setIsEmptyPassword(true);
      setIsValidEmail(true);
      setIsValidUsername(true);
      setIsValidPassword(true);
      document.querySelector("input[name='password']").type = "password";
      document.querySelectorAll("input")?.forEach((item) => (item.value = ""));
    });
  }, []);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
    !showPassword
      ? (document.querySelector("input[name='password']").type = "text")
      : (document.querySelector("input[name='password']").type = "password");
  };

  const handleChange = (e) => {
    if (isSignUp) {
      setRegUser({
        ...regUser,
        [e.target.name]: e.target.value,
      });
    } else
      setLoginUser({
        ...loginUser,
        [e.target.name]: e.target.value,
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (regUser.email.trim() === "") {
        setIsEmptyEmail(false);
      } else {
        setIsEmptyEmail(true);
      }

      setIsValidEmail(isEmail(regUser.email));

      if (regUser.username.trim() === "") {
        setIsEmptyUsername(false);
      } else {
        setIsEmptyUsername(true);
      }
      setIsValidUsername(isUsername(regUser.username));
      if (regUser.password.trim() === "") {
        setIsEmptyPassword(false);
      } else {
        setIsEmptyPassword(true);
      }
      setIsValidPassword(isPassword(regUser.password));
    }
    if (!isSignUp) {
      if (loginUser.username.trim() === "") {
        setIsEmptyUsername(false);
      } else {
        setIsEmptyUsername(true);
      }
      if (loginUser.password.trim() === "") {
        setIsEmptyPassword(false);
      } else {
        setIsEmptyPassword(true);
      }
    }

    if (isSignUp) console.log(regUser);
    else console.log(loginUser);
    console.log(isEmptyEmail, isEmptyPassword, isEmptyUsername);
  };

  return (
    <div className="box">
      <div className="wrapper">
        <div className="content">
          <div className="side absolute z-50">
            <div className="h-[796px] relative overflow-hidden">
              <div
                className={`top-balloon w-[300px] h-[300px] rounded-full bg-[#ecf0f3] absolute deep-neumorphism top-[-20%] ${
                  isSignUp ? "right-[-30%]" : "right-[20%]"
                } `}
              ></div>
              <div
                className={`bottom-balloon w-[450px] h-[450px] rounded-full bg-[#ecf0f3] absolute deep-neumorphism bottom-[-35%] ${
                  isSignUp ? "right-[50%]" : "right-[-20%]"
                }`}
              ></div>
              <div className="frame-2">
                <div className="title">
                  <p className="text-wrapper">
                    {isSignUp
                      ? "Join us today! Create your account."
                      : "Welcome back! Sign in to access your account."}
                  </p>
                  <p className="p select-none">
                    {isSignUp
                      ? " Ready to get started? Fill out the form below to create your new account. It only takes a few moments !"
                      : "Enter your username and password below to securely sign in and enjoy all the features and benefits of our platform."}
                  </p>
                  <div className="text-wrapper-2 font-semibold">
                    {isSignUp
                      ? "Already have an account?"
                      : "Don't have an account yet?"}
                  </div>
                </div>
                <div className="div-wrapper" id="signUp">
                  <button className="px-8 py-2 rounded-full hover:opacity-60 bg-[#8090CB] shadow-3xl text-md text-white font-medium uppercase">
                    {!isSignUp ? "SIGN UP NOW" : "SIGN IN NOW"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="main absolute z-0">
            <div className="header-contain">
              <div className="text-wrapper-4">
                {isSignUp ? "Create Account" : "Sign In To App"}
              </div>
              {!isSignUp && (
                <span className="bg-red-100 px-4 py-4 rounded w-[340px] border border-red-400 text-red-400 font-medium text-sm flex items-center justify-center">
                  Incorrect username or password.{" "}
                  <span>
                    <AiOutlineClose className="text-red-400 ml-2 cursor-pointer" />
                  </span>
                </span>
              )}
              <div className="frame-5">
                {isSignUp && (
                  <>
                    <div className="flex items-center">
                      <input
                        className={`pl-4 pr-8 py-3 rounded-lg outline-none deep-neumorphism min-w-[340px] ${
                          !isValidEmail && "bg-red-100"
                        } text-sm`}
                        type="email"
                        placeholder="Email"
                        name="email"
                        autoComplete="off"
                        onChange={handleChange}
                      />
                      <TfiHelpAlt
                        className="absolute right-3 text-[#8090CB] cursor-pointer"
                        onMouseEnter={() => setShowMailHelp(true)}
                        onMouseLeave={() => setShowMailHelp(false)}
                      />
                      {showMailHelp && (
                        <span className="w-[150px] h-[30px] border border-gray-400 rounded bg-gray-100 text-[#8090CB] absolute right-[-46%] flex items-center">
                          <p className="text-[12px] px-2">- Must be gmail.</p>
                        </span>
                      )}
                    </div>
                    {!isEmptyEmail && (
                      <span className="text-red-500 font-medium text-sm px-4">
                        Email must be not empty!.
                      </span>
                    )}
                  </>
                )}
                <div className="flex items-center">
                  <input
                    className={`pl-4 pr-8 py-3 rounded-lg outline-none deep-neumorphism min-w-[340px] ${
                      !isValidUsername && "bg-red-100"
                    } text-sm`}
                    type="text"
                    placeholder="Username"
                    name="username"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  {isSignUp && (
                    <TfiHelpAlt
                      className="absolute right-3 text-[#8090CB] cursor-pointer"
                      onMouseEnter={() => setShowUsernameHelp(true)}
                      onMouseLeave={() => setShowUsernameHelp(false)}
                    />
                  )}
                  {showUsernameHelp && (
                    <span className="w-[150px] min-h-[30px] border border-gray-400 rounded bg-gray-100 text-[#8090CB] absolute right-[-46%] flex flex-col items-center">
                      <p className="text-[12px] px-2">- Minimum length is 6.</p>
                      <p className="text-[12px] px-2">
                        - Contain letters and numbers.
                      </p>
                    </span>
                  )}
                </div>
                {!isEmptyUsername && (
                  <span className="text-red-500 font-medium text-sm px-4">
                    Username must be not empty!.
                  </span>
                )}
                <div className="relative">
                  <input
                    className={`pl-4 pr-8 py-3 rounded-lg outline-none deep-neumorphism min-w-[340px] ${
                      !isValidPassword && "bg-red-100"
                    } text-sm`}
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                  />

                  <span
                    className="absolute right-2 top-2.5 cursor-pointer"
                    onClick={handleShowPassword}
                  >
                    {isSignUp ? (
                      regUser.password !== "" ? (
                        !showPassword ? (
                          <AiOutlineEye size={22} className="text-[#8090CB]" />
                        ) : (
                          <AiOutlineEyeInvisible
                            size={22}
                            className="text-[#8090CB]"
                          />
                        )
                      ) : null
                    ) : loginUser.password !== "" ? (
                      !showPassword ? (
                        <AiOutlineEye size={22} className="text-[#8090CB]" />
                      ) : (
                        <AiOutlineEyeInvisible
                          size={22}
                          className="text-[#8090CB]"
                        />
                      )
                    ) : null}
                  </span>
                </div>
                {!isEmptyPassword && (
                  <span className="text-red-500 font-medium text-sm px-4">
                    Password must be not empty!.
                  </span>
                )}
              </div>
              <>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-2 rounded-full hover:opacity-60 bg-[#8090CB] shadow-3xl text-md text-white font-medium uppercase"
                >
                  {!isSignUp ? "sign in" : "sign up"}
                </button>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
