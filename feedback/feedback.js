function submit() {
  var templateParams = {
    name: "James",
    notes: "Check this out!",
  };

  emailjs.send("service_vylhvfb", "template_m9k4q8l", templateParams).then(
    function (response) {
      console.log("SUCCESS!", response.status, response.text);
    },
    function (error) {
      console.log("FAILED...", error);
    }
  );
}
