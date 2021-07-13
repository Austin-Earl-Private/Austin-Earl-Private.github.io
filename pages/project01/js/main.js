import Graph from "./ChartGraph.js";
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

async function getAssetInformation(id) {
    console.log("done")
    // const http = new XMLHttpRequest();
    const url = `https://api.coincap.io/v2/assets/${id}`
    let data = await fetch(url)
        .then(data => {
            return data.json();
        })
        .catch(error => console.log(error));
    console.log("asset info ", data)
    return data
}

async function getHistoryForAsset(id, interval) {
    console.log("Getting asset history for id " + id);
    const url = `https://api.coincap.io/v2/assets/${id}/history?interval=${interval}`
    let data = fetch(url)
        .then(data => {
            return data.json()
        })
    return data

}


async function renderGraph(id, interval) {
    let main_content = document.querySelector("#graph-placer")
    main_content.innerHTML = `
    <div class="graph">
    <canvas id="myCanvas" class="myCanvas"  >
      Sorry! Your browser doesn’t support Canvas.
  </canvas>
  </div>
    `


    var canvas = document.getElementById("myCanvas");
    let graphControler = new Graph(canvas, "line");


    let history_data = await getHistoryForAsset(id, "m15")
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
    let x_values = []
    let y_values = []
    let count = 0
    h24_bucket.forEach(ele => {
        count += 10
        x_values.push(count)
        y_values.push(parseFloat(ele.priceUsd))
    })

    graphControler.insertPoints(x_values, y_values);
    graphControler.renderGraph(0, 0);

    graphControler.canvas.onmousemove = function (e) {
        var rect = this.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top,
            i = 0,
            r;

        graphControler.renderGraph(x, y)
    }


}

async function initRenderMainContent() {
    let main_content = document.querySelector("#main-content")
    main_content.innerHTML = `
    <div id="info-bar-placer">
    
    </div>
    <div id="graph-placer">
    
    </div>
    <div id="columns">
        <div id="markets-placer">
        
        </div>
        <div id="exchanges-placer">
    
        </div>
    </div>
    `
}

async function getMarkets(id, limit) {
    const url = `https://api.coincap.io/v2/assets/${id}/markets?limit=${limit}`

    fetch(url)
        .then(data => {
            return data.json();
        })
        .then(data => renderMarkets(data)).then(console.log("Rendered markets"))
        .catch(error => console.log(error));

}
async function getMarketLinkMap() {
    const url = `https://api.coincap.io/v2/exchanges`
    let map = new Map()
    return fetch(url)
        .then(data => {

            return data.json();

        }).then(data => {
            console.log("data is ", data)
            data["data"].forEach(ele => {
                map.set(ele["name"], ele["exchangeUrl"])
            })
            return map
        })
        .then(console.log("Rendered markets"))
        .catch(error => console.log(error));

}

async function renderMarkets(requestItems) {
    /**
     * @type {Map}
     */
    let map = await getMarketLinkMap();
    console.log(map)
    let templateStart = `
    <table>
        <tr>
            <th>Market</th>
            <th>Base Currency</th>
            <th>Quote Currency</th>
            <th>Volume in Past 24 hr</th>
            <th>USD Price</th>
            <th>Total Volume Percent</th>
        </tr>
    `
    let templateMiddle = ``
    // `<tr>
    //     <td>Binance | BTC to USDT | Volume: 277775213.1923 | USD Price: 6263.8645 | Volume Percent: 7.4239%</td>
    // </tr>
    // <tr>
    //     <td>Binance | BTC to USDT | Volume: 277775213.1923 | USD Price: 6263.8645 | Volume Percent: 7.4239%</td>
    // </tr>
    // <tr>
    //     <td>Binance | BTC to USDT | Volume: 277775213.1923 | USD Price: 6263.8645 | Volume Percent: 7.4239%</td>
    // </tr>`
    let templateEnd = `
    </table>
    `

    requestItems["data"].forEach(ele => {
        // console.log(ele, templateMiddle)

        let exchangeId = ele["exchangeId"]
        let exchangeUrl = map.get(exchangeId)
        let baseSymbol = ele["baseSymbol"]
        let quoteSymbol = ele["quoteSymbol"]

        let volumeUsd24Hr = parseFloat(ele["volumeUsd24Hr"]).toLocaleString(undefined, {
            minimumFractionDigits: 4
        })
        let priceUsd = parseFloat(ele["priceUsd"]).toLocaleString(undefined, {
            minimumFractionDigits: 4
        })
        let volumePercent = parseFloat(ele["volumePercent"]).toLocaleString(undefined, {
            minimumFractionDigits: 4
        })


        // console.log(exchangeId, exchangeUrl, baseSymbol, quoteSymbol, volumeUsd24Hr, "raw", ele["volumeUsd24Hr"], priceUsd, volumePercent, "raw", ele["volumePercent"])
        templateMiddle = templateMiddle.concat(`
        <tr>
        <td><a href="${exchangeUrl}">${exchangeId} </a></td>
        <td> ${baseSymbol} </td>
        <td> ${quoteSymbol} </td>
        <td> ${volumeUsd24Hr} </td>
        <td> ${priceUsd} </td>
        <td> ${volumePercent}%</td>
   </tr>`)

    })

    document.querySelector("#markets-placer").innerHTML = templateStart + templateMiddle + templateEnd

}

async function renderInfoBar(requestItem) {
    /**
     * @type 
     */
    let history_data = await getHistoryForAsset(requestItem.id, "m15")
    let price = await getAssetInformation(requestItem.id)
    price = price["data"]
    console.log(price)
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


    document.querySelector("#info-bar-placer").innerHTML = `
            <div class="info-bar flex-row">
                <div class="info-bar-name flex-row">
                    <label>Name: </label>
                    <output> ${requestItem["name"]}</output>
                    <section class="vertial-bar"></section>
                    <section class="vertial-bar"></section>

                </div>
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
                    <section class="vertial-bar"></section>
                    <section class="vertial-bar"></section>
                </div>
                <div class="info-bar-usd flex-row">
                    <label>Price: </label>
                    <output>$${parseFloat(price.priceUsd)}</output>
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
            initRenderMainContent().then(
                renderInfoBar(element)
            ).then(
                renderGraph(element.id)
            ).then(
                getMarkets(element.id, 10)
            )

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