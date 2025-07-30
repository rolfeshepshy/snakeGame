/**
 * Declaración de constantes:
 * Aqui declaramos los valores constantes. 
 * 
 * Los valores constantes son cosas como elementos 
 * que necesitaremos para manipular el DOM.
 * 
 * Las constantes se llaman constantes porque no se 
 * pueden asignar otro valor del que fue declarado.
 */
const escenario = document.getElementById('escenario'); // Nuestra Tabla que sera el mapa del juego (Cuadricula)
const play = document.getElementById('play');           // Nuestro boton que inicia el juego
const up = document.getElementById('up-joystick')       // PARA MOBIL
const left = document.getElementById('left-joystick')   // PARA MOBIL
const right = document.getElementById('right-joystick') // PARA MOBIL
const down = document.getElementById('down-joystick')   // PARA MOBIL
const joystickPic = document
.getElementsByClassName('joystick cont pic')[0]         // Fondo con la imagen de la cruceta

// IMPLEMENTACION PARA MOBILES!!!
// Hitbox de la cruceta para mobiles
up.addEventListener('touchstart', cruceta) // Cada vez que se toque esta area, ejecuta la funcion `cruceta`
left.addEventListener('touchstart', cruceta)
right.addEventListener('touchstart', cruceta)
down.addEventListener('touchstart', cruceta)

/**
 * 
 * Funcion que se ejecuta al presionar la cruceta.
 * De aqui se cambia la dirección de la imagen de la cruceta.
 * Despues se pasa a la funcion de logica de acciones y se ejecuta el siguiente paso.
 * 
 * @returns Void
 */
function cruceta(){
    switch (this.id) { //Estamos buscando un caso que sea igual al elemento que fue presionado en la cruceta
        case "up-joystick": 
            if(ultimaTecla == "s"){return} // si se presiono la misma dirección al que la serpiente ya esta. No se hara nada.
            joystickPic.className = "joystick cont pic"; // Se cambia la direccion de la cruceta
            joystickPic.classList.contains('up')?{}: joystickPic.classList.toggle('up');
            actionLogic("w") // Empezamos la logica del juego
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

// Nuestra variable que contiene todas las posiciones. (Osea Mapa)
let escenarioGrid = [];
// La ultima tecla que se presiono. Esto nos ayudara a mover la serpiente.
let ultimaTecla = "d";
// La velocidad de el juego
let frames = 120;
// El tamaño de nuestra cuadricula.
let grid = [24, 30 ]; // *  [Y,X]
// Estado de Game Over
let gameOverStatus = false;

// Forma dinamica de llenar la cuadricula con elementos que
// Seran nuestras celdas para dibujar la serpiente.
for(let i=0;i<grid[0];i++){ // *Bucle que itera por el eje Y (Lee de arriba a abajo)
    const tr = document.createElement('tr'); // Crea una Hilera
    for(let k=0;k<grid[1];k++){ // *Bucle que itera por el eje X (Lee de izquierda a derecha)
        const td = document.createElement('td') // Crea una celda
        tr.appendChild(td); // Mete la celda en la hilera
    }
    escenario.children[0].appendChild(tr); // Mete la hilera a la tabla
}

// Todas las celdas (TD) metelas en una lista 2D para referenciar y utilzar en la logica del juego
const todosLosTD = document.getElementsByTagName('tbody');
for(n of todosLosTD[0].children){
    let hilera = []; 
    for(k of n.children){
        hilera.push(k);
    }
    escenarioGrid.push(hilera);
}

// Iniciando Coordenadas de la cabeza de la vibora
// let viboraPos = [[x:1,y:2]];
// [Y,X]
let viboraPos = [[1,0]]
// Iniciando Coordenadas de la primera comida
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

// !! SUPER IMPORTANTE  :)
// * La logica del juego que sucede CADA CUADRO del juego.
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

    framerate = setInterval(frameBuffer,frames);
    framerate;
}

let framerate = setInterval(frameBuffer,frames)

function frameBuffer(){
    actionLogic(ultimaTecla)
    if(bolitasPos.length == 0){createBolita()}

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
        console.log(viboraPos);
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

