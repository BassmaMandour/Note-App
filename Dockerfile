FROM python:alpine

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt && \
    pip install gunicorn


COPY . .

EXPOSE 5000

CMD ["python", "app.py"]

