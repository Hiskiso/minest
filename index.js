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
    Flag: "🚩"
}



function gameStart() {

    const fieldSize = document.getElementById("size").value
    const minesCount = document.getElementById("mines").value
    let field = document.getElementsByClassName("field")[0]
    field.style.gridTemplateColumns = "repeat(" + fieldSize + ",1fr)"

    mask = new Array(fieldSize * fieldSize).fill(Mask.Fill)

    console.log(mask);

    document.getElementsByClassName("startModal")[0].style.display = "none"

    let fieldG = generateField(fieldSize, minesCount)
    document.body.style.overflow = "unset"
    function update() {

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

            if (mask[i] != Mask.Transparent) {
                cell.textContent = Mask.Fill
                cell.classList.add("fill")
            }

            cell.id = i

            cell.onclick = (e) => {

                

                if (mask[i - 1] == Mask.Transparent) {
                    return
                }
                mask[i - 1] = Mask.Transparent
                if (fieldG[i] == -1) {
                    // gameOver()
                }

                const x = Math.floor(i%fieldSize)
                const y = Math.round(i/fieldSize)+1

                const clearing = []

                function clear(x,y) {
                    if (x >= 0 && x < fieldSize && y >= 0 && y < fieldSize) {
                        if(mask[y*fieldSize+x] == Mask.Transparent) return
                        clearing.push([x, y])
                    }
                }

                clear(x, y)

                while (clearing.length) {
                    const [x, y] = clearing.pop();
                    
                    mask[y*fieldSize+x] = Mask.Transparent
                    if (fieldG[(y*fieldSize+x)-1] != 0) continue
                    clear(x + 1, y)
                    clear(x - 1, y)
                    clear(x, y + 1)
                    clear(x, y - 1)
                }

                update()
            }

            field.appendChild(cell)

            i += 1
        }
    }
    update()
}