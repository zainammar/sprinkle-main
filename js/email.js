/* ==========================================
   Email Template Builder
   script.js - Part 1
========================================== */

const canvas = document.getElementById("emailCanvas");
const components = document.querySelectorAll(".component");

let selectedElement = null;

/* --------------------------
   Component Click
---------------------------*/

components.forEach(component => {

    component.addEventListener("click", () => {

        const type = component.dataset.type;

        addComponent(type);

    });

});


/* --------------------------
   Add Component
---------------------------*/

function addComponent(type){

    removePlaceholder();

    let element;

    switch(type){

        case "heading":

            element = createHeading();
            break;

        case "text":

            element = createParagraph();
            break;

        case "button":

            element = createButton();
            break;

        case "divider":

            element = createDivider();
            break;

        case "image":

            element = createImage();
            break;

        case "logo":

            element = createLogo();
            break;

        case "footer":

            element = createFooter();
            break;

        case "spacer":

            element = createSpacer();
            break;

        case "social":

            element = createSocial();
            break;

        default:

            return;

    }

    enableEditing(element);

    canvas.appendChild(element);

}


/* --------------------------
   Placeholder
---------------------------*/

function removePlaceholder(){

    const placeholder = canvas.querySelector(".placeholder");

    if(placeholder){

        placeholder.remove();

    }

}


/* --------------------------
   Heading
---------------------------*/

function createHeading(){

    const h = document.createElement("h2");

    h.innerText = "Your Heading";

    styleElement(h);

    return h;

}


/* --------------------------
   Paragraph
---------------------------*/

function createParagraph(){

    const p = document.createElement("p");

    p.innerText =
        "Write your email content here...";

    styleElement(p);

    p.style.lineHeight = "1.8";

    return p;

}


/* --------------------------
   Button
---------------------------*/

function createButton(){

    const btn = document.createElement("a");

    btn.innerText = "Click Here";

    btn.href = "#";

    btn.style.display = "inline-block";

    btn.style.background = "#2563eb";

    btn.style.color = "#fff";

    btn.style.padding = "12px 30px";

    btn.style.borderRadius = "6px";

    btn.style.textDecoration = "none";

    btn.style.margin = "15px 0";

    styleElement(btn);

    return btn;

}


/* --------------------------
   Divider
---------------------------*/

function createDivider(){

    const hr = document.createElement("hr");

    hr.style.margin = "25px 0";

    return hr;

}


/* --------------------------
   Image
---------------------------*/

function createImage(){

    const img = document.createElement("img");

    img.src = "https://placehold.co/600x250";

    img.style.width = "100%";

    img.style.borderRadius = "8px";

    img.style.margin = "15px 0";

    return img;

}


/* --------------------------
   Logo
---------------------------*/

function createLogo(){

    const img = document.createElement("img");

    img.src = "https://placehold.co/180x60";

    img.style.display = "block";

    img.style.margin = "20px auto";

    return img;

}


/* --------------------------
   Spacer
---------------------------*/

function createSpacer(){

    const div = document.createElement("div");

    div.style.height = "40px";

    return div;

}


/* --------------------------
   Footer
---------------------------*/

function createFooter(){

    const footer = document.createElement("div");

    footer.innerHTML = `
        <p style="text-align:center;color:#777;">
            © 2026 Your Company
        </p>
    `;

    footer.style.marginTop = "30px";

    return footer;

}


/* --------------------------
   Social
---------------------------*/

function createSocial(){

    const div = document.createElement("div");

    div.style.textAlign = "center";

    div.style.margin = "20px";

    div.innerHTML = `
        👍 Facebook
        &nbsp;&nbsp;
        📷 Instagram
        &nbsp;&nbsp;
        🐦 Twitter
    `;

    return div;

}


/* --------------------------
   Common Style
---------------------------*/

function styleElement(el){

    el.style.margin = "12px 0";

    el.style.padding = "6px";

    el.style.cursor = "pointer";

}


/* --------------------------
   Enable Editing
---------------------------*/

function enableEditing(el){

    el.addEventListener("click",(e)=>{

        e.stopPropagation();

        selectElement(el);

    });

    el.addEventListener("dblclick",()=>{

        const value = prompt(
            "Edit Content",
            el.innerText
        );

        if(value!==null){

            el.innerText = value;

        }

    });

}


/* --------------------------
   Select
---------------------------*/

function selectElement(el){

    if(selectedElement){

        selectedElement.style.outline="";

    }

    selectedElement = el;

    el.style.outline = "2px dashed #2563eb";

}


/* --------------------------
   Delete Key
---------------------------*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Delete"){

        if(selectedElement){

            selectedElement.remove();

            selectedElement=null;

        }

    }

});


/* --------------------------
   Canvas Click
---------------------------*/

canvas.addEventListener("click",()=>{

    if(selectedElement){

        selectedElement.style.outline="";

        selectedElement=null;

    }

});


/* --------------------------
   Copy HTML
---------------------------*/

document
.getElementById("copyBtn")
.addEventListener("click",()=>{

    navigator.clipboard.writeText(canvas.innerHTML);

    alert("HTML Copied");

});