// Sign up for an OpenTok API Key at: https://tokbox.com/signup
// Then generate a sessionId and token at: https://dashboard.tokbox.com
var apiKey = "45971012";
var sessionId = "1_MX40NTk3MTAxMn5-MTUxMjQ5OTk5NDA3M342Qzg0eUxlbEhabUlkN2JBeVRpT01NUjN-fg";
var token = "T1==cGFydG5lcl9pZD00NTk3MTAxMiZzaWc9NjVmODk4NjdjMDg0NzUyMmQ1YTQ4ZjY1NjhmZTJkN2Q0ZTViMmE0YjpzZXNzaW9uX2lkPTFfTVg0ME5UazNNVEF4TW41LU1UVXhNalE1T1RrNU5EQTNNMzQyUXpnMGVVeGxiRWhhYlVsa04ySkJlVlJwVDAxTlVqTi1mZyZjcmVhdGVfdGltZT0xNTEyNTAwMDA3Jm5vbmNlPTAuNzQ1OTgyMjA4MjkzMzc0NSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTEyNTAzNjA2JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

var session = null;
var publisher = null;
var subscriber = null;

function connectVideoChat() {
    console.log("Connect clicked.");
    $('#connectButton').prop('disabled', true);
    $('#disconnectButton').prop('disabled', false);
    $("#div_me").append("<div id='div_me_feed'></div>");
    console.log("Initializing publisher.");
    publisher = TB.initPublisher(apiKey, 'div_me_feed');
    console.log("Initializing session.");
    session = TB.initSession( apiKey, sessionId ); 
    session.on({
        'streamCreated': function( event ){
            console.log("New stream created, subscribing.");
            divId = 'stream' + event.stream.streamId;
            var div = $('<div>').attr('id', divId);
            $("#div_others").append(div);
            subscriber = session.subscribe( event.stream, divId, {subscribeToAudio: false} );
            console.log("Subscribed to stream.");
        }
    });
    console.log("Connecting to session.");
    session.connect(token, function(){
        console.log("Session connected, publishing my stream.");
        session.publish( publisher );
    });
}

function disconnectVideoChat() {
    console.log("Disconnect clicked.");
    $('#connectButton').prop('disabled', false);
    $('#disconnectButton').prop('disabled', true);
    try {
        session.unsubscribe(subscriber);
    }
    catch (err) {
        console.error("Call session unsubscribe failed: " + err.message);
    }
    subscriber = null;
    try {
        session.unpublish(publisher);
    }
    catch (err) {
        console.error("Call session unpublish failed: " + err.message);
    }        
    publisher = null;
    session.disconnect();
    session = null;
}

function initVideoChat() {
    console.log("Initializing video chat.");
    $('#connectButton').on('click', connectVideoChat);
    $('#disconnectButton').on('click', disconnectVideoChat);
    $('#connectButton').prop('disabled', false);
}



