/*
 * Copyright 2018-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

 /* SKILL: Let Me Know
 * Daniela Vega Monroy.
 * Interfaces de Voz de Usuario
 * Skill destinada a proveer información de diferentes maneras: como datos curiosos o como noticias importantes
 * La función principal del códio es su conexión con las APIs escogidas para optener la información
 */
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const languageStrings = require('./languageStrings');

const LaunchRequestHandler = {
    /*
 * Aquí generamos diálogos aleatorios para que el usuario descubra con el tiempo 
 * todas las opciones disponibles. 
 */
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome! Let\'s read the news of today! Just say "news"';
        const speakOutput2 = 'Hello there! Say "Tell me a fact" if you are curious';
        const speakOutput3 = 'Hey you, Want a specific fact? Ask for the categories saying: "What are the categories?"';
        const speakOutput4 = 'Hi! If you woke up hungry for history, just say "Tell me a fact about history"';
        const speakOutput5 = 'Welcome to our skill "Let me know", it\'s so good to see you!';
        const speakOutput6 = 'How are you? Don\'t know where to begin? Just say "help"';
        var dialogue = [speakOutput,speakOutput2,speakOutput3,speakOutput4,speakOutput5,speakOutput6];
        var randomOutput = Math.floor(Math.random() * 6);
        return handlerInput.responseBuilder
            .speak(dialogue[randomOutput])
            .reprompt(dialogue[randomOutput])
            .getResponse();
    }
}; 
const GetRemoteDataHandler = {  
     /*
 * Función para los datos curiosos.
 * Nos conectamos a una API que provee datos curiosos aleatorios. No elegimos la categoría, todo es aleatorio.
 * El API nos da 10 datos curiosos y aleatoriamente se selecciona uno
 *Se especifica la categoría, si es verdad o no y el dato en cuestión
 */
  canHandle(handlerInput) {  
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'  
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'  
      && handlerInput.requestEnvelope.request.intent.name === 'GetRemoteDataIntent');  
  },  
  async handle(handlerInput) {  
    let outputSpeech = 'This is the default message.';  
    var rando = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    await getRemoteData('https://opentdb.com/api.php?amount=10&type=boolean&correct_answer=True')  
      .then((response) => {  
        const da = JSON.parse(response);  
        outputSpeech = `Fun fact about ${da.results[rando].category}, Did you know that its ${da.results[rando].correct_answer} that ${da.results[rando].question} ? `; 
      })  
      .catch((err) => {  
        console.log(`ERROR: ${err.message}`);  
          
      });  
  
    return handlerInput.responseBuilder  
      .speak(outputSpeech)  
      .reprompt(outputSpeech)
      .getResponse();  
  },  
};

/*
 * Función para generar las noticias del día.
 * Nos conectamos a una API que provee las noticias más importantes del día de los periódicos y revistas más conocidos del mundo.
 * En este caso no hay categorías, solo se selcciona de manera aleatoria una de las noticias del día en el que se ejecuta 
 */
const GetRemoteNewsDataHandler = {  
  canHandle(handlerInput) {  
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'  
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'  
      && handlerInput.requestEnvelope.request.intent.name === 'GetRemoteNewsIntent');  
  },  
  async handle(handlerInput) {  
    let outputSpeech = 'This is the default message.';  
    var rando = Math.floor(Math.random() * (15 - 0 + 1)) + 0;
    await getRemoteData('http://newsapi.org/v2/top-headlines?country=us&apiKey=79b2f654735145578ac3b2c6786d09f4')  
      .then((response) => {  
        const da = JSON.parse(response);  
        outputSpeech = ` News of the day: ${da.articles[rando].title} informs `; 
      })  
      .catch((err) => {  
        console.log(`ERROR: ${err.message}`);  
          
      });  
  
    return handlerInput.responseBuilder  
      .speak(outputSpeech)  
      .reprompt(outputSpeech)
      .getResponse();  
  },  
};

 /*
 * Función para los datos curiosos.
 * Nos conectamos a una API que provee datos curiosos aleatorios. No elegimos la categoría, todo es aleatorio.
 * El API nos da 10 datos curiosos y aleatoriamente se selecciona uno
 *Se especifica la categoría, si es verdad o no y el dato en cuestión
 */
