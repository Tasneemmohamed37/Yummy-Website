//* Variables
let baseUrl = 'https://www.themealdb.com/api/json/v1/1/';
const formRegex = {
    contactName: /^[a-zA-Z]+\s*[a-zA-Z]+$/,
    contactEmail: /^\w+@\w{2,10}\.\w+$/,
    contactPhone: /^(\+2)?01[0125]\d{8}$/,
    contactAge: /^[1-9][0-9]?$/,
    contactPassword: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
}

//* functions 
function hideLoading(){
    $(".loading").fadeOut(1000, function () {
        $("body").css({ overflow: "auto" });
    });
}

function showLoading(){
    $(".loading").show();
    $("body").css({ overflow: "hidden" });
}

function collapseAside() {
    $("#menuIcon").show();
    $("#closeIcon").hide();
    $("#openMenu").addClass("d-none");
}

async function displayMeals(search) {
    showLoading();
    let data = await fetch(`${baseUrl}${search}`);
    let apiResponse = await data.json();
    hideLoading();
    $('#mealRow').html("");
    apiResponse.meals.forEach(function (meal) {
        $('#mealRow').append(`
            <div class="col-lg-3">
                <div class="inner meal py-2 position-relative overflow-hidden">
                    <img src="${meal.strMealThumb}" class="w-100 rounded" alt="${meal.strMeal}">
                    <div class="overlay d-flex align-items-center bg-white w-100 rounded position-absolute top-0 bottom-0 px-2 opacity-75">
                        <h3>${meal.strMeal}</h3>
                        <span class="d-none">${meal.idMeal}</span>
                    </div>
                </div>
            </div>
        `);
    });

    $('.meal').on('click', function () {
        displayMealDetails($(this).find('span').text());
    });
}

