import http.server
import socketserver
import os

os.chdir('./example')
handler = http.server.SimpleHTTPRequestHandler

