async function loginFormHandler(event) {
  event.preventDefault();

  const email = document.querySelector("#email-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();

  if (document.querySelector("#remember-box").checked) {
    const checkbox = document.querySelector("#remember-box:checked").value;

    if (email && password) {
      const response = await fetch("/api/users/login", {
        method: "post",
        body: JSON.stringify({
          email,
          password,
          checkbox: checkbox ? checkbox : null,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        alert(response.statusText);
      }
    }
  } else {
    if (email && password) {
      const response = await fetch("/api/users/login", {
        method: "post",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        alert(response.statusText);
      }
    }
  }
}
// ===================  line 18 put replace dashboard =============================== //

document.querySelector("#login").addEventListener("click", loginFormHandler);
