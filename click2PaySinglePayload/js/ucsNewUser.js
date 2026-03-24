
var mcCheckoutService = new MastercardCheckoutServices();

async function initNewUser() {

    console.log("window ", mcCheckoutService);
    const srcDpaId = 'c7f83380-d28f-4025-aee7-96e54f9b5cae';

    const dpaData = {
        "dpaName": "Merchant NNN"
    }
    const paymentOptions = [{
        dynamicDataType: "CARD_APPLICATION_CRYPTOGRAM_SHORT_FORM"
        // dynamicDataType: "NONE"

    }];

    const dpaTransactionOptions = {
        "dpaLocale": "en_US",
        "authenticationPreferences": {
            "payloadRequested": "AUTHENTICATED",
        },
        "acquirerData": [
            {
                "cardBrand": "mastercard",
                "acquirerMerchantId": "SRC3DS",
                "acquirerBIN": "545301"
            },
            {
                "cardBrand": "visa",
                "acquirerMerchantId": "33334444",
                "acquirerBIN": "432104"
            }
        ]
    }




    const initParamsCAM = {
        "srcDpaId": srcDpaId,
        "dpaData": dpaData,
        "dpaTransactionOptions": dpaTransactionOptions,
        "cardBrands": ["mastercard"],
        "checkoutExperience": "WITHIN_CHECKOUT"
    };
    try {

        const promiseResolvedPayloadCAM = await mcCheckoutService.init(initParamsCAM) // No other library methods should be invoked until `init` resolves
        console.log(`SRC DPA initialized successfully ${JSON.stringify(promiseResolvedPayloadCAM)}`);
        console.log(promiseResolvedPayloadCAM);
        localStorage.setItem('c2p.enable_passkeys', true);



        console.log("#######  INIT REQUEST PARAMS #####");
        console.log(JSON.stringify(initParamsCAM));
        console.log("#######  INIT RESPONSE #####");
        console.log(JSON.stringify(promiseResolvedPayloadCAM));
        console.log("####### INIT END ######");


    } catch (promiseRejectedPayloadCAM) {
        console.error("Error initializing SRC DPA:", promiseRejectedPayloadCAM);
    }
}

async function getCardsNewUser() {
    try {
        const promiseResolvedPayloaCards = await mcCheckoutService.getCards()
        console.log(`Get Cards - ", ${JSON.stringify(promiseResolvedPayloaCards)}`);
        console.log(promiseResolvedPayloaCards);

        if (promiseResolvedPayloaCards.length > 0) {
            localStorage.setItem('srcDigitalCardIdCheckout', promiseResolvedPayloaCards[1].srcDigitalCardId);
        } else {
            console.log("No cards   available");
        }

    } catch (promiseRejectedPayloadCards) {
        console.log(promiseRejectedPayloadCards);
    }
}

async function idLookupNewUser() {
    const email = {
        // "email": "natacha.govan@mastercard.com",
        "email": "natachagovan@gmail.com",
    }
    try {
        const promiseResolvedPayloaIDlookup = await mcCheckoutService.idLookup(email)
        console.log(`ID lookup - ", ${JSON.stringify(promiseResolvedPayloaIDlookup)}`);
        console.log(promiseResolvedPayloaIDlookup);

    } catch (promiseRejectedPayloadIDlookup) {
        console.log(promiseRejectedPayloadIDlookup);
    }
}




