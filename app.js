function createPatient() {
  var name = document.getElementById('patient-name').value;
  if (name == '') {
      alert('No name was provided');
  } else {
      axios.post('/create-patient', {
          name: name
      })
          .then(function(response) {
              document.getElementById('patient-name').value = '';
              refreshPatients();
          })
          .catch(function(error) {
              alert('URI /create-patient not properly implemented in Flask');
          });
  }
}

function recordTemperature() {
  var id = document.getElementById('temperature-patient-select').value;
  var temperature = parseFloat(document.getElementById('temperature').value);
  if (isNaN(temperature)) {
      alert('Not a valid number');
  } else {
      axios.post('/record-temperature', {
          id: id,
          temperature: temperature
      })
          .then(function(response) {
              document.getElementById('temperature').value = '';
              //refreshTemperatures();
          })
          .catch(function(error) {
              alert('URI /record-temperature not properly implemented in Flask');
          });
  }
}

function recordBloodPressure() {
    var id = document.getElementById('blood-pressure-patient-select').value;
    var systolic = parseFloat(document.getElementById('systolic').value);
    var diastolic = parseFloat(document.getElementById('diastolic').value);
    var meanArterialPressure = parseFloat(document.getElementById('mean-arterial-pressure').value);
    var pulsePressure = parseFloat(document.getElementById('pulse-pressure').value);
    
    // Vérification des valeurs numériques
    if (isNaN(systolic) || isNaN(diastolic) || isNaN(meanArterialPressure) || isNaN(pulsePressure)) {
        alert('Not a valid number');
    } else {
        axios.post('/record-bloodpressure', {
            id: id,
            systolic: systolic,
            diastolic: diastolic,
            mean_arterial_pressure: meanArterialPressure,
            pulse_pressure: pulsePressure
        })
        .then(function(response) {
            // Réinitialisation des champs après l'enregistrement réussi
            document.getElementById('systolic').value = '';
            document.getElementById('diastolic').value = '';
            document.getElementById('mean-arterial-pressure').value = '';
            document.getElementById('pulse-pressure').value = '';
        })
        .catch(function(error) {
            // Gestion des erreurs
            alert('URI /record-bloodpressure not properly implemented in Flask');
        });
    }
  }
  
function recordBloodSugar() {
  var id = document.getElementById('blood-sugar-patient-select').value;
  var bloodSugarLevel = parseFloat(document.getElementById('blood-sugar-level').value);
  if (isNaN(bloodSugarLevel)) {
      alert('Not a valid number');
  } else {
      axios.post('/record-bloodsugar', {
          id: id,
          blood_sugar_level: bloodSugarLevel,
          measurement_type: 'mg/dL' // Assuming measurement type is in mg/dL
      })
          .then(function(response) {
              document.getElementById('blood-sugar-level').value = '';
          })
          .catch(function(error) {
              alert('URI /record-bloodsugar not properly implemented in Flask');
          });
  }
}

function recordMedication() {
  var id = document.getElementById('medication-patient-select').value;
  var medicationName = document.getElementById('medication-name').value;
  var dosage = parseFloat(document.getElementById('dosage').value);
  var frequency = document.getElementById('frequency').value;
  if (isNaN(dosage)) {
      alert('Not a valid dosage');
  } else {
      axios.post('/record-medication', {
          id: id,
          medication_name: medicationName,
          dosage: dosage,
          frequency: frequency
      })
          .then(function(response) {
              document.getElementById('medication-name').value = '';
              document.getElementById('dosage').value = '';
              document.getElementById('frequency').value = '';
          })
          .catch(function(error) {
              alert('URI /record-medication not properly implemented in Flask');
          });
  }
}

function recordAlimentation() {
  var id = document.getElementById('alimentation-patient-select').value;
  var mealTime = document.getElementById('meal-time').value;
  var mealType = document.getElementById('meal-type').value;
  var food = document.getElementById('food').value;
  var calories = parseFloat(document.getElementById('calories').value);
  if (isNaN(calories)) {
      alert('Not a valid number');
  } else {
      axios.post('/record-foodjournal', {
          id: id,
          meal_time: mealTime,
          meal_type: mealType,
          food: food,
          calories: calories
      })
          .then(function(response) {
              document.getElementById('meal-time').value = '';
              document.getElementById('food').value = '';
              document.getElementById('calories').value = '';
          })
          .catch(function(error) {
              alert('URI /record-foodjournal not properly implemented in Flask');
          });
  }
}

function recordPhysicalActivity() {
  var id = document.getElementById('activity-patient-select').value;
  var activityTime = document.getElementById('activity-time').value;
  var activityType = document.getElementById('activity-type').value;
  var duration = parseFloat(document.getElementById('duration').value);
  if (isNaN(duration)) {
      alert('Not a valid duration');
  } else {
      axios.post('/record-physicalactivity', {
          id: id,
          activity_type: activityType,
          duration: duration
      })
          .then(function(response) {
              document.getElementById('activity-time').value = '';
              document.getElementById('duration').value = '';
          })
          .catch(function(error) {
              alert('URI /record-physicalactivity not properly implemented in Flask');
          });
  }
}

function recordVaccination() {
    var id = document.getElementById('vaccination-patient-select').value;
    var vaccineName = document.getElementById('vaccine-name').value;
    var vaccineDate = document.getElementById('vaccine-date').value;
    var vaccineDose = document.getElementById('vaccine-dose').value;

    if (!vaccineName || !vaccineDate || !vaccineDose) {
        alert('Please fill all fields');
        return;
    }

    axios.post('/record-vaccination', {
        id: id,
        vaccine_name: vaccineName,
        date: vaccineDate,
        dose_number: vaccineDose
    })
    .then(function(response) {
        document.getElementById('vaccine-name').value = '';
        document.getElementById('vaccine-date').value = '';
        document.getElementById('vaccine-dose').value = '';
        alert('Vaccination recorded successfully');
    })
    .catch(function(error) {
        console.error("Error recording vaccination:", error);
        alert('Failed to record vaccination. Check console for details.');
    });
}

