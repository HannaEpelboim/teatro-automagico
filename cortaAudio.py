from pydub import AudioSegment

# Carrega o arquivo MP3
audio = AudioSegment.from_mp3("triste.mp3")

# Corta os primeiros 3 segundos (3 * 1000 milissegundos)
audio_curtinho = audio[1000:5000]

# Salva o novo arquivo
audio_curtinho.export("feliz_curtinho.mp3", format="mp3")

print("Arquivo cortado com sucesso! Salvo como feliz_curtinho.mp3")