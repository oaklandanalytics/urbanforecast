import requests
import json

data = {
    'taz_url': 'someurl',
    'parcel_url': 'some other url',
    'timestamp': 999999,
    'name': 'Simulation run 45, Machine EC2'
}

r = requests.post('https://forecast-feedback.firebaseio.com/simulations.json', json.dumps(data))

print(r.text)