async function displayMealDetails(mealID) {
    showLoading();
    $("main").addClass("d-none");
    $("#mealDetails").removeClass("d-none");
    let data = await fetch(`${baseUrl}lookup.php?i=${mealID}`);
    let apiResponse = await data.json();
    hideLoading();
    let meal = apiResponse.meals[0];
    let recipes = [];
    let tags = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`] && meal[`strMeasure${i}`]) {
            recipes.push(`<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`);
        } else if (meal[`strIngredient${i}`]) {
            recipes.push(`<li class="alert alert-info m-2 p-1">${meal[`strIngredient${i}`]}</li>`);
        } else {
            continue;
        }
    }

    if (meal.strTags) {
        tags = meal.strTags.split(',');
        tags = tags.map(tag => `<li class="alert alert-danger m-2 p-1">${tag.trim()}</li>`);
    }

    $("#mealDetails").html(
        `<div class="row">
            <div class="col-md-4 img">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"
                    class="w-100 rounded">
                <h3>${meal.strMeal}</h3>
            </div>
            <div class="col-md-8 details">
                <h3>Instructions</h3>
                <p>${meal.strInstructions}</p>
                <h3>Area : ${meal.strArea}</h3>
                <h3>Category : ${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${recipes.join('')}
                </ul>
                <h3>Tags : </h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tags.join('')}
                </ul>
                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>
        </div>`
    );
}

async function displayCategories() {
    showLoading();
    let data = await fetch(`${baseUrl}categories.php`);
    let apiResponse = await data.json();
    hideLoading();
    apiResponse.categories.forEach(function (cat) {
        $('#categoryRow').append(`
            <div class="col-md-3">
                <div class="inner category py-2 position-relative overflow-hidden">
                    <img src="${cat.strCategoryThumb}" class="w-100" alt="food">
                    <div class="overlay text-center bg-white w-100 position-absolute top-0 bottom-0 px-2 opacity-75">
                        <h3>${cat.strCategory}</h3>
                        <p>${cat.strCategoryDescription.length > 150 ? cat.strCategoryDescription.substring(0, 150) + "..." : cat.strCategoryDescription}</p>
                    </div>
                </div>
            </div>
        `);
    });

    $('.category').on('click', function () {
        displayCategoryMeals($(this).find('h3').text());
    });
}

async function displayCategoryMeals(catName) {
    $("#categoriesContainer").addClass("d-none");
    $("main").removeClass("d-none");
    displayMeals(`filter.php?c=${catName}`)
}

async function displayArea() {
    showLoading();
    let data = await fetch(`${baseUrl}list.php?a=list`);
    let apiResponse = await data.json();
    hideLoading();
    apiResponse.meals.forEach(function (area) {
        $('#areaRow').append(`
            <div class="col-md-3">
                <div class="inner area py-3 rounded-2 text-center text-white cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${area.strArea}</h3>
                </div>
            </div>
        `);
    });

    $('.area').on('click', function () {
        displayAreaMeals($(this).find('h3').text());
    });
}

async function displayAreaMeals(areaName) {
    $("#areaContainer").addClass("d-none");
    $("main").removeClass("d-none");
    displayMeals(`filter.php?a=${areaName}`)
}

async function displayIngredients() {
    showLoading();
    let data = await fetch(`${baseUrl}list.php?i=list`);
    let apiResponse = await data.json();
    hideLoading();
    apiResponse.meals.forEach(function (ingredient) {
        $('#ingredientsRow').append(`
            <div class="col-md-3">
                <div class="inner ingredient py-3 rounded-2 text-center text-white">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ingredient.strIngredient}</h3>
                        <p>${ingredient.strDescription ? ingredient.strDescription.substring(0, 150) + "..." : ingredient.strDescription}</p>
                </div>
            </div>
        `);
    });

    $('.ingredient').on('click', function () {
        displayIngredientsMeals($(this).find('h3').text());
    });
}

async function displayIngredientsMeals(ingredientName) {
    $("#ingredientsContainer").addClass("d-none");
    $("main").removeClass("d-none");
    displayMeals(`filter.php?i=${ingredientName}`)
}

function validateInput(input, regex) {
    let value = input.value;
    if (regex.test(value)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
    } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
    }
}

function isConfirm() {
    if ($("#contactPassword").val() == $("#confirm").val()) {
        $("#confirm").addClass("is-valid");
        $("#confirm").removeClass("is-invalid");
    } else {
        $("#confirm").addClass("is-invalid");
        $("#confirm").removeClass("is-valid");
    }
}



// * events
// --------------------------------- [ home ] -------------
$(document).ready(async function () {
    hideLoading();
    collapseAside();
    displayMeals('search.php?s=');
});

// -------------------------------- [ aside ] -------------
$("#closeIcon").on("click", collapseAside);

$("#menuIcon").on("click", function () {
    $("#menuIcon").hide();
    $("#closeIcon").show();
    $("#openMenu").removeClass("d-none");

    $(".sideLinks ul li").each(function (index) {
        $(this).css("top", -$(this).outerHeight());
        $(this).delay((index + 1) * 100).animate({ top: 0 }, 500);
    });

});

// ------------------------------- [ search ] ------------------
$("#searchBtn").on("click", function () {
    $("#searchContainer").removeClass("d-none");
    $("main").removeClass("d-none");
    $("#mealDetails").addClass("d-none");
    collapseAside();
});

$("#searchByName").on("input", function () {
    let searchValue = $(this).val();
    displayMeals(`search.php?s=${searchValue}`);
});

$("#searchByFLetter").on("input", function () {
    let searchValue = $(this).val();
    displayMeals(`search.php?f=${searchValue}`);
});


// ------------------------------- [ categories ] ------------------
$("#categoriesBtn").on("click", function () {
    $("#categoriesContainer").removeClass("d-none");
    $("main").addClass("d-none");
    $("#mealDetails").addClass("d-none");
    collapseAside();
    displayCategories();
});


// ------------------------------- [ Area ] ------------------
$("#areaBtn").on("click", function () {
    $("#areaContainer").removeClass("d-none");
    $("#categoriesContainer").addClass("d-none");
    $("main").addClass("d-none");
    $("#mealDetails").addClass("d-none");
    collapseAside();
    displayArea();
});


// ------------------------------- [ Ingredients ] ------------------
$("#ingredientsBtn").on("click", function () {
    $("#ingredientsContainer").removeClass("d-none");
    $("#areaContainer").addClass("d-none");
    $("#categoriesContainer").addClass("d-none");
    $("main").addClass("d-none");
    $("#mealDetails").addClass("d-none");
    collapseAside();
    displayIngredients();
});


// ------------------------------- [ Contact ] ------------------
$("#contactBtn").on("click", function () {
    $("#contactContainer").removeClass("d-none");
    $("#ingredientsContainer").addClass("d-none");
    $("#areaContainer").addClass("d-none");
    $("#categoriesContainer").addClass("d-none");
    $("main").addClass("d-none");
    $("#mealDetails").addClass("d-none");
    collapseAside();

    let contactInputs = document.querySelectorAll("#contactRow input");

    for (let input of contactInputs) {
        input.addEventListener("keyup", function () {
            if (input.id !== "confirm") {
                validateInput(this, formRegex[`${this.id}`]);
            } else {
                isConfirm();
            }
            const validInputs = document.querySelectorAll(".is-valid");
            if (validInputs.length == 6) {
                $("#submitBtn").removeAttr("disabled");
            } else {
                $("#submitBtn").setAttribute("disabled", "true");
            }
        });
    }
});

