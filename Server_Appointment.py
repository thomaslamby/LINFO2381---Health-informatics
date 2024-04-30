#!/usr/bin/env python3

import datetime
import random
import CouchDBClient

client = CouchDBClient.CouchDBClient()

if not 'ehr' in client.listDatabases():
    client.createDatabase('ehr')

def record_appointments(patient_id):
    for i in range(3):
        appointment_time = datetime.datetime.now() + datetime.timedelta(days=random.randint(1, 7))
        doctor_name = "Doctor %d" % (i + 1)
        reason = "Reason for appointment %d" % (i + 1)

        client.addDocument('ehr', {
            'type': 'appointment',
            'patient_id': patient_id,
            'appointment_time': appointment_time.isoformat(),
            'doctor_name': doctor_name,
            'reason': reason
        })

def display_appointments(patient_name):
    patient_id = None
    patients = client.executeView('ehr', 'patients', 'by_patient_name')
    for patient in patients:
        if patient['value']['name'] == patient_name:
            patient_id = patient['value']['_id']
            break

    appointments = client.executeView('ehr', 'appointments', 'by_patient_id', patient_id)

    print(f"Appointments for patient '{patient_name}':")
    for appointment in sorted(appointments, key=lambda x: x['value']['appointment_time']):
        print(f"At {appointment['value']['appointment_time']}: {appointment['value']['doctor_name']}, Reason: {appointment['value']['reason']}")

def display_patients():
    patients = client.executeView('ehr', 'patients', 'by_patient_name')
    print("\nList of patients:")
    for patient in patients:
        print(f"Patient with ID {patient['value']['_id']} is {patient['value']['name']}")

record_appointments('patient_id_here')  # Replace 'patient_id_here' with actual patient ID
display_appointments('John Doe')  # Replace 'John Doe' with the name of the patient whose appointments you want to display
display_patients()
