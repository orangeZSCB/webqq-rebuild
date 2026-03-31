from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
import base64

class QRCodeHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path == '/qrcode':
            qrcode_path = os.path.join(os.path.dirname(__file__), 'cache', 'qrcode.png')

            if os.path.exists(qrcode_path):
                with open(qrcode_path, 'rb') as f:
                    img_data = f.read()
                    img_base64 = 'data:image/png;base64,' + base64.b64encode(img_data).decode()

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'qrcode': img_base64}).encode())
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'QR code not found'}).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        print(f"[QRCode Server] {format % args}")

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 19114), QRCodeHandler)
    print('[QRCode Server] Listening on http://0.0.0.0:19114')
    server.serve_forever()
