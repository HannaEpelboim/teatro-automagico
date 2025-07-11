#include <Stepper.h>
#include <AccelStepper.h>
#include <Servo.h>
#include <FastLED.h>

// --- Constantes ---

// Luzes
#define DATA_PIN 13
#define NUM_LEDS 30
#define ACCELERATION 500
#define STEPPER_SPEED 500

CRGB leds[NUM_LEDS];
unsigned long previous = millis();
unsigned long actual = millis();
int increment = 0;
bool fadein_on = false;
CRGB color = CRGB::Black;
int d = 100;
int leds_n = NUM_LEDS;

// Configurações dos Motores de Passo (Steppers)
const int STEPS_PER_REV = 2048;
const int NUM_STEPPERS = 3;

// Pinos dos motores de passo
const int M1_PINS[] = { 8, 10, 9, 11 };    // Motor 0 (Pessoa): IN1, IN2, IN3, IN4
const int M2_PINS[] = { 4, 6, 5, 7 };      // Motor 1 (Cenário): IN1, IN2, IN3, IN4
//const int M3_PINS[] = { A1, A3, A2, A4 };  // Motor 2 (Pessoa extra)

// Configurações para Múltiplos Servos
const int NUM_SERVOS = 2;           // Número total de servos
const int SERVO_PINS[] = { 3, 2 };  // Pinos para o Servo 0 (pino 3) e Servo 1 (pino 2)

// Constantes de Posição para os Steppers (em passos)
const long POS_R_OUT = 0;
const long POS_RIGHT = 4000;
const long POS_CENTER = 8000;
const long POS_LEFT = 12000;
const long POS_L_OUT = 16000;

const long LUA = 0;
const long SOL = 6000;

// Constantes de Posição para o Servo (em ângulos)
const int SERVO_LEFT_ANGLE = 45;
const int SERVO_CENTER_ANGLE = 90;
const int SERVO_RIGHT_ANGLE = 135;

// --- Variáveis Globais ---

// Array de objetos Stepper
AccelStepper steppers[NUM_STEPPERS] = {
  AccelStepper(AccelStepper::FULL4WIRE, M1_PINS[0], M1_PINS[1], M1_PINS[2], M1_PINS[3]),
  AccelStepper(AccelStepper::FULL4WIRE, M2_PINS[0], M2_PINS[1], M2_PINS[2], M2_PINS[3]),
 // AccelStepper(AccelStepper::FULL4WIRE, M3_PINS[0], M3_PINS[1], M3_PINS[2], M3_PINS[3])
};

// Array de objetos Servo
Servo actionServos[NUM_SERVOS];

// Array para armazenar a posição atual de cada motor de passo
long currentStepperPositions[NUM_STEPPERS];


// --- Funções Principais (Setup e Loop) ---

void setup() {
  Serial.begin(9600);

  //Luzes
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);
  Serial.setTimeout(10);

  // Inicializa os motores de passo
  for (int i = 0; i < NUM_STEPPERS; i++) {
    steppers[i].setMaxSpeed(STEPPER_SPEED);
    steppers[i].setAcceleration(ACCELERATION);  // Aceleração ajustada
    currentStepperPositions[i] = POS_L_OUT;
    steppers[i].setCurrentPosition(POS_L_OUT);
  }

  // CORREÇÃO: Inicializa todos os servos usando um loop
  for (int i = 0; i < NUM_SERVOS; i++) {
    actionServos[i].attach(SERVO_PINS[i]);
    actionServos[i].write(SERVO_CENTER_ANGLE);  // Começam no centro
  }

  // Mensagens de boas-vindas
  Serial.println("Sistema de Marionetes Digitais Pronto (2 Steppers, 2 Servos).");
  Serial.println("Use o formato: [tipo], [motor], [posicao]");
  Serial.println("Exemplos: pes, 0, r  |  cen, 1, up  |  emo, 1, l");
  Serial.println("-------------------------------------------------");
}

void loop() {
  //Luzes
  if (fadein_on && previous + d > actual) {
    increment += 1;
    fadeIn(color);
    if (increment == 255) {
      increment = 0;
      fadein_on = false;
    }
    previous = actual;
  }

  for (int i = 0; i < NUM_STEPPERS; i++) {
    if (steppers[i].isRunning()) {
      steppers[i].run();
    }
  }


  if (Serial.available() > 0) {
    processSerialCommand();
  }
}


// --- Processamento de Comandos ---

