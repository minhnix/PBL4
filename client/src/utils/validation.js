export const isUsername = (val) => {
  let regUser = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{6,18}$/;
  return regUser.test(val);
};

export const isPassword = (val) => {
  let regPassword = /^[a-zA-Z0-9]{6,18}$/;
  return regPassword.test(val);
};

export const isEmail = (val) => {
  let regMail = /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/;
  return regMail.test(val);
};
