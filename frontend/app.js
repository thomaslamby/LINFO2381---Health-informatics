function refreshPatients() {
  axios
    .get("/patients")
    .then(function (response) {
      var patients = response.data;
      console.log(patients);
      if (patients.length === 0) {
        // If there are no patients, disable the other forms
        toggleForms(1);
        document.getElementById("multiCollapseButton2").classList.add("disabled");
        document.getElementById("multiCollapseButton3").classList.add("disabled");
        document.getElementById("noPatientFound").style.display = "block";
        document.getElementById("topText").style.display = "none";
      } else {
        // If there are patients, enable the other forms
        document.getElementById("multiCollapseButton2").classList.remove("disabled");
        document.getElementById("multiCollapseButton3").classList.remove("disabled");
        document.getElementById("noPatientFound").style.display = "none";
        document.getElementById("topText").style.display = "block";
      }
      var patientSelects = document.querySelectorAll(
        'select[id$="-patient-select"]'
      );
      patientSelects.forEach(function (select) {
        select.innerHTML = ""; // Clear previous options
        var defaultOption = new Option("Select a patient", "");
        select.appendChild(defaultOption);
        patients.forEach(function (patient) {
          var option = new Option(patient.name, patient.id);
          select.appendChild(option);
        });
      });
      // Automatically refresh temperatures after fetching patients
      //refreshTemperatures();
    })
    .catch(function (error) {
      alert("URI /patients not properly implemented in Flask");
    });
}

function createPatient() {
  var name = document.getElementById("inputPatientName").value;
  if (name == "") {
    alert("No name was provided");
  } else {
    axios
      .post("/create-patient", {
        name: name,
      })
      .then(function (response) {
        document.getElementById("inputPatientName").value = "";
        refreshPatients();
        showAlert("success", "Patient created successfully", 3000);
      })
      .catch(function (error) {
        alert("URI /create-patient not properly implemented in Flask");
      });
  }
}

function toggleForms(id) {
  // Loop through all the collapsible elements
  for (let i = 1; i <= 3; i++) {
    let element = document.getElementById(`multiCollapseExample${i}`);
    let button = document.getElementById(`multiCollapseButton${i}`);
    // If the current element's id matches the provided id, toggle its visibility
    // Otherwise, ensure it's not shown
    if (i === id) {
      button.classList.add("active");
      element.classList.toggle("show");
    } else {
      button.classList.remove("active");
      element.classList.remove("show");
    }
  }
}

function showAlert(type, text, duration) {
  // Create a new alert div
  var alertDiv = document.createElement("alertDiv");
  alertDiv.className = "alert alert-" + type + " alert-dismissible fade show";
  alertDiv.role = "alert";
  alertDiv.style.position = "fixed"; // Make the alert fixed position
  alertDiv.style.left = "20px"; // Start from the left edge of the page
  alertDiv.style.right = "20px"; // End at the right edge of the page


  // Create a new text node with the specified text
  var alertText = document.createTextNode(text);
  alertDiv.appendChild(alertText);

  // Append the new alert div to the main div
  var mainDiv = document.getElementById("alertDiv");
  mainDiv.appendChild(alertDiv);

  // Fade out the alert after the specified duration
  setTimeout(function () {
    $(alertDiv).fadeOut("slow");
  }, duration);
}

// Function to refresh patient data whenever index.html or patient.html is loaded
function refreshOnPageLoad() {
  refreshPatients(); // Call the function to refresh patient data
}

// Call the refreshOnPageLoad function when the DOM content is loaded
document.addEventListener("DOMContentLoaded", refreshOnPageLoad);
