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
    .catch(function (_error) {
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
      .then(function (_response) {
        document.getElementById("inputPatientName").value = "";
        refreshPatients();
        showAlert("success", "Patient created successfully", 3000);
      })
      .catch(function (_error) {
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
      .then(function (_response) {
        document.getElementById("inputPatientTemperature").value = "";
        showAlert("success", "Temperature recorded successfully", 3000);
      })
      .catch(function (_error) {
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
      .then(function (_response) {
        // Réinitialisation des champs après l'enregistrement réussi
        document.getElementById("inputPatientSystolic").value = "";
        document.getElementById("inputPatientDiastolic").value = "";
        document.getElementById("inputPatientArterial").value = "";
        document.getElementById("inputPatientMeanPulse").value = "";
        showAlert("success", "Blood pressure recorded successfully", 3000);
      })
      .catch(function (_error) {
        // Gestion des erreurs
        showAlert("danger", "Error recording blood pressure", 3000);
      });
  }
}

function recordBloodSugar() {
  var id = document.getElementById("add-patient-select").value;
  var bloodSugarLevel = parseFloat(
    document.getElementById("inputPatientSugar").value
  );
  if (isNaN(bloodSugarLevel) || bloodSugarLevel === "") {
    showAlert("danger", "Please enter a valid blood sugar level", 3000);
  } else {
    axios
      .post("/record-bloodsugar", {
        id: id,
        blood_sugar_level: bloodSugarLevel,
        measurement_type: "mg/dL", // Assuming measurement type is in mg/dL
      })
      .then(function (_response) {
        document.getElementById("inputPatientSugar").value = "";
        showAlert("success", "Blood sugar recorded successfully", 3000);
      })
      .catch(function (_error) {
        showAlert("danger", "Error recording blood sugar", 3000);
      });
  }
}

function recordMedication() {
  var id = document.getElementById("add-patient-select").value;
  var medicationName = document.getElementById(
    "inputPatientMedicationName"
  ).value;
  var dosage = parseFloat(
    document.getElementById("inputPatientMedicationDosage").value
  );
  var frequency = document.getElementById(
    "inputPatientMedicationFrequency"
  ).value;
  if (
    isNaN(dosage) ||
    dosage === "" ||
    dosage <= 0 ||
    medicationName === "" ||
    frequency === ""
  ) {
    showAlert("danger", "Please enter valid values", 3000);
  } else {
    axios
      .post("/record-medication", {
        id: id,
        medication_name: medicationName,
        dosage: dosage,
        frequency: frequency,
      })
      .then(function (_response) {
        document.getElementById("inputPatientMedicationName").value = "";
        document.getElementById("inputPatientMedicationDosage").value = "";
        document.getElementById("inputPatientMedicationFrequency").value = "";
        showAlert("success", "Medication recorded successfully", 3000);
      })
      .catch(function (_error) {
        showAlert("danger", "Error recording medication", 3000);
      });
  }
}

function recordAlimentation() {
  var id = document.getElementById("add-patient-select").value;
  var mealTime = document.getElementById("patientMealTime").value;
  var mealType = document.getElementById("patientMealType").value;
  var food = document.getElementById("inputPatientFoodName").value;
  var calories = parseFloat(
    document.getElementById("inputPatientFoodCalories").value
  );
  if (
    isNaN(calories) ||
    calories === "" ||
    calories <= 0 ||
    mealTime === "" ||
    mealType === "" ||
    food === ""
  ) {
    showAlert("danger", "Please enter valid values", 3000);
  } else {
    axios
      .post("/record-foodjournal", {
        id: id,
        meal_time: mealTime,
        meal_type: mealType,
        food: food,
        calories: calories,
      })
      .then(function (_response) {
        document.getElementById("patientMealTime").value = "";
        document.getElementById("inputPatientFoodName").value = "";
        document.getElementById("inputPatientFoodCalories").value = "";
        //select default meal type
        document.getElementById("patientMealType").selectedIndex = 0;
        showAlert("success", "Food journal recorded successfully", 3000);
      })
      .catch(function (_error) {
        //console.log(error);
        showAlert("danger", "Error recording food journal", 3000);
      });
  }
}

function recordPhysicalActivity() {
  var id = document.getElementById("add-patient-select").value;
  var activityTime = document.getElementById("inputPatientActivityTime").value;
  var activityType = document.getElementById("inputPatientActivityType").value;
  var duration = parseFloat(
    document.getElementById("inputPatientActivityDuration").value
  );
  if (
    isNaN(duration) ||
    duration === "" ||
    duration <= 0 ||
    activityTime === "" ||
    activityType === ""
  ) {
    showAlert("danger", "Please enter valid values", 3000);
  } else {
    axios
      .post("/record-physicalactivity", {
        id: id,
        activity_type: activityType,
        duration: duration,
      })
      .then(function (_response) {
        document.getElementById("inputPatientActivityTime").value = "";
        document.getElementById("inputPatientActivityDuration").value = "";
        //select default activity type
        document.getElementById("inputPatientActivityType").selectedIndex = 0;
        showAlert("success", "Physical activity recorded successfully", 3000);
      })
      .catch(function (_error) {
        showAlert("danger", "Error recording physical activity", 3000);
      });
  }
}

function recordVaccination() {
  var id = document.getElementById("add-patient-select").value;
  var vaccineName = document.getElementById("inputPatientVaccinName").value;
  var vaccineDate = document.getElementById("inputPatientVaccinTime").value;
  var vaccineDose = document.getElementById("inputPatientVaccinNumber").value;

  if (vaccineName == "" || vaccineDate == "" || isNaN(vaccineDose)) {
    showAlert("danger", "Please enter valid values", 3000);
  } else {
    axios
      .post("/record-vaccination", {
        id: id,
        vaccine_name: vaccineName,
        date: vaccineDate,
        dose_number: vaccineDose,
      })
      .then(function (_response) {
        document.getElementById("inputPatientVaccinName").value = "";
        document.getElementById("inputPatientVaccinTime").value = "";
        document.getElementById("inputPatientVaccinNumber").value = "";
        showAlert("success", "Vaccination recorded successfully", 3000);
      })
      .catch(function (_error) {
        //console.error("Error recording vaccination:", error);
        showAlert("danger", "Error recording vaccination", 3000);
      });
  }
}

function recordAppointment() {
  var id = document.getElementById("add-patient-select").value;
  var appointmentTime = document.getElementById(
    "inputPatientAppointmentTime"
  ).value;
  var doctorName = document.getElementById("inputPatientDoctorName").value;
  var reason = document.getElementById("inputPatientAppointmentReason").value;
  if (appointmentTime == "" || doctorName == "" || reason == "") {
    showAlert("danger", "Please enter valid values", 3000);
  } else {
    axios
      .post("/record-appointment", {
        id: id,
        appointment_time: appointmentTime,
        doctor_name: doctorName,
        reason: reason,
      })
      .then(function (_response) {
        document.getElementById("inputPatientAppointmentTime").value = "";
        document.getElementById("inputPatientDoctorName").value = "";
        document.getElementById("inputPatientAppointmentReason").value = "";
        showAlert("success", "Appointment recorded successfully", 3000);
      })
      .catch(function (_error) {
        showAlert("danger", "Error recording appointment", 3000);
      });
  }
}

function displayPatientData() {
  var patientId = document.getElementById("display-patient-select").value;
  var template = document.getElementById("selectDataDisplay").value;

  // Vérifier si un modèle a été sélectionné avant de récupérer les données du client
  if (patientId && template) {
    // Récupérer les données du client pour le modèle sélectionné
    axios
      .get("/api/data", {
        params: {
          patientId: patientId,
          template: template,
        },
      })
      .then(function (response) {
        // Afficher les données reçues dans la section appropriée de la page
        // console.log("client data: ", response.data);
        var tableData = document.getElementById("tableData");
        tableData.innerHTML = ""; // Empty the tableData element

        if (response.data.length === 0) {
          showAlert("warning", "No data found for the selected patient", 3000);
          tableData.innerHTML = `
            <p class="lead">
                No data found for the selected patient
            </p>
        `;
          return;
        }

        var table = document.createElement("table");
        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");

        table.className = "table table-striped";

        // Create the table headers
        var firstItem = response.data[0];
        var tr = document.createElement("tr");
        for (var key in firstItem) {
          var th = document.createElement("th");
          th.textContent = key;
          th.scope = "col";
          tr.appendChild(th);
        }
        thead.appendChild(tr);

        // Create the table body
        response.data.forEach(function (item) {
          var tr = document.createElement("tr");
          for (var key in item) {
            var td = document.createElement("td");
            td.textContent = item[key];
            tr.appendChild(td);
          }
          tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        tableData.appendChild(table);
        showAlert("success", "Data retrieved successfully", 3000);
      })
      .catch(function (error) {
        console.error("Error while retriving the client data:", error);
        showAlert("danger", "Error while retreving the data", 3000);
      });
  } else {
    showAlert("danger", "Please select a patient and a data to display", 3000);
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
  if (this.value && this.value !== "Select a patient") {
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
  if (this.value && this.value !== "Select data to add") {
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

var patientSelectDisplay = document.getElementById("display-patient-select");
var selectDataToDisplay = document.getElementById("selectDataToDisplay");

// Add event listener
patientSelectDisplay.addEventListener("change", function () {
  // Check if a user is selected
  if (this.value && this.value !== "Select a patient") {
    // Make selectDataToDisplay visible
    selectDataToDisplay.style.display = "block";
  } else {
    // Hide selectDataToDisplay
    selectDataToDisplay.style.display = "none";
  }
});

var selectDataDisplay = document.getElementById("selectDataDisplay");
var tableData = document.getElementById("tableData");

// Add event listener
selectDataDisplay.addEventListener("change", function () {
  // Check if a user is selected
  if (this.value && this.value !== "Select data to display") {
    tableData.style.display = "block";
    displayPatientData();
  } else {
    tableData.style.display = "none";
    //console.log("No data selected");
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
