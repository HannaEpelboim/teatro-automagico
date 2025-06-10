import json
import requests

with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

API_KEY = 'sk_5652dd77630493587ffd7d0b14669d1c2a023d4c5f0f9847'
VOICE_ID = '21m00Tcm4TlvDq8ikWAM'  # Rachel
url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

headers = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
    "Accept": "audio/mpeg"
}

for i, quadro in enumerate(data["tp"]):
    text = quadro["fala"]

    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.75,
            "similarity_boost": 0.75
        }
    }

    print(f"Gerando áudio para fala {i + 1}: \"{text}\"")
    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        filename = f"fala_{i + 1}.mp3"
        with open(filename, "wb") as f:
            f.write(response.content)
        print(f"Áudio salvo como '{filename}'\n")
    else:
        print(f"Erro ao gerar fala {i + 1}: {response.status_code}")
        print(response.text)