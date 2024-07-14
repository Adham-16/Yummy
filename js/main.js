// show spinner on load
let spinner = $(".loading-spinner")
let MainContent = $(".Main-Content")
let leftNavbar = $(".left-navbar")

$(document).ready(() => {
    SearchByName('').then( ()=>{
       $(".loading-spinner").fadeOut(500)
        $(".Main-Content").fadeIn(1000);
    })
})

//  open nav and close nav

function openSideNav() {
    $(".left-navbar").animate({
        left: 0
    }, 500)
    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");
    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 80)
    }
}

function closeSideNav() {
    let width = $(".left-navbar .nav-in").outerWidth()
    $(".left-navbar").animate({
        left: -width
    }, 500)
    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");
    $(".links li").animate({
        top: 200
    }, 200)
}

closeSideNav()
$(".nav-out .close-nav").click(() => {
    if ($(".left-navbar").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})

function displayMeals(arr) {
    let meals = arr.meals
    if (meals != null) {
    let Box = ``
    for (let i = 0; i < Math.min(20, meals.length); i++) {
        Box +=
            `
        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
            <div class="food position-relative rounded-2 overflow-hidden "  onclick="mealDetails('${meals[i].idMeal}')">
                    <img src="${meals[i].strMealThumb}" class="w-100" alt="food" />
                <div class="layer position-absolute d-flex align-items-center justify-content-center text-black p-2">
                    <h3>${meals[i].strMeal}</h3>
                </div>
            </div>
        </div> 
        `
        
    }
    $(".Box-Of-Meals").html(Box)
    }else{
    $(".Box-Of-Meals").html('')
    }
}
    // <!----------------------Start search -------------------->
$("#Search").click(function () { 
    $(".Box-Of-Meals").html('')
    closeSideNav()
    showSearch()
});
function showSearch() {
    $(".search-area").html(`
        <div class="row py-4">
            <div class="col-md-6 col-sm-12">
                <input onkeyup="SearchByName(this.value)" class="form-control bg-transparent change-placeholder-color text-white" type="text" name="search" placeholder="Search By Name" />
            </div>
            <div class="col-md-6 col-sm-12">
                <input onkeyup="SearchFirstLetter(this.value)" class="form-control bg-transparent change-placeholder-color text-white" type="text" name="search" maxlength="1" placeholder="Search By First Letter" />
            </div>
        </div>
        
        `)
}

async function SearchByName(term) {
        let Meals = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        let Data = await Meals.json();
        displayMeals(Data)
        closeSideNav()
}


async function SearchFirstLetter(term) {
    let Meals = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
    let Data = await Meals.json();
    displayMeals(Data)
    closeSideNav()
}
    // <!----------------------End search ---------------------->
    // <!----------------------Start Show Details -------------------->
async function mealDetails(id) {
    let Meals = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let Data = await Meals.json();
    $(".Box-Of-Meals").html('')
    $(".search-area").html('')
    closeSideNav()
    showMealDetails(Data)
}
function showMealDetails(details) {
    let Data = details.meals[0]
    let Recipes = ``
    let tagsGroup = ``
    let tags = []
    for (let i = 1; i <= 20; i++) {
        if (Data[`strIngredient${i}`]) {
            Recipes += `<li class="alert alert-info m-2 p-1">${Data[`strMeasure${i}`]} ${Data[`strIngredient${i}`]}</li>`
        }
    }
    if (Data.strTags != null) {
      tags = Data.strTags.split(',');
      for (let i = 0; i < tags.length; ++i) {
         tagsGroup += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
      }
   } else {
      tagsGroup = `<li class="alert alert-danger m-2 p-1">None</li>`;
   }
   
    $(".Box-Of-Meals").html(`
        <div class="col-md-4">
            <div class="left-side">
                <img src="${Data.strMealThumb}" class="w-100 rounded-2" alt="food thumbnail " />
                <h2 class="text-white">${Data.strMeal}</h2>
            </div>
        </div>
        <div class="col-md-8">
            <div class="right-side text-white">
                <h2>Instructions</h2>
                <p>${Data.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span> ${Data.strArea} </h3>
                <h3><span class="fw-bolder">Category : </span> ${Data.strCategory} </h3>
                <h3>Recipes :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap">
                        ${Recipes}
                    </ul>
                <h3>Tags :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap">
                        ${tagsGroup}
                    </ul>
                <a target="_blank" class="btn btn-success" href="${Data.strSource}">Source</a>
                <a target="_blank" class="btn btn-danger" href="${Data.strYoutube}">Youtube</a>
            </div>
        </div>
        `)

}

    // <!----------------------End Show Details ---------------------->
    // <!----------------------Start Filter by Category -------------------->
    $("#Categories").click(function () { 
        $(".Box-Of-Meals").html('')
        $(".search-area").html('')
        closeSideNav()
        categories()
    });
async function categories() {
    let Meals = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let Data = await Meals.json();
    
    showCategories(Data.categories)
}
function showCategories(arr) {
    let Categories = ``
    for (let i = 0; i < Math.min(20, arr.length); i++) {
        Categories +=`
         <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
            <div class="food position-relative rounded-2 overflow-hidden" onclick="filterByCategory('${arr[i].strCategory}')">
              <img src="${arr[i].strCategoryThumb}" class="w-100" alt="food" />
              <div
                class="layer text-center position-absolute overflow-hidden text-black p-2"
              >
                <h3> ${arr[i].strCategory} </h3>
                <p> ${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
              </div>
            </div>
          </div>
        `
    }
    $(".Box-Of-Meals").html(Categories)
}
async function filterByCategory(Category) {
    let Meals = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${Category}`);
    let Data = await Meals.json();
    displayMeals(Data)
    closeSideNav()
}
    // <!----------------------End Filter by Category ---------------------->
    // <!----------------------Start Filter by Area -------------------->
    $("#Area").click(function () { 
        $(".Box-Of-Meals").html('')
        $(".search-area").html('')
        closeSideNav()
        area()
    });
async function area() {
    let Meals = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let Data = await Meals.json();
    showArea(Data.meals)
    closeSideNav()
}
function showArea(arr) {
    
    let Area = ``
    for (let i = 0; i < arr.length; i++) {
        Area +=`
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                <div class="food text-center rounded-2 "   onclick="filterByArea('${arr[i].strArea}')" >
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${arr[i].strArea}</h3>
                </div>
            </div>
        `
    }
    $(".Box-Of-Meals").html(Area)
}
async function filterByArea(Area) {
    let Meals = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${Area}`);
    let Data = await Meals.json();
    displayMeals(Data)
    closeSideNav()
}
    // <!----------------------End Filter by Area ---------------------->
    // <!----------------------Start Filter by main ingredient -------------------->
    $("#Ingredients").click(function () { 
        $(".Box-Of-Meals").html('')
        $(".search-area").html('')
        closeSideNav()
        Ingredients()
    });
