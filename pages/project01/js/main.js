let save_assets; 

function getAssets(){
    console.log("done")
    // const http = new XMLHttpRequest();
    const url = "https://api.coincap.io/v2/assets"
    // http.open("GET",url);
    // http.send();
    // http.onreadystatechange= (e)=>{
    //     if(this.readyState==4 && this.status==200){
    //         console.log(http.responseText);
    //     }
    // }   

    fetch(url)
    .then(data=>{
        return data.json();
    })
    .then(data => populateSideBar(data))
    .then(data => save_assets = data)
    .then(indicateSidebarSelection())
    .catch(error => console.log(error));
}

function indicateSidebarSelection(){
    let h2 = document.createElement("h2");
    h2.textContent = "Please select a Coin to view it's data!"
    let main_content = document.getElementById("main-content")
    main_content.innerHTML = "";
    main_content.appendChild(h2);
}

function populateSideBar(listDataRAW){
    let listData = listDataRAW["data"]
    console.log(listDataRAW)
    let sideBar = document.getElementById("side-bar")
    let list = document.createElement("ul");
    listData.forEach(element => {
        let listItem = document.createElement("li");
        let p = document.createElement("p");
        // let link = document.createElement("a");
        // link.appendChild(listItem);

        let text = element["name"]
        p.innerText = text
        listItem.appendChild(p);
        if(parseFloat(element["changePercent24Hr"]) > 0){
            let up = document.createElement("i")
            up.classList.add("goodArrow")
            up.classList.add("arrow")
            up.classList.add("up")
            listItem.appendChild(up)
        }else{
            let down = document.createElement("i")
            down.classList.add("badArrow")
            down.classList.add("arrow")
            down.classList.add("down")
            listItem.appendChild(down)
        }
       
        console.log(element)
        console.log(listItem)

        let link = document.createElement("a");
        link.href = "#"
        link.appendChild(listItem);
        list.appendChild(link);
    });
    sideBar.appendChild(list);
    return listDataRAW
}


function getDetails(){

}

let data = getAssets();


// populateSideBar(data.data)
