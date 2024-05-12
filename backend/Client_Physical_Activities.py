#!/usr/bin/env python3

import datetime
import random
import CouchDBClient

client = CouchDBClient.CouchDBClient()

if not 'ehr' in client.listDatabases():
    client.createDatabase('ehr')

def record_physical_activity(patient_id):
    for i in range(3):
        activity_time = datetime.datetime.now() - datetime.timedelta(hours=random.randint(1, 12))
        activity_type = random.choice(['Running', 'Walking', 'Cycling', 'Swimming'])
        duration = random.randint(10, 60)

        client.addDocument('ehr', {
            'type': 'physical_activity',
            'patient_id': patient_id,
            'activity_time': activity_time.isoformat(),
            'activity_type': activity_type,
            'duration': duration
        })

def display_physical_activity(patient_name):
    patient_id = None
    patients = client.executeView('ehr', 'patients', 'by_patient_name')
    for patient in patients:
        if patient['value']['name'] == patient_name:
            patient_id = patient['value']['_id']
            break

    physical_activity = client.executeView('ehr', 'physical_activity', 'by_patient_id', patient_id)

    print(f"Physical activity for patient '{patient_name}':")
    for activity in sorted(physical_activity, key=lambda x: x['value']['activity_time']):
        print(f"At {activity['value']['activity_time']}: {activity['value']['activity_type']} - Duration: {activity['value']['duration']} minutes")

def display_patients():
    patients = client.executeView('ehr', 'patients', 'by_patient_name')
    print("\nList of patients:")
    for patient in patients:
        print(f"Patient with ID {patient['value']['_id']} is {patient['value']['name']}")

record_physical_activity('patient_id_here')  # Remplacer 'patient_id_here' par l'identifiant réel du patient
display_physical_activity('John Doe')  # Remplacer 'John Doe' par le nom du patient dont vous souhaitez afficher l'activité physique
display_patients()
