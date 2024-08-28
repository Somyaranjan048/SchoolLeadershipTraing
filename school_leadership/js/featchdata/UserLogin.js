$(document).ready(function () {
  const loginForm = $("#login-form");
  const fonts = [ "Verdana"]; // Example of non-cursive fonts
  let captchaValue = "";
  deleteCookie("authToken");
  const changePasswordForm = $("#change-password-form");
  const backToLoginButton = $("#back-to-login");

  function showChangePasswordForm() {
    $("#login-container").hide();
    $("#change-password-container").show();
    // console.log("Attempting to show change password form.");
  }

  function showLoginForm() {
    $("#change-password-container").hide();
    $("#login-container").show();
    // console.log("Attempting to show login form.");
    // Clear the form fields
    $("#login-form")[0].reset();
    $("#captchaInput").val("");

    // Generate a new CAPTCHA
    generateCaptcha();
    setCaptcha();
  }

  function showLoader() {
    //console.log("Showing loader...");
    $("#overlay").show(); // Show the overlay
    $("#loaderContainer").show(); // Show the loader
    document.body.classList.add("loading");
  }

  function hideLoader() {
    //console.log("Hiding loader...");
    $("#overlay").hide(); // Hide the overlay
    $("#loaderContainer").hide(); // Hide the loader
    document.body.classList.add("loading");
    clearTimeout(hideLoaderTimeout); // Clear any existing timeout to prevent unintended behavior
  }

  // Generating captcha
  function generateCaptcha() {
    let value = btoa(Math.random() * 1000000000);
    value = value.substring(0, 5 + Math.random() * 5);
    captchaValue = value;
  }
  

  // Set captcha
  function setCaptcha() {
    let html = captchaValue
      .split("")
      .map((char) => {
        const rotate = -10 + Math.trunc(Math.random() * 30);
        const font = Math.trunc(Math.random() * fonts.length);
        return `<span
        style="
        transform:rotate(${rotate}deg);
        font-family:${fonts[font]};
        "
      >${char}</span>`;
      })
      .join("");
    document.querySelector(".login_form #captcha .preview").innerHTML = html;
  }

  function initCaptcha() {
    document
      .querySelector(".login_form #captcha .captcha_refresh")
      .addEventListener("click", function () {
        generateCaptcha();
        setCaptcha();
      });

    generateCaptcha();
    setCaptcha();
  }

  function validateCaptcha(inputCaptchaValue) {
    return inputCaptchaValue === captchaValue;
  }

  // Initially show login form
  showLoginForm();
  initCaptcha();

  if (loginForm.length) {
    loginForm.on("submit", function (event) {
      event.preventDefault();
      const cfmsId = $("#inputText").val();
      const password = $("#inputPassword").val();
      const inputCaptchaValue = $("#captchaInput").val(); // Get CAPTCHA input value

      // console.log("user captcha:", inputCaptchaValue);

      if (!validateCaptcha(inputCaptchaValue)) {
        toastr.error("Invalid Captcha");
        generateCaptcha();
        setCaptcha();
        return;
      }

      // console.log("Login form submitted with CFMS ID:", cfmsId);
      // console.log("Password:", password);

      $.ajax({
        url: "http://localhost:8080/school/user/login",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ cfmsId: cfmsId, password: password }),
        beforeSend: function () {
          showLoader();
          hideLoaderTimeout = setTimeout(hideLoader, 200000);
        },
        success: function (data) {
          // console.log("Login response:", data);
          if (data.token) {
            if (data.message === "Change your default password") {
              setCookie("authToken", data.token, 1);
              toastr.info("Change your default password");
              showChangePasswordForm();
              hideLoader();
            } else if (data.message === "Login Success") {
              setCookie("authToken", data.token, 1);
              toastr.success("Login Success");
              hideLoader();
              window.location.href = "Home.html";
            } else {
              // Handle unexpected success messages
              toastr.warning("Unexpected response: " + data.message);
            }
          } else {
            // Handle login failure messages
            if (data.message === "Invalid password") {
              toastr.error("Invalid password. Please try again.");
              hideLoader();
            } else {
              toastr.error("Login failed: " + data.message);
              hideLoader();
            }
            generateCaptcha();
            setCaptcha();
            hideLoader();
          }
          // console.log(data.token)
        },
        
        error: function (error) {
          //hideLoader();
          console.error("Login request error:", error);
          if (error.responseJSON) {
            // Specific error message from the backend
            toastr.error("Login failed: " + error.responseJSON.message);
          } else if (error.statusText) {
            // HTTP status text if no specific message
            toastr.error("Login failed: " + error.statusText);
          } else {
            // Generic error message for unexpected errors
            toastr.error("An unexpected error occurred during login.");
          }
          generateCaptcha();
          setCaptcha();
        },
      });
    });
  }

  if (backToLoginButton.length) {
    backToLoginButton.on("click", function () {
      showLoginForm();
    });
  }

  //funcation for update password
  if (changePasswordForm.length) {
    changePasswordForm.on("submit", function (event) {
      event.preventDefault();

      const newPassword = $("#newPassword").val();
      const confirmPassword = $("#confirmPassword").val();

      const token = getCookie("authToken");
      if (!token) {
        toastr.error("Token not found in cookies. Please log in again.");
        showLoginForm(); // Redirect to login page
        return;
      }

      // console.log("Change password form submitted.");
      // console.log("New Password:", newPassword);
      // console.log("Confirm Password:", confirmPassword);

      if (newPassword !== confirmPassword) {
        toastr.error("New password and confirm password do not match.");
        return;
      }

      $.ajax({
        url: "http://localhost:8080/school/user/update-password",
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
        beforeSend: function () {
          showLoader();
          hideLoaderTimeout = setTimeout(hideLoader, 300000);
        },
        contentType: "application/json",
        data: JSON.stringify({
          newPassword: newPassword,
        }),
        success: function (data) {
          // console.log("Password change response:", data);
          if (data.status) {
            toastr.success("Password changed successfully: " + data.message);
            showLoginForm();
          } else {
            if (
              data.message ===
              "New password cannot be the same as the old password"
            ) {
              toastr.error("Password change failed: " + data.message);
            } else {
              toastr.error("Password change failed: " + data.message);
            }
            showChangePasswordForm();
          }
          hideLoader();
        },

        error: function (error) {
          console.error("Password change request error:", error);
          let errorMessage = "Password change failed.";
          if (error.responseJSON && error.responseJSON.message) {
            errorMessage += " " + error.responseJSON.message;
          } else {
            errorMessage += " " + error.statusText;
          }
          toastr.error(errorMessage);
          showChangePasswordForm();
        },
      });
    });
  }

  $.ajaxSetup({
    beforeSend: function (xhr) {
      const token = getCookie("authToken");
      if (token) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      }
    },
  });
});

// Function to set a cookie with the token
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + (value || "") + ";" + expires + ";path=/";
}
// Function to get a cookie by name
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

//remove token from coookies
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: true,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};
