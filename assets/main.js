// Menggunakan library JsBarcode untuk barcode


// Menggunakan library QRCode.js untuk QR code
// var qr = new QRCode(document.getElementById("qrcode"), {
//     text: "https://example.com", // URL atau data lainnya untuk QR code
//     width: 128,
//     height: 128
// });
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function generateBarCode(id, string) {
    JsBarcode(id, string, {
        format: "CODE128",
        displayValue: true,
        height : 30,
        fontSize: 11
    });
}
function generateQRCode(element, text) {
    new QRCode(element, {
        text: text, // URL atau data lainnya untuk QR code
        width: 128,
        height: 128
    });

}

let TEMPLATE = [];
const storage = window.localStorage.getItem("card_json");
if(storage) {
    TEMPLATE = JSON.parse(storage);
}
if(TEMPLATE.length > 0) {
    renderCard();
} else {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.position = "relative";
    document.querySelector(".page").appendChild(card);
}


function getTemp(property) {
    const find = TEMPLATE.findIndex(Obj => Obj.property === property);
    if(find === -1) return {};
    return TEMPLATE[find];
}

function renderCard() {
    if(!TEMPLATE) return alert("Please select a template");

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
                        text.ondblclick = function() {
                            let find = TEMPLATE.findIndex(Obj => Obj.class == c.class);
                            propertyActivity(c.class, [
                                {
                                    type : 'text',
                                    label : "Text",
                                    value : c.value,
                                    placeholder : "choose {name} or {another text}",
                                    onkeyup : function(e) {
                                        TEMPLATE[find].value = e.target.value;
                                        text.innerText = e.target.value;
                                    }
                                },
                
                                {
                                    type : 'number', 
                                    label : "height",
                                    value : c.height,
                                    onkeyup : function(e) {
                                        TEMPLATE[find].height = e.target.value;
                                        text.style.height = e.target.value + "px";
                                    }
                                },
                                {
                                    type : 'number', 
                                    label : "width",
                                    value : c.width,
                                    onkeyup : function(e) {
                                        TEMPLATE[find].width = e.target.value;
                                        text.style.width = e.target.value + "px";
                                    }
                                },
                                {
                                    type : 'number', 
                                    label : "Font Size",
                                    value : c.fontSize || "10",
                                    onkeyup : function(e) {
                                        TEMPLATE[find].fontSize = e.target.value;
                                        text.style.fontSize = e.target.value + "px";
                                    }
                                },
                                {
                                    type : "color",
                                    label : "color",
                                    value : c.color || "black",
                                    onchange : function(e) {
                                        TEMPLATE[find].color = e.target.value;
                                        text.style.color = e.target.value;
                                    }
                                },
                                {
                                    type : "select",
                                    label : "Font Weight",
                                    value : c.fontWeight || "normal",
                                    onchange : function(e) {
                                        TEMPLATE[find].fontWeight = e.target.value;
                                        text.style.fontWeight = e.target.value;
                                    }
                                }
                            ]);
                        }
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
                        photo.ondblclick = function() {
                            let find = TEMPLATE.findIndex(Obj => Obj.class == c.class);
                            propertyActivity(c.class, [
                                {
                                    type : "text",
                                    label : "Path Photo",
                                    value : c.value,
                                    onkeyup : function(e) {
                                        TEMPLATE[find].value = e.target.value;
                                    }
                                },
                
                                {
                                    type : "number",
                                    label : "Height Photo dalam px",
                                    value : c.height.replace(/px/, ""),
                                    onkeyup : function(e) {
                                        TEMPLATE[find].height = e.target.value;
                                        photo.style.height = e.target.value + "px";
                                    }
                                },
                
                                {
                                    type : "number",
                                    label : "Width Photo dalam px",
                                    value : TEMPLATE[find].width.replace(/px/, ""),
                                    onkeyup : function(e) {
                                        TEMPLATE[find].width = e.target.value;
                                        photo.style.width = e.target.value + "px";
                                    }
                                }
                            ]);
                        }
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
                        svg.ondblclick = function() {
                            let find = TEMPLATE.findIndex(Obj => Obj.class == c.class);
                            propertyActivity(className, [
                                {
                                    "type" : "text",
                                    "label" : "Tag barcode",
                                    "placeholder" : "{barcode}",
                                    value : c.value,
                                    onkeydown : function(e) {
                                        TEMPLATE[find].value = e.target.value;
                                    }
                                },
                
                                {
                                    type : "number",
                                    label : "height",
                                    value : c.height || 20,
                                    onkeydown : function(e) {
                                        TEMPLATE[find].height = e.target.value;
                                        svg.setAttribute("height", e.target.value + "px");
                                    }
                                },
                
                                {
                                    type : "number",
                                    label : "width",
                                    value : c.width || 20,
                                    onkeydown : function(e) {
                                        TEMPLATE[find].width = e.target.value;
                                        svg.setAttribute("width", e.target.value + "px");
                                    }
                                }
                            ]);
                        }
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
        for(const d of drags) {
            dragElement(d);
        }
}

