const menu = document.querySelector("#menu");
const cartBtn = document.querySelector("#cart-btn");
const cartModal = document.querySelector("#modal");
const cartItemsContainer = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const checkoutBtn = document.querySelector("#checkout-btn");
const closeModalBtn = document.querySelector("#close-modal-cart");
const cartCounter = document.querySelector("#cart-count");
const addressInput = document.querySelector("#adress");
const addressWarn = document.querySelector("#adress-warn");
const mycart = document.querySelector("#my_cart");
const section1 = document.querySelector("#section1");
const main = document.querySelector(".main");


let cart = [];

//abrir o modal no carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = 'flex'
});

//quando clicar fora fechar o modal
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

//Botão de fechar o modal pelo botão "fechar"
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = 'none'
});

//pegar a região no evento de click do usuario para pegar o nome e o preço do produto
main.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    console.log(parentButton)
    if (parentButton) {
        //como pegar os atributos setados no html pelo console
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"))
        //adicionar no carrinho!
        addToCart(name, price)

    }
});

//função para add no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        //se o item ja existe aumenta apenas a quant +1
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal();
};

//atualiza cart     
function updateCartModal() {
    cartItemsContainer.innerHTML ="";
    let total = 0;

    //forEach percorre a lista e ve se os produtos não estão repetidos.
    cart.forEach(item =>{
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex","justify-between", "mb-4", "flex-col");
        cartItemElement.innerHTML = `
        <div class ="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: = ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price}</p>
            </div>

            <div>   
                <button class="remove-from-cart" data-name="${item.name}">Remover</button>
            </div>
        </div>
        `;

        cartItemsContainer.appendChild(cartItemElement);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    
    cartCounter.innerHTML = cart.length;
};


//função para remover item do carrinho
cartItemsContainer.addEventListener("click",function(event){
    if(event.target.classList.contains("remove-from-cart")){
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }

});

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        };
        
        cart.splice(index, 1);
        updateCartModal();
    }
};

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        addressWarn.style.display = "none"
        addressInput.style.border ="solid green"
    }

    //
});



//finalizar pedido!
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
       Toastify({
        text: "Ops o Restaurante está fechado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },

       }).showToast();
        return;
    }
    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.style.display = "flex";
        addressInput.style.border ="solid red"
    } 

    //ENVIAR PARA A API DO ZAPZAP
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} quantidade: (${item.quantity}) Preço: ${item.price} |`
        )
    }).join("")
   
    const message = encodeURIComponent(cartItems)
    const phone = "5511956817479"; // Formato internacional: +55 (11) 95681-7479

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}` , "_blank");

    cart = [];
    updateCartModal()

});

//verificar a hora e manipular o card do horario no header
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; //true restaurante está aberto
}

const spanItem = document.querySelector(".funcionamento");
const isOpen = checkRestaurantOpen();

if(isOpen == true){
    spanItem.style.color = "white"
    spanItem.style.backgroundColor = "##33842F"
} else{
    spanItem.style.color = "white";
    spanItem.style.backgroundColor = "red"
}

