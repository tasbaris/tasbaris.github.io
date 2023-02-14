let daily = document.getElementById("daily");
let weekly = document.getElementById("weekly");
let monthly = document.getElementById("monthly");
let dashboard = document.querySelector(".dashboard");
const color = ["hsl(15, 100%, 70%)","hsl(195, 74%, 62%)","hsl(348, 100%, 68%)","hsl(145, 58%, 55%)","hsl(264, 64%, 52%)","hsl(43, 84%, 65%)"];
const img = ["work","play","study","exercise","social","self-care"];
let data;

fetch('./data.json')
    .then(response => response.json())
    .then(rdata => {
        data = rdata;
createBox("weekly","Week");
        
    });


daily.addEventListener("click",function(){
    btnControl("daily");
    createBox("daily","Day");
});
weekly.addEventListener("click",function(){
    btnControl("weekly");
    createBox("weekly","Week");
});
monthly.addEventListener("click",function(){
    btnControl("monthly");
    createBox("monthly","Month");
});
 function clearBox(){
    dashboard.innerHTML = "";
 }

function createBox(time,timeframe) {
    clearBox();
    data.forEach(function(activity,index) {
        let box = '<div class="box '+(activity.title).replace(' ','')+'" style="--clr:'+color[index]+';">';
        box += '<div class="box-info">';
        box += '<div class="title-row">';
        box += '<h2 class="box-title">'+activity.title+'</h2>';
        box += '<a href="#"><img src="./images/icon-ellipsis.svg" alt="More Icon" class="more-icon"></a>';
        box += '</div>'
        box += '<div class="time">';
        box += '<h3 class="current-time">'+activity.timeframes[time].current+'hrs</h3>';
        box += '<p class="last-time">Last '+timeframe+' - '+activity.timeframes[time].previous+'hrs</p>';
        box += '</div></div></div>';
        dashboard.innerHTML += box;
        document.querySelector("."+activity.title.replace(' ','')).style.setProperty("--img",'url("./images/icon-'+img[index]+'.svg")');
    });
}

function btnControl(time) {
    switch (time) {
        case "daily":
            daily.className != "active" ? daily.classList.add("active") : "";
            weekly.classList.remove("active");
            monthly.classList.remove("active");
            break;
        case "weekly":
            weekly.className != "active" ? weekly.classList.add("active") : "";
            daily.classList.remove("active");
            monthly.classList.remove("active");
            break;
        case "monthly":
            monthly.className != "active" ? monthly.classList.add("active") : "";
            daily.classList.remove("active");
            weekly.classList.remove("active");
            break;
    }
}