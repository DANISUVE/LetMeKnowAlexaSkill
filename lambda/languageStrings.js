/* *
 * We create a language strings object containing all of our strings.
 * The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG').
 * The localisation interceptor in index.js will automatically choose the strings
 * that match the request's locale.
 * */

module.exports = {
    en: {
        translation: {
            SKILL_NAME: 'Random Facts',
            GET_FACT_MESSAGE: 'Here\'s your fact: ',
            HELP_MESSAGE: 'Here\'s what you can do: Say "Tell me a fact" for a random fact, Say "What are the categories?" for a specific fact ,or Say "News" for the news of the day! If you want me to stop, just say "Bye"',
            HELP_REPROMPT: 'What can I help you with?',
            FALLBACK_MESSAGE: 'I cannot do that, I can only give you interesting information. Say "help" if you are lost',
            FALLBACK_REPROMPT: 'What can I help you with?',
            ERROR_MESSAGE: 'I dont understand.',
            CATEG_MESSAGE: 'I dont understand. Say help if you need it!' ,
            STOP_MESSAGE: 'Even the greatest minds of our time need rest, See you soon!',
            FACTS:
            [
                'A year on Mercury is just 88 days long.',
                'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
                'On Mars, the Sun appears about half the size as it does on Earth.',
                'Jupiter has the shortest day of all the planets.',
                'The Sun is an almost perfect sphere.',
            ],
        }
    }
}