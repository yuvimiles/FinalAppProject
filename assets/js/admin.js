$(document).ready(function () {
  document.getElementById("addCategory").addEventListener("click", addCategory);
  document.getElementById("addProduct").addEventListener("click", addProduct);

  const names = $(".names");
  const email = $(".email");
  const joined = $(".joined");
  const navBar = $("nav");
  const navToggle = $(".navToggle");
  const navLinks = $(".navList");
  const body = $("body");

  const dashboardSection = $("#dashboard");
  const contentSection = $("#content");
  const productSection = $("#product");
  const categorySection = $("#category");
  const orderSection = $("#order");

  dashboardSection.show();
  contentSection.hide();
  productSection.hide();
  categorySection.hide();
  orderSection.hide();

  navToggle.click(function () {
    navBar.toggleClass("close");
  });

  navLinks.click(function () {
    navLinks.removeClass("active");
    $(this).addClass("active");

    const menuId = $(this).attr("id");

    if (menuId === "dashboardLink") {
      dashboardSection.show();
      productSection.hide();
      contentSection.hide();
      categorySection.hide();
      orderSection.hide();
    } else if (menuId === "contentLink") {
      dashboardSection.hide();
      productSection.hide();
      contentSection.show();
      categorySection.hide();
      orderSection.hide();
    } else if (menuId === "productLink") {
      dashboardSection.hide();
      contentSection.hide();
      productSection.show();
      categorySection.hide();
      orderSection.hide();
    } else if (menuId === "categoryLink") {
      dashboardSection.hide();
      contentSection.hide();
      productSection.hide();
      categorySection.show();
      orderSection.hide();
    }else if (menuId === "orderLink") {
      dashboardSection.hide();
      contentSection.hide();
      productSection.hide();
      categorySection.hide();
      orderSection.show();
    }
  });

  // Handle logout click
  $("#logout-link").click(function (event) {
    event.preventDefault();

    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    window.location.href = "logout"; // Update with the correct login page URL
  });
});

function addCategory() {
  const name = $("#categoryName").val();
  const description = $("#categoryDescription").val();
  const image = $("#categoryPicture").val();
  if(!name || !description || !image || name.length < 2 || description.length < 10 || image.length < 10){
    alert("Please fill all the fields! - name: 2 lettersm description: 10 letters, image: 10 letters");
    return;
  }
  $.ajax({
      url: "/admin/addCategory",
      method: "POST",
      data: { name, description, image },
      followRedirects: true,
      xhrFields: { withCredentials: true },
      success: function (data, textStatus, jqXHR) {
        if (jqXHR.status == 200) {
          alert("Successfully added the category!");
          location.reload();
        } else {
        }
      },
      error: function () {
          alert("Unable to add the category!");
      },
  });
};

function addProduct(){
  const name = $("#productName").val();
  const category = $("#Category").val();
  const price = $("#Price").val();
  const description = $("#productDescription").val();
  const image = $("#productPicture").val();
  console.log(name + " " + category + " " + price + " " + description + " " + image);
  if(!name || !category || !price || !description || !image || name.length < 2 || description.length < 10 || image.length < 10 || price < 0){
    alert("Please fill all the fields! - name: 2 lettersm description: 10 letters, image: 10 letters, price: positive number");
    return;
  }
  $.ajax({
      url: "/admin/addProduct",
      method: "POST",
      data: { name, category, price, description, image },
      followRedirects: true,
      xhrFields: { withCredentials: true },
      success: function (data, textStatus, jqXHR) {
        if (jqXHR.status == 200) {
          alert("Successfully added the product");
          location.reload();
        } else {
        }
      },
      error: function () {
          alert("Unable to add the product!");
      },
  });
};

function updateUser(id){
  const isAdmin = $("#ia" + id).val();
  let password = $("#pw" + id).val() || null;
  $.ajax({
    url: "/admin/updateACustomer",
    method: "POST",
    data: { id, isAdmin, password },
    followRedirects: true,
    xhrFields: { withCredentials: true },
    success: function (data, textStatus, jqXHR) {
      if (jqXHR.status == 200) {
        alert("User updated Successfully!");
        window.location.reload();
      } else {
        alert("User updated Failed!");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("User updated Failed!");
    }
  });
}

function deleteUser(id){
  $.ajax({
    url: "/admin/deleteACustomer",
    method: "POST",
    data: { id },
    followRedirects: true,
    xhrFields: { withCredentials: true },
    success: function (data, textStatus, jqXHR) {
      if (jqXHR.status == 200) {
        alert("User deleted Successfully!");
        window.location.reload();
      } else {
        alert("Unable to delete the user!");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Unable to delete the user!");
    }
  });
}

function viewDetails(details){
  const conElem = document.getElementById("orderDetails");
  conElem.innerHTML = details;
  conElem.style.display = "block";
}

const updateOrder = (id) => {
  const status = $("#" + id + "status").val();
  $.ajax({
      url: "/admin/updateOrder",
      method: "POST",
      data: { id, status },
      followRedirects: true,
      xhrFields: { withCredentials: true },
      success: function (data, textStatus, jqXHR) {
        if (jqXHR.status == 200) {
          alert("Status Changed!");
          location.reload();
        } else {
        }
      },
      error: function () {
          alert("Unable to update order's status!");
      },
  });
};

function deleteProduct(id){
  $.ajax({
    url: "/admin/deleteAProduct",
    method: "POST",
    data: { id },
    followRedirects: true,
    xhrFields: { withCredentials: true },
    success: function (data, textStatus, jqXHR) {
      if (jqXHR.status == 200) {
        alert("Product deleted Successfully!");
        window.location.reload();
      } else {
        alert("Unable to delete the product!");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Unable to delete the product!");
    }
  });
}

function deleteCategory(id){
  $.ajax({
    url: "/admin/deleteACategory",
    method: "POST",
    data: { id },
    followRedirects: true,
    xhrFields: { withCredentials: true },
    success: function (data, textStatus, jqXHR) {
      if (jqXHR.status == 200) {
        alert("Category deleted Successfully!");
        window.location.reload();
      } else {
        alert("Unable to delete the category!");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Unable to delete the category!");
    }
  });
}