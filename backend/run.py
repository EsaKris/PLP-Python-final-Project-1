#!/usr/bin/env python
"""
This script runs the Django development server on the specified host and port.
It should be used for development purposes only.
"""
import os
import sys
from dotenv import load_dotenv

if __name__ == "__main__":
    # Load environment variables from .env file
    load_dotenv()
    
    # Set the Django settings module
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "techiekraft.settings")
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Default to port 5000 to match the previous Express server
    port = os.environ.get("PORT", "5000")
    host = "0.0.0.0"  # Bind to all interfaces
    
    # Run the development server
    execute_from_command_line(["manage.py", "runserver", f"{host}:{port}"])