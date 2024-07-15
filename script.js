const initiailzeProxy = (target, subscribers) => {
  return new Proxy(
    target,
    {
      set(target, property, newValue) {
        subscribers.forEach((subscriber) => {
          if (subscriber[0] === target && subscriber[1] === property) {
            subscriber[2](newValue);
          }
        })
        return Reflect.set(target, property, newValue);
      }
    }
  )
}

const subscribe = ({
    subscribers,
    target,
    field,
    element, 
    callback
  }) => {
  const valueReciever = callback.bind(null, element)
  subscribers.push([target, field, valueReciever]);
  
  return subscribers;
}

const createState = (target) => {
  const subscribers = [];
  const state = initiailzeProxy(target, subscribers);
  const subscribtionHelper = (field, element, callback) => {
    subscribe({
      subscribers,
      target,
      field,
      element,
      callback,
    })
  }

  return { subscribers, state, subscribtionHelper }
}

const counters = { 
  basicCounter: 0,
  negativeCounter: 0
}

const counter = document.getElementById("counter");
const counterHandler = (element, value) => { 
  element.textContent = "Counter: " + value
}
const negativeCounter = document.getElementById("negative-counter");
const negativeHandler = (element, value) => { 
  element.textContent = "Negative Counter: " + value
}

const {
  state: countersState,
  subscribtionHelper: subscribeToCounters 
} = createState(counters);

subscribeToCounters(
  "basicCounter",
  counter,
  counterHandler
)

subscribeToCounters(
  "negativeCounter",
  negativeCounter,
  negativeHandler
)