function recordAppointment() {
  var id = document.getElementById('appointment-patient-select').value;
  var appointmentTime = document.getElementById('appointment-time').value;
  var doctorName = document.getElementById('doctor-name').value;
  var reason = document.getElementById('reason').value;
  axios.post('/record-appointment', {
      id: id,
      appointment_time: appointmentTime,
      doctor_name: doctorName,
      reason: reason
  })
      .then(function(response) {
          document.getElementById('appointment-time').value = '';
          document.getElementById('doctor-name').value = '';
          document.getElementById('reason').value = '';
      })
      .catch(function(error) {
          alert('URI /record-appointment not properly implemented in Flask');
      });
}

// Populate the select elements with patient data from server
function refreshPatients() {
  axios.get('/patients')
      .then(function(response) {
          var patients = response.data;
          var patientSelects = document.querySelectorAll('select[id$="-patient-select"]');
          patientSelects.forEach(function(select) {
              select.innerHTML = ''; // Clear previous options
              var defaultOption = new Option('Select a patient', '');
              select.appendChild(defaultOption);
              patients.forEach(function(patient) {
                  var option = new Option(patient.name, patient.id);
                  select.appendChild(option);
              });
          });
          // Automatically refresh temperatures after fetching patients
          //refreshTemperatures();
      })
      .catch(function(error) {
          alert('URI /patients not properly implemented in Flask');
      });
}

function refreshTemperatures() {
    var id = document.getElementById('temperature-patient-select').value;
    if (id === '') {
        console.log('No patient selected');
        return;
    }
  
    axios.get('/temperatures', {
        params: {
            id: id
        }
    })
    .then(function(response) {
        var data = response.data;
        // Vérifiez si des données de température existent
        if (data.length === 0) {
            console.log('No temperature data available for this patient yet.');
            // Vous pouvez également informer l'utilisateur que les données ne sont pas disponibles
            return;
        }
  
        var labels = data.map(function(entry) {
            return entry.time;
        });
        var temperatures = data.map(function(entry) {
            return entry.temperature;
        });
        updateTemperatureChart(labels, temperatures);
    })
    .catch(function(error) {
        console.error("Error occurred:", error);
        alert('Error in processing temperatures. Check console for details.');
    });
  }


// Function to redirect to patient.html
function redirectToPatientInfo() {
    axios.get('/patients')
        .then(function(response) {
            var patients = response.data;
            var queryString = '?patients=' + encodeURIComponent(JSON.stringify(patients));
            window.location.href = 'patient.html' + queryString;
        })
        .catch(function(error) {
            console.error('Error fetching patients:', error);
            alert('Failed to redirect to patient info. Please try again.');
        });
}

// Attach redirectToPatientInfo function to the click event of the button
document.addEventListener('DOMContentLoaded', function() {
    var redirectButton = document.getElementById('redirect-button');
    redirectButton.addEventListener('click', redirectToPatientInfo);
});  



// Fonction pour afficher les données du client en fonction du modèle sélectionné
function displayPatientData() {
    var patientId = document.getElementById('display-patient-select').value;
    var template = document.getElementById('display-template-select').value;
    var displayInfo = document.getElementById('display-info');

    // Effacer le contenu précédent
    displayInfo.innerHTML = '';

    // Vérifier si un modèle a été sélectionné avant de récupérer les données du client
    if (patientId && template) {
        // Récupérer les données du client pour le modèle sélectionné
        axios.get('/api/data', {
            params: {
                patientId: patientId,
                template: template
            }
        })
        .then(function(response) {
            // Afficher les données reçues dans la section appropriée de la page
            displayInfo.innerHTML = JSON.stringify(response.data);
            
        })
        .catch(function(error) {
            console.error('Erreur lors de la récupération des données du client:', error);
            console.log('Error response:', error.response); // Ajout de cette ligne pour afficher la réponse d'erreur complète
            displayInfo.innerHTML = 'Erreur lors de la récupération des données du client';
        });
    }
}


// Ajouter un écouteur d'événements pour le bouton de déclenchement
document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('redirect-button');
    button.addEventListener('click', displayPatientData);
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('display-button').addEventListener('click', displayPatientData);
});

function displayAppointmentsToday() {
    axios.get('/api/appointments/today')
    .then(function(response) {
        // Display appointments for today
        var appointmentsTodayDiv = document.getElementById('appointments-today');
        appointmentsTodayDiv.innerHTML = JSON.stringify(response.data);
    })
    .catch(function(error) {
        console.error('Error retrieving appointments for today:', error);
    });
}

function displayAppointmentsWeek() {
    axios.get('/api/appointments/week')
    .then(function(response) {
        // Display appointments for this week
        var appointmentsWeekDiv = document.getElementById('appointments-week');
        appointmentsWeekDiv.innerHTML = JSON.stringify(response.data);
    })
    .catch(function(error) {
        console.error('Error retrieving appointments for this week:', error);
    });
}


// Function to refresh patient data whenever index.html or patient.html is loaded
function refreshOnPageLoad() {
    refreshPatients(); // Call the function to refresh patient data
}

// Call the refreshOnPageLoad function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', refreshOnPageLoad);
