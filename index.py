import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

class handler(Handler):
    def do_GET(self):
        httpd = socketserver.TCPServer(("", 8000), Handler)
        httpd.server_forever()
