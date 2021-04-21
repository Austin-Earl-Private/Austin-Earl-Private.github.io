const links =[
    {
        label: "Week 01 Notes",
        url: "pages/week01/week1.html"
    }
]

function getLinks(){
    var list = document.getElementById("custom-list");
    links.forEach(element => {
        var listItem = document.createElement('a');
        listItem.href = element.url;
        listItem.innerText = element.label;
        list.appendChild(listItem);
    });
}