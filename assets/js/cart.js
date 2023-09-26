const cart = JSON.parse(localStorage.getItem("cart"));
const table = document.getElementById("cartTable");
let i = 1;
let totalPrice = 0;

const initCart = () => {
    table.innerHTML = '';
    cart.forEach((item) => {
        let element = document.createElement("tr");
        element.innerHTML = `
            <td>${i}</td>
            <td><img src="${item.Picture}" alt="${item.ProductName}" width="100px"></td>
            <td>${item.ProductName}</td>
            <td>&#8362;${(item.Price * item.amount)}</td>
        `;
        let amountTd = document.createElement("td");
        let amountInput = document.createElement("input");
        amountInput.type = "number";
        amountInput.value = item.amount;
        amountInput.id = `${i}Amount`;
        amountInput.name = `${i}`;
        amountTd.appendChild(amountInput);
        amountInput.addEventListener('change', function (){
            let elemId = Number(this.name);
            let amount = this.value;
            if(amount < 1){
                cart.splice(elemId - 1, 1);
            }else{
                cart[elemId - 1].amount = amount;
                cart[elemId - 1].totalPrice = cart[elemId - 1].Price * amount;
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            window.location.reload();
        });
        element.appendChild(amountTd);
        totalPrice += (item.Price * item.amount);
        i ++;
        table.appendChild(element);
    });
}
initCart();



const totalPricePlaceholder = document.getElementById("totalPricePlaceholder");
totalPricePlaceholder.textContent = `${totalPrice.toFixed(0)}`;

const verifyTotalPricePlaceholder = document.getElementById("verifyTotalPricePlaceholder");
verifyTotalPricePlaceholder.textContent = `${totalPrice.toFixed(0)}`;

document.getElementById("PayButton").addEventListener('click', () => {
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const country = document.getElementById('country');
    const zip = document.getElementById('zip');
    $.ajax({
        url: "/cart",
        method: "POST",
        data: { address: address.value, city: city.value, country: country.value, zip: zip.value, cart },
        followRedirects: true,
        xhrFields: { withCredentials: true },
        success: function (data, textStatus, jqXHR) {
          if (jqXHR.status == 201) {
            alert("Order Placed Successfully");
            localStorage.removeItem("cart");
            window.location.href = '/account';
          } else {
            const errors = data.errors;
            let msg = "";
            errors.forEach((error) => {
                msg += error + "\n";
            });
            alert(msg);
          }
        },
        error: function () {
            const errors = errors.responseJSON;
            let msg = "";
            errors.forEach((error) => {
                msg += error + "\n";
            });
            alert(msg);
        },
      });
});