
var mcCheckoutService = new MastercardCheckoutServices();
var isNewCard = false;
var cardNum = "";


function getCookie(name) {
    const value = ` ${document.cookie}`;
    const cookeivalue = value.trim();
    var cookies = cookeivalue.split('=');


    if (cookies[0].indexOf(name) == 0) {
        console.log(true);
        return cookies[1];
    }

}


async function initHandlerUserEM() { // this method will return a promise
    // const recognitionToken = getCookie("recognitionToken");
    console.log("window ", mcCheckoutService);

    const srcDpaId = 'c7f83380-d28f-4025-aee7-96e54f9b5cae';
    // const srcDpaId = '9ecd5366-198f-42e8-805e-33bfa62b86d6_dpa1';

    const dpaData = {
        "dpaName": "DPA Name"       //required
    }

    const paymentOptions = [{
        dynamicDataType: "CARD_APPLICATION_CRYPTOGRAM_SHORT_FORM"
        // dynamicDataType: "NONE"

    }]

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
        // "recognitionToken": recognitionToken
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
        console.log("####### INIT END ######")
        let list = document.getElementById("srcCardList");


    } catch (promiseRejectedPayloadCAM) {
        console.error("Error initializing SRC DPA:", promiseRejectedPayloadCAM);
    }
}

//  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

async function getCardsEM() {
    try {
        const promiseResolvedPayloaCards = await mcCheckoutService.getCards()
        console.log(`Get Cards - ", ${JSON.stringify(promiseResolvedPayloaCards)}`);
        if (promiseResolvedPayloaCards.length > 0) {
            localStorage.setItem('srcDigitalCardIdCheckout', promiseResolvedPayloaCards[0].srcDigitalCardId);
        }


        console.log(promiseResolvedPayloaCards);

    } catch (promiseRejectedPayloadCards) {
        console.log(promiseRejectedPayloadCards);
    }
}