async function authenticateNewUser() {
    var myWindow = window.open("", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=200,left=600,width=500,height=700");
    // const iframe = document.createElement('iframe');
    // iframe.width = '0';
    // iframe.height = '0';
    // iframe.allow = 'publickey-credentials-get; publickey-credentials-create';
    // document.body.appendChild(iframe);
    // //iframe.focus();
    // iframe.contentWindow.focus();



    const accountReference = {
        "consumerIdentity": {
            // "identityType": "MOBILE_PHONE_NUMBER",
            // "identityValue": "+351912554378"
            // "identityValue": "+351932612853"
            "identityType": "EMAIL_ADDRESS",
            "identityValue": "natachagovan@gmail.com"
        }
    }

    const initRequestParameters = {
        "windowRef": myWindow,
        // "windowRef": iframe.contentWindow,
        "accountReference": accountReference,
        "requestRecognitionToken": true
    }

    try {
        const authenticateResult = await mcCheckoutService.authenticate(initRequestParameters)
        console.log(`Authenticate - ", ${JSON.stringify(authenticateResult)}`);
        console.log(authenticateResult);
        myWindow.close();
        // iframe.remove();
    } catch (authenticateResultRejected) {
        console.log(authenticateResultRejected);
        // iframe.remove();
        myWindow.close();
    }
}

async function encryptCard() {
    const encryptCardParams = {
        "primaryAccountNumber": "5506900485709082",
        "panExpirationMonth": "06",
        "panExpirationYear": "28",
        "cardSecurityCode": "875"
    }
    try {
        const encryptCardResult = await mcCheckoutService.encryptCard(encryptCardParams)
        console.log(`Encrypt Card - ", ${JSON.stringify(encryptCardResult)}`);
        console.log(encryptCardResult);
        localStorage.setItem("encryptedCard", encryptCardResult.encryptedCard);
        localStorage.setItem("cardBrand", encryptCardResult.cardBrand);

    } catch (encryptCardRejected) {
        console.log(encryptCardRejected);
    }
}


async function checkoutWithNewCard() { // this method will return a promise
    var myWindow = window.open("", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=200,left=600,width=500,height=700,popup=1");

    const encryptedCard = localStorage.getItem('encryptedCard');
    const cardBrand = localStorage.getItem('cardBrand');

    const paymentOptions = [{
        dynamicDataType: "CARD_APPLICATION_CRYPTOGRAM_SHORT_FORM"
        // dynamicDataType: "NONE"

    }]

    const dpaTransactionOptionsCheckout = {
        "dpaLocale": "en_US",
        "acquirerMerchantId": "550e8400",
        "acquirerBIN": "444444",
        "merchantCategoryCode": "5719",
        "merchantCountryCode": "US",
        "transactionAmount":
        {
            "transactionAmount": 105.00,
            "transactionCurrencyCode": "AUD",
        },
        // "authenticationPreferences": {
        //     "payloadRequested": "AUTHENTICATED",
        // },
        "paymentOptions": paymentOptions
    }

    const consumer = {
        "emailAddress": "natachagovan@gmail.com",
        "mobileNumber":
        {
            "countryCode": "351",
            "phoneNumber": 932612853
        }
    }

    const checkoutNewCardParams = {
        "encryptedCard": encryptedCard,
        "cardBrand": cardBrand,
        // "consumer": consumer,
        "windowRef": myWindow,
        "dpaTransactionOptions": dpaTransactionOptionsCheckout,
        "rememberMe": true,
        "recognitionTokenRequested": true
    }

    try {

        //    const checkoutNewCardResult = window.mcCheckoutService.checkoutWithNewCard(checkoutNewCardParams) 
        const checkoutNewCardResult = await mcCheckoutService.checkoutWithNewCard(checkoutNewCardParams)

        console.log("###################");
        console.log(`Checkout with New Card - ", ${JSON.stringify(checkoutNewCardResult)}`);
        console.log("paymentOptions", checkoutNewCardParams.dpaTransactionOptions.paymentOptions);
        // console.log("payloadRequested", checkoutNewCardParams.dpaTransactionOptions.authenticationPreferences.payloadRequested);
        console.log("merchant-transaction-id: ", checkoutNewCardResult.headers['merchant-transaction-id']);
        console.log("###################");

        console.log(checkoutNewCardResult);
        myWindow.close();
    } catch (checkoutNewCardRejected) {
        console.log(`Checkout with New Cards ERROR - ", ${JSON.stringify(checkoutNewCardRejected)}`);
        console.log(checkoutNewCardRejected);
    }
}
