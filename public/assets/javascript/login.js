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

<<<<<<< HEAD
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
          // CAN NOT USE WINDOW ALERTS HOWARD HAS SAID A BUNCH OF TIMES HOW MUCH HE HATES THEM
        document.getElementById('messageAlert').setAttribute("style", "visibility:visible")
        document.getElementById("blank-field-alert").innerText=response.statusText
        setTimeout(function(){document.getElementById('messageAlert').setAttribute("style", "visibility:collapse")},4000)
        
        }
=======
      if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        alert(response.statusText);
      }
>>>>>>> feature/codys-front-end
    }
  }
}
// ===================  line 18 put replace dashboard =============================== //

document.querySelector("#login").addEventListener("click", loginFormHandler);
