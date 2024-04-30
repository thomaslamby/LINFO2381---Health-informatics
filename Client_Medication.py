#!/usr/bin/env python3

import datetime
import random
import CouchDBClient

# Initialisation du serveur CouchDB et création de la base de données "ehr" si elle n'existe pas
client = CouchDBClient.CouchDBClient()

if not 'ehr' in client.listDatabases():
    client.createDatabase('ehr')

def record_medication(patient_id):
    for i in range(5):
        medication_name = 'Medication %d' % (i + 1)
        dosage = random.randint(1, 3)  # Dosage aléatoire en mg
        frequency = random.choice(['Once daily', 'Twice daily', 'As needed'])  # Fréquence aléatoire

        now = datetime.datetime.now().isoformat()

        client.addDocument('ehr', {
            'type': 'medication',
            'patient_id': patient_id,
            'medication_name': medication_name,
            'dosage': dosage,
            'frequency': frequency,
            'time': now,
        })

def display_medications(patient_name):
    patient_id = None
    patients = client.executeView('ehr', 'patients', 'by_patient_name')
    for patient in patients:
        if patient['value']['name'] == patient_name:
            patient_id = patient['value']['_id']
            break

    medications = client.executeView('ehr', 'medications', 'by_patient_id', patient_id)

    print(f"Medications for patient '{patient_name}':")
    for med in medications:
        print(f"At {med['value']['time']}: {med['value']['medication_name']} - Dosage: {med['value']['dosage']} mg, Frequency: {med['value']['frequency']}")

def display_patients():
    patients = client.executeView('ehr', 'patients', 'by_patient_name')
    print("\nList of patients:")
    for patient in patients:
        print(f"Patient with ID {patient['value']['_id']} is {patient['value']['name']}")

record_medication('patient_id_here')  # Remplace 'patient_id_here' par l'ID réel du patient
display_medications('John Doe')  # Remplace 'John Doe' par le nom du patient dont on souhaite afficher les médicaments
display_patients()
