let TEMPLATE;
const storage = window.localStorage.getItem("card_json");
if(storage) {
    TEMPLATE = JSON.parse(storage);
}

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".file-input").addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.classList.add("input");
        input.style.position = "absolute";
        input.style.top = "-100px";
        input.onchange = handleFile;
        document.body.appendChild(input);
        document.querySelector(".input").click();
    });

   

})
console.log(window.XLSX)
function handleFile(event) {
    var file = event.target.files[0];
    document.querySelector(".input").remove();
    var reader = new FileReader();

    reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, { type: 'array' });

        // Mendapatkan nama sheet pertama dari workbook
        var sheetName = workbook.SheetNames[0];

        // Mengonversi sheet ke objek JSON
        var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(jsonData);
        renderCard(jsonData);
        // Menampilkan hasil JSON pada elemen dengan ID "json-output"
        // document.getElementById('json-output').textContent = JSON.stringify(jsonData, null, 2);
    };

    reader.readAsArrayBuffer(file);
}

// Fungsi untuk mengganti placeholder dengan data yang sesuai
function replacePlaceholders(template, data) {
    // Mengganti placeholder dengan nilai yang sesuai menggunakan metode replace()
    return template.replace(/{(.*?)}/g, function(match, key) {
        // Mengambil nilai dari objek data berdasarkan kunci (key)
        return data[key.trim()] || match;
    });
}

function getTemp(property) {
    const find = TEMPLATE.findIndex(Obj => Obj.property === property);
    if(find === -1) return {};
    return TEMPLATE[find];
}

function renderCard(data) {
    if(!TEMPLATE) return alert("Please select a template");
    console.log(data);
    for(const key of data) {
        const card = document.createElement("div");
        card.classList.add("card");
        const settings = getTemp("settings");
        card.style.width = settings.size.width;
        card.style.height = settings.size.height;
        card.style.position = "relative";
        card.style.backgroundImage = "url(" + settings.backgroundImage + ")";
        card.style.backgroundSize = "100%";
        let BARCODE = [];
        let drags = [];
        for(const c of TEMPLATE) {
            console.log(c.width);
            if(c.property !== "settings") {
                switch(c.property) {
                    case "text" : 
                        const text = document.createElement("div");
                        text.classList.add(c.class);
                        text.innerText = c.value;
                        text.style.position = "absolute";
                        text.style.width = c.width + "px";
                        text.style.height = c.height + "px";
                        text.style.top = c.position.top + "px";
                        text.style.left = c.position.left + "px";
                        text.style.color = c.color || "black";
                        text.style.fontWeight = c.fontWeight || "normal";
                        text.style.fontSize = (c.fontSize || 10) + "px";

                        card.appendChild(text);
                        drags.push(c.class);
                    break;
                    case "photo" : 
                        const photo = document.createElement("div");
                        photo.classList.add(c.class);
                        photo.src = c.value;
                        photo.style.border = "1px solid #000";
                        photo.innerText = "Photo";
                        photo.style.fontSize = "10px";
                        photo.style.display = 'flex';
                        photo.style.justifyContent = "center";
                        photo.style.alignItems = "center";
                        photo.style.position = "absolute";
                        photo.style.width = c.width + "px";
                        photo.style.height = c.height + "px";
                        photo.style.top = c.position.top +  "px";
                        photo.style.left = c.position.left + "px";

                        card.appendChild(photo);
                        drags.push(c.class);
                    break;
                    case "barcode" :
                        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        const className = c.class;
                        svg.classList.add(className);
                        BARCODE.push(className);
                        svg.style.position = "absolute";
                        svg.style.top = c.position.top;
                        svg.style.left = c.position.left;
                        
                        svg.setAttribute("jsbarcode-format", "CODE128");
                        svg.setAttribute("jsbarcode-value", 123456);
                        svg.setAttribute("jsbarcode-textmargin", "0");
                        svg.setAttribute("jsbarcode-height", c.height);
                        svg.setAttribute("jsbarcode-width", c.width);
                        svg.setAttribute("jsbarcode-displayvalue", "false");

                        card.appendChild(svg);
                        drags.push(c.class);
                    break;
                }
            }
        }

        document.querySelector(".page").appendChild(card);
        for(const b of BARCODE) {
            console.log(b);
            JsBarcode("."+ b).init();
        }
    }
}

function generateRandomText() {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy0123456789".split("").sort((a,b) => Math.random() - .5).join("").substring(0, 10);
}
