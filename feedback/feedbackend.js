const btn = document.getElementById("button");
const max_submit = 3;
document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();

  // Check the honeypot field
  const honeypotField = document.getElementById("honeypot");
  if (honeypotField.value !== "") {
    alert("Sorry, your submission was marked as spam.");
    return; // Stop further execution if honeypot is filled
  }

  btn.value = "Sending...";

  const serviceID = "service_vylhvfb";
  const templateID = "template_m9k4q8l";

  emailjs.sendForm(serviceID, templateID, this).then(
    () => {
      btn.value = "Send Email";
      alert("Sent!");
      max_submit--;
    },
    (err) => {
      btn.value = "Send Email";
      alert(JSON.stringify(err));
    }
  );
});