function modal(callback) {
    const background = document.createElement('div');
    background.classList.add('modal');
    background.style.position = 'fixed';
    background.style.display = "flex";
    background.style.zIndex = "5000";
    background.style.left = 0;
    background.style.top = 0;
    background.style.width = "100%";
    background.style.height = "100%";
    background.style.justifyContent = "center";
    background.style.alignItems = "center";
    background.style.backgroundColor = 'rgba(188, 188, 188, 0.5)';
    const div = document.createElement('div');
    div.style.backgroundColor = 'rgba(255, 255, 255)';
    div.style.boxShadow = "0px 10px 15px -3px rgba(0,0,0,0.1)";
    div.style.padding = '0.5rem';
    div.style.borderRadius = '10px';
    div.style.position = "relative";

    div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;position:absolute; right : 5px; top : 5px;" width="16" height="16" fill="currentColor" class="close" viewBox="0 0 16 16">
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg> <div style="margin-top:0.5rem;"> ` + callback() + "</div>";
    background.appendChild(div);
    document.body.appendChild(background);

    document.querySelector(".close").addEventListener('click', function() {
        document.querySelector(".modal").remove();
    });

}

document.addEventListener("DOMContentLoaded", function() {
   

    document.querySelectorAll(".button-group button").forEach(function(e) {
        e.addEventListener("click", function(evt) {
            document.querySelectorAll(".button-group button").forEach(function(r) {
                r.classList.remove("active")
            })
            evt.target.classList.add("active");
        });
    });

    document.querySelector(".new").addEventListener("click", function() {
        modal(() => {
            return `
                <label style="font-size:1.4rem;" for="new">Select size</label>
                <select name="new" id="new">
                    <option value="cardpelajar"> Kartu pelajar 55mm x 86mm
                    <option value="cardtinggi"> Kartu pelajar 55mm x 86mm
                    <option value="cardrendah"> Kartu pelajar 55mm x 86mm
                </select>
                <div class="mt-3">
                    <button type="button">Buat Baru</button>
                </div>
            `
        });
    })

    const frame = document.querySelectorAll(".custom-frame input");
    const fx = frame[0].value;
    const fy = frame[1].value;
    frameX({value : fx});
    frameY({value : fy});

    document.querySelector(".setting-card svg").addEventListener("click", (evt) => {
        const [x,y] = [evt.x,evt.y];
        
        const div = document.createElement("div");
        div.classList.add("setting-card-active");
        div.onchange = settingCard;
        div.onmouseleave = function () {
            div.remove();
        }
        div.style.position = "fixed";
        div.style.left = (x+20) + "px";
        div.style.top =  y + "px";
        div.style.zIndex = 3000;
        const inputRange = document.createElement("input");
        inputRange.type = "range";
        inputRange.min = "0";
        inputRange.max = "100";
        const rad = document.querySelector(".card").style.borderRadius;
        inputRange.value = rad.replace("px", "");
        div.append(inputRange);
        document.body.append(div);
        
    });

    document.querySelector(".setting-bg svg").addEventListener("click", function(evt) {
        const input = document.createElement("input");
        input.classList.add("setting-bg-active");
        input.onchange = settingBg;
        input.type = "file";
        input.multiple = false;
        input.accept = "image/jpeg, image/jpg, image/png";
        input.style.opacity = 0;
        document.body.appendChild(input);
        document.querySelector(".setting-bg-active").click();
        
    });


    document.querySelector(".setting-photo svg").addEventListener("click", function(evt) {
        const div = document.createElement("div");
        div.style.border = "1px solid #000";
        const nameClass = "photo-" + generateRandomText();
        div.classList.add("photo");
        div.classList.add(nameClass);
        div.style.position = "absolute";
        div.style.cursor = "move";
        div.style.resize = "both";
        div.style.wordBreak = "break-word";
        div.style.display = "flex";
        div.style.justifyContent = "center";
        div.style.alignItems = "center";
        div.style.fontSize = "10px";
        div.draggable = true;
        const [defaultWidth, defaultHeight] = [30, 40];
        div.style.height = defaultHeight + "px";
        div.style.width = defaultWidth + "px";
        div.innerText = "Photo";
        let find = TEMPLATE.findIndex(Obj => Obj.property == "photo" && Obj.class == nameClass);
        if(find === -1) {
            TEMPLATE.push({
                property : "photo",
                class : nameClass,
                height : defaultHeight + "px",
                width : defaultWidth + "px",
                value : "{path}.jpg",
            })
            find = TEMPLATE.findIndex(Obj => Obj.property == "photo" && Obj.class == nameClass);
        }
        div.ondblclick = function() {
            console.log("test clicked");
            propertyActivity(nameClass, [
                {
                    type : "text",
                    label : "Path Photo",
                    value : TEMPLATE[find].value,
                    onkeyup : function(e) {
                        TEMPLATE[find].value = e.target.value;
                    }
                },

                {
                    type : "number",
                    label : "Height Photo dalam px",
                    value : TEMPLATE[find].height.replace(/px/, ""),
                    onkeyup : function(e) {
                        TEMPLATE[find].height = e.target.value;
                        div.style.height = e.target.value + "px";
                    }
                },

                {
                    type : "number",
                    label : "Width Photo dalam px",
                    value : TEMPLATE[find].width.replace(/px/, ""),
                    onkeyup : function(e) {
                        TEMPLATE[find].width = e.target.value;
                        div.style.width = e.target.value + "px";
                    }
                }
            ]);
        }

        document.querySelector(".card").appendChild(div);
        dragElement(nameClass);


    });
    document.querySelector(".setting-barcode svg").addEventListener("click", function(evt) {
        const div = document.createElement("div");
        div.style.padding = "0.5em";
        div.style.cursor = "move";
        const className = "barcode-" + generateRandomText();
        const idName = "barcode-" + generateRandomText();
        div.id = idName;
        div.classList.add(className);
        div.style.position = "absolute";
        div.style.zIndex = 5;
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("jsbarcode-format", "CODE128");
        svg.setAttribute("jsbarcode-value", "123456789012");
        svg.setAttribute("jsbarcode-height", "20px");
        svg.setAttribute("jsbarcode-width", "10px");
        let find = TEMPLATE.findIndex(Obj => Obj.property == "barcode" && Obj.class == className);
        if(find === -1) {
            TEMPLATE.push({
                property : "barcode",
                class : className,
                height : 20,
                value : 0,
            })
            find = TEMPLATE.findIndex(Obj => Obj.property == "barcode" && Obj.class == className);
        }
        svg.ondblclick = function() {
            propertyActivity(className, [
                {
                    "type" : "text",
                    "label" : "Tag barcode",
                    "placeholder" : "{barcode}",
                    value : "{barcode}",
                    onkeydown : function(e) {
                        TEMPLATE[find].value = e.target.value;

                    }
                },

                {
                    type : "number",
                    label : "height",
                    value : svg.getAttribute("jsbarcode-height").replace(/px/, "") || 20,
                    onkeydown : function(e) {
                        TEMPLATE[find].height = e.target.value;
                        svg.setAttribute("height", e.target.value + "px");
                    }
                },

                {
                    type : "number",
                    label : "width",
                    value : svg.getAttribute("jsbarcode-width").replace(/px/, "") || 20,
                    onkeydown : function(e) {
                        TEMPLATE[find].width = e.target.value;
                        svg.setAttribute("width", e.target.value + "px");
                    }
                }
            ]);
        }
        div.appendChild(svg);
        document.querySelector(".card").appendChild(div);

        JsBarcode(className).init();
        dragElement(className);

    });


    document.querySelector(".setting-addtext svg").addEventListener('click', function() {
        const div = document.createElement("div");
        div.style.position = "absolute";
        // div.style.padding = "0.5em";
        div.style.textAlign = "left";
        div.style.cursor = "move";
        div.style.width = "100px";
        div.innerText = "Type Text Here";
        div.contentEditable = true;
        div.style.height = "10px";
        const nameClass = "text-" + generateRandomText();
        div.classList.add(nameClass);
        div.classList.add("text-editing");
        div.style.zIndex = 6;
        let find = TEMPLATE.findIndex(Obj => Obj.property == "text" && Obj.class == nameClass);
        if(find === -1) {
            TEMPLATE.push({
                property : "text",
                class : nameClass,
                height : div.style.height.replace(/px/, ""),
                width : div.style.width.replace(/px/, ""),
                color : "#000",
                fontSize : 10,
                position : {
                    left : 0,
                    top : 0
                },
                value : div.innerText
            })
            find = TEMPLATE.findIndex(Obj => Obj.property == "text" && Obj.class == nameClass);
        }
        div.ondblclick = function() {

            propertyActivity(nameClass, [
                {
                    type : 'text',
                    label : "Text",
                    value : TEMPLATE[find].value,
                    placeholder : "choose {name} or {another text}",
                    onkeyup : function(e) {
                        TEMPLATE[find].value = e.target.value;
                        div.innerText = e.target.value;
                    }
                },

                {
                    type : 'number', 
                    label : "height",
                    value : TEMPLATE[find].height,
                    onkeyup : function(e) {
                        TEMPLATE[find].height = e.target.value;
                        div.style.height = e.target.value + "px";
                    }
                },
                {
                    type : 'number', 
                    label : "width",
                    value : TEMPLATE[find].width,
                    onkeyup : function(e) {
                        TEMPLATE[find].width = e.target.value;
                        div.style.width = e.target.value + "px";
                    }
                },
                {
                    type : 'number', 
                    label : "Font Size",
                    value : TEMPLATE[find].fontSize || "10",
                    onkeyup : function(e) {
                        TEMPLATE[find].fontSize = e.target.value;
                        div.style.fontSize = e.target.value + "px";
                    }
                },
                {
                    type : "color",
                    label : "color",
                    value : TEMPLATE[find].color || "black",
                    onchange : function(e) {
                        console.log(e);
                        TEMPLATE[find].color = e.target.value;
                        div.style.color = e.target.value;
                    }
                }
            ]);
        }
        document.querySelector(".card").appendChild(div);
        dragElement(nameClass);
    });

    document.querySelector(".saving").addEventListener("click", function() {
        // const element = document.querySelector(".card").outerHTML;
        // const form = new FormData();
        const data = JSON.stringify(TEMPLATE);
        const ab = btoa(data);
        const blob = new Blob([ab], {type: "application/text"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "card.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    document.querySelector('.savingToBrowser').addEventListener('click', () => {
        const element = document.querySelector(".card").outerHTML;
        console.log(TEMPLATE);
        window.localStorage.setItem("card", element);
        window.localStorage.setItem("card_json", JSON.stringify(TEMPLATE));
        alert("success saving");
    });

    document.querySelector(".renderLink").addEventListener("click", () => { 
        const host = window.location.hostname;
        window.location.href = "/render.html"; 
    });
});

// Fungsi untuk mengganti placeholder dengan data yang sesuai
function replacePlaceholders(template, data) {
    // Mengganti placeholder dengan nilai yang sesuai menggunakan metode replace()
    return template.replace(/{(.*?)}/g, function(match, key) {
        // Mengambil nilai dari objek data berdasarkan kunci (key)
        return data[key.trim()] || match;
    });
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.querySelector("."+ elmnt)) {
      /* if present, the header is where you move the DIV from:*/
      document.querySelector("."+ elmnt).onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
    //   console.log(pos1, pos2, pos3, pos4);
      // set the element's new position:
      const top = (document.querySelector("."+ elmnt).offsetTop - pos2);
      const left = (document.querySelector("."+ elmnt).offsetLeft - pos1);
      document.querySelector("."+ elmnt).style.top = top  + "px";
      document.querySelector("."+ elmnt).style.left = left  + "px";
    }
  
    function closeDragElement(e) {
        e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
    //   console.log(pos1, pos2, pos3, pos4);
      // set the element's new position:
      const top = (document.querySelector("."+ elmnt).offsetTop - pos2);
      const left = (document.querySelector("."+ elmnt).offsetLeft - pos1);

      /* stop moving when mouse button is released:*/
      const find = TEMPLATE.findIndex(Obj => Obj.class == elmnt);
      TEMPLATE[find].position = {
        left, top
      }
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

function generateRandomText() {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy0123456789".split("").sort((a,b) => Math.random() - .5).join("").substring(0, 10);
}

function convertToBase64(file) {
    return new Promise(function(resolve, reject) { 
        let reader = new FileReader();
    
        reader.onloadend = function() {
            resolve(reader.result);
        }
        reader.readAsDataURL(file);
    })
}


function settingBg(event) {
    const file = event.target.files[0];
    
    convertToBase64(file).then(base64 => {
        const find = TEMPLATE.findIndex(Obj => Obj.property == "settings");
        if(find === -1) {
            TEMPLATE.push({
                property: "settings",
                backgroundImage : base64,
            })
        } else {
            TEMPLATE[find].backgroundImage = base64;
        }
        document.querySelector('.card').style.backgroundImage = "url(" + base64 + ")";
        document.querySelector('.card').style.backgroundSize = "100%";
    
        document.querySelector(".setting-bg-active").remove();

    })
}

function settingCard(e) {
    document.querySelector(".card").style.borderRadius = e.target.value + "px";
}
function frameX(evt) {
    const find = TEMPLATE.findIndex(Obj => Obj.property == "settings");
    if(find === -1) {
        TEMPLATE.push({
            property: "settings",
            size : {
                width : evt.value,
                height : evt.value
            }
        })
    } else {
        TEMPLATE[find].size.width = evt.value;
    }
    document.querySelector(".card").style.width = evt.value;
}
function frameY(evt) {
    const find = TEMPLATE.findIndex(Obj => Obj.property == "settings");
    if(find === -1) {
        TEMPLATE.push({
            property: "settings",
            size : {
                height : evt.value,
                width : evt.value
            }
        })
    } else {
        TEMPLATE[find].size.height = evt.value;
    }
    document.querySelector(".card").style.height = evt.value;
}


/**
 * 
 * @param {String} name 
 * @param {Array} array 
 * [
 *  {
 *      type : "text" | "range",
 *      placeholder : String,
 *      label : String,
 *      min : Number,
 *      max : Number,
 *      onchange : Function,
 *      onkeyup : Function
 *  }
 * ]
 * @returns 
 */
function propertyActivity(name, array) {
    if(document.querySelector(".activity")) {
        document.querySelector(".activity").remove();
    }
    if(array.length < 1) return;
    console.log("in activity", array);

    const activity = document.createElement("div");
    activity.classList.add("activity");
    const h3 = document.createElement("h3");
    h3.innerText = name || "activity";
    activity.appendChild(h3);
    
    for(const a of array) {
        console.log("activity", a);
        const div = document.createElement("div");
        div.style.marginBottom = "1rem";

        switch(a.type) {
            case "color" :
                const color = document.createElement("input");
                color.type = "color";
                color.placeholder = a.placeholder || "Please type a text";
                color.value = a.value || "#000";
                color.onkeyup = a.onkeyup || function(e) {};
                color.onchange = a.onchange || function() {};
                color.onkeydown = a.onkeydown || function(e) {};
                const labelcolor = document.createElement("label");
    
                labelcolor.innerText = a.label || "Input Text";
                labelcolor.appendChild(color);
                div.appendChild(labelcolor);
            break;
            case "number" : 
                const number = document.createElement("input");
                number.type = "number";
                number.placeholder = a.placeholder || "Please type a text";
                number.value = a.value || "0";
                number.onkeyup = a.onkeyup || function(e) {};
                number.onchange = a.onchange || function() {};

                const labelnumber = document.createElement("label");
                labelnumber.style.fontSize = "1rem";

                labelnumber.innerText = a.label || "Input Text";
                labelnumber.appendChild(number);
                div.appendChild(labelnumber);
            break;
            case "text" : 
                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = a.placeholder || "Please type a text";
                input.value = a.value || "Type a text";
                input.onkeyup = a.onkeyup || function(e) {};
                input.onchange = a.onchange || function() {};
                const label = document.createElement("label");
                label.style.fontSize = "1rem";

                label.innerText = a.label || "Input Text";
                label.appendChild(input);
                div.appendChild(label);
            break;
            case "range" :
                const range = document.createElement("input");
                range.type = "range";
                range.onkeyup = a.onkeyup || function(e) {};
                range.onchange = a.onchange || function() {};
                range.placeholder = a.placeholder || "Please select a range";
                range.min = a.min || 0;
                range.max = a.max || 100;
                div.appendChild(range);
            break;
            case "select" :
                const select = document.createElement("select");
                select.innerHTML = `
                    <option value="100"> 100 </option>
                    <option value="200"> 200 </option>
                    <option value="300"> 300 </option>
                    <option value="400"> 400 </option>
                    <option value="500"> 500 </option>
                    <option value="600"> 600 </option>
                    <option value="700"> 700 </option>
                    <option value="800"> 800 </option>
                    <option value="900"> 900 </option>
                    <option value="normal"> normal </option>
                    <option value="bold"> bold </option>
                    <option value="bolder"> bolder </option>
                `;
                select.value = a.value || "normal";
                select.onkeydown = a.onkeydown || function() {};
                select.onchange = a.onchange || function() {};
                select.onkeyup = a.onkeyup || function() {};
                const labelSelect = document.createElement('label');
                labelSelect.innerHTML = a.label || "Font Weight";
                labelSelect.appendChild(select);
                div.appendChild(labelSelect);
        }
        activity.appendChild(div);
    }

    const button = document.createElement('button');
    button.innerText = "Keluar";
    button.onclick = () => {
        activity.remove();
    }
    activity.appendChild(button);
    document.body.appendChild(activity);


}