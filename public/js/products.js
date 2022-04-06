function cookieParser() {
  return (document.cookie || "").split("; ").reduce((obj, cookie) => {
    const [name, value] = cookie.split("=")
    obj[name] = decodeURI(value)
    return obj
  }, {})
}

const productsElement = document.getElementById("products")

const objCookies = cookieParser()

console.log(objCookies)

fetch("/api/products", {
  headers: { authorization: `Bearer ${objCookies.token}` }
})
.then(res => res.json())
.then(data => {
  data.forEach(prd => {
    productsElement.innerHTML += `
      <div class="uk-card uk-card-default uk-card-body uk-width-1-1 uk-margin-top">
        <div class="uk-card-badge uk-label">${prd.price}</div>
        <h3 class="uk-card-title">${prd.name}</h3>
        <p>${prd.description}</p>
      </div>`
  })
})
.catch(err => {
  productsElement.innerHTML = "ocurrio un error"
  productsElement.style.color = "red"
})