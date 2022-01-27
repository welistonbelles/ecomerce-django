function openSubCategorys(element) {
  element.parentElement.getElementsByClassName("rotate")[0].classList.toggle("rotate-down");
  element.parentElement.querySelector(".nested").classList.toggle("active");
  element.classList.toggle("caret-down");
}

function requestProducts() {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', `http://127.0.0.1:8000/api/v1/${location.search.slice(1) ? "?" + location.search.slice(1) : window.location.href = "http://127.0.0.1:8000/?page=1"}`)
  xhr.send()

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        createProductList(JSON.parse(xhr.responseText));
    }
  }

}

function createProductList(data) {
  let firstRow = document.getElementById('first-row');
  let firstRowText = ``;
  let secondRow = document.getElementById('second-row');
  let secondRowText = ``;

  if (!data.detail) {
    data.results.map((product, i) => {
      if (i <= 3) {
        firstRowText += `
            <div class="col">
            <a href="#" onclick="openModalProduct(${ product.id })">
              <div class="image-content" id="image-${ product.id }">
                <img src="${ product.image}">
              </div>
              <p>${product.name}</p>
              <p>R$ ${product.price}</p>
            </a>
            </div>
          `
      } else{
        secondRowText += `
            <div class="col">
            <a href="#" onclick="openModalProduct(${ product.id })">
              <div class="image-content" id="image-${ product.id }">
                <img src="${ product.image}">
              </div>
              <p>${product.name}</p>
              <p>R$ ${product.price}</p>
            </a>
            </div>
          `
      }
    })
  }

  firstRow.innerHTML = firstRowText;
  secondRow.innerHTML = secondRowText;

  if (data.links.total >= 1) {
    let pag = document.getElementById('paginator');
    let pagProdText = ""
    pagProdText += `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${data.links.previous == null ? "disabled" : ""} ">
                    <a class="page-link" onclick="updateFilter('?page=1')" tabindex="-1" ${data.links.previous === null ? 'aria-disabled="true"' : ''} >&laquo;</a>
                </li>
    `
    for(let i=1; i <= data.links.total; i++){
      pagProdText += `
            <li class="page-item ${data.links.current === i ? 'active' : ''}"><a class="page-link" onclick="updateFilter('?page=${i}')">${i}</a></li>
        `
    }

    pagProdText += `
            <li class="page-item ${data.links.next == null ? "disabled" : ""}">
                <a class="page-link" onclick="updateFilter('?page=${data.links.total}')">&raquo;</a>
            </li>
        </ul>
    </nav>
    `
    pag.innerHTML = pagProdText
  }

}

function getOrder() {
  let order = document.querySelector('.form-select').selectedIndex;
  if (order === 1) {
    return '&price=ASC';
  } else if (order === 2) {
    return '&price=DESC';
  }
  return ''
}

function getCategories() {
  let checks = document.querySelectorAll('.checkbox');
  let subCategories = ``;
  checks.forEach((check, i) => {
    if (check.checked) {
      if (subCategories === '') {
        subCategories += `${(check.id).split('-')[1]}`
      } else {
        subCategories += `-${(check.id).split('-')[1]}`
      }
    }
  })
  if (subCategories != '') {
    subCategories = `&subCategory=${subCategories}`
    return subCategories
  }
  return ''
}

function filter(element) {
  let subCategory = (element.id).split('&')[1];
  var xhr = new XMLHttpRequest()
  xhr.open('GET', `http://127.0.0.1:8000/api/v1/?page=1${getOrder()+getCategories()}`)
  xhr.send()
  let local = (location.search).split('&')[0]
  window.history.pushState({page: "another"}, "another page", `${local + getOrder() + getCategories()}`)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        createProductList(JSON.parse(xhr.responseText));
    }
  }
}

function updateFilter(page) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', `http://127.0.0.1:8000/api/v1/${page ? page : '?page=1'}${getOrder()+getCategories()}`)
  xhr.send()
  let local = page ? page : (location.search).split('&')[0]
  window.history.pushState({page: "another"}, "another page", `${local + getOrder() + getCategories()}`)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        createProductList(JSON.parse(xhr.responseText));
    }
  }
}


