const xhr = new XMLHttpRequest(); // Creates a new HTTP message to send to the backend. (message = request)

// Why EventListener is above ?
// First we need to set up the EventListener and then we can trigger the event or send request.
xhr.addEventListener('load', () => { // (eventThatWeNeedToWaitFor, FunctionWeNeedToRunAfterThat)
  console.log(xhr.response);
});

xhr.open('GET', 'https://supersimplebackend.dev'); // (type, url)
xhr.send();