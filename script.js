let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

ctx.fillStyle = "#ADD8E6";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let mousePos = {x: 0, y: 0};
let mouseHeld = false;
let particlepos = [];

function getMouseCoords(e)
{
    let rect = canvas.getBoundingClientRect();
    return{x: e.clientX - rect.left - 5, y: e.clientY - rect.top - 5}
}

onmousemove = ((e) => {
    coords = getMouseCoords(e)
    mousePos.x = Math.round(coords.x/10)*10;
    mousePos.y = Math.round(coords.y/10)*10;
});

function updateStatus()
{
    particlepos.sort((a, b) => a.y < b.y);
    for(let i = 0; i < particlepos.length; i++)
    {
        if (!particlepos[i].active) continue;
        if (particlepos[i].y >= canvas.height - 10)
        {
            particlepos[i].y = canvas.height - 10
            particlepos[i].active = 0;
        } 
        else for (let j = 0; j < particlepos.length; j++)
        {
            let xvalues = [particlepos[i].x-10, particlepos[i].x+10];
            if (particlepos[i].y + 10 == particlepos[j].y && particlepos[i].x == particlepos[j].x)
            {
                xvalues.sort(() => Math.random() - 0.5);
                let passedloop = true;
                for (let k = 0; k < particlepos.length; k++)
                {
                    if (particlepos[i].y + 10 == particlepos[k].y && xvalues[0] == particlepos[k].x)
                    {
                        passedloop = false;
                        break;
                    }
                }
                if (passedloop)
                {
                    particlepos[i].x = xvalues[0];
                    break;
                }
                passedloop = true;
                for (let k = 0; k < particlepos.length; k++)
                {
                    if (particlepos[i].y + 10 == particlepos[k].y && xvalues[1] == particlepos[k].x)
                    {
                        passedloop = false;
                        break;
                    }
                }
                if (passedloop)
                {
                    particlepos[i].x = xvalues[1];
                    break;
                }
                else particlepos[i].active = 0;
            }
        }
        if (particlepos[i].active) particlepos[i].y += 10;
    }
}

onmousedown = (() => {
    mouseHeld = true;
});

onmouseup = (() => {
    mouseHeld = false;
});


onMouseHeld = (() => {
    position = {x: mousePos.x, y: mousePos.y, active: 1};

    for (let i = 0; i < particlepos.length; i++)
    {
        if (particlepos[i].x === position.x && particlepos[i].y === position.y) return;
    }
    
    particlepos.push(position);
});

function drawFrame()
{
    counter++;
    ctx.fillStyle = "#ADD8E6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    ctx.fillRect(mousePos.x, mousePos.y, 10, 10);
    if (mouseHeld) onMouseHeld();
    if (counter >= 5)
    {
        updateStatus();
        counter = 0;
    }
    for(let i = 0; i < particlepos.length; i++)
    {
        ctx.fillStyle = "yellow";
        ctx.fillRect(particlepos[i].x, particlepos[i].y, 10, 10);
    }
    requestAnimationFrame(drawFrame);
}

let counter = 0;
drawFrame();