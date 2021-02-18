# Fan​ Clubs ​Portal (Mission on Tatooine)

Fan Club Portal for every loyal fan out there. Here, Users can create achat room for any movie/series they like which can be followed by other fans logged into the portal.

## Tech Stack

```sh
 React
 Semantic UI
 Axios
 Websockets
 Django
 Django-Rest-Framework
 Django-Channels
 Redis
 Google OAuth2
```


## Installation

#### Using Docker
Make sure your redis is stopped and you have docker and docker-compose installed.

Open your terminal inside `fanclub` directory and run the following command.
```sh
$ docker-compose up
```
Your frontend will be sucessfully running at http://localhost:3000/ and backend at http://localhost:8000/ 

#### Without Using Docker
Make sure your redis is started.

Open your two terminal inside `fanclub` directory and run the following command.

##### Terminal 1
```sh
$ cd fanclubBackend
$ python3 -m venv venv
$ source venv/bin/activate
$ pip install -r requirementsNew.txt
$ python manage.py migrate
$ python manage.py runserver
```

##### Terminal 2
```sh
$ cd fanclubfrontend
$ yarn install
$ yarn start
```
Your frontend will be sucessfully running at http://localhost:3000/ and backend at http://localhost:8000/ 

Enjoy!!!!!!!!!!!!!!!