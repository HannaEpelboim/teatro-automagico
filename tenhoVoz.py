import requests

#  Substitua pela sua API Key da ElevenLabs
API_KEY = 'sk_5652dd77630493587ffd7d0b14669d1c2a023d4c5f0f9847'

#  Escolha o ID da voz (ou use a padrão "Rachel" abaixo)
VOICE_ID = '21m00Tcm4TlvDq8ikWAM'  # Rachel

#  Texto a ser lido
text = "Olá! Esta é uma demonstração de texto para fala usando a Eleven Labs."

#  Endpoint da API
url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

#  Cabeçalhos e corpo da requisição
headers = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
    "Accept": "audio/mpeg"
}

data = {
    "text": text,
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
        "stability": 0.75,
        "similarity_boost": 0.75
    }
}

#  Requisição POST
response = requests.post(url, headers=headers, json=data)

# Salvar o áudio
if response.status_code == 200:
    with open("saida.mp3", "wb") as f:
        f.write(response.content)
    print(" Áudio salvo como 'saida.mp3'")
else:
    print(" Erro:", response.status_code)
    print(response.text)