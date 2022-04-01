function redirect() {
  console.log("soy un redirect")
  location.replace(`${location.origin}/`)
}

console.log(location)
setTimeout(redirect, 2000) // se ejecuta despues de dos segundos