#!/usr/bin/env python3

import datetime
import json


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
## Optional: You can install CouchDB views at this point (this is not
## mandatory, but using views will vastly improve performance)
##

# TODO
# BEGIN STRIP
client.installView('ehr', 'temperatures', 'by_patient_id', '''
function(doc) {
if (doc.type == 'temperature') {
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
# END STRIP


##
## Serving static HTML/JavaScript resources using Flask
##

from flask import Flask, Response, request, redirect, url_for
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


##
## REST API to be implemented by the students
##
    
@app.route('/create-patient', methods = [ 'POST' ])
def create_patient():
    # "request.get_json()" necessitates the client to have set "Content-Type" to "application/json"
    body = json.loads(request.get_data())

    patientId = None

    # TODO
    # BEGIN STRIP
    patientId = client.addDocument('ehr', {
        # '_id' : 'IMPLICITLY AUTO-GENERATED BY CouchDB',
        'type' : 'patient',
        'name' : body['name'],
    })
    # END STRIP

    return Response(json.dumps({
        'id' : patientId
    }), mimetype = 'application/json')
        

@app.route('/record', methods = [ 'POST' ])
def record_temperature():
    # "request.get_json()" necessitates the client to have set "Content-Type" to "application/json"
    body = json.loads(request.get_data())

    now = datetime.datetime.now().isoformat()  # Get current time

    # TODO
    # BEGIN STRIP
    client.addDocument('ehr', {
        # '_id' : 'IMPLICITLY AUTO-GENERATED BY CouchDB',
        'type' : 'temperature',
        'patient_id' : body['id'],
        'temperature' : body['temperature'],
        'time' : now,
    })
    # END STRIP

    return Response('', 204)


@app.route('/patients', methods = [ 'GET' ])
def list_patients():
    result = []

    # TODO
    # BEGIN STRIP
    patients = client.executeView('ehr', 'patients', 'by_patient_name')

    for patient in patients:
        result.append({
            'id' : patient['value']['_id'],
            'name' : patient['value']['name'],
        })
    # END STRIP

    return Response(json.dumps(result), mimetype = 'application/json')
        

@app.route('/temperatures', methods = [ 'GET' ])
def list_temperatures():
    patientId = request.args.get('id')

    result = []

    # TODO
    # BEGIN STRIP
    temperatures = client.executeView('ehr', 'temperatures', 'by_patient_id', patientId)

    for temperature in temperatures:
        result.append({
            'time' : temperature['value']['time'],
            'temperature' : temperature['value']['temperature'],
        })
    # END STRIP

    return Response(json.dumps(result), mimetype = 'application/json')

if __name__ == '__main__':
    app.run()