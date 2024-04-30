#!/usr/bin/env python3

import datetime
import random

# Initialisation du serveur CouchDB et création de la base de données "ehr" si elle n'existe pas
import CouchDBClient

client = CouchDBClient.CouchDBClient()

if not 'ehr' in client.listDatabases():
    client.createDatabase('ehr')

# Création d'un patient avec un nom aléatoire
patientName = 'John Doe n°%d' % random.randint(0, 1000)

# Enregistrement du patient dans la base de données
patientId = client.addDocument('ehr', {
    'type': 'patient',
    'name': patientName,
})

# Enregistrement de quelques médicaments pour le patient
for i in range(5):
    medication_name = 'Medication %d' % (i + 1)
    dosage = random.randint(1, 3)  # Dosage aléatoire en mg
    frequency = random.choice(['Once daily', 'Twice daily', 'As needed'])  # Fréquence aléatoire

    now = datetime.datetime.now().isoformat()

    client.addDocument('ehr', {
        'type': 'medication',
        'patient_id': patientId,
        'medication_name': medication_name,
        'dosage': dosage,
        'frequency': frequency,
        'time': now,
    })

# Récupération de la liste des médicaments pour le patient
medications = client.executeView('ehr', 'medications', 'by_patient_id', patientId)

# Affichage des médicaments enregistrés
print(f"Medications for patient '{patientName}':")
for med in medications:
    print(f"At {med['time']}: {med['medication_name']} - Dosage: {med['dosage']} mg, Frequency: {med['frequency']}")

# Récupération de la liste de tous les patients enregistrés dans la base de données
patients = client.executeView('ehr', 'patients', 'by_patient_name')

# Affichage des noms de tous les patients
print("\nList of patients:")
for patient in patients:
    print(f"Patient with ID {patient['value']['_id']} is {patient['value']['name']}")
