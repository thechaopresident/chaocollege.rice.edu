#!/usr/bin/env python3
"""
Local preview server for the Chao College site.

    python3 tools/devserver.py [port]        # default 4173

Why this exists instead of `python3 -m http.server`: that server sends
Last-Modified but no Cache-Control and no ETag, so browsers fall back to
heuristic caching and will happily serve a stale copy of styles.css or
data/site.js for minutes after you've edited it. Every response here carries
Cache-Control: no-store, so a plain refresh always shows current files.

This is a development convenience only. It is not used in production — the
site deploys as plain static files.
"""
import sys, os, socket, functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):          # quieter: errors only
        status = str(args[1]) if len(args) > 1 else ""
        if status.startswith(("4", "5")):
            sys.stderr.write("  %s %s\n" % (status, args[0]))

class DualStackServer(ThreadingHTTPServer):
    """Listen on IPv6 *and* IPv4.

    On macOS `localhost` resolves to ::1 before 127.0.0.1, so an IPv4-only
    socket gets connection-refused in the browser even though curl against
    127.0.0.1 works. Binding :: with V6ONLY off covers both.
    """
    address_family = socket.AF_INET6
    allow_reuse_address = True

    def server_bind(self):
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except (AttributeError, OSError):
            pass
        super().server_bind()

def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    handler = functools.partial(NoCacheHandler, directory=ROOT)
    try:
        server = DualStackServer(("::", port), handler)
    except OSError:                       # no IPv6 on this host
        server = ThreadingHTTPServer(("0.0.0.0", port), handler)
    with server as httpd:
        print(f"Chao College site  ->  http://localhost:{port}")
        print(f"serving {ROOT}  (no-store: edits show on a plain refresh)")
        print("Ctrl-C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nstopped")

if __name__ == "__main__":
    main()
