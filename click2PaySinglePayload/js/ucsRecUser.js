// window.mcCheckoutService.init //returns a promise which will:
// // Resolve to an object containing availableCardBrands, e.g.: 
// const brands = {
//     "availableCardBrands": [
//         "mastercard",
//         "visa",
//         "amex",
//         "discover"
//     ]
// }

var mcCheckoutService = new MastercardCheckoutServices();
//window.mcCheckoutService = new MastercardCheckoutServices()
async function initHandlerCAM() { // this method will return a promise

    console.log("window ", mcCheckoutService);

    //const srcDpaId = 'a448413d-2f5c-4d90-b3bd-0a1c49385b8f_dpa3';
    // const srcDpaId = 'c7f83380-d28f-4025-aee7-96e54f9b5cae';
    const srcDpaId = '9ecd5366-198f-42e8-805e-33bfa62b86d6_dpa1';

    const dpaData = {
        "dpaName": "Merchant NNN"       //required
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
        "paymentOptions": paymentOptions
    }
    const InitParamsCAM = {
        "srcDpaId": srcDpaId,
        "dpaData": dpaData,
        "dpaTransactionOptions": dpaTransactionOptions,
        "recognitionToken": "eyJraWQiOiIyMDI1MDYxMTEzNDI1NS1kYXMtcG9hLXNpZ24tbXRmIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc0NoYWxsZW5nZVBlcmZvcm1lZCI6dHJ1ZSwiY29tcGxldGVkQXQiOjE3NTg1NTAwMDAsImFzc2VydGlvblR5cGUiOiJhdXRoZW50aWNhdGlvbiIsImNlcnRpZmllZE1GQU1ldGhvZElkIjoiMjAwMDEiLCJpc3MiOiJodHRwczpcL1wvc2FuZGJveC52ZXJpZnkubWFzdGVyY2FyZC5jb20iLCJhdXRoZW50aWNhdGlvbkZhY3RvcnMiOiIwMjBBIiwiYXBwSW5zdGFuY2VJZCI6Ikg0VExJMU4xUjFxaXlJN0xHTXNHQ3cwMDAwMDAwMDAwMTBVUyIsImF1ZCI6Imh0dHBzOlwvXC9tYXN0ZXJjYXJkLmNvbSIsImNsaWVudFNlc3Npb25JZCI6Ijg2YmQ0YTkxLTQ2YmEtNzZ5dC05YjRhLTU5ZWVhMzgxMmYwNiIsImF1dGhlbnRpY2F0aW9uTWV0aG9kIjoiRklETzIiLCJkYXNBdXRoZW50aWNhdG9ySW5zdGFuY2VJZCI6Inp0dGxhOXpqU3hxTDFpLWRoVDdaM0EwMDAwMDAwMDAwMTBVUyIsImV4cCI6MTc1ODU1MDkwMCwiaWF0IjoxNzU4NTUwMDAwLCJhdXRoZW50aWNhdGlvblJlYXNvbnMiOlsiQklORF9BVVRIRU5USUNBVE9SIl19.xA2C8E5O6r-kcRXXXcncNtdRZzcBTdDdbgDhH09OyRL2WDKwhtVuhPO8pZ0JNfPHSWcwLbYQpaUoyG1sG6h5C4hKs79XHp6fdWNtWPxBHxZjE0DgudnSeMQpxby3fW7Tvp_GbmCyNaKvwgcpKOvtSFZwGhXNrAC9tm-GRYvhvGp9HRBRjUl8NmuyFP7NUs0gUHMiSV9jlllUsCeEx1TASqBkl8WhUPhUTVzShRMa8tzz4TohWzELkVGB2ooA-FqzshvwHe_gvmdxdg2jP1O9L9p8pIuusIcC4_wqmmyk5JwQUxpA7wnItI5VlyDse51oYLR8nathg5tpe1uBVWva3g",
        "cardBrands": ["mastercard"]  // required. Array of card brands supported.
    };
    try {
        const promiseResolvedPayloadCAM = await mcCheckoutService.init(InitParamsCAM) // No other library methods should be invoked until `init` resolves
        console.log(`SRC DPA initialized successfully ${JSON.stringify(promiseResolvedPayloadCAM)}`);
        console.log(promiseResolvedPayloadCAM);
        localStorage.setItem('c2p.enable_passkeys', true);
    } catch (promiseRejectedPayloadCAM) {
        console.error("Error initializing SRC DPA:", promiseRejectedPayloadCAM);
    }
}

function storeCards(cardsList) {

    let len = cardsList.length;
    localStorage.setItem('cardslength', len);

    for (let cards in cardsList) {
        localStorage.setItem('card'.concat(len), cardsList[cards].srcDigitalCardId);
        len--;
    }
}


async function getCardsHandler() {
    try {
        const promiseResolvedPayloaCardsR = await mcCheckoutService.getCards()
        console.log(`Get Cards - ", ${JSON.stringify(promiseResolvedPayloaCardsR)}`);
        console.log(promiseResolvedPayloaCardsR);
        storeCards(promiseResolvedPayloaCardsR)
        if (promiseResolvedPayloaCardsR.length > 0) {
            localStorage.setItem('srcDigitalCardIdCheckout', promiseResolvedPayloaCardsR[1].srcDigitalCardId);
        }
        console.log(promiseResolvedPayloaCardsR);

        localStorage.setItem('srcDigitalCardIdCheckout', promiseResolvedPayloaCards[1].srcDigitalCardId);
    } catch (promiseRejectedPayloadCards) {
        console.log(promiseRejectedPayloadCards);
    }
}



async function checkoutWithCardHandler() { // this method will return a promise
    var myWindow = window.open("", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=200,left=600,width=500,height=700");


    const srcDigitalCardId = localStorage.getItem('srcDigitalCardIdCheckout');
    var ddt = "";

    var dsrp = document.getElementById('dsrp').checked;
    var none = document.getElementById('none').checked;

    if (dsrp && none) {
        console.log("Select just one dynamicDataType!")
        return;
    } else if (!dsrp && !none) {
        console.log("Select one dynamicDataType!")
        return;
    } else if (dsrp) {
        ddt = "CARD_APPLICATION_CRYPTOGRAM_SHORT_FORM";
    } else {
        ddt = "NONE";
    }

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
        // "transactionAmount":
        // {
        //     "transactionAmount": 100.00,
        //     "transactionCurrencyCode": "USD",
        // },
        "authenticationPreferences": {
            "payloadRequested": "AUTHENTICATED",
        },
        "paymentOptions": paymentOptions,
    }

    const checkoutParams = {
        "windowRef": myWindow, // required.
        "srcDigitalCardId": srcDigitalCardId, // optional.
        "rememberMe": true,
        //   "recognitionTokenRequested": true,
        "dpaTransactionOptions": dpaTransactionOptionsCheckout
    }

    try {
        // const promiseResolvedPayloadCheckoutWCard = await window.mcCheckoutServiceInstance.checkoutWithCard(checkoutParams) // `checkoutWithCard` method must be called after `init` method is resolved

        const promiseResolvedPayloadCheckoutWCard = await mcCheckoutService.checkoutWithCard(checkoutParams);
        console.log(`Checkout with Cards - ", ${JSON.stringify(promiseResolvedPayloadCheckoutWCard)}`);
        console.log(promiseResolvedPayloadCheckoutWCard);
        myWindow.close();
    } catch (promiseRejectedPayloadCheckoutWCard) {
        console.log(`Checkout with Cards ERROR - ", ${JSON.stringify(promiseRejectedPayloadCheckoutWCard)}`);
        console.log(promiseRejectedPayloadCheckoutWCard);
    }
}
