import { useEffect, useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineClose,
} from "react-icons/ai";
export const SignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, setLoginUser] = useState({ username: "", password: "" });
  const [regUser, setRegUser] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [validation, setValidation] = useState({
    email: true,
    username: true,
    password: true,
  });
  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const container = document.querySelector(".box");

    signUpButton.addEventListener("click", () => {
      container.classList.toggle("right-panel-active");
      setIsSignUp((prev) => !prev);
      setShowPassword(false);
      setLoginUser({ username: "", password: "" });
      setRegUser({ email: "", username: "", password: "" });
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
    if (isSignUp) {
      if (
        regUser.email === "" ||
        regUser.email === null ||
        regUser.email.length == 0
      ) {
        setValidation({ ...validation, email: false });
      }
      if (
        regUser.username === "" ||
        regUser.username === null ||
        regUser.username.length == 0
      ) {
        setValidation({ ...validation, username: false });
      }
      if (
        regUser.password === "" ||
        regUser.password === null ||
        regUser.password.length == 0
      ) {
        setValidation({ ...validation, password: false });
      }
    } else {
      if (
        loginUser.username === "" ||
        loginUser.username === null ||
        loginUser.username.length == 0
      ) {
        setValidation({ ...validation, username: false });
      }
      if (
        loginUser.password === "" ||
        loginUser.password === null ||
        loginUser.password.length == 0
      ) {
        setValidation({ ...validation, password: false });
      }
    }

    e.preventDefault();
    if (isSignUp) console.log(regUser);
    else console.log(loginUser);
  };
  console.log(validation);
  return (
    <div className="box">
      <div className="wrapper">
        <div className="content">
          <div className="side">
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
          <div className="main">
            <div className="header-contain">
              <div className="text-wrapper-4">
                {isSignUp ? "Create Account" : "Sign In To App"}
              </div>
              <span className="bg-red-200 px-4 py-4 rounded w-[340px] font-medium flex items-center justify-center">
                Incorrect username or password.{" "}
                <span>
                  <AiOutlineClose className="text-red-400 ml-2 cursor-pointer" />
                </span>
              </span>
              <div className="frame-5">
                {isSignUp && (
                  <>
                    <input
                      className="px-4 py-2 rounded-lg outline-none deep-neumorphism min-w-[340px]"
                      type="email"
                      placeholder="Email"
                      name="email"
                      onChange={handleChange}
                    />
                    <span className="text-red-500 font-medium text-md px-4">
                      Email must not be empty!.
                    </span>
                  </>
                )}
                <input
                  className="px-4 py-2 rounded-lg outline-none deep-neumorphism min-w-[340px]"
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={handleChange}
                />
                {!validation.username && (
                  <span className="text-red-500 font-medium text-md px-4">
                    Username must not be empty!.
                  </span>
                )}
                <div className="relative">
                  <input
                    className="px-4 py-2 rounded-lg outline-none deep-neumorphism min-w-[340px]"
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                  />

                  <span
                    className="absolute right-4 top-2.5 cursor-pointer"
                    onClick={handleShowPassword}
                  >
                    {isSignUp ? (
                      regUser.password !== "" ? (
                        !showPassword ? (
                          <AiOutlineEye size={24} />
                        ) : (
                          <AiOutlineEyeInvisible size={24} />
                        )
                      ) : null
                    ) : loginUser.password !== "" ? (
                      !showPassword ? (
                        <AiOutlineEye size={24} />
                      ) : (
                        <AiOutlineEyeInvisible size={24} />
                      )
                    ) : null}
                  </span>
                </div>
                {!validation.username && (
                  <span className="text-red-500 font-medium text-md px-4">
                    Password must not be empty!.
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
