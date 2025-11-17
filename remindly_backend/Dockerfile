FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /user_app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Run Django using manage.py
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "remindly_backend.asgi:application"]
