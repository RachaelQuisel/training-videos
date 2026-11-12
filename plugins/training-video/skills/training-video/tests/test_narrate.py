import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import narrate


def test_script_text_joins_spoken_lines_in_order():
    script = {"segments": [{"spoken": " Open the page. "}, {"spoken": "Tap Sign me up."}]}
    assert narrate.script_text(script) == "Open the page. Tap Sign me up."


def test_check_length_rejects_text_over_the_model_limit():
    with pytest.raises(ValueError, match="10001 characters"):
        narrate.check_length("a" * 10001)


def test_check_length_rejects_empty_text():
    with pytest.raises(ValueError, match="no spoken text"):
        narrate.check_length("  ")


def test_check_length_accepts_text_at_the_limit():
    narrate.check_length("a" * 10000)


def test_script_text_sends_tts_lines_on_the_expressive_model():
    script = {"segments": [{"spoken": "Open the page.", "tts": "[warmly] Open the page."}, {"spoken": "Tap Sign me up."}]}
    assert narrate.script_text(script, "eleven_v4") == "[warmly] Open the page. Tap Sign me up."


def test_script_text_ignores_tts_lines_on_the_standard_model():
    script = {"segments": [{"spoken": "Open the page.", "tts": "[warmly] Open the page."}]}
    assert narrate.script_text(script, "eleven_multilingual_v2") == "Open the page."
