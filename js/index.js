let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;

function openSideNav() {
  $(".side-nav-menu").animate({ left: 0 }, 500);

  for (let i = 0; i < 5; i++) {
    $(".nav-links li")
      .eq(i)
      .animate({ top: 0 }, (i + 5) * 100);
  }
}

closeSideNav();
function closeSideNav() {
  let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();

  $(".side-nav-menu").animate({ left: -boxWidth }, 500);
  $(".nav-links li").animate({ top: 300 }, 500);
}
$(".side-nav-menu i.open-close-icon ").click(() => {
  if ($(".side-nav-menu").css("left") == "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});

async function searchByName(term) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  response = await response.json();
  displayData(response.meals);
  response.meals ? displayData(response.meals) : displayData([]);
}

function displayData(arr) {
  let data = "";
  for (let i = 0; i < arr.length; i++) {
    data += `
        <div class="col-md-3">
                    <div class="meal position-relative overflow-hidden rounded-5 mt-3 " onclick = "getMealDetails('${arr[i].idMeal}')">
                        <img class="w-100" src="${arr[i].strMealThumb}" alt="">
                        <div class="meal-leyar position-absolute text-center pt-3">
                          <h2>${arr[i].strMeal}</h2>
                        </div>
                    </div>
                </div>
        `;
  }
  rowData.innerHTML = data;
}
searchByName("");

async function getCategories() {
  searchContainer.innerHTML = "";
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  response = await response.json();
  displayCategories(response.categories);
  closeSideNav();
}

function displayCategories(arr) {
  let data = "";
  for (let i = 0; i < arr.length; i++) {
    data += `
        <div class="col-md-3">
                    <div class="meal position-relative overflow-hidden rounded-2 mt-3" onclick="getCategoryMeals('${
                      arr[i].strCategory
                    }')" ${arr[i].idCategory} ">
                        <img class="w-100" src="${
                          arr[i].strCategoryThumb
                        }" alt="">
                        <div class="meal-leyar position-absolute text-center p-2">
                        <h2>${arr[i].strCategory}</h2>
                        <p>${arr[i].strCategoryDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                        </div>
                    </div>
                </div>
        `;
  }
  rowData.innerHTML = data;
}

async function getArea() {
  searchContainer.innerHTML = "";
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  response = await response.json();
  displayAreas(response.meals);
  closeSideNav();
}

function displayAreas(arr) {
  let data = "";
  for (let i = 0; i < arr.length; i++) {
    data += `
        <div class="col-md-3">
                    <div class="area rounded-2 mt-3 w-100 text-center" onclick="getAreaMeals('${arr[i].strArea}')">
                        <i class="fa-solid fa-map-location-dot fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                    </div>
        </div>
        `;
  }
  rowData.innerHTML = data;
}
async function getIngredients() {
  searchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  response = await response.json();
  displayIngredients(response.meals.slice(0, 20));
  console.log(response.meals);
  closeSideNav();
}

function displayIngredients(arr) {
  let data = "";
  for (let i = 0; i < arr.length; i++) {
    data += `
          <div class="col-md-3">
                      <div class="meal rounded-2 mt-3 w-100 text-center" onclick="getIngredientsMeals('${
                        arr[i].strIngredient
                      }')">
                          <i class="fa-solid fa-utensils fa-4x"></i>
                          <h3>${arr[i].strIngredient}</h3>
                          <p>${arr[i].strDescription
                            .split(" ")
                            .slice(0, 25)
                            .join(" ")}</p>
                      </div>
          </div>
          `;
    console.log(arr[i].strDescription);
  }
  rowData.innerHTML = data;
}

async function getCategoryMeals(meal) {
  searchContainer.innerHTML = "";
  let response =
    await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${meal}
`);
  response = await response.json();
  displayData(response.meals.slice(0, 20));
}

async function getAreaMeals(country) {
  searchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`
  );
  response = await response.json();
  displayData(response.meals.slice(0, 20));
}

async function getIngredientsMeals(ingredient) {
  searchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  response = await response.json();
  displayData(response.meals.slice(0, 20));
}

async function getMealDetails(mealsId) {
  searchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealsId}`
  );
  response = await response.json();
  displayMealDetails(response.meals[0]);
}
function displayMealDetails(meal) {
  let ingredients = ``;

  for (let i = 1; i <= 15; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1 rounded-2">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li> `;
    }
  }

  let tags = meal.strTags?.split(",");
  if (!tags) tags = [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li> `;
  }

  let data = `
    <div class="col-md-4">
                    <img src="${meal.strMealThumb}" class="w-100 rounded-2" alt="">
                    <h2 class="px-3">${meal.strMeal}</h2>
                </div>
                <div class="col-md-8">
                    <h2>instructions</h2>
                    <p>
                        ${meal.strInstructions} </p>
                    <h3><span class="fw-bolder"> Area : </span>${meal.strArea}</h3>
                    <h3><span class="fw-bolder"> Category : </span>${meal.strCategory}</h3>
                    <h3><span class="fw-bolder my-2">recipes : </span></h3>
                    <ul class="list-unstyled d-flex flex-wrap">
                        ${ingredients}
                    </ul>
                    <h3>tags : </h3>
                    <ul class="list-unstyled d-flex justify-content-center align-items-center">
                        ${tagsStr}
                    </ul>
                <a target= "_blank" class="btn btn-success m-2" href="${meal.strSource}"> Source</a>
                <a target= "_blank"  class="btn btn-danger" href="${meal.strYoutube}"> Youtube</a>
            </div>
    `;
  rowData.innerHTML = data;
}

function showSearchInput() {
  searchContainer.innerHTML = `
        <div class="row">
            <div class="col-md-6 mt-4 ">
                <input type="text" onkeyup= "searchByName(this.value)" class="form-control bg-transparent text-white" placeholder="search by Name">
                
            </div>
            <div class="col-md-6 mt-4">
                <input type="text" onKeyup = "searchByFirstLetter(this.value)" maxLength="1" class="form-control bg-transparent text-white" placeholder="search by first Letter">
                
            </div>
        </div>
    `;
  closeSideNav();
  rowData.innerHTML = " ";
}
async function searchByFirstLetter(letter) {
  letter == " " ? (letter = "a") : " ";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  response = await response.json();
  displayData(response.meals);
  response.meals ? displayData(response.meals) : displayData([]);
}
function showContactPart() {
  rowData.innerHTML = `
     <div class="d-flex justify-content-center align-items-center min-vh-100">
        <div class="container w-75 text-center ">
            <h2 class="text-center">Contact Us</h2>
            <div class="row ">
                <div class="col-md-6 p-2">
                    <input type="text" onKeyup ="inputValidation()" class="form-control" id="nameInput" placeholder="enter your name">
                    <div class="alert alert-danger w-100 mt-2 p-1 d-none" id= "nameAlert">
                    characters and numbers are not allowed.
                    </div>
                </div>
                <div class="col-md-6 p-2" >
                    <input onKeyup ="inputValidation()"type="email" class="form-control" id="emailInput" placeholder="enter your email">
                    <div class="alert alert-danger w-100 mt-2 p-1 d-none" id= "emailAlert" >
                    this format is not allowed *example@yyy.zzz
                    </div>
                </div>
                <div class="col-md-6 p-2">
                    <input onKeyup ="inputValidation()"type="text" class="form-control" id="phoneInput" placeholder="enter your phone number">
                    <div class="alert alert-danger w-100 mt-2 p-1 d-none" id= "phoneAlert" >
                    invalid phone number .
                    </div>
                </div>
                <div class="col-md-6 p-2">
                    <input onKeyup ="inputValidation()" type="number" class="form-control" id="ageInput" placeholder="enter your age">
                </div>
                <div class="col-md-6 p-2">
                    <input onKeyup ="inputValidation()" type="password" class="form-control" id="passwordInput" placeholder="enter your password">
                    <div class="alert alert-danger w-100 mt-2 p-1 d-none" id= "passwordAlert" >
                    password must have a numbers and letters and special characters. 
                    </div>
                </div>
                <div class="col-md-6 p-2">
                    <input onKeyup ="inputValidation()"type="password" class="form-control" id="rePasswordInput" placeholder="enter your rePassword">
                    <div class="alert alert-danger w-100 mt-2 p-1 d-none" id= "rePasswordAlert">
                    passwords are not matched.
                    </div>
                </div>
            </div>
            <button id="submitBtn" disabled class="btn btn-outline-danger mt-3"> Submit </button>
        </div>
    </div> 
    `;
  closeSideNav();
  submitBtn = document.getElementById("submitBtn");
  document.getElementById("nameInput").addEventListener("focus", () => {
    nameTouched = true;
  });
  document.getElementById("emailInput").addEventListener("focus", () => {
    emailTouchedTouched = true;
  });
  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneTouched = true;
  });
  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordTouched = true;
  });
  document.getElementById("rePasswordInput").addEventListener("focus", () => {
    rePasswordTouched = true;
  });
}

let nameTouched = false;
let emailTouched = false;
let phoneTouched = false;
let passwordTouched = false;
let rePasswordTouched = false;

function inputValidation() {
  if (nameTouched) {
    if (NameValidation()) {
      document
        .getElementById("nameAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("nameAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (emailTouched) {
    if (emailValidation()) {
      document
        .getElementById("emailAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("emailAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (phoneTouched) {
    if (phoneValidation()) {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (passwordTouched) {
    if (passwordValidation()) {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (rePasswordTouched) {
    if (rePasswordValidation()) {
      document
        .getElementById("rePasswordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("rePasswordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (
    NameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    rePasswordValidation()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

function NameValidation() {
  return /^[a-zA-Z]+$/.test(document.getElementById("nameInput").value);
}
function emailValidation() {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    document.getElementById("emailInput").value
  );
}
function phoneValidation() {
  return /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(
    document.getElementById("phoneInput").value
  );
}
function ageValidation() {
  return /^\S[0-9]{0,3}$/.test(document.getElementById("ageInput").value);
}

function passwordValidation() {
  return /^(?=.*[a-z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(
    document.getElementById("passwordInput").value
  );
}

function rePasswordValidation() {
  return (
    document.getElementById("rePasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}
