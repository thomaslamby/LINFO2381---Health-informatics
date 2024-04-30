#!/usr/bin/env python3

import datetime
import json
from flask import Flask, Response, request, redirect, url_for
import CouchDBClient

# Initialisation du serveur CouchDB et création de la base de données "ehr" si elle n'existe pas
client = CouchDBClient.CouchDBClient()

if not 'ehr' in client.listDatabases():
    client.createDatabase('ehr')

# Installation des vues CouchDB pour les médicaments et les patients
client.installView('ehr', 'medications', 'by_patient_id', '''
function(doc) {
if (doc.type == 'medication') {
    emit(doc.patient_id, doc);
  }
}
''')

client.installView('ehr', 'patients', 'by_patient_name', '''
function(doc) {
  if (doc.type == 'patient') {
    emit(doc.name, doc);
  }
}
''')

# Configuration de l'application Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return redirect(url_for('get_index'))

@app.route('/index.html', methods = [ 'GET' ])
def get_index():
    with open('index.html', 'r') as f:
        return Response(f.read(), mimetype = 'text/html')

@app.route('/app.js', methods = [ 'GET' ])
def get_javascript():
    with open('app.js', 'r') as f:
        return Response(f.read(), mimetype = 'text/javascript')

# Création d'un patient
@app.route('/create-patient', methods = [ 'POST' ])
def create_patient():
    body = json.loads(request.get_data())
    patientId = client.addDocument('ehr', {
        'type' : 'patient',
        'name' : body['name'],
    })
    return Response(json.dumps({
        'id' : patientId
    }), mimetype = 'application/json')

# Enregistrement d'un médicament
@app.route('/record-medication', methods = [ 'POST' ])
def record_medication():
    body = json.loads(request.get_data())
    now = datetime.datetime.now().isoformat()
    client.addDocument('ehr', {
        'type' : 'medication',
        'patient_id' : body['id'],
        'medication_name' : body['medication_name'],
        'dosage' : body['dosage'],
        'frequency' : body['frequency'],
        'comment' : body.get('comment', ''),  # Champs de commentaire facultatif
        'time' : now,
    })
    return Response('', 204)

# Récupération de la liste des patients
@app.route('/patients', methods = [ 'GET' ])
def list_patients():
    result = []
    patients = client.executeView('ehr', 'patients', 'by_patient_name')
    for patient in patients:
        result.append({
            'id' : patient['value']['_id'],
            'name' : patient['value']['name'],
        })
    return Response(json.dumps(result), mimetype = 'application/json')

# Récupération de la liste des médicaments pour un patient donné
@app.route('/medications', methods = [ 'GET' ])
def list_medications():
    patientId = request.args.get('id')
    result = []
    medications = client.executeView('ehr', 'medications', 'by_patient_id', patientId)
    for med in medications:
        result.append({
            'time' : med['time'],
            'medication_name' : med['medication_name'],
            'dosage' : med['dosage'],
            'frequency' : med['frequency'],
            'comment' : med['comment'],
        })
    return Response(json.dumps(result), mimetype = 'application/json')

if __name__ == '__main__':
    app.run()
