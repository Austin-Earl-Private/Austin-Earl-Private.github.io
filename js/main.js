const links =[
    {
        label: "Week 01 Notes",
        url: "pages/week01/week1.html"
    },
    {
        label: "Week 02 Notes",
        url: "pages/week02/week2.html"
    },
    {
        label: "Week 03 Notes",
        url: "pages/week03/week3.html"
    },
    {
        label: "Week 04 Notes",
        url: "pages/week04/week4.html"
    },
    {
        label: "Week 05 Notes",
        url: "pages/week05/week5.html"
    }
]
const current_project = {name:"Crypto Data viewer!",link:"./pages/project01/index.html",decription:"This project is a crypto coin viewer project written in html, css ,and vanilla js. There are no libraries in this project! WIP"}

function getLinks(){
    var list = document.getElementsByClassName("custom-list")[0];
    links.forEach(element => {
        var listItem = document.createElement('li');
        var link = document.createElement('a');
        link.href = element.url;
        link.innerText = element.label;
        listItem.appendChild(link)
        list.appendChild(listItem);
    });
}

document.getElementById("current-project").textContent = current_project.name;
document.getElementById("current-project").href = current_project.link;
document.getElementById("current-project-desciption").textContent = current_project.decription;
