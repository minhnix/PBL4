import React, { useEffect, useState } from "react";

export const SignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginUser, setLoginUser] = useState({ username: "", password: "" });
  const [regUser, setRegUser] = useState({
    email: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const container = document.querySelector(".box");

    signUpButton.addEventListener("click", () => {
      container.classList.toggle("right-panel-active");
      setIsSignUp((prev) => !prev);
      document.querySelectorAll("input")?.forEach((item) => (item.value = ""));
    });
  }, []);

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
    if (isSignUp) console.log(regUser);
    else console.log(loginUser);
  };

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
                  <p className="p">
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
              <div className="frame-5">
                {isSignUp && (
                  <input
                    className="px-4 py-2 rounded-lg outline-none deep-neumorphism min-w-[340px]"
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                  />
                )}
                <input
                  className="px-4 py-2 rounded-lg outline-none deep-neumorphism min-w-[340px]"
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={handleChange}
                />
                <input
                  className="px-4 py-2 rounded-lg outline-none deep-neumorphism min-w-[340px]"
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                />
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
