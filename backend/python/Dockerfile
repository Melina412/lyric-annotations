FROM python:latest
WORKDIR /app
RUN python3 -m venv env
ENV PATH="/env/bin:$PATH"
COPY requirements.txt .
# RUN ./env/bin/pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "main.py"]