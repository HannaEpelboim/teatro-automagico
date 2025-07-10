import json

with open("resposta.json", "r", encoding="utf-8") as f:
    dados = json.load(f)

with open("emocoes.txt", "w", encoding="utf-8") as out:
    for item in dados["historia"]:
        emocao = item.get("emocao", "neutra")
        out.write(emocao + "\n")