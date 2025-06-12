import json
import requests
from pydub import AudioSegment

with open("data.json", "r", encoding="utf-8") as f:
    data_json = json.load(f)

API_KEY = 'sk_5652dd77630493587ffd7d0b14669d1c2a023d4c5f0f9847'
VOICE_ID = '21m00Tcm4TlvDq8ikWAM'
url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

headers = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
    "Accept": "audio/mpeg"
}

# Carrega o efeito sonoro intercalado
efeito_feliz = AudioSegment.from_file("teste01.mp3")

# Carrega a música de fundo
musica_fundo_original = AudioSegment.from_file("musica_fundo.mp3")

for i, quadro in enumerate(data_json["tp"]):
    text = quadro["fala"]

    payload = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.75,
            "similarity_boost": 0.75
        }
    }

    print(f"Gerando áudio para fala {i + 1}: \"{text}\"")
    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        fala_filename = f"fala_{i + 1}.mp3"
        with open(fala_filename, "wb") as f:
            f.write(response.content)
        print(f"Áudio salvo como '{fala_filename}'")

        # Carrega o áudio da fala
        fala = AudioSegment.from_file(fala_filename)
        if(quadro["emocao"] == "feliz"):
            print("Adicionando efeito sonoro para fala feliz...")
            efeito = efeito_feliz
            # Junta a fala com o efeito
            faixa = fala + efeito
        else:
            faixa = fala


        if(quadro["emocao"] == "triste"):
            print("Adicionando música de fundo para fala triste...")
            # Reduz o volume da música de fundo
            fundo_reduzido = musica_fundo_original - 15

            # Repete a música de fundo conforme necessário
            fundo_loop = fundo_reduzido * (len(faixa) // len(fundo_reduzido) + 1)

            # Faz o overlay (mistura)
            faixa_mixada = faixa.overlay(fundo_loop)
        else:
            faixa_mixada = faixa

        # Salva a faixa individual com fundo
        output_filename = f"fala_{i + 1}_mixada.mp3"
        faixa_mixada.export(output_filename, format="mp3")
        print(f"Fala {i + 1} mixada salva como '{output_filename}'\n")

    else:
        print(f"Erro ao gerar fala {i + 1}: {response.status_code}")
        print(response.text)
