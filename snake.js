
const escenario = document.getElementById('escenario');
const play = document.getElementById('play');
const up = document.getElementById('up-joystick')
const left = document.getElementById('left-joystick')
const right = document.getElementById('right-joystick')
const down = document.getElementById('down-joystick')
const joystickPic = document.getElementsByClassName('joystick cont pic')[0]

up.addEventListener('touchstart', cruceta)
left.addEventListener('touchstart', cruceta)
right.addEventListener('touchstart', cruceta)
down.addEventListener('touchstart', cruceta)


function cruceta(){
    this.preventDefault();
    console.log(this.id);
    console.log(joystickPic.classList.contains('up'))
    switch (this.id) {
        case "up-joystick":
            if(ultimaTecla == "s"){return}
            joystickPic.className = "joystick cont pic";
            joystickPic.classList.contains('up')?{}: joystickPic.classList.toggle('up');
            actionLogic("w")
            break;
        case "left-joystick":
            if(ultimaTecla == "d"){return}
            joystickPic.className = "joystick cont pic";
            joystickPic.classList.contains('left')?{}: joystickPic.classList.toggle('left');
            actionLogic("a")
            break;
        case "right-joystick":
            if(ultimaTecla == "a"){return}
            joystickPic.className = "joystick cont pic";
            joystickPic.classList.contains('right')?{}: joystickPic.classList.toggle('right');
            actionLogic("d")
            break;
        case "down-joystick":
            if(ultimaTecla == "w"){return}
            joystickPic.className = "joystick cont pic";
            joystickPic.classList.contains('down')?{}: joystickPic.classList.toggle('down');
            actionLogic("s")
            break;
        default:
            break;
    }
}

// Nuestra variable de posicionamiento

let escenarioGrid = [];
let ultimaTecla = "d";
let frames = 120;
let grid = [24, 30 ];
for(let n in document.getElementsByClassName('grid-pos')){
    document.getElementsByClassName('grid-pos').value = grid[n];
}
let gameOverStatus = false;

for(let i=0;i<grid[0];i++){
    //console.log(i);
    const tr = document.createElement('tr');
    for(let k=0;k<grid[1];k++){
        const td = document.createElement('td')
        tr.appendChild(td);
    }
    //console.log(escenario)
    escenario.children[0].appendChild(tr);
}

const todosLosTD = document.getElementsByTagName('tbody');

for(n of todosLosTD[0].children){
    // //console.log(n);
    let hilera = []; 
    for(k of n.children){
        // //console.log(k)
        hilera.push(k);
    }
    escenarioGrid.push(hilera);
}

// Iniciando Coordenadas de la cabeza de la vibora
// let viboraPos = {x:1,y:2};
// [Y,X]
let viboraPos = [[1,0]]
// Iniciando Coordenadas de la comida
let bolitasPos = [[3,3]]
// Iniciando la posicion de la vibora
escenarioGrid[viboraPos[0][0]][viboraPos[0][1]].className = "vibora";

// Evento de presionar una tecla
// Para usar el "WASD"
document.addEventListener('keypress', (e)=>{
    if(ultimaTecla == e.key){return}
    switch (e.key) {
        case "a":
            if(ultimaTecla == "d"){return}
            break
        case "w":
            if(ultimaTecla == "s"){return}
            break
        case "s":
            if(ultimaTecla == "w"){return}
            break
        case "d":
            if(ultimaTecla == "a"){return}
            break;
        default:
            break;
    }
    actionLogic(e.key)
})

// Cuando se presiona Play!
play.addEventListener('click',(e)=>{
    window.location.reload();
})