async function authenticateUserEM() {
    var myWindow = window.open("", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=200,left=600,width=500,height=700");
    // const iframe = document.createElement('iframe');
    // iframe.width = '400';
    // iframe.height = '400';
    // iframe.allow = 'publickey-credentials-get; publickey-credentials-create';
    // iframe.style = "border:2px solid red;";
    // iframe.href = "click2PaySinglePayload/css/app.css";
    // iframe.rel = "src-otp-input";
    // iframe.type = "text/css";
    // //frames['iframe1'].document.head.appendChild(iframe);
    // document.body.appendChild(iframe);
    // iframe.focus();
    // iframe.contentWindow.focus();
    const accountReference = {
        "consumerIdentity": {
            "identityType": "EMAIL_ADDRESS",
            // "identityValue": "natacha.govan@mastercard.com"
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

        showMycards(authenticateResult.cards);
        // document.cookie = 'recognitionToken=' + authenticateResult.recognitionToken + '';

        if (authenticateResult.recognitionToken) {

            localStorage.setItem('recognitionToken', authenticateResult.recognitionToken);
        }

        if (authenticateResult.cards.length > 0) {
            localStorage.setItem('srcDigitalCardIdCheckout', authenticateResult.cards[0].srcDigitalCardId);
        }
        console.log(authenticateResult);
        myWindow.close();
        // iframe.remove();
    } catch (authenticateResultRejected) {
        console.log(authenticateResultRejected);
        myWindow.close();
        // iframe.remove();
    }
}

function showMycards(mycardsList) {
    var list = document.getElementById("wrapperList");
    var elementsToInsert = [];



    for (i = 0; i < mycardsList.length; ++i) {

        var radio = document.createElement('input');
        var label = document.createElement('label');
        var br = document.createElement('br');

        radio.type = 'radio';
        radio.name = "mycardsList";
        radio.value = mycardsList[i].srcDigitalCardId;

        label.setAttribute("for", mycardsList[i].panLastFour);
        label.innerHTML = mycardsList[i].srcDigitalCardId;

        elementsToInsert.push({ label: label, radio: radio });

        list.appendChild(elementsToInsert[i].radio);
        list.appendChild(elementsToInsert[i].label);
        list.appendChild(br);
    }
}


function getCard() {
    let checkRadio = document.querySelector('input[name="mycardsList"]:checked');

    if (checkRadio.value == "manualCardEM") {
        isNewCard = true;
        cardNum = document.getElementById("CardNumEM").value.trim()
        return "CARD_APPLICATION_CRYPTOGRAM_SHORT_FORM";
    }
    else if (checkRadio.value == "dsrpEM") {
        return "CARD_APPLICATION_CRYPTOGRAM_SHORT_FORM";
    } else if (checkRadio.value == "NONE") {
        return "NONE";
    }
}



function getDynamicDataType() {
    let checkRadio = document.querySelector('input[name="dynamicDataTypeEM"]:checked');

    if (checkRadio.value == "manualCardEM") {
        isNewCard = true;
        cardNum = document.getElementById("CardNumEM").value.trim()
        return "CARD_APPLICATION_CRYPTOGRAM_SHORT_FORM";
    }
    else if (checkRadio.value == "dsrpEM") {
        return "CARD_APPLICATION_CRYPTOGRAM_SHORT_FORM";
    } else if (checkRadio.value == "NONE") {
        return "NONE";
    }
}
//3dskeytest25
//API Key: f18df45f-38cf-4d51-ad71-3025a84808e9
//NMP2526!@mosteiro
// curl -iH 'APIKey: f18df45f-38cf-4d51-ad71-3025a84808e9' https://service.sandbox.3dsecure.io

function checkoutEM() {
    var myWindow = window.open("", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=200,left=600,width=500,height=700,popup=1");

    const ddt = getDynamicDataType();

    if (!isNewCard) {
        checkoutWithCardEM(ddt, myWindow);
    } else {
        checkoutWithNewCardEM(ddt, myWindow);
    }
}




async function checkoutWithNewCardEM(ddt, myWindow) { // this method will return a promise
    // var myWindow = window.open("", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=200,left=600,width=500,height=700,popup=1");
    isNewCard = false;
    const encryptCardParamsEM = {
        "primaryAccountNumber": cardNum,
        "panExpirationMonth": "06",
        "panExpirationYear": "30",
        "cardSecurityCode": "952"
    }

    const paymentOptionsEM = [{
        dynamicDataType: ddt
    }]

    const dpaTransactionOptionsCheckoutEM = {
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
        "authenticationPreferences": {
            "payloadRequested": "AUTHENTICATED",
        },
        "paymentOptions": paymentOptionsEM
    }

    const consumerEM = {
        "emailAddress": "natachagovan@gmail.com",
        "mobileNumber":
        {
            "countryCode": "351",
            "phoneNumber": 912554378
        }
    }

    try {


        const encryptCardResult = await mcCheckoutService.encryptCard(encryptCardParamsEM)
        console.log(`Encrypt Card EM- ", ${JSON.stringify(encryptCardResult)}`);
        console.log(encryptCardResult);
        localStorage.setItem("encryptedCardEM", encryptCardResult.encryptedCard);
        localStorage.setItem("cardBrandEM", encryptCardResult.cardBrand);
        const encryptedCard = localStorage.getItem('encryptedCardEM');
        const cardBrand = localStorage.getItem('cardBrandEM');

        const checkoutNewCardParamsEM = {
            "encryptedCard": encryptedCard,
            "cardBrand": cardBrand,
            // "consumer": consumer,
            "windowRef": myWindow,
            "dpaTransactionOptions": dpaTransactionOptionsCheckoutEM,
            //"rememberMe": true,
            //  "recognitionTokenRequested": true
        }

        //    const checkoutNewCardResult = window.mcCheckoutService.checkoutWithNewCard(checkoutNewCardParams) 
        const checkoutNewCardResultEM = await mcCheckoutService.checkoutWithNewCard(checkoutNewCardParamsEM)

        console.log(`Checkout with New Card - ", ${JSON.stringify(checkoutNewCardResultEM)}`);
        console.log(checkoutNewCardResultEM);


        console.log("###################");
        console.log("FPAN and dynamicDataTypeEM: ", ddt);
        console.log("merchant-transaction-id: ", checkoutNewCardResultEM.headers['merchant-transaction-id']);
        console.log("paymentOptions", checkoutNewCardParamsEM.dpaTransactionOptions.paymentOptions);
        // console.log("payloadRequested", checkoutNewCardParamsEM.dpaTransactionOptions.authenticationPreferences.payloadRequested);
        console.log("###################");

        myWindow.close();
    } catch (checkoutNewCardRejectedEM) {
        console.log(`Checkout with New Cards ERROR - ", ${JSON.stringify(checkoutNewCardRejectedEM)}`);
        console.log(checkoutNewCardRejectedEM);
        myWindow.close();
    }
}


async function checkoutWithCardEM(ddt, myWindow) { // this method will return a promise
    //var myWindow = window.open("", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=200,left=600,width=500,height=700,popup=1");
    // getCard();

    // const srcDigitalCardId = localStorage.getItem('srcDigitalCardIdCheckout');

    const srcDigitalCardId = document.querySelector('input[name="mycardsList"]:checked').value;


    const paymentOptions = [{
        "dynamicDataType": ddt
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
        "authenticationPreferences": {
            "payloadRequested": "AUTHENTICATED",
            // "payloadRequested": "NON_AUTHENTICATED",
        },
        "paymentOptions": paymentOptions
    }


    const checkoutParams = {
        "windowRef": myWindow, // required.
        "srcDigitalCardId": srcDigitalCardId, // optional.
        "dpaTransactionOptions": dpaTransactionOptionsCheckout
    }


    try {
        const promiseResolvedPayloadCheckoutWCard = await mcCheckoutService.checkoutWithCard(checkoutParams);

        console.log(`Checkout with Cards - ", ${JSON.stringify(promiseResolvedPayloadCheckoutWCard)}`);
        console.log(promiseResolvedPayloadCheckoutWCard);
        console.log("###################");
        console.log("paymentOptions", checkoutParams.dpaTransactionOptions.paymentOptions);
        console.log("payloadRequested", checkoutParams.dpaTransactionOptions.authenticationPreferences.payloadRequested);
        console.log("merchant-transaction-id: ", promiseResolvedPayloadCheckoutWCard.headers['merchant-transaction-id']);
        console.log("###################");
        myWindow.close();
    } catch (promiseRejectedPayloadCheckoutWCard) {
        console.log(`Checkout with Cards ERROR - ", ${JSON.stringify(promiseRejectedPayloadCheckoutWCard)}`);
        console.log(promiseRejectedPayloadCheckoutWCard);
        myWindow.close();
    }
}
