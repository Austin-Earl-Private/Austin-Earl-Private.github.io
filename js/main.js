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
    }
    {
        label: "Week 04 Notes",
        url: "pages/week04/week4.html"
    }
]

function getLinks(){
    var list = document.getElementsByClassName("custom-list")[0];
    links.forEach(element => {
        var listItem = document.createElement('a');
        listItem.href = element.url;
        listItem.innerText = element.label;
        list.appendChild(listItem);
    });
}