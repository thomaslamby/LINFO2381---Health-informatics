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
              refreshTemperatures();
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
  if (isNaN(systolic) || isNaN(diastolic)) {
      alert('Not a valid number');
  } else {
      axios.post('/record-bloodpressure', {
          id: id,
          systolic: systolic,
          diastolic: diastolic
      })
          .then(function(response) {
              document.getElementById('systolic').value = '';
              document.getElementById('diastolic').value = '';
          })
          .catch(function(error) {
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
          refreshTemperatures();
      })
      .catch(function(error) {
          alert('URI /patients not properly implemented in Flask');
      });
}

// Update temperature chart based on selected patient
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
          var labels = data.map(function(entry) {
              return entry.time;
          });
          var temperatures = data.map(function(entry) {
              return entry.temperature;
          });
          updateTemperatureChart(labels, temperatures);
      })
      .catch(function(error) {
          alert('URI /temperatures not properly implemented in Flask');
      });
}

// Update temperature chart
function updateTemperatureChart(labels, temperatures) {
  chart.data.labels = labels;
  chart.data.datasets[0].data = temperatures;
  chart.update();
}

function displayPatientData(id) {
  var template = document.getElementById('display-template-select').value;
  var displayInfo = document.getElementById('display-info');

  // Clear previous content
  displayInfo.innerHTML = '';

  // Fetch patient data based on selected template
  switch (template) {
      case 'temperature':
          axios.get('/temperatures?id=' + id)
              .then(function(response) {
                  var data = response.data;
                  var html = '<ul>';
                  data.forEach(function(entry) {
                      html += '<li>' + entry.time + ': ' + entry.temperature + '</li>';
                  });
                  html += '</ul>';
                  displayInfo.innerHTML = html;
              })
              .catch(function(error) {
                  console.error('Error fetching temperature data:', error);
                  displayInfo.innerHTML = 'Error fetching temperature data';
              });
          break;
      // Add similar handling for other templates
      default:
          displayInfo.innerHTML = 'No template selected';
  }
}



document.addEventListener('DOMContentLoaded', function() {
  // Initialize temperature chart
  chart = new Chart(document.getElementById('temperatures'), {
      type: 'line',
      data: {
          labels: [],
          datasets: [{
              label: 'Temperature',
              data: [],
              fill: false
          }]
      },
      options: {
          animation: {
              duration: 0 // Disable animations
          },
          scales: {
              x: {
                  ticks: {
                      // Rotate the X label
                      maxRotation: 45,
                      minRotation: 45
                  }
              }
          }
      }
  });

  // Populate select elements with patient data
  refreshPatients();

  // Add event listeners for select elements
  var selects = document.querySelectorAll('select[id$="-patient-select"]');
  selects.forEach(function(select) {
      select.addEventListener('change', refreshTemperatures);
  });
});
