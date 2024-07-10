const API_KEY = `e63a0ba9a3634e71bd60f43254e6df47`;
//newsapi_key
let newsList=[];
const menus = document.querySelectorAll(".menus button");
menus.forEach(menu=>menu.addEventListener("click",(event)=>getNewsByCategory(event)))

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");
    if(inputArea.style.display === "inline"){
        inputArea.style.display = "none";
    } else{
        inputArea.style.display = "inline";
    }
}

const getNewsByCategory= async(event)=> {
    const category = event.target.textContent.toLowerCase();
    console.log(category);
    const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
}

const getLatestNews = async()=>{
    const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`) 
    
    console.log(url);
    
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
    console.log(newsList);
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
                <div>${news.source.name || "no source"}  ${moment(news.publishedAt).fromNow()}
                </div>
            </div>
        </div>`
    ).join('');

    

    document.getElementById("news-board").innerHTML = newsHTML;
}

getLatestNews();