const GetCategoriesHandler = {
    canHandle(handlerInput) {  
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'  
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'  
      && handlerInput.requestEnvelope.request.intent.name === 'GetCategoriesIntent');  
     },  
    async handle(handlerInput) {  
    let outputSpeech = 'These are the categories: General Knowledge, Mythology ,Sports, Geography, History, Politics, Vehicles and Animals. Choose one!';  
    return handlerInput.responseBuilder  
      .speak(outputSpeech)  
      .reprompt(outputSpeech)
      .getResponse();  
  },  
};
 /*
 * Función para los datos curiosos con categoría escogida por el usuario.
 * Nos conectamos a una API que provee datos curiosos aleatorios.
 * Mapeamos la categoría a un número para seleccionar el dato correspondiente.
 */
const GetRemoteDataCategoryHandler = {
    canHandle(handlerInput) {  
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'  
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'  
      && handlerInput.requestEnvelope.request.intent.name === 'GetRemoteDataCategoryIntent');  
     },  
    async handle(handlerInput) {  
    let outputSpeech = 'I cannot find that category, try again';  
    const tema = handlerInput.requestEnvelope.request.intent.slots.category.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    var cateN = 0;
    if (tema === 'General Knowledge') {
        cateN = 9;
    }else if(tema === 'Mythology'){
        cateN = 20
    }else if(tema === 'Sports'){
        cateN = 21
    }else if(tema === 'Geography'){
        cateN = 22
    }else if(tema === 'History'){
        cateN = 23
    }else if(tema === 'Politics'){
        cateN = 24
    }else if(tema === 'Vehicles'){
        cateN = 28
    }else if(tema === 'Animals'){
        cateN = 27
    }
    var rando = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    let url = 'https://opentdb.com/api.php?amount=10&type=boolean&category=';
    let endp = url + cateN;
    await getRemoteData(endp)  
      .then((response) => {  
        const da = JSON.parse(response);  
        outputSpeech = `Here's a fact about ${da.results[rando].category}, Did you know that its ${da.results[rando].correct_answer} that ${da.results[rando].question} ? `;  
      })  
      .catch((err) => {  
        console.log(`ERROR: ${err.message}`);  
          
      });  
  
    return handlerInput.responseBuilder  
      .speak(outputSpeech)  
      .reprompt(outputSpeech)
      .getResponse();  
  },  
};
/*
 * Función default de ayuda
 */
const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('HELP_MESSAGE'))
      .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .getResponse();
  },
};
/*
 * Función default de FALLBACK
 */
const FallbackHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('FALLBACK_MESSAGE'))
      .reprompt(requestAttributes.t('FALLBACK_REPROMPT'))
      .getResponse();
  },
};
/*
 * Función default de salida
 */
const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('STOP_MESSAGE'))
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('CATEG_MESSAGE'))
      .reprompt(requestAttributes.t('CATEG_MESSAGE'))
      .getResponse();
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    /* Inicializa i18next.*/
    const localizationClient = i18n.init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings,
      returnObjects: true
    });
    /* Creamos una función de localización para recibir argumentos*/
    localizationClient.localize = function localize() {
       /* Pasan los argumentos a i18next usando sprintf*/
      const args = arguments;
      const value = i18n.t(...args);
       /* Si se usa un arreglo se selecciona un valor aleatorio*/
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
     /* Lo siguiente opbtiene los atributos de petición y guarda la función de localización*/
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    }
  }
};

     /* Función para poder realizar las llamdas al API con éxito*/
const getRemoteData = (url) => new Promise((resolve, reject) => {  
     /* Se especifica que la url escogida debe empezar con http*/
  const client = url.startsWith('https') ? require('https') : require('http');  
  const request = client.get(url, (response) => {  
    if (response.statusCode < 200 || response.statusCode > 299) {  
      reject(new Error(`Failed with status code: ${response.statusCode}`));  
    }  
    const body = [];  
    response.on('data', (chunk) => body.push(chunk));  
    response.on('end', () => resolve(body.join('')));  
  });  
  request.on('error', (err) => reject(err));  
});  
  

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetRemoteDataHandler,
    GetRemoteNewsDataHandler,
    GetCategoriesHandler,
    GetRemoteDataCategoryHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('sample/basic-fact/v2')
  .lambda();
