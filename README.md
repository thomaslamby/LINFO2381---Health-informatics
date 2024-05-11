# LINFO2381---Health-informatics

This is a health informatics project.

## Prerequisites

You need to have Docker and Python3 installed on your machine.

## Running the Project

1. First, start the CouchDB server using Docker with the following command:

```bash
docker run --rm -t -i -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password couchdb:3.3.3
```

2. Second, from the backend directory start the Flask server using the following command:

```bash
python3 Server_Global.py
```

3. Once the Flask server is running, it will display the address of the server in the terminal. You can open this address in your browser to access the project.