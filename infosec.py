from requests.models import PreparedRequest
import requests


payload = {
    "username": "scott",
    "password": 'test',
    "submit": 'Login'
}

morepayload = {
    "months": 30,
    "submit":"Get Premium Content"
}


with requests.Session() as session:
    post = requests.post("http://127.0.0.1:8000/login.php", data=payload)
    #req = requests.get('http://127.0.0.1:8000/transfer.php', params=morepayload)
    print(post.text)