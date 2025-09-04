export const emailValid = (email) => {
  const regExp = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  return regExp.test(email);
}