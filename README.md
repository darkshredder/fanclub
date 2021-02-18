# Fan​ Clubs ​Portal (Mission on Tatooine)

<!-- As we all know that there are many people who help building open source projects without any incentive. Maybe Its the reason that it's not much popular in India to help them. So to tackle this issue We have built a Blockchain based solution where you can Login using Github and thus earn Ethereum tokens or Crypto money. We just need to click on Collect and it will be directly transfered to our Wallet.To make this app more Enjoyable we have also added Playing Zone where you give a Travia Quiz and earn Crypto Money Aswell -->

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