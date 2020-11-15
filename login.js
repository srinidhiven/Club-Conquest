const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;

  if (username === "user" && password === "code") {
    window.location.href="overview.html";
  }
  else {
    loginErrorMsg.style.opacity = 1;
  }
})  

