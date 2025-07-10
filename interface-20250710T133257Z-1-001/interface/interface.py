from flask import Flask, render_template, request #
from openai import OpenAI #
import json
import os
from dotenv import load_dotenv #
import requests #
import time


API_KEY = 'key'
VOICE_ID = 'lWq4KDY8znfkV0DrK8Vb'

url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

headers = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
    "Accept": "audio/mpeg"
}


load_dotenv()
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    sketch_activated = False 
    result = None

    role_A = request.form.get('role_A')
    role_B = request.form.get('role_B')
    role_C = request.form.get('role_C')
    prompt = request.form.get('prompt')
    
    if request.method == 'POST': 
        if all([role_A, role_B, role_C, prompt]):
            result = {
                'role_A': role_A,
                'role_B': role_B,
                'role_C': role_C,
                'prompt': prompt
            }
        #send_to_ai(role_A, role_B, role_C, prompt)
        sketch_activated = True


    return render_template('index.html', result=result, sketch_active=sketch_activated)


def send_to_ai(role_A, role_B, role_C, prompt):
    prompt_user = criar_prompt_historia(role_A, role_B, role_C, prompt)
    story = mandar_prompt("prompt_historia.txt", prompt_user)
    print("historia completa... \ncriando json")
    answer = mandar_prompt("prompt_inicial.txt", story)
    print("json completo...\ncomecando simulacao")
    json = extract_json_from_text(answer)
    salvar_json(json, "static/resposta.json")
    make_audio_files(json)


def criar_prompt_historia(role_A, role_B, role_C, prompt):
    text = (
        f"The characters in the story are:\n"
        f"A: {role_A}\n"
        f"B: {role_B}\n"
        f"C: {role_C}\n\n"
        f"Story idea:\n{prompt}\n\n"
        f"Please generate a short story following the instructions from the initial prompt, "
        f"with characters A, B, and C acting according to their descriptions."
    )

    return text

def mandar_prompt(caminho_arquivo, prompt_user):
    with open(caminho_arquivo, 'r', encoding='utf-8') as arquivo:
        prompt_inicial = arquivo.read()
    response = client.responses.create(
        model="gpt-4.1-mini",
        instructions=prompt_inicial,
        input=prompt_user
    )

    return response.output_text

def salvar_json(dados, caminho_json):
    with open(caminho_json, 'w', encoding='utf-8') as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)

def json_data_para_string(json_data):
    return json.dumps(json_data, ensure_ascii=False, indent=2)
    
def extract_json_from_text(texto):
    start = texto.find('{')
    if start == -1:
        raise ValueError("Início de JSON ('{') não encontrado.")
        return None


    # Contador de chaves para identificar o final do JSON
    open_count = 0
    end = None

    for i in range(start, len(texto)):
        if texto[i] == '{':
            open_count += 1
        elif texto[i] == '}':
            open_count -= 1
            if open_count == 0:
                end = i + 1  # inclui a última chave
                break

    if end is None:
        raise ValueError("JSON incompleto: chave de fechamento não encontrada.")
        return None

    json_str = texto[start:end]

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"Erro ao decodificar JSON: {e}")
        return None

    
##########################################

def make_audio_files(data_json):
    for i, quadro in enumerate(data_json["story"]):
        text = quadro.get("paragraph", "").strip()
        if not text:
            print(f"Fala {i + 1} vazia — ignorada.")
            continue
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
            fala_filename = f"static/audio/fala_{i + 1}.mp3"
            with open(fala_filename, "wb") as f:
                f.write(response.content)
            print(f"Áudio salvo como '{fala_filename}'")
        
        time.sleep(1)


###############################################################################



if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)

    