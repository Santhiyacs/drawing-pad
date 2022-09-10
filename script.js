
const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
colorPicker = document.querySelector("#color-picker"),
ctx = canvas.getContext("2d");

// global variables with default value
let prevMouseX , prevMouseY, snapshot,
 isDrawing = false,
selectedTool = "brush",
brushWidth = 5; 
selectedColor = "#000"; 

const setCanvasBackground =()=>{
    ctx.fillStyle ="#fff"; // fill style property fill the background  
    ctx.fillRect(0,0,canvas.width,canvas.height);// fillReact property create a (filled reactangle)
    ctx.fillStyle =selectedColor;
}

window.addEventListener("load", ()=>{
    //set width and height
    canvas.width= canvas.offsetWidth;
    canvas.height= canvas.offsetHeight;
    setCanvasBackground();
});
const drawReact =(e) =>{
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX,e.offsetY,prevMouseX-e.offsetX, prevMouseY-e.offsetY);
    }
    ctx.fillRect(e.offsetX,e.offsetY,prevMouseX-e.offsetX, prevMouseY-e.offsetY);
}

const drawCircle =(e) =>{
    ctx.beginPath();
    // get radius on mouse moment
    let radius = Math.sqrt(Math.pow((prevMouseX- e.offsetX),2)+ Math.pow((prevMouseY- e.offsetY),2));
    // sqrt return the square root of a number
    ctx.arc(prevMouseX,prevMouseY,radius,0,2*Math.PI);// arc method is used to create a circle
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTri=(e) =>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY);//
    ctx.lineTo(e.offsetX, e.offsetY);// create a line accorting to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX , e.offsetY);
    ctx.closePath(); // closepath automatically close the triangle
    ctx.stroke();//fill the line in color
    fillColor.checked ? ctx.fill() : ctx.stroke();

}
const drawLine=(e) =>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY);//
    ctx.lineTo(e.offsetX, e.offsetY);
    fillColor.checked ? ctx.stroke() : ctx.stroke();

}

const startDraw=(e)=>{
    isDrawing = true;
    prevMouseX = e.offsetX;// pass a mouse event in pre mouse x and y
    prevMouseY = e.offsetY;
    ctx.beginPath();// beginpath method help to create a new drawpoint
    ctx.lineWidth = brushWidth;// pass  brush size in line width
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0,0,canvas.width,canvas.height);
    //avoid inshaped image
}

const drawing =(e) =>{
    if(!isDrawing) return; // drawing is false show nothing
    ctx.putImageData(snapshot,0,0);// this method is help to put the dayta into the canvas
    if(selectedTool === "brush" || selectedTool === "eraser"){
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;    
    ctx.lineTo(e.offsetX, e.offsetY);// create a line accorting to the mouse pointer
    ctx.stroke();
    }
    else if(selectedTool === "rectangle")
    {
        drawReact(e);
    }
    else if(selectedTool === "circle")
    {
        drawCircle(e);
    }
    else if(selectedTool ==="triangle")
    {
        drawTri(e);
    }
    else{
        drawLine(e);
    }
}
toolBtns.forEach(btn => {
    btn.addEventListener("click",()=>{//to add click event in all tools
        document.querySelector(".options .active").classList.remove("active");
        //removing active class from previous option
        btn.classList.add("active");
        // add active class in current option
        selectedTool = btn.id;
        console.log(btn.id);
    });
    
});

sizeSlider.addEventListener("change",()=> brushWidth = sizeSlider.value);

colorBtns.forEach(btn =>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor=(window.getComputedStyle(btn).getPropertyValue("background-color"));
    });
});

colorPicker.addEventListener("change", ()=>{
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", ()=>{
    ctx.clearRect(0,0,canvas.width, canvas.height);// clearrect method clear the specified pixel reactanle
    setCanvasBackground();
});

saveImg.addEventListener("click", ()=>{
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});
canvas.addEventListener("mousedown",startDraw);
canvas.addEventListener("mousemove",drawing);
canvas.addEventListener("mouseup",()=> isDrawing= false);

