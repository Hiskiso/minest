const Mine = -1


function generateField(size, bombsCount) {
    const field = new Array(size * size).fill(0)

    function inc(x, y) {

        if (x >= 0 && x < size && y >= 0 && y < size) {
            if (field[y * size + x] == Mine) { return }
            field[y * size + x] += 1
        }
    }

    for (let i = 0; i < bombsCount;) {
        const x = Math.floor(Math.random() * size)
        const y = Math.floor(Math.random() * size)
        if (field[y * size + x] == Mine) continue

        field[y * size + x] = Mine
        i += 1

        inc(x + 1, y)
        inc(x - 1, y)
        inc(x, y + 1)
        inc(x, y - 1)
        inc(x + 1, y - 1)
        inc(x - 1, y - 1)
        inc(x + 1, y + 1)
        inc(x - 1, y + 1)

    }
    return field
}

let Mask = {
    Transparent: null,
    Fill: "",
    Flag: "🚩",
    lose: "lose",
    sucess: "sucess"
}



function gameStart() {

    const fieldSize = document.getElementById("size").value
    const minesCount = document.getElementById("mines").value
    let field = document.getElementsByClassName("field")[0]
    field.style.gridTemplateColumns = "repeat(" + fieldSize + ",1fr)"

    let mask = new Array(fieldSize * fieldSize).fill(Mask.Fill)
    document.getElementsByClassName("startModal")[0].style.display = "none"

    
    if(localStorage.getItem("logs") == null){
        localStorage.setItem("logs", "[]")
    }
    currentStorage = JSON.parse(localStorage.getItem("logs")) 

    let fieldG = generateField(fieldSize, minesCount)
    document.body.style.overflow = "unset"

    let isGameEnd = false
    let flagsLeft = minesCount

    document.getElementById("flagsLeft").textContent = flagsLeft

    tick = 0
    document.getElementById("gameResult").onclick = ()=>{
        tick++
        currentStorage.sort
        if (tick ==5) {
            for (let i = 0; i < currentStorage.length; i++) {
                row = document.createElement("div")
                row.innerHTML = `<div>- </div><div>⏱${currentStorage[i].score} </div> <div>💣${currentStorage[i].minesCount}</div> <div>📏${currentStorage[i].fieldSize}</div>`
                row.classList.add("results")
                document.getElementById("settings").appendChild(row)
                
            }
        }
    }

    let scoreTimer 
    let score = 0

    scoreTimer = setInterval(() => {
        score++
        document.getElementById("timer").textContent = score 
    }, 1000);

    function update() {

        function endGame(){
            isGameEnd = true
            clearInterval(scoreTimer)
            let sucessCount = 0
            for (let j = 0; j < mask.length; j++) {

                if (fieldG[j] == -1 && mask[j] == Mask.Flag) {
                    mask[j] = Mask.sucess
                    sucessCount++
                }
                if ((fieldG[j] == -1 && mask[j] != Mask.Flag && mask[j] !== Mask.sucess) || (fieldG[j] !== -1 && mask[j] == Mask.Flag)) {
                    mask[j] = Mask.lose
                    if (mask[j] == Mask.Flag && fieldG[j] !== -1) {
                        fieldG[j] = Mask.Flag
                    }
                }
                if (mask[j] == Mask.Fill) {
                    mask[j] = Mask.Transparent
                }
            }

            if(sucessCount == minesCount){
                setTimeout(()=>{
                    document.getElementsByClassName("startModal")[0].style.display = "flex"
                    let gmaeResult = document.getElementById("gameResult")
                    gmaeResult.textContent = "🚩🚩🚩"
                    currentStorage.push({score, minesCount, fieldSize, fieldG})
                    localStorage.setItem("logs", JSON.stringify(currentStorage))
                },3000)
            } 
            if (sucessCount != minesCount) {
                setTimeout(()=>{
                    document.getElementsByClassName("startModal")[0].style.display = "flex"
                    let gmaeResult = document.getElementById("gameResult")
                    gmaeResult.textContent = "💣💣💣"
                },3000)
            }

        }

        field.innerHTML = ""
        for (let i = 0; i < fieldG.length;) {
            cell = document.createElement("div")
            cell.className = "cell"

            cell.textContent = fieldG[i]

            if (fieldG[i] == Mine) {
                cell.textContent = "💣"
            }

            if (fieldG[i] == 0) {
                cell.textContent = ""
            }

            if (mask[i] != Mask.Transparent && mask[i] !== Mask.lose && mask[i] !== Mask.sucess) {
                cell.textContent = Mask.Fill
                cell.classList.add("fill")
            }

            if (mask[i] == Mask.Flag) {
                cell.textContent = Mask.Flag
            }
            if (mask[i] == Mask.Fill) {
                cell.textContent = Mask.Fill
            }

            if (mask[i] == Mask.sucess) {
                if (fieldG[i] == -1) {
                    cell.textContent = Mask.Flag
                }
                cell.classList.add(Mask.sucess)
            }
            if (mask[i] == Mask.lose) {

                if (fieldG[i] != -1) {
                    cell.textContent = Mask.Flag
                }
                cell.classList.add(Mask.lose)
            }

            cell.id = i

            cell.onclick = (e) => {

 

                const x = Math.round(i % fieldSize - 1) == -1 ? 9 : Math.round(i % fieldSize - 1)
                const y = Math.ceil(i / fieldSize - 1)

                if (mask[i - 1] == Mask.Transparent || mask[i - 1] == Mask.Flag || isGameEnd) {
                    return
                }

                if(flagsLeft == 0 ){
                    if(confirm("Закончить игру?")){
                        endGame()
                        update()
                        return
                    }
                   
                }
               



                if (fieldG[(y * fieldSize + x)] == -1) {

                    endGame()
                    update()
                    // gameOver()
                }



                const clearing = []

                function clear(x, y) {
                    if (x >= 0 && x < fieldSize && y >= 0 && y < fieldSize) {
                        if (mask[y * fieldSize + x] == Mask.Transparent || mask[y * fieldSize + x] == Mask.Flag) return
                        clearing.push([x, y])
                    }
                }

                clear(x, y)

                while (clearing.length) {
                    const [x, y] = clearing.pop();

                    mask[y * fieldSize + x] = Mask.Transparent
                    if (fieldG[(y * fieldSize + x)] != 0) continue
                    clear(x + 1, y)
                    clear(x - 1, y)
                    clear(x, y + 1)
                    clear(x, y - 1)

                }

                update()
            }

            let timer


            function setFlag() {

               

                if (mask[i - 1] == Mask.Transparent )  {
                    return
                }

                if (mask[i - 1] == Mask.Flag) {
                    mask[i - 1] = Mask.Fill;
                    flagsLeft = flagsLeft + 1
                    document.getElementById("flagsLeft").textContent = flagsLeft
                    update()
                    return
                }
                if (mask[i - 1] == Mask.Fill && flagsLeft >= 1) {

                    flagsLeft = flagsLeft - 1
                    document.getElementById("flagsLeft").textContent = flagsLeft
                    mask[i - 1] = Mask.Flag

                    update()
                    
                }

                if(flagsLeft == 0 ){
                    if(confirm("Закончить игру?")){
                        endGame()
                        update()
                        return
                    }
                   
                }
                

            }

            cell.addEventListener('touchstart', () => {
                timer = setTimeout(() => {
                    setFlag()
                }, 400)

            })

            cell.addEventListener('touchend', () => {
                clearTimeout(timer)
            })

            cell.oncontextmenu = (e) => {
                event.preventDefault();
                setFlag()
                return false
            }

            field.appendChild(cell)

            i += 1
        }
    }
    update()
}