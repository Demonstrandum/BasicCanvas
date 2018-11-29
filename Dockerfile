FROM python:3.6-alpine
COPY . /app
WORKDIR /app
RUN pip3 install httpserver
EXPOSE 8000
CMD ["sh", "server.sh"]
