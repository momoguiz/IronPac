//Intégrer DOM à tout le fichier JS
document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('keydown', function(event) {
        if (
            event.key === 'ArrowUp' || event.key === 'ArrowDown' ||
            event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
        }
    });
    // Afficher le score
    const scoreDisplay = document.querySelector('#score')
    let score = 0

    const timereElt = document.getElementById('timer')
    const width = 28
    const grid = document.querySelector('.grid')


    //Création des paramètres du jeu"
    class Game {
        constructor(name, level , counter, pacManIndex, wall, ghostHomeColor, score,congratulation){
            this.name = name,
            this.level = level,
            this.counter = counter,
            this.pacManIndex = pacManIndex,
            this.wall = wall,
            this.ghostHomeColor = ghostHomeColor,
            this.score = score,
            this.congratulation = congratulation
        }
    }
    const games = [
        new Game('Level 1', 1, 120, 490, 'wall', 'rgb(51, 50, 50)', 3800, 'Félicitations, tu as réussis le level 1 !! Go au level 2'),
        new Game('Level 2', 2, 240, 490, 'wall', 'rgb(94, 91, 49)', 300, 'Félicitations, tu as réussis le level 2 !! Go au level 3'),
        new Game('Level 3', 3, 360, 492, 'wallor','rgb(73, 55, 55)', 500, 'Félicitations !! Maintenant reprends tes cours')
    ]
    // select game level
    let game = games[1];

    const layout = levels[game.level];

    // Tableau vide "squares" pour la création des "div"
    const squares = []

    // Création du board
    function createBoard(){
        for(let i=0; i<layout.length; i++){
            const square = document.createElement('div')
            grid.appendChild(square)
            squares.push(square)

            //Conditions de mise en page "layout"
            if(layout[i] === 0){
                squares[i].classList.add('coin')
            } else if(layout[i] === 1){
                squares[i].classList.add('wall')
                squares[i].style.backgroundImage = "url('./images/" + game.wall + ".webp')"
            } else if(layout[i] === 2){
                squares[i].classList.add('ghost-home')
                squares[i].style.backgroundColor = game.ghostHomeColor
            } else if(layout[i] === 3){
                squares[i].classList.add('flash')
            }
        }
    }
    createBoard()

    //Création de pacman
    let pacManIndex = game.pacManIndex //Par example, 490 est la position initiale de pacman

    squares[pacManIndex].classList.add('pacman')

    //mouvement de pacman (70-122=52)
    function pacManMove(e){
        squares[pacManIndex].classList.remove('pacman')
        squares[pacManIndex].removeAttribute('style')
        switch(e.keyCode){
            case 37:
                if(
                    pacManIndex % width !== 0 &&
                    !squares[pacManIndex -1].classList.contains('wall')&&
                    !squares[pacManIndex -1].classList.contains('ghost-home')
                )
                    pacManIndex -= 1
                    squares[pacManIndex].style.transform = 'rotate(180deg)' //left
                if(squares[pacManIndex -1] === squares[363]){
                    pacManIndex = 391
                }
                break
            case 38:
                if(
                    pacManIndex - width >= 0 &&
                    !squares[pacManIndex -width].classList.contains('wall')&&
                    !squares[pacManIndex -width].classList.contains('ghost-home')
                )
                    pacManIndex -= width
                    squares[pacManIndex].style.transform = 'rotate(270deg)' //up
                    break
            case 39 :
                if(
                    pacManIndex % width < width -1 &&
                    !squares[pacManIndex +1].classList.contains('wall')&&
                    !squares[pacManIndex +1].classList.contains('ghost-home')
                )
                pacManIndex += 1
                squares[pacManIndex].style.transform = 'rotate(0deg)' //right
                if(squares[pacManIndex +1] === squares[392]){
                    pacManIndex = 364
                }
                break
            case 40:
                if(
                    pacManIndex + width < width * width &&
                    !squares[pacManIndex +width].classList.contains('wall') &&
                    !squares[pacManIndex +width].classList.contains('ghost-home')
                )
                pacManIndex+= width
                squares[pacManIndex].classList.add('down')
                squares[pacManIndex].style.transform = 'rotate(90deg)' //down
                break
        }
        squares[pacManIndex].classList.add('pacman')
        pacEatCoin()
        pacEatFlash()
        gameOver()
        gameWin()
    }
    document.addEventListener('keyup', pacManMove)

    //pacman mange les "coin" 
    function pacEatCoin(){
        if(
            squares[pacManIndex].classList.contains('coin')){
            score += 50
            scoreDisplay.innerHTML = score
            squares[pacManIndex].classList.remove('coin')
            }
        }

    //pacman mange les "flash" et les ghost deviennent innofensifs
    function pacEatFlash(){
        if(
            squares[pacManIndex].classList.contains('flash')){
            score += 100
            ghosts.forEach(ghost => ghost.noDangerGhost = true)
            setTimeout(noDangerGhost, 10000)
            squares[pacManIndex].classList.remove('flash')
            }
        }

    //Les ghost redevienne dangereux
    function noDangerGhost(){
        ghosts.forEach(ghost => ghost.noDangerGhost = false)
    }

    //Création des fantômes "ghost"
    class Ghost {
        constructor(name, startIndex, speed){
            this.name = name
            this.startIndex = startIndex
            this.speed = speed
            this.currentIndex = startIndex
            this.noDangerGhost = false
            this.timerId = NaN
        }
    }
    const ghosts = [
        new Ghost('orangeGhost', 377, 250),     //blinky
        new Ghost('pinkGhost', 375, 350),       //pinky
        new Ghost('redGhost', 350, 350),        //inky
        
    ]

    // Add extra ghosts
    if (game.level === 1) {
        ghosts.push(new Ghost('blueGhost', 380, 350));
        ghosts.push(new Ghost('blueGhost', 377, 250));
    } else if (game.level === 2) {
        ghosts.push(new Ghost('blueGhost', 380, 350));
        ghosts.push(new Ghost('blueGhost', 377, 250));
        ghosts.push(new Ghost('redGhost', 380, 350));
        ghosts.push(new Ghost('blueGhost', 376, 250));
        ghosts.push(new Ghost('boss', 376, 100));
    } else if (game.level === 3) {
        ghosts.push(new Ghost('redGhost', 380, 350));
        ghosts.push(new Ghost('blueGhost', 376, 250));
        ghosts.push(new Ghost('blueGhost', 377, 250));
        ghosts.push(new Ghost('boss', 376, 50));
        ghosts.push(new Ghost('boss', 376, 50));
    }

    //faire apparaitre les fantômes dans le grid
    ghosts.forEach(ghost => {
        squares[ghost.currentIndex].classList.add(ghost.name)
        squares[ghost.currentIndex].classList.add('ghost')
    })
    
    //Créer des déplacements aléatoire des fantômes
    ghosts.forEach(ghost => ghostMove(ghost))
    function ghostMove(ghost){
        const directions = [-1,  +1, width, -width]
        let direction = directions[Math.floor(Math.random() * directions.length)]
        ghost.timerId = setInterval(function(){
            //Si la prochaine case où va le fantome n'a pas de fantome ni de mur :
            if (
                !squares[ghost.currentIndex + direction].classList.contains('ghost')&&
                !squares[ghost.currentIndex + direction].classList.contains('wall')) {
                //supprimer les fantomes :
                squares[ghost.currentIndex].classList.remove(ghost.name)
                squares[ghost.currentIndex].classList.remove('ghost', 'scareGhost')
                //déplacer à cette  case :
                ghost.currentIndex += direction
                squares[ghost.currentIndex].classList.add(ghost.name, 'ghost')
            //sinon se déplacer dans une autre direction aléatoire
            } else {
                direction = directions[Math.floor(Math.random() * directions.length)]
            }
            //si le fantome est inofensif
            if (ghost.noDangerGhost){
                squares[ghost.currentIndex].classList.add('scareGhost')
            }
            //si le fantome est inoffensif et pacman est sur lui
            if (
                ghost.noDangerGhost && squares[ghost.currentIndex].classList.contains('pacman')){
                squares[ghost.currentIndex].classList.remove(ghost.name, 'ghost', 'scareGhost')
                ghost.currentIndex = ghost.startIndex
                score += 100
                squares[ghost.currentIndex].classList.add(ghost.name, 'ghost')
            }
            gameOver()
        }, ghost.speed)
    }

    //fonction Game Over
    function gameOver(){
        if(
            squares[pacManIndex].classList.contains('ghost')&&
            !squares[pacManIndex].classList.contains('scareGhost')){
            ghosts.forEach(ghost => clearInterval(ghost.timerId))
            document.removeEventListener('keyup', pacManMove)
            setTimeout(function(){alert('GAME OVER, click OK pour recommencer ce level')}, 500)
        }
    }

    // Timer
    let counter = game.counter
    const timer = setInterval(function() {
        timereElt.innerText = counter;
        counter--;
        if(counter === 0){
            gameOver()
            clearInterval(timer)
        }
    }, 1000);


    //function Game WIN
    function gameWin(){
        if (score === game.score) {
            ghosts.forEach(ghost => clearInterval(ghost.timerId))
            document.addEventListener('keyup', pacManMove)
            setTimeout(function(){alert(game.congratulation)}, 500)
            // setTimeout(function(){
            //     if (game.level !== 3){ 
            //         game = games[game.level]
            //     }
            //     else { 
            //         game = games[0]
            //     }
            //     window.location.reload();     // Doesn't work :(
            // }, 2000)
        }
    }
})
