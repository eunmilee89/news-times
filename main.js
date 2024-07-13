const API_KEY = `e63a0ba9a3634e71bd60f43254e6df47`; //api_key
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

let totalResults = 0;
let page =1;
const pageSize = 10;
const groupSize = 5;

const getNews = async() => {
    try{
        url.searchParams.set("page",page); // => &page=page
        url.searchParams.set("pageSize", pageSize); // => &pageSize=pageSize

        const response = await fetch(url);
        let data = await response.json();
        if(response.status === 200){
            if(data.articles.length === 0){
                throw new Error("There are no results that match your search");
            }
            newsList = data.articles;
            totalResults = data.totalResults;
            render();
            paginationRender();
        } else {
            throw new Error(data.message);
        }
        
    }catch (error) {
        errorRender(error.message);
    }
    
}

const getNewsByCategory= async(event)=> {
    page = 1;
    const category = event.target.textContent.toLowerCase();
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`);
    await getNews();
}

const getLatestNews = async()=>{
    page = 1;
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`) 
    await getNews();
}

const searchNews = async() => {
    page = 1;
    const keyword = document.getElementById("search-input").value;
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`);
    await getNews();
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

const paginationRender = () => {
    const totalPages = Math.ceil(totalResults/pageSize);
    const pageGroup = Math.ceil(page/groupSize);
    let lastPage = pageGroup * groupSize;
    let paginationHTML = ``;

    if(lastPage > totalPages){
        lastPage = totalPages;
    }
    const firstPage = lastPage - (groupSize - 1)<= 0? 1 : lastPage - (groupSize - 1);

    if(page > 1){
        paginationHTML = `
        <li class="page-item" onclick="moveToPage(1)"><a class="page-link" href="#">&lt;&lt;</a></li>
        <li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link" href="#">&lt;</a></li>`;
    }
    
    for(let i=firstPage;i<=lastPage;i++){
        paginationHTML += `<li class="page-item ${
            i===page? "active":""
        }" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`;
    }
    if(page < totalPages){
        paginationHTML += `
        <li class="page-item" onclick="moveToPage(${page+1})" ><a class="page-link" href="#">&gt;</a></li>
        <li class="page-item" onclick="moveToPage(${totalPages})" ><a class="page-link" href="#">&gt;&gt;</a></li>`
    }
    
    document.querySelector(".pagination").innerHTML = paginationHTML;
}

const moveToPage = (pageNum) => {
    page = pageNum;
    getNews();
}

getLatestNews();