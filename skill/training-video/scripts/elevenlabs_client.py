"""ElevenLabs client for the training-video scripts. Usage: from elevenlabs_client import get_client"""
import os
from pathlib import Path

from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

# The key file lives outside this folder because this folder syncs to GitHub.
ENV_FILE = Path(os.environ.get("ELEVENLABS_ENV_FILE", "~/.config/elevenlabs/.env.local")).expanduser()


def get_client():
    load_dotenv(ENV_FILE)
    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key:
        raise RuntimeError(f"ELEVENLABS_API_KEY is not set and was not found in {ENV_FILE}")
    # The SDK reads the environment at import time, before load_dotenv runs, so pass the key in.
    return ElevenLabs(api_key=api_key)
