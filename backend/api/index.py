"""
Entry point for Vercel's Python serverless runtime.

Vercel's @vercel/python builder looks for a module-level WSGI callable
named `app` in this file — Django's own wsgi.py exposes it as
`application`, so this just re-exports it under the name Vercel expects.
"""

import os
import sys

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

from django.core.wsgi import get_wsgi_application  # noqa: E402

app = get_wsgi_application()
