const API_KEY = `e63a0ba9a3634e71bd60f43254e6df47`;
//newsapi_key

let news=[];
const getLatestNews = async()=>{
    const url = new URL(`https://newstimes-1.netlify.app/top-headlines`) 
    
    console.log(url);
    
    const response = await fetch(url);
    const data = await response.json();
    news = data.articles;
    console.log(news);
}

getLatestNews();