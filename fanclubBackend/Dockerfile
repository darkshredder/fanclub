FROM python:3.8-alpine


ENV PYTHONBUFFERED 1

RUN apk update \
  && apk add postgresql-dev gcc python3-dev musl-dev build-base py-pip libffi-dev openssl-dev jpeg-dev zlib-dev


RUN pip install --upgrade pip \
  && pip install --upgrade setuptools \
  && pip install --upgrade pipenv  

COPY ./requirementsNew.txt /requirementsNew.txt
RUN pip install -r /requirementsNew.txt

RUN mkdir /usr/backend
WORKDIR /usr/backend

# COPY . .

CMD ["sh", "-c", "python manage.py collectstatic --no-input; python manage.py migrate; python manage.py runserver 0.0.0.0:8000 --noreload"]
