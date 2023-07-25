interface Board {
    name: string,
    columns: [Column]
}
interface Column {
    name: string,
    tasks: [Task]
}
interface Task {
    name: string,
    subtasks: [{
        name: string,
        isCompleted: boolean
    }]
}
class myApp {
    board: Board = {
        name: '',
        columns: [{
            name: '',
            tasks: [{
                name: '',
                subtasks: [{
                    name: '',
                    isCompleted: false
                }]
            }]
        }]
    }
    data: { boards:[Board] }
    constructor(data: { boards:[Board] }) {
        this.data = data
        console.log(this.data);
        this.board = this.getBoard("Platform Launch") as Board
        this.updateView()
        this.popupInit()
        this.insertColumnInit()
    }
    generateNav() {
        let nav = document.querySelector('#nav-desktop') as HTMLUListElement
        nav.innerHTML = ""
        this.data.boards.forEach(el => {
            let li = document.createElement('li')
            let span1 = document.createElement('span')
            let span2 = document.createElement('span')
            span2.innerText = el.name
            li.appendChild(span1)
            li.appendChild(span2)
            li.setAttribute('data-name', el.name)
            if (el.name == this.board.name) {
                li.className = "active"
            }
            else {
                li.addEventListener('click', () => {
                    console.log(el.name);
                    this.board = el
                    this.updateView()
                })
            }

            let str = 
            `<li ${el.name == this.board.name ? 'class="active"' : ""} data-name=${el.name}>
                <span></span>
                <span>${el.name}</span>
            </li>`
            nav.append(li)
        })
    }
    updateView() {
        this.generateNav()
        this.setBoard()
    }
    getBoard(boardName: string) {
        //// FIND DATA
        let currentBoard = this.data.boards.find(board => board.name == boardName)
        return currentBoard
    }
    setBoard() {
        //// UPDATE DOM
        
        // heading
        (document.getElementById('board-name') as HTMLHeadingElement).innerText = this.board.name;

        // columns
        let div = document.querySelector('.columns') as HTMLDivElement
        div.innerHTML = ""
        for (let i = 0; i < this.board.columns.length; i++) {
            const column = this.board.columns[i];
            div.innerHTML += this.columnTemplate(column)
        }
    }
    toggleBoard() {}
    taskTemplate(obj: Task) {
        var str = 
        `<div>
            <h3>${obj.name}</h3>
            <p>${obj.subtasks.filter(el => el.isCompleted == true).length} of ${obj.subtasks.length} ${obj.subtasks.length > 1 ? 'subtasks' : 'subtask'}</p>
        </div>`;
        return str;
    }
    columnTemplate(obj: Column) {
        var str = 
        `<div class="column">
            <h2>
                <span>${obj.name}</span>
                <span>(${obj.tasks.length})</span>
            </h2>
            <div class="tasks">
            ${
                obj.tasks.map(task => this.taskTemplate(task)).join("")
            }
            </div>
        </div>`
        return str
    }
    popupInit() {
        let popup = document.createElement('div')
        popup.id = "popup"
        let overlay = document.createElement('div')
        overlay.addEventListener('click', () => {
            this.togglePopup("close")
        })
        overlay.id = "overlay"
        document.body.append(popup)
        document.body.append(overlay)
    }
    togglePopup(status: "open" | "close") {
        let overlay = document.querySelector("#overlay")
        let popup = document.querySelector("#popup")
        
        if (overlay && popup) {
            if (status === "open") {
                overlay.className = "opened"
                popup.className = "opened"
            }
            else {
                overlay.className = ""
                popup.className = ""
            }
        }
    }
    insertColumnInit() {
        let elem = document.querySelector('#insertNewColumn') as HTMLDivElement
        elem.addEventListener("click", () => {
            this.insertColumnPopup()
        })
    }
    editBoardPopup(type: "insert" | undefined = undefined) {
        let popup = document.querySelector("#popup") as HTMLDivElement
        if (type === "insert") {
            popup.innerHTML = this.editBoardPopupTemplate()
        }
        this.togglePopup("open")
    }
    editBoardPopupTemplate(type: "insert" | undefined = undefined) {
        let str = 
        `<div>
            <h1>Edit Board</h1>
            <div>
                <h2>Board Name</h2>
                <div class="input-box">${this.board.name}</div>
            </div>
        </div>`
        return str
    }
    insertColumnPopup() {
        this.editBoardPopup("insert")
    }
}
var app;
fetch('./data/dev-data.json').then(res => res.json()).then(data => {
    app = new myApp(data)
})