const API_KEY = `e63a0ba9a3634e71bd60f43254e6df47`; //newsapi_key
let newsList=[];
let userInput = document.getElementById("search-input");
const menus = document.querySelectorAll(".menus button");
menus.forEach(menu=>menu.addEventListener("click",(event)=>getNewsByCategory(event)));
const sideMenu = document.querySelectorAll(".side-menu-list button")
sideMenu.forEach(menu => menu.addEventListener("click", (event)=> getNewsByCategory(event)));

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

userInput.addEventListener("keyup", (event)=> {
    if (event.keyCode === 13){
        searchNews(event);
    }
})

const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");
    if(inputArea.style.display === "none"){
        inputArea.style.display = "inline";
    } else{
        inputArea.style.display = "none";
    }
}

let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);

const getNews = async() => {
    try{
        const response = await fetch(url);

        const data = await response.json();
        if(response.status === 200){
            if(data.articles.length === 0){
                throw new Error("There are no results that match your search");
            }
            newsList = data.articles;
            render();
        } else {
            throw new Error(data.message);
        }
        
    }catch (error) {
        errorRender(error.message);
    }
    
}

const getNewsByCategory= async(event)=> {
    const category = event.target.textContent.toLowerCase();
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`);
    getNews();
}

const getLatestNews = async()=>{
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`) 
    getNews();
}

const searchNews = async() => {
    const keyword = document.getElementById("search-input").value;
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`);
    getNews();
}

const render = () => {
    const newsHTML = newsList.map(news=>
        `<div class="row news">
            <div class="col-lg-4">
                <img class="news-img-size" src="${
                    news.urlToImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
                }"/>
            </div>
            <div class="col-lg-8">
                <h2>${news.title}</h2>
                <p>${
                    news.description == null || news.description == "" ? "내용없음"
                    :news.description.length > 200 ? news.description.substring(0,200)+"..."
                    :news.description
                }</p>
                <div class="additional">${news.source.name || "no source"}  ${moment(news.publishedAt).fromNow()}
                </div>
            </div>
        </div>`
    ).join('');

    

    document.getElementById("news-board").innerHTML = newsHTML;
}

const errorRender = (errorMessage) => {
    const errorHtml = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
    </div>`;

    document.getElementById("news-board").innerHTML = errorHtml;
}

getLatestNews();