# Teatro Automágico

Projeto desenvolvido para a disciplina de Microcontroladores, integrando hardware e inteligência artificial para criar uma apresentação teatral automatizada e interativa.
# Descrição Geral

O Teatro Automágico é uma instalação que une criatividade narrativa com automação. A peça é gerada dinamicamente através de inteligência artificial, narrada por voz sintetizada e representada por personagens robóticos no palco. O sistema interpreta emoções e situações para movimentar personagens, alterar iluminação e criar uma ambientação realista com sol e lua.
# Tecnologias Utilizadas

    OpenAI API: gera histórias em linguagem natural, que são convertidas automaticamente para um formato JSON estruturado com parágrafos, personagens, emoções e posições de palco.

    ElevenLabs API: sintetiza a narração da história utilizando uma voz única.

    Microcontroladores (Arduino): controlam os movimentos dos personagens e a iluminação do palco.

    Drivers de motores de passo: movimentam os personagens pelo palco com correias.

    Servos: permitem que os bonecos se inclinem para os lados.

    LEDs RGB: mudam de cor conforme a emoção do parágrafo narrado.

    Sol e lua: simulam dia e noite no palco.

# Componentes do Teatro

    3 Bonecos (Personagens A, B e C):

        Se movem horizontalmente pelo palco (offstage-left → center → offstage-right).

        Podem inclinar para a esquerda, direita ou permanecer retos.

        Podem "falar" quando estão com a ação speaking.

    Ambiente:

        Sol e lua visíveis de acordo com o campo "time" (day ou night).

        LEDs que mudam de cor baseados na "emotion" do parágrafo.

# Formato do JSON

O sistema recebe histórias no seguinte formato estruturado:

```{
  "characters": {
    "A": "",
    "B": "",
    "C": ""
  },
  "story": [
    {
      "paragraph": "",
      "emotion": "happy",
      "time": "day",
      "characters": {
        "A": {
          "stage_position": "center",
          "action": "speaking"
        },
        "B": {
          "stage_position": "right",
          "action": "none"
        },
        "C": {
          "stage_position": "offstage-left",
          "action": "none"
        }
      }
    }
  ]
}
```

# Restrições e Convenções

    emotion: "sad", "happy", "neutral", "angry", "funny"

    time: "day" ou "night"

    stage_position: "offstage-right", "right", "center", "left", "offstage-left"

    action: "tilted-right", "tilted-left", "none", "speaking"

# Funcionamento:
Interface Web - O usuário define 3 personagens (A, B, C) e uma ideia de história através de um formulário Flask
Geração de História - A IA (OpenAI) cria uma história estruturada baseada nos personagens e prompt fornecidos
Conversão para JSON - A história é transformada em um JSON estruturado com cenas, posições e falas dos personagens
Síntese de Áudio - Cada fala é convertida em áudio usando ElevenLabs TTS e salva como arquivo MP3
Visualização - O p5.js renderiza os personagens em movimento na tela conforme as cenas da história
Controle Físico - O Arduino controla motores, servos e LEDs para criar efeitos físicos sincronizados com a performance
Tecnologias:
Backend: Flask + OpenAI API + ElevenLabs TTS
Frontend: HTML + p5.js (animação/áudio)
Hardware: Arduino (motores stepper, servos, LEDs)
