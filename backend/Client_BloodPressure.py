#!/usr/bin/env python3

import datetime
import random


##
## Initialization of the CouchDB server (creation of 1 collection of
## documents named "ehr", if it is not already existing)
##

import CouchDBClient

client = CouchDBClient.CouchDBClient()

# client.reset()   # If you want to clear the entire content of CouchDB

if not 'ehr' in client.listDatabases():
    client.createDatabase('ehr')


##
## Goal: Create a patient, record a few blood_pressures, retrieve the
## blood_pressures associated with the patient, and finally retrieve the
## name of all the patients stored in the CouchDB databases.
##

## 1. Create one new patient (which corresponds to an EHR in the
## framework of openEHR CDR) and associate it with a demographic
## information (i.e., patient's name)

patientName = 'John Doe n°%d' % random.randint(0, 1000)

# TODO
# BEGIN STRIP
patientId = client.addDocument('ehr', {
    # '_id' : 'IMPLICITLY AUTO-GENERATED BY CouchDB',
    'type' : 'patient',
    'name' : patientName,
})
# END STRIP


## 2. Record a few random blood_pressures

for i in range(10):
    systolic_pressure = random.randint(90, 120)
    diastolic_pressure = random.randint(60, 80)
    mean_arterial_pressure = (2/3) * diastolic_pressure + (1/3) * systolic_pressure
    pulse_pressure = systolic_pressure - diastolic_pressure
    now = datetime.datetime.now().isoformat()

    client.addDocument('ehr', {
        'type' : 'blood_pressure',
        'patient_id' : patientId,
        'systolic' : systolic_pressure,
        'diastolic' : diastolic_pressure,
        'mean_arterial_pressure' : mean_arterial_pressure,
        'pulse_pressure' : pulse_pressure,
        'time' : now,
    })
    # END STRIP


## 3. Retrieve all the blood_pressures that have just been stored, sorted
## by increasing time

# TODO
# BEGIN STRIP
if False:
    # Slow version (many calls to the REST API)
    compositions = []

    for documentId in client.listDocuments('ehr'):
        doc = client.getDocument('ehr', documentId)
        if (doc['type'] == 'blood_pressures' and
            doc['patient_id'] == patientId):
            compositions.append(doc)
    
else:
    # Fast version (install a view that "groups" blood pressures
    # according to their patient ID, which corresponds to AQL in
    # openEHR)
    client.installView('ehr', 'blood_pressures', 'by_patient_id', '''
    function(doc) {
      if (doc.type == 'blood_pressure') {
        emit(doc.patient_id, doc);
      }
    }
    ''')

    compositions = client.executeView('ehr', 'blood_pressures', 'by_patient_id', patientId)

    # Only keep the content of "value" to be compatible with the slow version
    compositions = list(map(lambda x: x['value'], compositions))

for bp in sorted(compositions, key = lambda x: x['time']):
    print('At %s: %d/%d mmHg' % (bp['time'], bp['systolic'], bp['diastolic'],bp['mean_arterial_pressure'],bp['pulse_pressure'] ))
# END STRIP


## 4. Retrieve the name of all the patients stored in the database

# TODO
# BEGIN STRIP
if False:
    # Slow version (many calls to the REST API)
    compositions = []
    
    for documentId in client.listDocuments('ehr'):
        doc = client.getDocument('ehr', documentId)
        if doc['type'] == 'patient':
            compositions.append(doc)
else:
    # Fast version (install a view)
    client.installView('ehr', 'patients', 'by_patient_name', '''
    function(doc) {
      if (doc.type == 'patient') {
        emit(doc.name, doc);
      }
    }
    ''')

    compositions = client.executeView('ehr', 'patients', 'by_patient_name')

    # Only keep the content of "value" to be compatible with the slow version
    compositions = list(map(lambda x: x['value'], compositions))

for composition in compositions:
    print('Patient with ID %s is %s' % (composition['_id'], composition['name']))
# END STRIP
