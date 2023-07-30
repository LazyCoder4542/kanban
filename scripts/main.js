class myApp {
    constructor(data) {
        this.currentBoard = 0;
        this.menuController = new AbortController;
        this.data = data;
        console.log(this.data);
        this.mql = window.matchMedia("(max-width: 540px)");
        this.popupInit();
        this.updateView();
        this.insertColumnInit();
        this.headerMenuInit();
        this.toggleSideBarInit();
        document.addEventListener('keyup', (ev) => {
            if (ev.key == "Escape") {
                this.togglePopup("close");
            }
        });
        this.mql.addEventListener("change", () => {
            if (this.mql.matches)
                this.menuController = new AbortController();
            this.updateView();
        });
        if (!this.mql.matches)
            document.querySelector('.container').classList.add('side-bar-opened');
    }
    generateMenuNav() {
        let side = document.querySelector('.menu');
        let popup = document.querySelector("#popup");
        let div = document.createElement('div');
        div.className = "menu";
        div.innerHTML = `<div class="boards">
        <h2>ALL BOARDS (${this.data.boards.length})</h2>
        <div>
        <ul id="nav-desktop"></ul>
          <span id="createNewBoard">&plus; Create New Board</span>
        </div>
        </div>
        <div class="theme">
            <div class="sun">
            <img src="./assets/icons/sun.svg" alt="sun" />
            </div>
            <div class="toggle">
            <span></span>
            </div>
            <div class="moon">
            <img src="./assets/icons/moon.svg" alt="moon" />
            </div>
        </div>`;
        let elem = div.querySelector('#createNewBoard');
        elem.addEventListener('click', () => {
            this.newBoardPopup();
        });
        let ul = div.querySelector('#nav-desktop');
        ul.innerHTML = "";
        this.data.boards.forEach((el, id) => {
            let li = document.createElement('li');
            let span1 = document.createElement('span');
            span1.innerHTML = `
            <?xml version="1.0" encoding="UTF-8" standalone="no"?>
                <svg
                xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:cc="http://creativecommons.org/ns#"
                xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                xmlns:svg="http://www.w3.org/2000/svg"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                width="16"
                height="16"
                version="1.1"
                id="svg4"
                sodipodi:docname="icon-board-white.svg"
                inkscape:version="1.0.2 (e86c870879, 2021-01-15)">
                <metadata
                id="metadata10">
                <rdf:RDF>
                <cc:Work
                        rdf:about="">
                        <dc:format>image/svg+xml</dc:format>
                        <dc:type
                        rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                        <dc:title></dc:title>
                    </cc:Work>
                    </rdf:RDF>
                </metadata>
                <defs
                id="defs8" />
                <sodipodi:namedview
                pagecolor="#ffffff"
                bordercolor="#666666"
                    borderopacity="1"
                    objecttolerance="10"
                    gridtolerance="10"
                    guidetolerance="10"
                    inkscape:pageopacity="0"
                    inkscape:pageshadow="2"
                    inkscape:window-width="1882"
                    inkscape:window-height="1367"
                    id="namedview6"
                    showgrid="false"
                    inkscape:zoom="63"
                    inkscape:cx="8"
                    inkscape:cy="8"
                    inkscape:window-x="26"
                    inkscape:window-y="23"
                    inkscape:window-maximized="0"
                    inkscape:current-layer="svg4" />
                    <path
                    d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                    fill="currentColor"
                    id="path2"/>
                </svg>

            `;
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
                    if (this.mql.matches)
                        this.togglePopup("close");
                    this.updateView();
                });
            }
            li.setAttribute("data-id", `${id}`);
            ul.append(li);
        });
        if (this.mql.matches) {
            document.querySelector('#board-name').addEventListener('click', () => {
                popup.innerHTML = "";
                popup.appendChild(div);
                this.togglePopup("open");
                document.querySelector(".container").classList.add("side-bar-opened");
            }, { signal: this.menuController.signal });
        }
        else {
            this.menuController.abort();
            this.togglePopup("close");
            side.innerHTML = "";
            side.append(...div.childNodes);
        }
    }
    updateView() {
        this.generateMenuNav();
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
                this.currentPopup = popup.querySelector('div').className;
            }
            else {
                overlay.className = "";
                popup.className = "";
                if (this.currentPopup === "menu" && this.mql.matches) {
                    document.querySelector(".container").classList.remove("side-bar-opened");
                }
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
        popup.innerHTML = this.editBoardPopupTemplate(type);
        if (type != "new") {
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
        }
        popup.querySelector('#addNewColumn').addEventListener('click', () => {
            this.addNewInputBox(popup.querySelector(".input-container"), "eg. Todo");
        });
        if (type === "insert" || type === 'new') {
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
            if (type === 'new')
                this.data.boards.push(newBoard);
            else
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
        optionBox.querySelector('.input-box').addEventListener('click', () => {
            let r = document.querySelector('.options');
            if (optionBox.classList.contains('opened')) {
                optionBox.classList.remove('opened');
                r.style.height = "0";
            }
            else {
                optionBox.classList.add('opened');
                r.style.height = 2 * columns.length + 'rem';
            }
        });
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
        let menu = document.querySelector('.popup-menu');
        const toggleMenu = (str = null) => {
            if (str == "close") {
                menu.classList.remove("opened");
            }
            else if (str == "open") {
                menu.classList.add("opened");
            }
            else {
                if (menu.classList.contains("opened")) {
                    menu.classList.remove("opened");
                }
                else {
                    menu.classList.add("opened");
                }
            }
        };
        menu.querySelector('#togglePopupMenu').addEventListener("click", () => {
            toggleMenu();
        });
        menu.querySelector('#editTask').addEventListener("click", () => {
            toggleMenu("close");
            this.addTaskPopup({ columnID, taskID });
        });
        elem.appendChild(optionBox);
        this.togglePopup("open");
    }
    addTaskPopup(edit) {
        let columns = this.data.boards[this.currentBoard].columns;
        let task = edit ? columns[edit.columnID].tasks[edit.taskID] : null;
        let popup = document.querySelector("#popup");
        popup.innerHTML = this.addTaskPopupTemplate(edit);
        popup.querySelector('#addNewSubtask').addEventListener('click', () => {
            this.addNewInputBox(popup.querySelector(".input-container"), "eg. Make coffee");
        });
        if (task)
            task.subtasks.forEach((el, id) => this.addNewInputBox(popup.querySelector(".input-container"), "eg. Make coffee", el.name, id));
        this.addNewInputBox(popup.querySelector(".input-container"), "eg. Make coffee");
        let elem = popup.querySelector('.select-container');
        let optionBox = this.generateOptionBox(columns.map((column, id) => { return { name: column.name, id }; }), edit ? edit.columnID : 0);
        const toggleDrop = () => {
            let r = document.querySelector('.options');
            if (optionBox.classList.contains('opened')) {
                optionBox.classList.remove('opened');
                r.style.height = "0";
            }
            else {
                optionBox.classList.add('opened');
                r.style.height = 2 * columns.length + 'rem';
            }
        };
        optionBox.querySelector('.input-box').addEventListener('click', toggleDrop);
        optionBox.querySelector('.options').querySelectorAll("span").forEach((el, id) => {
            el.addEventListener("click", () => {
                if (el.getAttribute("data-id") ? parseInt(el.getAttribute("data-id")) != parseInt(optionBox.getAttribute("data-id")) : false) {
                    optionBox.setAttribute("data-id", `${id}`);
                    optionBox.querySelector('.input-box').querySelector('span').innerText = columns[id].name;
                    toggleDrop();
                }
            });
        });
        elem.appendChild(optionBox);
        popup.querySelector('#saveChanges').addEventListener('click', () => {
            saveChanges();
        });
        this.togglePopup("open");
        const saveChanges = () => {
            let newTask = {
                name: "",
                subtasks: [],
            };
            newTask = Object.assign(Object.assign({}, newTask), { name: popup.querySelector('#board-name').value.trim(), subtasks: Array.from(popup.querySelector('.input-container').querySelectorAll('input')).filter(input => input.value.trim() != "").map(input => {
                    return {
                        name: input.value.trim().charAt(0).toUpperCase() + input.value.trim().slice(1),
                        isCompleted: input.getAttribute("data-id") ? task.subtasks[parseInt(input.getAttribute("data-id"))].isCompleted : false
                    };
                }) });
            console.log(newTask);
            if (edit) {
                if (parseInt(optionBox.getAttribute("data-id")) == edit.columnID) {
                    this.data.boards[this.currentBoard].columns[edit.columnID].tasks[edit.taskID] = newTask;
                }
                else {
                    this.data.boards[this.currentBoard].columns[parseInt(optionBox.getAttribute("data-id"))].tasks.push(newTask);
                    this.data.boards[this.currentBoard].columns[edit.columnID].tasks.splice(edit.taskID, 1);
                }
            }
            else
                this.data.boards[this.currentBoard].columns[parseInt(optionBox.getAttribute("data-id"))].tasks.push(newTask);
            this.togglePopup("close");
            this.updateView();
        };
    }
    newBoardPopup() {
        this.editBoardPopup("new");
    }
    editBoardPopupTemplate(type) {
        let board = this.data.boards[this.currentBoard];
        let str = `<div class="edit-board">
            <h1>${type === 'new' ? 'Add New Board' : 'Edit Board'}</h1>
            <div>
                <h2>Board Name</h2>
                <input class="input-box" value="${type === 'new' ? '' : board.name}" id="board-name" placeholder="e.g. Web Design">
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
                <div class="popup-menu">
                    <span id="togglePopupMenu">
                        <img src="assets/icons/vertical-ellipsis.svg">
                    </span>
                    <span>
                        <span id="editTask">Edit Task</span>
                        <span id="deleteTask">Delete Task</span>
                    </span>
                </div>
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
    addTaskPopupTemplate(edit) {
        let columns = this.data.boards[this.currentBoard].columns;
        let task = edit ? columns[edit.columnID].tasks[edit.taskID] : null;
        let str = `<div class="add-task">
            <h1>${task ? "Edit task" : "Add New Task"}</h1>
            <div>
                <h2>Title</h2>
                <input class="input-box" id="board-name" placeholder="e.g. Take a coffee break" ${task ? `value="${task.name}"` : ""}>
            </div>
            <div>
                <h2>Description</h2>
                <textarea class="input-box" id="board-description" rows="5" placeholder="e.g. It's always good to take a break. This 15-minute break will recharge the batteries a little."></textarea>
            </div>
            <div>
                <h2>Subtasks</h2>
                <div class="input-container">
                </div>
            </div>
            <div class="btn btn-secondary" id="addNewSubtask">
                    + Add New Column
            </div>
            <div>
                <h2>Current Status</h2>
                <div class="select-container">
                </div>
            </div>
            <div class="btn btn-primary" id="saveChanges">
                    Save Changes
            </div>
        </div>`;
        return str;
    }
    insertColumnPopup() {
        this.editBoardPopup("insert");
    }
    addNewInputBox(inputContainer, inputPlaceholder, inputValue, inputID) {
        let div = document.createElement('div');
        let str = `<input class="input-box" placeholder="${inputPlaceholder}" ${inputValue ? `value="${inputValue}"` : ""} ${inputID != undefined ? `data-id="${inputID}"` : ""}>
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
        div.setAttribute('data-id', `${id}`);
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
    headerMenuInit() {
        let elem = document.querySelector('.header-menu');
        const toggleMenu = (str = null) => {
            if (str == "close") {
                elem.classList.remove("opened");
            }
            else if (str == "open") {
                elem.classList.add("opened");
            }
            else {
                if (elem.classList.contains("opened")) {
                    elem.classList.remove("opened");
                }
                else {
                    elem.classList.add("opened");
                }
            }
        };
        elem.querySelector('#toggleMenu').addEventListener("click", () => {
            toggleMenu();
        });
        elem.querySelector('#editBoard').addEventListener("click", () => {
            toggleMenu("close");
            this.editBoardPopup();
        });
        elem.querySelector('#deleteBoard').addEventListener("click", () => {
            toggleMenu("close");
            this.deleteBoard();
        });
        document.querySelector("#addTask").addEventListener("click", () => {
            this.addTaskPopup();
        });
    }
    deleteBoard() {
        this.data.boards.splice(this.currentBoard, 1);
        if (this.currentBoard >= this.data.boards.length) {
            this.currentBoard = this.data.boards.length - 1;
        }
        this.updateView();
    }
    toggleSideBarInit() {
        let elem = document.querySelector('.container');
        elem.querySelector('#showSideBar').addEventListener('click', () => {
            elem.classList.add('side-bar-opened');
        });
        elem.querySelector('#hideSideBar').addEventListener('click', () => {
            elem.classList.remove('side-bar-opened');
        });
    }
}
var app;
fetch('./data/dev-data.json').then(res => res.json()).then(data => {
    app = new myApp(data);
});
