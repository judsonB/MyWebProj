const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90
optionList = [];
buildOptions();
dataElements=[];
total = 0;
timeLeft = 60;
correct = 0;
ave = 0;
buildData();
correctHour = 0;
correctMin = 0;
correctTime = 0;
//setInterval(drawClock, 1000);
drawClock();
function buildData()
{
    dataElements[0] = document.getElementById("timeLeft");
    dataElements[1] = document.getElementById("correct");
    dataElements[2] = document.getElementById("total");
    dataElements[3] = document.getElementById("ave");
}
function buildOptions()
{
    for(let i = 0; i < 4; i++)
    {
        option = document.getElementById("op"+(i+1));
        option.addEventListener("click", choiceMade);
        optionList.push(option);
    }
}
function choiceMade(e)
{
    console.log(e.target);
    dataElements[2].innerHTML = total;
    if(e.target.innerHTML == correctTime)
        correct++;
    dataElements[1].innerHTML = correct;
    dataElements[3].innerHTML = (correct/total*100).toFixed(2);
    drawClock();
}

function drawClock() {
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTicks(ctx, radius);

    correctHour = Math.floor(Math.random() * 12);
    correctMin = Math.floor(Math.random() * 60);
    drawTime(ctx, radius);
    updateOptions();
}

function drawFace(ctx, radius) {
  const grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.5, 'white');
  grad.addColorStop(1, '#333');
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2*Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius*0.1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
  ctx.fillStyle = '#333';
  ctx.fill();
}

function drawNumbers(ctx, radius) {
    ctx.font = radius*0.15 + "px arial";
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    for(let num = 1; num < 13; num++){
        let ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius*0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius*0.85);
        ctx.rotate(-ang);
    }
}
function drawTicks(ctx, radius) {
    for(let num = 1; num < 60; num++){
        let ang = num * Math.PI / 30;
        ctx.rotate(ang);
        ctx.translate(0, -radius*0.85);
        ctx.rotate(-ang);
        if(num % 5 != 0)
        {
            ctx.beginPath();
            ctx.arc(0,0,1,0, 2*Math.PI);
            ctx.fill();
        }
        ctx.rotate(ang);
        ctx.translate(0, radius*0.85);
        ctx.rotate(-ang);
    }
}

// function drawTime(ctx, radius){
//     const now = new Date();
//     let hour = now.getHours();
//     let minute = now.getMinutes();
//     let second = now.getSeconds();
//     //hour
//     hour=hour%12;
//     hour=(hour*Math.PI/6)+
//     (minute*Math.PI/(6*60))+
//     (second*Math.PI/(360*60));
//     drawHand(ctx, hour, radius*0.5, radius*0.07);
//     //minute
//     minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
//     drawHand(ctx, minute, radius*0.8, radius*0.07);
//     // second
//     second=(second*Math.PI/30);
//     drawHand(ctx, second, radius*0.9, radius*0.02);
// }
function drawTime(ctx, radius){
    let hour=(correctHour*Math.PI/6)+(correctMin*Math.PI/(6*60));
    drawHand(ctx, hour, radius*0.5, radius*0.07);
    //minute
    let minute=(correctMin*Math.PI/30);
    drawHand(ctx, minute, radius*0.8, radius*0.07);
    // second
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}
function updateOptions()
{
    let ops = [];
    //Correct Option
    correctTime = makeTime(correctHour, correctMin);
    ops.push(correctTime);
    //Min/Hour Swap - Incorrect Option
    let time = makeTime(Math.floor(correctMin/5), correctHour*5+Math.floor(correctMin/12));
    if(ops.indexOf(time) == -1)
        ops.push(time);
    //Min as non-multiple of 5.
    time = makeTime(Math.round(correctHour+correctMin/60), Math.floor(correctMin/5));
    if(ops.indexOf(time) == -1)
        ops.push(time);
    //Random options
    while(ops.length < 4)
    {
        h = Math.floor(Math.random() * 12);
        m = Math.floor(Math.random() * 60);
        time = makeTime(h, m);
        if(ops.indexOf(time) == -1)
            ops.push(time);
    }
    //randomize ops
    for(let i = 0; i < 20; i++)
    {
        op1 = Math.floor(Math.random()*4);
        op2 = Math.floor(Math.random()*4);
        temp = ops[op1];
        ops[op1] = ops[op2];
        ops[op2] = temp;
    }
    console.log(optionList)
    for(let i = 0; i < ops.length; i++)
    {
        console.log(optionList[i])
        optionList[i].innerHTML = ops[i];
    }
    //update total
    total += 1;
}
function makeTime(h, m)
{
    let time = "";
    if(h == 0)
        h = 12;
    time += h.toString().padStart(2,"0");
    time+=":";
    time += m.toString().padStart(2,"0");
    return time;
}