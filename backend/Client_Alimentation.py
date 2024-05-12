#!/usr/bin/env python3

import datetime
import random
import CouchDBClient

client = CouchDBClient.CouchDBClient()

if not 'ehr' in client.listDatabases():
    client.createDatabase('ehr')

def record_food_journal(patient_id):
    for i in range(3):
        meal_time = datetime.datetime.now() - datetime.timedelta(hours=random.randint(1, 12))
        meal_type = random.choice(['Breakfast', 'Lunch', 'Dinner', 'Snack'])
        food = "Food item %d" % (i + 1)
        calories = random.randint(100, 800)

        client.addDocument('ehr', {
            'type': 'food_journal',
            'patient_id': patient_id,
            'meal_time': meal_time.isoformat(),
            'meal_type': meal_type,
            'food': food,
            'calories': calories
        })

def display_food_journal(patient_name):
    patient_id = None
    patients = client.executeView('ehr', 'patients', 'by_patient_name')
    for patient in patients:
        if patient['value']['name'] == patient_name:
            patient_id = patient['value']['_id']
            break

    food_journal = client.executeView('ehr', 'food_journal', 'by_patient_id', patient_id)

    print(f"Food journal for patient '{patient_name}':")
    for entry in sorted(food_journal, key=lambda x: x['value']['meal_time']):
        print(f"At {entry['value']['meal_time']}: {entry['value']['food']} - Calories: {entry['value']['calories']}")

def display_patients():
    patients = client.executeView('ehr', 'patients', 'by_patient_name')
    print("\nList of patients:")
    for patient in patients:
        print(f"Patient with ID {patient['value']['_id']} is {patient['value']['name']}")

record_food_journal('patient_id_here')  # Replace 'patient_id_here' with actual patient ID
display_food_journal('John Doe')  # Replace 'John Doe' with the name of the patient whose food journal you want to display
display_patients()
