let save_assets;

function getAssets() {
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
        .then(data => {
            return data.json();
        })
        .then(data => populateSideBar(data))
        .then(data => save_assets = data)
        .then(indicateSidebarSelection())
        .catch(error => console.log(error));
}

async function getHistoryForAsset(id, interval) {
    console.log("Getting asset history for id " + id);
    const url = `https://api.coincap.io/v2/assets/${id}/history?interval=${interval}`
    console.log("calling url ", url)
    let data = fetch(url)
        // .then(data => {
        //     console.dir(data.text())
        //     return data
        // })
        .then(data => {
            return data.json()
        })
    console.log("data is ", data)
    return data

}

async function renderInfoBar(requestItem) {
    /**
     * @type 
     */
    let history_data = await getHistoryForAsset(requestItem.id, "m15")
    console.log(history_data)
    let startDate = new Date(history_data["data"][0]["time"])
    let endDate = new Date(history_data["data"][history_data["data"].length - 1]["time"])

    let adjusted_date = new Date();
    adjusted_date.setDate(endDate.getDate() - 1)
    startDate = adjusted_date
    /**
     * @type []
     */
    let h24_bucket = history_data["data"].filter(
        (ele) => {
            return new Date(ele["time"]) > startDate
        }
    )
    console.log(h24_bucket)


    document.querySelector("#main-content").innerHTML = `
            <div class="info-bar flex-row">
                <div class="info-bar-interval flex-row">
                    <label>Time Interval: </label>
                    <output> 1 Day</output>
                    <section class="vertial-bar"></section>
                    <section class="vertial-bar"></section>

                </div>
                <div class="info-bar-start-date flex-row">
                    <label>Start Date: </label>
                    <output> ${startDate.toLocaleDateString("en-US")}</output>
                    <section class="vertial-bar"></section>
                    <section class="vertial-bar"></section>

                </div>
                <div class="info-bar-end-date flex-row">
                    <label>End Date: </label>
                    <output> ${endDate.toLocaleDateString("en-US")}</output>
                    <section class="vertial-bar"></section>
                    <section class="vertial-bar"></section>

                </div>
                <div class="info-bar-rank flex-row">
                    <label>Rank: </label>
                    <output> ${requestItem["rank"]}</output>
                    <section class="vertial-bar"></section>
                    <section class="vertial-bar"></section>

                </div>
                <div class="info-bar-24-rate flex-row">
                    <label>24h Rate: </label>
                    <output> ${parseFloat(requestItem["changePercent24Hr"]).toLocaleString(undefined,{minimumFractionDigits:4})}%</output>
                </div>
            </div>
            `
}

function indicateSidebarSelection() {
    let h2 = document.createElement("h2");
    h2.textContent = "Please select a Coin to view it's data!"
    let main_content = document.getElementById("main-content")
    main_content.innerHTML = "";
    main_content.appendChild(h2);
}

function populateSideBar(listDataRAW) {
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
        if (parseFloat(element["changePercent24Hr"]) > 0) {
            // let up = document.createElement("img")
            let up = document.createElement("i")

            // up.src = "./assets/graph_down.svg"
            // up.width = "30"
            // up.height = "30"
            up.classList.add("goodArrow")
            up.classList.add("arrow")
            up.classList.add("up")
            listItem.appendChild(up)
        } else {
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
        link.addEventListener("click", () => {
            renderInfoBar(element)
        }, false)

        link.appendChild(listItem);
        list.appendChild(link);
    });
    sideBar.appendChild(list);
    return listDataRAW
}


function getDetails() {

}

let data = getAssets();


// populateSideBar(data.data)