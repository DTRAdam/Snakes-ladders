let board = document.getElementById("board");
let player = document.getElementById("player");
let npc = document.getElementById("npc");
let dice = document.getElementById("dice");
let winHeader = document.getElementById("winhead");
let overlay = document.getElementById("overlay");

let playerlocation = 0;
let npclocation = 0;
let readyToRoll = true;
let specialMove = [[8, 18, 59, 55, 98, 93, 68, 44], [31, 36, 62, 86, 37, 72, 33, 13]]
// asstant var to help us to set the numbers in the right order so number 1 would be 0 as starting point and not number 10 to be 0 as starting point
let start = 9;
// var that help us to find the boxSize [0] means the box with the id 0 which help us to create a function to control the players size
let boxSize = 0;


// loop to create the other divs inside the board
for (let i = 99; i >= 0; i--) {
    // condtion that help us to locate the even tens number so we can swap the order of the id on the board so we can put the starting point at div number 0 with the var "start" in line 5
    if (Math.floor(i / 10) % 2 == 0) {
        const div = document.createElement("div");
        div.className = "box";
        div.id = i - start;
        board.appendChild(div);
        // by decreasing the start point by 2 it help us to make the jump between the id number of the divs that we created with the loop by 2 
        // exsample 9-9 = 0 which is our starting point and the next point 8-7 = 1
        start -= 2

    } else {
        //  by reseting the start on the odd tens it help us to make the start point at 9 for the next even tens line  
        start = 9
        const div = document.createElement("div");
        div.className = "box";
        div.id = i;
        board.appendChild(div);
    }
};

// function that reSizing the players in the board
function reSizePlayer() {
    boxSize = document.getElementsByClassName("box")[0].offsetWidth
    player.style.width = boxSize / 2 + "px";
    player.style.height = boxSize / 2 + "px";
    npc.style.width = boxSize / 2 + "px";
    npc.style.height = boxSize / 2 + "px";
}

// calling the function so it work
reSizePlayer()
// calling move function to set the player at the starting point
move("player", 0);
move("npc", 0);

// function that generates random number between 1 - 6 and to print the dice picture that equal to the random number we get lets say we get 5 on the random number so it print dice with the number 5 depends on who is playing if its the player its green dice if its npc its red dice
function rolldice(who) {
    if (readyToRoll || who == "npc") {
        dice.classList.add("bounceFromTop");
        let dicenum = Math.floor(Math.random() * 6) + 1;
        if (who == "player") {
            dice.style.backgroundImage = `url(/images/num${dicenum}Green.svg)`
            movement("player", playerlocation, dicenum);
        } else {
            dice.style.backgroundImage = `url(/images/num${dicenum}Red.svg)`
            movement("npc", npclocation, dicenum);
        }
        readyToRoll = false
    }

};



// function that control the player and npc location to be if they both on the same box both will have space around them equally and if one stay and the other moves the one that stayed go back to the center of the box 
function move(who, num) {
    if (who == "player") {
        player.style.top = document.getElementById(num).offsetTop + boxSize / 2 + "px";
        player.style.left = document.getElementById(num).offsetLeft + boxSize / 2 + "px";
        playerlocation = num;

    } else {
        npc.style.top = document.getElementById(num).offsetTop + boxSize / 2 + "px";
        npc.style.left = document.getElementById(num).offsetLeft + boxSize / 2 + "px";
        npclocation = num;

    }
    if (playerlocation == npclocation) {
        player.style.left = document.getElementById(num).offsetLeft + boxSize / 3 + "px";
        npc.style.left = document.getElementById(num).offsetLeft + boxSize / 1.4 + "px";
    } else {
        player.style.left = document.getElementById(playerlocation).offsetLeft + boxSize / 2 + "px";
        npc.style.left = document.getElementById(npclocation).offsetLeft + boxSize / 2 + "px";
    }
};

// function to control the animation of the players movment from starting point to the end point 
function movement(who, num, dicenum) {
    // loop that keep looping as long as i smaller than the number we get on the dice
    for (let i = 0; i < dicenum; i++) {
        // set delay that make the players move 1 block each time until it reachs the box the player need to be on 
        setTimeout(() => {
            //  num equal to player current locaton and by adding 1 to num we move the player by 1 every time 
            // by setting this condition we say if the num which represent the chars location and we say if the num not equal to 99 keep moving and if it is the chars wont move
            if (num != 99) {
                num++;
            }

            move(who, num);
            // we multiply the 500 ms by i to reach the delay number or ms that the player need to move from the starting point to the box after it \
            if (i == 1) {
                dice.classList.remove("bounceFromTop");
            }
        }, 500 * i);

    }

    setTimeout(() => {
        // condition that says if the who is player and the player finished moving the npc rool the dice by number of the dice of the player * 500ms
        if (who == "player") {
            if (num != 99) {
                rolldice("npc")
            }

        } else {
            readyToRoll = true
        }
        if (specialMove[0].includes(num)) {
            move(who, specialMove[1][specialMove[0].indexOf(num)])
        }
        if (num == 99) {
            winHeader.innerHTML = `Congratulations!${who == "npc" ? " you just lost to a bot" : " you won."}`
            overlay.style.visibility = "visible";


        }
        // setting the delay by multiplying the diceNum from the player * 500 ms
    }, dicenum * 500)


}

let restart = () => {
    move("player", 0);
    move("npc", 0);
    overlay.style.visibility = "hidden"
}

// function the "char" if thge screen size changes 
addEventListener("resize", (event) => {
    reSizePlayer()
    // 
    move("player", playerlocation);
    move("npc", npclocation);
});
const syncPointer = (event) => {
    const pointerX = event.x;
    const pointerY = event.y;

    const x = pointerX.toFixed(2);
    const y = pointerY.toFixed(2);
    const xp = (pointerX / window.innerWidth).toFixed(2);
    const yp = (pointerY / window.innerHeight).toFixed(2);

    document.documentElement.style.setProperty('--x', x);
    document.documentElement.style.setProperty('--xp', xp);
    document.documentElement.style.setProperty('--y', y);
    document.documentElement.style.setProperty('--yp', yp);
};

document.body.addEventListener('pointermove', syncPointer);


// debug to see where the acutal number located
// for (let i = 0; i < 100; i++) {
//     document.getElementById(i).innerHTML = i;
// }


