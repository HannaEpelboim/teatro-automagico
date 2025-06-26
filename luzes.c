#include <FastLED.h>

#define DATA_PIN 2
#define NUM_LEDS 14

CRGB leds[NUM_LEDS];

void setup() {
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);
}

void loop() {

  // Set all LEDs to red
  fill_solid(leds, NUM_LEDS, CRGB::Red);
  FastLED.show();
  delay(1000);

  // Set all LEDs to green
  fill_solid(leds, NUM_LEDS, CRGB::Green);
  FastLED.show();
  delay(1000);

  // Set all LEDs to blue
  fill_solid(leds, NUM_LEDS, CRGB::Blue);
  FastLED.show();
  delay(1000);
}

// #include <stdio.h>
// #include <stdlib.h>
// #include "cJSON.h"

// int main() {
//     FILE *file = fopen("resposta.json", "r");
//     if (file == NULL) {
//         perror("Erro ao abrir o arquivo");
//         return 1;
//     }

//     fseek(file, 0, SEEK_END);
//     long length = ftell(file);
//     rewind(file);

//     char *data = (char *)malloc(length + 1);
//     fread(data, 1, length, file);
//     data[length] = '\0';
//     fclose(file);

//     cJSON *json = cJSON_Parse(data);
//     if (json == NULL) {
//         printf("Erro ao parsear o JSON\n");
//         free(data);
//         return 1;
//     }

//     // Acessa o array "historia"
//     cJSON *historia = cJSON_GetObjectItemCaseSensitive(json, "historia");
//     if (!cJSON_IsArray(historia)) {
//         printf("Campo 'historia' não é um array.\n");
//         cJSON_Delete(json);
//         free(data);
//         return 1;
//     }

//     int total = cJSON_GetArraySize(historia);
//     for (int i = 0; i < total; i++) {
//         cJSON *item = cJSON_GetArrayItem(historia, i);

//         cJSON *emocao = cJSON_GetObjectItemCaseSensitive(item, "emocao");

//         if (cJSON_IsString(emocao)) {
//             printf("Emoção: %s\n\n", emocao->valuestring);
//         }
//     }

//     cJSON_Delete(json);
//     free(data);
//     return 0;
// }