async function Ingredients() {
    let Meals = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let Data = await Meals.json();
    showIngredient(Data.meals)
    closeSideNav()
}
function showIngredient(arr) {

    let Ingredient = ``
    for (let i = 0; i < Math.min(20, arr.length); i++) {
        Ingredient +=`
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                <div class="food text-center rounded-2 "   onclick="filterByIngredient('${arr[i].strIngredient}')" >
                    <img src="https://www.themealdb.com/images/ingredients/${arr[i].strIngredient}.png" class="w-50">
                    <h3>${arr[i].strIngredient}</h3>
                    <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
            </div>
        `
    }
    $(".Box-Of-Meals").html(Ingredient)
}
async function filterByIngredient(Ingredient) {
    let Meals = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${Ingredient}`);
    let Data = await Meals.json();
    displayMeals(Data)
    closeSideNav()
}
    // <!----------------------End Filter by main ingredient ---------------------->


const nameRegex = /^[\w\s]*[^\d\W_][\w\s]*$/i;
const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/i;
const phoneRegex = /^(?!.{0,7}$)\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{4,10}$/;
const ageRegex = /^(?:1[0-1][0-9]|[1-9]?[1-9])$|^120$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

function nameValidation() {
    return nameRegex.test($('.get-Name').val());
}
function emailValidation() {
   return emailRegex.test($('.get-Email').val());
}
function numberValidation() {
    return phoneRegex.test($('.get-Phone').val());
}
function ageValidation() {
    return ageRegex.test($('.get-Age').val());
}

function passwordValidation() {
    return passwordRegex.test($('.get-Password').val());
}
function rePasswordValidation() {
    return ($('.get-Password').val() == $('.re-Password').val());
}

function nameInputCheck() {
    if (nameValidation()) {
        
        $(".get-Name").addClass("is-valid");
        $(".get-Name").removeClass("is-invalid");
        $("#nameAlert").addClass("d-none");
    
    }
    else {
        
        $(".get-Name").addClass("is-invalid");
        $(".get-Name").removeClass("is-valid");
        $("#nameAlert").removeClass("d-none");
    }
    if ($('.get-Name').val() == "") {
        $(".get-Name").removeClass("is-invalid");
        $(".get-Name").removeClass("is-valid");
        $("#nameAlert").addClass("d-none");
    }
    inputsCheck()
    closeSideNav()

}

function emailInputCheck() {
    if (emailValidation()) {
        
        $(".get-Email").addClass("is-valid");
        $(".get-Email").removeClass("is-invalid");
        $("#emailAlert").addClass("d-none");
    
    }
    else {
        
        $(".get-Email").removeClass("is-valid");
        $(".get-Email").addClass("is-invalid");
        $("#emailAlert").removeClass("d-none");
    }
    if ($('.get-Email').val() == "") {
        $(".get-Email").removeClass("is-invalid");
        $(".get-Email").removeClass("is-valid");
        $("#emailAlert").addClass("d-none");
    }
    inputsCheck()
    closeSideNav()
}

function numberInputCheck() {
    if (numberValidation()) {
        
        $(".get-Phone").addClass("is-valid");
        $(".get-Phone").removeClass("is-invalid");
        $("#phoneAlert").addClass("d-none");
    
    }
    else {
    
        $(".get-Phone").removeClass("is-valid");
        $(".get-Phone").addClass("is-invalid");
        $("#phoneAlert").removeClass("d-none");
    }
    if ($('.get-Phone').val() == "") {
        $(".get-Phone").removeClass("is-invalid");
        $(".get-Phone").removeClass("is-valid");
        $("#phoneAlert").addClass("d-none");
    }
    inputsCheck()
    closeSideNav()
}


function ageInputCheck() {
    if (ageValidation()) {
        
        $(".get-Age").addClass("is-valid");
        $(".get-Age").removeClass("is-invalid");
        $("#ageAlert").addClass("d-none");
    }
    else {
        
        $(".get-Age").removeClass("is-valid");
        $(".get-Age").addClass("is-invalid");
        $("#ageAlert").removeClass("d-none");
    }
    if ($('.get-Age').val() == "") {
        $(".get-Age").removeClass("is-invalid");
        $(".get-Age").removeClass("is-valid");
        $("#ageAlert").addClass("d-none");
    }
    inputsCheck()
    closeSideNav()
}


function passwordInputCheck() {
    if (passwordValidation()) {
        
        $(".get-Password").addClass("is-valid");
        $(".get-Password").removeClass("is-invalid");
        $("#passwordAlert").addClass("d-none");
    }
    else {
        
        $(".get-Password").removeClass("is-valid");
        $(".get-Password").addClass("is-invalid");
        $("#passwordAlert").removeClass("d-none");
    }
    if ($('.get-Password').val() == "") {
        $(".get-Password").removeClass("is-invalid");
        $(".get-Password").removeClass("is-valid");
        $("#passwordAlert").addClass("d-none");
    }
    inputsCheck()
    closeSideNav()
}


function rePasswordInputCheck() {
    if (rePasswordValidation()) {
        
        $(".re-Password").addClass("is-valid");
        $(".re-Password").removeClass("is-invalid");
        $("#rePasswordAlert").addClass("d-none");
    }
    else {
        
        $(".re-Password").removeClass("is-valid");
        $(".re-Password").addClass("is-invalid");
        $("#rePasswordAlert").removeClass("d-none");
    }
    if ($('.re-Password').val() == "") {
        $(".re-Password").removeClass("is-invalid");
        $(".re-Password").removeClass("is-valid");
        $("#rePasswordAlert").addClass("d-none");
    }
    inputsCheck()
    closeSideNav()
}
function inputsCheck() {
    if (nameValidation() && emailValidation() && numberValidation() && ageValidation() && passwordValidation() && rePasswordValidation()) {
        $('#submit').removeClass("disabled");
    } else {
        $('#submit').addClass("disabled");
    }
}  

$('#Contact-Us').on('click', function () {
    $(".Box-Of-Meals").html('');
    $('#search_area').html('');
    closeSideNav()
    $('.Box-Of-Meals').html(`
        <div class="contact-us min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input onkeyup="nameInputCheck()" type="text" class="form-control get-Name" placeholder="Enter Your Name" />
                            <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none" >
                                Special characters and numbers not allowed
                            </div>
                    </div>
                    <div class="col-md-6">
                        <input onkeyup="emailInputCheck()" type="email" class="form-control get-Email" placeholder="Enter Your Email" />
                            <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none" >
                                Email not valid *exemple@yyy.zzz
                            </div>
                    </div>
                    <div class="col-md-6">
                        <input onkeyup="numberInputCheck()" type="text" class="form-control get-Phone" placeholder="Enter Your Phone" />
                            <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none" >
                                Enter valid Phone Number
                            </div>
                    </div>
                    <div class="col-md-6">
                        <input onkeyup="ageInputCheck()" type="number" class="form-control get-Age" placeholder="Enter Your Age"/>
                            <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                                Enter valid age
                            </div>
                    </div>
                    <div class="col-md-6">
                        <input onkeyup="passwordInputCheck()" type="password" class="form-control get-Password" placeholder="Enter Your Password" />
                            <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none" >
                                    Enter valid password *Minimum eight characters, at least one letter and one number:* 
                            </div>
                    </div>
                    <div class="col-md-6">
                        <input onkeyup="rePasswordInputCheck()" type="password" class="form-control re-Password" placeholder="Re-Password" />
                            <div id="rePasswordAlert" class="alert alert-danger w-100 mt-2 d-none"> 
                                Enter valid RePassword 
                            </div>
                    </div>
                </div>
                <button  id="submit" class="submit btn btn-outline-danger px-2 mt-3 disabled">
                    Submit
                </button>
            </div>
        </div>
`)
})