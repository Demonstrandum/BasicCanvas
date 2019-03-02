import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

class handler(Handler):
    def do_GET(self):
        httpd = socketserver.TCPServer(("", 46500), Handler)
        httpd.serve_forever()