function openModalProduct(id) {
  $.getJSON(`http://127.0.0.1:8000/api/v1/${id}`, function(data) {
    if (!("error" in data)) {
      let editModal = document.querySelector('#editModal');
      editModal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editModalLabel">${data.name}</h5>
              <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row" align="center">
                <div class="col">
                  <div class="image-content" id="image-${ data.id }">
                    <img src="${ data.image}">
                  </div>
                  <p>${data.name}</p>
                  <p id="totalPrice">Preço: R$ ${data.price}</p>
                </div>
              </div>
              <div class="row" align="center">
                <div class="col">
                <br>
                  <div class="quantity">
                  Selecionar quantidade
                    <input type="number" value="1" min="1" id="totalAmount" onchange="changePrice(this, ${data.price})" onkeypress="return false">
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer" align="center">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
              <button type="button" class="btn btn-primary" onclick="addToCart(${data.id})"><i class="fas fa-cart-plus"></i> Adicionar ao carrinho.</button>
            </div>
          </div>
        </div>`
      $('#editModal').modal('show')
    }
  })
}

function changePrice(element, basePrice) {
    let newPrice = basePrice*parseFloat(element.value);
    document.getElementById('totalPrice').textContent = 'R$ '+newPrice.toFixed(2)
}



function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}


function addToCart(id) {
  let amount = document.getElementById('totalAmount').value;
  const csrftoken = getCookie('csrftoken');
  const request = new Request(`http://127.0.0.1:8000/cart/api/v1/`,
    {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
      },
      mode: 'same-origin',
      body: JSON.stringify({
        'msg': 'add',
        id,
        amount
      })
    }
  )
  $('#editModal').modal('hide')
  fetch(request).then(res => {
    if (res.statusText === "Created") {
      return
    } else {
      return res.json()
    }
  }).then(function(data) {
    if (data.detail) {
      showToast("Você precisa estar logado para fazer isso.")
    }
  })

}

function changePriceInCart(element, id, basePrice) {
  let newPrice = basePrice*parseFloat(element.value);
  let item = document.getElementById(`totalPrice-${id}`)
  item.textContent = 'R$ '+newPrice.toFixed(2)
  updateItemCart(id, element.value)
  updateFinalPrice()
}

function deleteItemFromCart(element, id) {
  let product = document.getElementById(`product-${id}`)
  product.remove(); 
  updateFinalPrice();
  isCartCleaned();
  const csrftoken = getCookie('csrftoken');
  const request = new Request(`http://127.0.0.1:8000/cart/api/v1/`,
    {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
      },
      mode: 'same-origin',
      body: JSON.stringify({
        'msg': 'remove',
        id,
      })
    }
  )
  fetch(request).then(res => {
    if (res.statusText === "Created") {
        return
    } else {
        console.log(res.json())
    }
  })
}

function updateItemCart(id, amount) { 
  const csrftoken = getCookie('csrftoken');
  const request = new Request(`http://127.0.0.1:8000/cart/api/v1/`,
    {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
      },
      mode: 'same-origin',
      body: JSON.stringify({
        'msg': 'update',
        id,
        amount
      })
    }
  )
  fetch(request).then(res => {
    if (res.statusText === "Created") {
        return
    } else {
        console.log(res.json())
    }
  })
}

function updateFinalPrice() {
  let price = document.getElementById('finalPrice');
  let items = document.querySelectorAll('.totalPrice');
  let totalPrice = 0.00;
  items.forEach((item, i) => {
    let p = parseFloat(item.textContent.split(' ')[1])
    totalPrice += p
  })
  price.textContent = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function cleanCart(element) {
  const csrftoken = getCookie('csrftoken');
  const request = new Request(`http://127.0.0.1:8000/cart/api/v1/`,
    {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
      },
      mode: 'same-origin',
      body: JSON.stringify({
        'msg': 'clean'
      })
    }
  )
  fetch(request).then(res => {
    if (res.statusText === "Created") {
        return
    } else {
        console.log(res.json())
    }
  })
  let items = document.querySelectorAll('.cartProduct');
  items.forEach((item, i) => {
    item.remove();
  })
  updateFinalPrice()
  element.style.display = 'none';
  document.getElementById('addProducts').style.display = 'block';
}

function isCartCleaned() {
  let items = document.querySelectorAll('.cartProduct');
  if (items.length === 0) {
    document.getElementById('emptyCart').style.display = 'none';
    document.getElementById('addProducts').style.display = 'block';
  }
}

function showToast(msg) {
  let divToast = document.querySelector('#toast-area');
  divToast.innerHTML = ''
  divToast.innerHTML += `
      <div class="toast" data-autohide="false" role="alert" aria-live="assertive">
          <div class="toast-header" style="background-color: #FA8072;">
              <strong class="mr-auto" style="color: black;">Informação:</strong>
              <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="toast-body" style="color: black;">
              ${msg}
          </div>
      </div>
  `
  $('.toast').toast('show')
}