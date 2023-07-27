class myApp {
    constructor(data) {
        this.currentBoard = 0;
        this.data = data;
        console.log(this.data);
        this.updateView();
        this.popupInit();
        this.insertColumnInit();
    }
    generateNav() {
        let nav = document.querySelector('#nav-desktop');
        nav.innerHTML = "";
        this.data.boards.forEach((el, id) => {
            let li = document.createElement('li');
            let span1 = document.createElement('span');
            let span2 = document.createElement('span');
            span2.innerText = el.name;
            li.appendChild(span1);
            li.appendChild(span2);
            li.setAttribute('data-name', el.name);
            if (id == this.currentBoard) {
                li.className = "active";
            }
            else {
                li.addEventListener('click', () => {
                    console.log(el.name);
                    this.currentBoard = id;
                    this.updateView();
                });
            }
            li.setAttribute("data-id", `${id}`);
            nav.append(li);
        });
    }
    updateView() {
        this.generateNav();
        this.setBoard();
    }
    getBoard(boardName) {
        let index = this.data.boards.forEach((el, id) => {
            console.log(id);
            if (el.name === boardName) {
                return id;
            }
        });
        return index;
    }
    setBoard() {
        let board = this.data.boards[this.currentBoard];
        document.getElementById('board-name').innerText = board.name;
        let div = document.querySelector('.columns');
        div.innerHTML = "";
        for (let i = 0; i < board.columns.length; i++) {
            const column = board.columns[i];
            div.appendChild(this.columnTemplate(column, i));
        }
    }
    taskTemplate(obj, id, columnID) {
        let div = document.createElement('div');
        div.setAttribute("data-id", `${id}`);
        var str = `<h3>${obj.name}</h3>
        <p>${obj.subtasks.filter(el => el.isCompleted == true).length} of ${obj.subtasks.length} ${obj.subtasks.length > 1 ? 'subtasks' : 'subtask'}</p>
        `;
        div.innerHTML = str;
        div.addEventListener('click', () => {
            this.displayTaskPopup(columnID, id);
        });
        return div;
    }
    columnTemplate(obj, id) {
        let div = document.createElement('div');
        div.className = "column";
        var str = `<h2>
            <span>${obj.name}</span>
            <span>(${obj.tasks.length})</span>
        </h2>
        <div class="tasks">
        </div>`;
        div.innerHTML = str;
        obj.tasks.forEach((task, index) => {
            div.querySelector('.tasks').appendChild(this.taskTemplate(task, index, id));
        });
        return div;
    }
    popupInit() {
        let popup = document.createElement('div');
        popup.id = "popup";
        let overlay = document.createElement('div');
        overlay.addEventListener('click', () => {
            this.togglePopup("close");
        });
        overlay.id = "overlay";
        document.body.append(popup);
        document.body.append(overlay);
    }
    togglePopup(status) {
        let overlay = document.querySelector("#overlay");
        let popup = document.querySelector("#popup");
        if (overlay && popup) {
            if (status === "open") {
                overlay.className = "opened";
                popup.className = "opened";
            }
            else {
                overlay.className = "";
                popup.className = "";
            }
        }
    }
    insertColumnInit() {
        let elem = document.querySelector('#insertNewColumn');
        elem.addEventListener("click", () => {
            this.insertColumnPopup();
        });
    }
    editBoardPopup(type = undefined) {
        let board = this.data.boards[this.currentBoard];
        let popup = document.querySelector("#popup");
        popup.innerHTML = this.editBoardPopupTemplate();
        board.columns.forEach((column, id) => {
            let div = document.createElement('div');
            let str = `<input class="input-box" value="${column.name}">
            <span class="close">
            <img src="./assets/icons/close.svg" />
            </span>`;
            div.innerHTML = str;
            div.setAttribute('data-existing', `${id}`);
            div.querySelector('.close').addEventListener('click', () => {
                div.remove();
            });
            popup.querySelector('.input-container').appendChild(div);
        });
        popup.querySelector('#addNewColumn').addEventListener('click', () => {
            this.addNewInputBox(popup.querySelector(".input-container"), "eg. Todo");
        });
        if (type === "insert") {
            this.addNewInputBox(popup.querySelector(".input-container"), "eg. Todo");
        }
        popup.querySelector('#saveChanges').addEventListener('click', () => {
            saveChanges();
        });
        this.togglePopup("open");
        const validateInput = () => { };
        const saveChanges = () => {
            let newBoard = {
                name: "",
                columns: []
            };
            let boardNameElem = popup.querySelector('#board-name');
            newBoard.name = boardNameElem.value;
            popup.querySelector('.input-container').querySelectorAll('input').forEach(input => {
                if (input.value.trim() != "") {
                    var eID = input.parentElement.getAttribute("data-existing") ? parseInt(input.parentElement.getAttribute("data-existing")) : null;
                    if (eID != null) {
                        if (input.value !== board.columns[eID].name) {
                            newBoard.columns.push(Object.assign(Object.assign({}, board.columns[eID]), { name: input.value }));
                        }
                        else {
                            newBoard.columns.push(Object.assign({}, board.columns[eID]));
                        }
                    }
                    else
                        newBoard.columns.push({ name: input.value, tasks: [] });
                }
            });
            console.log(newBoard);
            this.data.boards[this.currentBoard] = newBoard;
            this.togglePopup("close");
            this.updateView();
        };
    }
    displayTaskPopup(columnID, taskID) {
        let columns = this.data.boards[this.currentBoard].columns;
        let task = columns[columnID].tasks[taskID];
        let popup = document.querySelector("#popup");
        popup.innerHTML = this.displayTaskPopupTemplate(columnID, taskID);
        task.subtasks.forEach((subtask, id) => {
            let checkbox = this.generateCheckBox(subtask.name, subtask.isCompleted);
            checkbox.addEventListener('click', () => {
                if (this.data.boards[this.currentBoard].columns[columnID].tasks[taskID].subtasks[id].isCompleted) {
                    checkbox.removeAttribute("checked");
                    this.data.boards[this.currentBoard].columns[columnID].tasks[taskID].subtasks[id].isCompleted = false;
                }
                else {
                    checkbox.setAttribute("checked", "");
                    this.data.boards[this.currentBoard].columns[columnID].tasks[taskID].subtasks[id].isCompleted = true;
                }
                this.updateView();
            });
            popup.querySelector(".checkbox-container").appendChild(checkbox);
        });
        let elem = popup.querySelector('.select-container');
        let optionBox = this.generateOptionBox(columns.map((column, id) => { return { name: column.name, id }; }), columnID);
        optionBox.querySelector('.options').querySelectorAll("span").forEach((el) => {
            if (el.getAttribute("data-id") ? parseInt(el.getAttribute("data-id")) != columnID : false) {
                el.addEventListener("click", () => {
                    this.data.boards[this.currentBoard].columns[parseInt(el.getAttribute("data-id"))].tasks.push(this.data.boards[this.currentBoard].columns[columnID].tasks[taskID]);
                    this.data.boards[this.currentBoard].columns[columnID].tasks.splice(taskID, 1);
                    this.togglePopup("close");
                    this.updateView();
                });
            }
        });
        elem.appendChild(optionBox);
        this.togglePopup("open");
    }
    editBoardPopupTemplate() {
        let board = this.data.boards[this.currentBoard];
        let str = `<div class="edit-board">
            <h1>Edit Board</h1>
            <div>
                <h2>Board Name</h2>
                <input class="input-box" value="${board.name}" id="board-name">
            </div>
            <div>
                <h2>Board Columns</h2>
                <div class="input-container">
                </div>
            </div>
            <div class="btn btn-secondary" id="addNewColumn">
                    + Add New Column
            </div>
            <div class="btn btn-primary" id="saveChanges">
                    Save Changes
            </div>
        </div>`;
        return str;
    }
    displayTaskPopupTemplate(columnID, taskID) {
        let columns = this.data.boards[this.currentBoard].columns;
        let task = columns[columnID].tasks[taskID];
        let str = `<div class="display-task">
            <header>
                <h1>${task.name}</h1>
            </header>
            <div>
                <h2>Subtasks (${task.subtasks.filter(el => el.isCompleted == true).length} of ${task.subtasks.length})</h2>
                <div class="checkbox-container">
                </div>
            </div>
            <div>
                <h2>Current Status</h2>
                <div class="select-container">
                </div>
            </div>
        </div>`;
        return str;
    }
    insertColumnPopup() {
        this.editBoardPopup("insert");
    }
    addNewInputBox(inputContainer, inputPlaceholder) {
        let div = document.createElement('div');
        let str = `<input class="input-box" placeholder="${inputPlaceholder}">
        <span class="close">
        <img src="./assets/icons/close.svg" />
        </span>`;
        div.innerHTML = str;
        div.querySelector('.close').addEventListener('click', () => {
            div.remove();
        });
        inputContainer.appendChild(div);
    }
    generateCheckBox(name, isChecked) {
        let div = document.createElement('div');
        div.className = "checkbox-box";
        if (isChecked)
            div.setAttribute("checked", "");
        let str = `<span></span>
        <span>${name}</span>`;
        div.innerHTML = str;
        return div;
    }
    generateOptionBox(arr, id) {
        let div = document.createElement('div');
        div.className = "option-box";
        let str = `<div class="input-box" tabIndex="0">
        <span>${arr[id].name}</span>
        <span>
        <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>
        </span>
        </div>
        <div class="options">
            ${arr.map((obj, index) => {
            return `<span data-id="${index}">${obj.name}</span>`;
        }).join("")}
        </div>`;
        div.innerHTML = str;
        return div;
    }
}
var app;
fetch('./data/dev-data.json').then(res => res.json()).then(data => {
    app = new myApp(data);
});