void processSerialCommand() {
  String command = Serial.readStringUntil('\n');
  command.trim();
  command.toLowerCase();

  int firstComma = command.indexOf(',');
  int secondComma = command.indexOf(',', firstComma + 1);

  if (firstComma == -1 || secondComma == -1) {
    Serial.println(">> Erro: Formato de comando invalido. Use: tipo,motor,posicao");
    return;
  }

  String type = command.substring(0, firstComma);
  String motorStr = command.substring(firstComma + 1, secondComma);
  String position = command.substring(secondComma + 1);

  type.trim();
  motorStr.trim();
  position.trim();

  int motorIndex = motorStr.toInt();

  // Valida o índice do motor para steppers
  if ((type == "pes" || type == "cen") && (motorIndex < 0 || motorIndex >= NUM_STEPPERS)) {
    Serial.println(">> Erro: Indice do motor de passo invalido.");
    return;
  }
  // Valida o índice do motor para servos
  if (type == "act" && (motorIndex < 0 || motorIndex >= NUM_SERVOS)) {
    Serial.println(">> Erro: Indice do servo invalido.");
    return;
  }
  //Num de luzes
  if (type == "emo" && motorIndex > NUM_LEDS) {
    Serial.println(">> Erro: Numero de luzes invalido.");
    return;
  }

  // Direciona o comando para a função apropriada
  if (type == "pes") {
    moveCharacter(motorIndex, position);
  } else if (type == "cen") {
    moveScenery(motorIndex, position);
  } else if (type == "act") {
    moveAction(motorIndex, position);
  } else if (type == "emo") {
    handleEmotion(motorIndex, position);
  } else {
    Serial.println(">> Erro: Tipo de movimento invalido. Use 'pes', 'cen' ou 'emo'.");
  }
  Serial.println("-------------------------------------------------");
}


//Luzes

void handleEmotion(int n, String emocao) {
  if (emocao == "sad") {
    color = CRGB::Blue;
  } else if (emocao == "happy") {
    color = CRGB::Green;
  } else if (emocao == "angry") {
    color = CRGB::Red;
  } else if (emocao == "funny") {
    color = CRGB::Yellow;
  } else {
    color = CRGB::White;
  }
  fadein_on = true;
  previous = millis();
  leds_n = n;
}

void fadeIn(CRGB color) {
  fill_solid(leds, leds_n, color);

  for (int j = 0; j < leds_n; j++) {
    leds[j].fadeToBlackBy(255 - increment);
  }

  FastLED.show();
}

// --- Funções de Controle dos Motores ---

void moveCharacter(int motorIndex, String positionCmd) {
  long targetPosition;

  if (positionCmd == "c") targetPosition = POS_CENTER;
  else if (positionCmd == "l") targetPosition = POS_LEFT;
  else if (positionCmd == "r") targetPosition = POS_RIGHT;
  else if (positionCmd == "ol") targetPosition = POS_L_OUT;
  else if (positionCmd == "or") targetPosition = POS_R_OUT;
  else {
    Serial.println(">> Erro: Posicao de personagem invalida ('c','l','r','ol','or').");
    return;
  }

  Serial.print("Movendo personagem ");
  Serial.print(motorIndex);
  Serial.print(" para a posicao '");
  positionCmd.toUpperCase();
  Serial.print(positionCmd);
  Serial.println("'...");

  executeMove(motorIndex, targetPosition);
}

void moveScenery(int motorIndex, String positionCmd) {
  long targetPosition;

  if (positionCmd == "sol") targetPosition = SOL;
  else if (positionCmd == "lua") targetPosition = LUA;
  
  else {
    Serial.println(">> Erro: Posicao de cenario invalida ('sol','lua').");
    return;
  }

  Serial.print("Movendo cenario ");
  Serial.print(motorIndex);
  Serial.print(" para a posicao '");
  positionCmd.toUpperCase();
  Serial.print(positionCmd);
  Serial.println("'...");

  executeMove(motorIndex, targetPosition);
}

/**
 * @brief Controla um servo motor específico de "emoção".
 * @param motorIndex O índice do servo no array 'emotionServos' (0 ou 1).
 * @param positionCmd O comando de posição ("m", "l", "r").
 */
void moveAction(int motorIndex, String positionCmd) {
  int targetAngle;

  if (positionCmd == "m") targetAngle = SERVO_CENTER_ANGLE;
  else if (positionCmd == "l") targetAngle = SERVO_LEFT_ANGLE;
  else if (positionCmd == "r") targetAngle = SERVO_RIGHT_ANGLE;
  else {
    Serial.println(">> Erro: Posicao de emocao invalida ('m', 'l', 'r').");
    return;
  }

  Serial.print("Movendo servo ");
  Serial.print(motorIndex);
  Serial.print(" para a posicao '");
  positionCmd.toUpperCase();
  Serial.print(positionCmd);
  Serial.println("'...");

  // CORREÇÃO: Move o servo correto do array
  actionServos[motorIndex].write(targetAngle);
  Serial.println("Movimento do servo concluido.");
}


// --- Função Auxiliar ---

void executeMove(int motorIndex, long targetPosition) {
  long stepsToMove = targetPosition - currentStepperPositions[motorIndex];

  Serial.print("  Posicao atual: ");
  Serial.print(currentStepperPositions[motorIndex]);
  Serial.print(", Alvo: ");
  Serial.print(targetPosition);
  Serial.print(" -> Passos: ");
  Serial.println(stepsToMove);


  steppers[motorIndex].moveTo(targetPosition);

  currentStepperPositions[motorIndex] = targetPosition;

  Serial.println("Movimento do stepper concluido.");
}
