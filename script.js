let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

ctx.fillStyle = "#ADD8E6";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let mousePos = {x: 0, y: 0};
let mouseHeld = false;
let drawRock = false;
let erase = false;

let grid = [];

for (let i = 0; i < canvas.width; i += 10)
{
    grid[i/10] = [];
    for (let j = 0; j < canvas.height; j += 10)
    {
        grid[i/10][j/10] = 0;
    }
}

let nextgrid = [...grid];

function getMouseCoords(e)
{
    let rect = canvas.getBoundingClientRect();
    return{x: e.clientX - rect.left - 5, y: e.clientY - rect.top - 5}
}

onmousemove = ((e) => {
    coords = getMouseCoords(e)
    if (coords.x < 0 || coords.x > canvas.width - 10) return;
    if (coords.y < 0 || coords.y > canvas.height - 10) return;
    mousePos.x = Math.round(coords.x/10)*10;
    mousePos.y = Math.round(coords.y/10)*10;
});

function updateStatus(grid)
{
    for(let i = grid[0].length - 1; i >= 0; i--)
    {
        for (let j = grid.length - 1; j >= 0; j--)
        {
            if (grid[j][i] == 1)
            {
                if (grid[j][i+1] == 0)
                {
                    nextgrid[j][i+1] = 1;
                    nextgrid[j][i] = 0;
                }
                else 
                {
                    if (j == 0) canditateTiles = [j+1, j+1];
                    else if (j == grid.length - 1) canditateTiles = [j-1, j-1];
                    else {
                        canditateTiles = [j+1, j-1];
                        canditateTiles.sort(() => Math.random() - 0.5);
                    }
                    if (grid[canditateTiles[0]][i+1] == 0)
                    {
                        nextgrid[canditateTiles[0]][i+1] = 1;
                        nextgrid[j][i] = 0;
                    }
                    else if (grid[canditateTiles[1]][i+1] == 0)
                    {
                        nextgrid[canditateTiles[1]][i+1] = 1;
                        nextgrid[j][i] = 0;
                    }
                }
            }
        }
    }
    return nextgrid;
}

onmousedown = (() => {
    mouseHeld = true;
});

onmouseup = (() => {
    mouseHeld = false;
});


onMouseHeld = (() => {
    position = {x: mousePos.x, y: mousePos.y, active: 1};

    if (erase)
    {
        if (position.x < canvas.width-10 && position.y < canvas.height-10)
        {
            nextgrid[position.x/10][position.y/10] = 0;
            nextgrid[position.x/10][position.y/10+1] = 0;
            nextgrid[position.x/10+1][position.y/10] = 0;
            nextgrid[position.x/10+1][position.y/10+1] = 0;
        }
    } 
    else if (drawRock)
    {
        if (position.x < canvas.width-10 && position.y < canvas.height-10)
        {
            nextgrid[position.x/10][position.y/10] = 2;
            nextgrid[position.x/10][position.y/10+1] = 2;
            nextgrid[position.x/10+1][position.y/10] = 2;
            nextgrid[position.x/10+1][position.y/10+1] = 2;
        }
    } 
    else if (grid[position.x/10][position.y/10] == 0) nextgrid[position.x/10][position.y/10] = 1;
});

function drawFrame()
{
    counter++;
    if (counter >= 5)
    {
        grid = updateStatus(grid);
        counter = 0;
    }
    ctx.fillStyle = "#ADD8E6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (mouseHeld) onMouseHeld();
    for(let i = 0; i < grid.length; i++)
    {
        for (let j = 0; j < grid[0].length; j++)
        {
            if (grid[i][j] == 1)
            {
                ctx.fillStyle = "yellow";
                ctx.fillRect(i*10, j*10, 10, 10);
            }
            else if (grid[i][j] == 2)
            {
                ctx.fillStyle = "gray";
                ctx.fillRect(i*10, j*10, 10, 10);
            }
        }
    }
    if (erase)
    {
        ctx.fillStyle = "red";
        ctx.fillRect(mousePos.x, mousePos.y, 10, 10);
        ctx.fillRect(mousePos.x, mousePos.y+10, 10, 10);
        ctx.fillRect(mousePos.x+10, mousePos.y, 10, 10);
        ctx.fillRect(mousePos.x+10, mousePos.y+10, 10, 10);
    }
    else if (drawRock)
    {
        ctx.fillStyle = "green";
        ctx.fillRect(mousePos.x, mousePos.y, 10, 10);
        ctx.fillRect(mousePos.x, mousePos.y+10, 10, 10);
        ctx.fillRect(mousePos.x+10, mousePos.y, 10, 10);
        ctx.fillRect(mousePos.x+10, mousePos.y+10, 10, 10);
    }
    else
    {
        ctx.fillStyle = "blue";
        ctx.fillRect(mousePos.x, mousePos.y, 10, 10);
    }
    requestAnimationFrame(drawFrame);
}

document.addEventListener(
    "keydown",
    (event) => { 
    const keyName = event.key;
  
      if (keyName === "Shift") {
        drawRock = true;
      }

      if (keyName === "Control")
      {
        erase = true;
      }
    },
);
  
document.addEventListener(
    "keyup", (event) => { 
    const keyName = event.key;
    
      if (keyName === "Shift") 
      {
        drawRock = false;
      }
      if (keyName === "Control")
      {
        erase = false;
      }
    },
);


let counter = 0;
drawFrame();