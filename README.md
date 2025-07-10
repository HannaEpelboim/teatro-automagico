# Teatro Automágico

O projeto tem como objetivo fazer um teatro automágico, no qual uma IA gera uma história que é representada por bonecos que vão para posições no palco e balançam, com elementos extras como luzes, voz e cenário. 
# Tecnologias Utilizadas

    OpenAI API: gera histórias em linguagem natural, que são convertidas automaticamente para um formato JSON estruturado com parágrafos, personagens, emoções e posições de palco.

    ElevenLabs API: sintetiza a narração da história utilizando uma voz única.

    Microcontroladores (Arduino): controlam os movimentos dos personagens e a iluminação do palco.

    Drivers de motores de passo: movimentam os personagens pelo palco com correias.

    Servos: permitem que os bonecos se inclinem para os lados.

    LEDs RGB: mudam de cor conforme a emoção do parágrafo narrado.


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


# Componentes do Teatro

    3 Bonecos (Personagens A, B e C):

        Se movem horizontalmente pelo palco (offstage-left → center → offstage-right).

        Podem inclinar para a esquerda, direita ou permanecer retos.

        Podem "falar" quando estão com a ação speaking.

    Ambiente:

        Sol e lua visíveis de acordo com o campo "time" (day ou night).

        LEDs que mudam de cor baseados na "emotion" do parágrafo.

# Hardware

#Vídeo