function actionLogic(key){
    if(gameOverStatus){return}
    // Para el bucle de eventos para revisar colisiones o efectos
    clearInterval(framerate)
    let newPos = [];
    
    // Esto dictara la siguiente posicion de la vibora 
    // Basado en que tecla se presiono
    if(key == "w"){
        // Mueve Arriba
        if(viboraPos[0][0] == 0){
            gameOver();
            return;
        }
        newPos = [viboraPos[0][0]-1,viboraPos[0][1]];
    }else if(key == "d"){
        // Muevete a la derecha
        if(escenarioGrid[0].length-1 == viboraPos[0][1]){
            gameOver();
            return
        }
        newPos = [viboraPos[0][0],viboraPos[0][1]+1];
    }else if(key == "s"){
        // Muevete abajo
        if(escenarioGrid.length-1 == viboraPos[0][0]){
            gameOver();
            return
        }
        newPos = [viboraPos[0][0]+1,viboraPos[0][1]];
    }else if(key == "a"){
        // A la izquierda
        if(viboraPos[0][1] == 0){
            gameOver();
            return
        }
        newPos = [viboraPos[0][0],viboraPos[0][1]-1];
    }
    
    
    // Registra cual fue la ultima tecla que se toco
    // Esto ayudara al movimiento automatico si no se presiona alguna tecla
    ultimaTecla = key;
    // Añade la nueva posicion al principio de la lista.
    viboraPos = [newPos, ...viboraPos];
    // Checa si hay alguna colisión
    collision(newPos)
    actualizeViboraPos()
}

function actualizeViboraPos(){
    viboraPos.pop();
    for(n of viboraPos){
        escenarioGrid[n[0]][n[1]].className = "vibora";
    }

    
    // //console.log("%cPOSICION DE LA VIBORA:","background-color:RED;font-size:18px")
    // console.table(viboraPos);
    framerate = setInterval(frameBuffer,frames);
    framerate;
}

let framerate = setInterval(frameBuffer,frames)

function frameBuffer(){
    //console.log("Frame")
    actionLogic(ultimaTecla)
    if(bolitasPos.length == 0){createBolita()}
    // console.clear();

}

/**
 * 
 * Esta funcion busca por objetos o paredes que 
 * colisionan con la posicion de la vibora
 * 
 * @param {*} newPos 
 */
function collision(newPos){

    // Si la vibora pega a una bolita:
    if(escenarioGrid[newPos[0]][newPos[1]].className.includes('bolitas')){
        viboraPos.push(newPos)
        bolitasPos.pop();
        createBolita();
    }else if(escenarioGrid[newPos[0]][newPos[1]].className.includes('vibora')){

        gameOver();
    }else if(escenarioGrid[newPos[0]][newPos[1]].className == ("")){
        escenarioGrid[viboraPos[viboraPos.length -1][0]][viboraPos[viboraPos.length -1][1]].classList.toggle("vibora");
        
    }

}

function randomizerBolitas(){
    let y = escenarioGrid.length-1;
    let x = escenarioGrid[0].length-1;

    let numberYRandom = Math.floor(Math.random() * (y - 0 + 1)) + 0
    let numberXRandom = Math.floor(Math.random() * (x - 0 + 1)) + 0
    return [numberYRandom, numberXRandom];
}

function createBolita(){
    // Que nos de un numero aleatorio
    let randomPos = randomizerBolitas();
    //console.log(randomPos, viboraPos)
    //console.log("INCLUDES:" + viboraPos.includes(randomPos))
    // Usemos ese numero para saber si existe en la posicion de la vibora.
    for(n of viboraPos){
        if(compareArrays(randomPos, n)){
            createBolita()
            return;
        }
    }
    // //console.log("RANDOM POS: ", randomPos)
    escenarioGrid[randomPos[0]][randomPos[1]].className = "bolitas";
    bolitasPos.push([randomPos[0],randomPos[1]])
}

function compareArrays(array1, array2){
    let eq1,eq2;

    eq1 = array1[0] == array2[0];
    eq2 = array1[1] == array2[1];
    return eq1 && eq2;
}

function gameOver(){
    gameOverStatus = true;
    //console.log("PERDISTE!")

    let msg = document.getElementById('message-container');
    msg.classList.toggle('hidden')

    // setTimeout(()=>{
    // window.location.reload()
    // }, 60000)
}

createBolita();

