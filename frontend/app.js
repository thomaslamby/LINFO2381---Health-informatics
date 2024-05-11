function refreshPatients() {
  axios
    .get("/patients")
    .then(function (response) {
      var patients = response.data;
      console.log(patients);
      if (patients.length === 0) {
        // If there are no patients, disable the other forms
        toggleForms(1);
        document
          .getElementById("multiCollapseButton2")
          .classList.add("disabled");
        document
          .getElementById("multiCollapseButton3")
          .classList.add("disabled");
        document.getElementById("noPatientFound").style.display = "block";
        document.getElementById("topText").style.display = "none";
      } else {
        // If there are patients, enable the other forms
        document
          .getElementById("multiCollapseButton2")
          .classList.remove("disabled");
        document
          .getElementById("multiCollapseButton3")
          .classList.remove("disabled");
        document.getElementById("noPatientFound").style.display = "none";
        document.getElementById("topText").style.display = "block";
      }
      var patientSelects = document.querySelectorAll(
        'select[id$="-patient-select"]'
      );
      patientSelects.forEach(function (select) {
        select.innerHTML = ""; // Clear previous options
        var defaultOption = new Option("Select a patient", "");
        defaultOption.selected = true; // Make this option selected by default
        select.appendChild(defaultOption);
        patients.forEach(function (patient) {
          var option = new Option(
            patient.name + "  id: " + patient.id,
            patient.id
          );
          select.appendChild(option);
        });
      });
      // Automatically refresh temperatures after fetching patients
      //refreshTemperatures();
    })
    .catch(function (error) {
      showAlert("danger", "Error fetching patients", 3000);
    });
}

function createPatient() {
  var name = document.getElementById("inputPatientName").value;
  if (name == "") {
    showAlert("danger", "Please enter a name", 3000);
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
        showAlert("danger", "Error creating patient", 3000);
      });
  }
}

function recordTemperature() {
  var id = document.getElementById("add-patient-select").value;
  var temperature = parseFloat(
    document.getElementById("inputPatientTemperature").value
  );
  if (isNaN(temperature) || temperature === "") {
    showAlert("danger", "Please enter a valid temperature", 3000);
  } else {
    axios
      .post("/record-temperature", {
        id: id,
        temperature: temperature,
      })
      .then(function (response) {
        document.getElementById("inputPatientTemperature").value = "";
        showAlert("success", "Temperature recorded successfully", 3000);
      })
      .catch(function (error) {
        showAlert("danger", "Error recording temperature", 3000);
      });
  }
}

function recordBloodPressure() {
  var id = document.getElementById("add-patient-select").value;
  var systolic = parseFloat(
    document.getElementById("inputPatientSystolic").value
  );
  var diastolic = parseFloat(
    document.getElementById("inputPatientDiastolic").value
  );
  var meanArterialPressure = parseFloat(
    document.getElementById("inputPatientArterial").value
  );
  var pulsePressure = parseFloat(
    document.getElementById("inputPatientMeanPulse").value
  );

  // Vérification des valeurs numériques
  if (
    isNaN(systolic) ||
    systolic === "" ||
    isNaN(diastolic) ||
    diastolic === "" ||
    isNaN(meanArterialPressure) ||
    meanArterialPressure === "" ||
    isNaN(pulsePressure) ||
    pulsePressure === ""
  ) {
    showAlert("danger", "Please enter valid values", 3000);
  } else {
    axios
      .post("/record-bloodpressure", {
        id: id,
        systolic: systolic,
        diastolic: diastolic,
        mean_arterial_pressure: meanArterialPressure,
        pulse_pressure: pulsePressure,
      })
      .then(function (response) {
        // Réinitialisation des champs après l'enregistrement réussi
        document.getElementById("inputPatientSystolic").value = "";
        document.getElementById("inputPatientDiastolic").value = "";
        document.getElementById("inputPatientArterial").value = "";
        document.getElementById("inputPatientMeanPulse").value = "";
        showAlert("success", "Blood pressure recorded successfully", 3000);
      })
      .catch(function (error) {
        // Gestion des erreurs
        showAlert("danger", "Error recording blood pressure", 3000);
      });
  }
}

function recordBloodSugar() {
    var id = document.getElementById('add-patient-select').value;
    var bloodSugarLevel = parseFloat(document.getElementById('inputPatientSugar').value);
    if (isNaN(bloodSugarLevel) || bloodSugarLevel === '') {
        showAlert('danger', 'Please enter a valid blood sugar level', 3000);
    } else {
        axios.post('/record-bloodsugar', {
            id: id,
            blood_sugar_level: bloodSugarLevel,
            measurement_type: 'mg/dL' // Assuming measurement type is in mg/dL
        })
            .then(function(response) {
                document.getElementById('inputPatientSugar').value = '';
                showAlert('success', 'Blood sugar recorded successfully', 3000);
            })
            .catch(function(error) {
                showAlert('danger', 'Error recording blood sugar', 3000);
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
  alertDiv.style.bottom = "20px"; // Start from the bottom edge of the page
  alertDiv.style.zIndex = "9999";

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

// Select the elements
var patientSelect = document.getElementById("add-patient-select");
var selectDataToAdd = document.getElementById("selectDataToAdd");

// Add event listener
patientSelect.addEventListener("change", function () {
  // Check if a user is selected
  if (this.value && this.value !== '"Select a patient') {
    // Make selectDataToAdd visible
    selectDataToAdd.style.display = "block";
  } else {
    // Hide selectDataToAdd
    selectDataToAdd.style.display = "none";
  }
});

var selectData = document.getElementById("selectData");

// Add event listener
selectData.addEventListener("change", function () {
  // Check if a user is selected
  if (this.value && this.value !== '"Select data to add') {
    for (var i = 1; i < selectData.length; i++) {
      if (selectData.options[i].value == this.value) {
        document.getElementById(i).style.display = "block";
        document.getElementById(i * 10).style.display = "block";
      } else {
        document.getElementById(i).style.display = "none";
        document.getElementById(i * 10).style.display = "none";
      }
    }
  } else {
    console.log("No data selected");
  }
});

function addNumberInputRestrictions(inputElement, min, max) {
  inputElement.addEventListener("input", function (e) {
    // Remove non-digit characters
    e.target.value = e.target.value.replace(/[^\d\.-]/g, "");

    // Convert the value to a number
    var value = parseFloat(e.target.value);

    // Check if the value is out of range
    if (value < min) {
      // If the value is less than min, set it to min
      e.target.value = min;
    } else if (value > max) {
      // If the value is more than max, set it to max
      e.target.value = max;
    }
  });
}

// Get all number inputs
var numberInputs = document.querySelectorAll("input[type=number]");

// Add restrictions to each input
numberInputs.forEach(function (input) {
  addNumberInputRestrictions(input, -273.15, 200);
});

// Function to refresh patient data whenever index.html loaded
function refreshOnPageLoad() {
  refreshPatients(); // Call the function to refresh patient data
  //toggleForms(2); // Call the function to toggle forms
}

// Call the refreshOnPageLoad function when the DOM content is loaded
document.addEventListener("DOMContentLoaded", refreshOnPageLoad);
