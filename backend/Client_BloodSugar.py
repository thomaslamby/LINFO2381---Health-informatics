#!/usr/bin/env python3

import datetime
import random
import CouchDBClient

client = CouchDBClient.CouchDBClient()

if not 'ehr' in client.listDatabases():
    client.createDatabase('ehr')

def record_blood_sugar(patient_id):
    for i in range(10):
        blood_sugar_level = random.uniform(3.5, 7.8)  # Random blood sugar level in mmol/L
        measurement_type = random.choice(['Fasting', 'Postprandial'])  # Randomly select measurement type
        comment = "No comment"  # You can modify this to allow users to input comments
        now = datetime.datetime.now().isoformat()

        client.addDocument('ehr', {
            'type': 'blood_sugar',
            'patient_id': patient_id,
            'blood_sugar_level': blood_sugar_level,
            'measurement_type': measurement_type,
            'comment': comment,
            'time': now,
        })

def display_blood_sugars(patient_name):
    patient_id = None
    patients = client.executeView('ehr', 'patients', 'by_patient_name')
    for patient in patients:
        if patient['value']['name'] == patient_name:
            patient_id = patient['value']['_id']
            break

    blood_sugars = client.executeView('ehr', 'blood_sugars', 'by_patient_id', patient_id)

    print(f"Blood sugars for patient '{patient_name}':")
    for bs in sorted(blood_sugars, key=lambda x: x['value']['time']):
        print('At %s: %.2f mmol/L' % (bs['value']['time'], bs['value']['blood_sugar_level']))

def display_patients():
    patients = client.executeView('ehr', 'patients', 'by_patient_name')
    print("\nList of patients:")
    for patient in patients:
        print(f"Patient with ID {patient['value']['_id']} is {patient['value']['name']}")

record_blood_sugar('patient_id_here')  # Replace 'patient_id_here' with actual patient ID
display_blood_sugars('John Doe')  # Replace 'John Doe' with the name of the patient whose blood sugars you want to display
display_patients()
