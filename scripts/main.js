var myApp = /** @class */ (function () {
    function myApp(data) {
        this.board = {
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
        };
        this.data = data;
        console.log(this.data);
        this.board = this.getBoard("Platform Launch");
        this.updateView();
        this.popupInit();
        this.insertColumnInit();
    }
    myApp.prototype.generateNav = function () {
        var _this = this;
        var nav = document.querySelector('#nav-desktop');
        nav.innerHTML = "";
        this.data.boards.forEach(function (el) {
            var li = document.createElement('li');
            var span1 = document.createElement('span');
            var span2 = document.createElement('span');
            span2.innerText = el.name;
            li.appendChild(span1);
            li.appendChild(span2);
            li.setAttribute('data-name', el.name);
            if (el.name == _this.board.name) {
                li.className = "active";
            }
            else {
                li.addEventListener('click', function () {
                    console.log(el.name);
                    _this.board = el;
                    _this.updateView();
                });
            }
            var str = "<li ".concat(el.name == _this.board.name ? 'class="active"' : "", " data-name=").concat(el.name, ">\n                <span></span>\n                <span>").concat(el.name, "</span>\n            </li>");
            nav.append(li);
        });
    };
    myApp.prototype.updateView = function () {
        this.generateNav();
        this.setBoard();
    };
    myApp.prototype.getBoard = function (boardName) {
        //// FIND DATA
        var currentBoard = this.data.boards.find(function (board) { return board.name == boardName; });
        return currentBoard;
    };
    myApp.prototype.setBoard = function () {
        //// UPDATE DOM
        // heading
        document.getElementById('board-name').innerText = this.board.name;
        // columns
        var div = document.querySelector('.columns');
        div.innerHTML = "";
        for (var i = 0; i < this.board.columns.length; i++) {
            var column = this.board.columns[i];
            div.innerHTML += this.columnTemplate(column);
        }
    };
    myApp.prototype.toggleBoard = function () { };
    myApp.prototype.taskTemplate = function (obj) {
        var str = "<div>\n            <h3>".concat(obj.name, "</h3>\n            <p>").concat(obj.subtasks.filter(function (el) { return el.isCompleted == true; }).length, " of ").concat(obj.subtasks.length, " ").concat(obj.subtasks.length > 1 ? 'subtasks' : 'subtask', "</p>\n        </div>");
        return str;
    };
    myApp.prototype.columnTemplate = function (obj) {
        var _this = this;
        var str = "<div class=\"column\">\n            <h2>\n                <span>".concat(obj.name, "</span>\n                <span>(").concat(obj.tasks.length, ")</span>\n            </h2>\n            <div class=\"tasks\">\n            ").concat(obj.tasks.map(function (task) { return _this.taskTemplate(task); }).join(""), "\n            </div>\n        </div>");
        return str;
    };
    myApp.prototype.popupInit = function () {
        var _this = this;
        var popup = document.createElement('div');
        popup.id = "popup";
        var overlay = document.createElement('div');
        overlay.addEventListener('click', function () {
            _this.togglePopup("close");
        });
        overlay.id = "overlay";
        document.body.append(popup);
        document.body.append(overlay);
    };
    myApp.prototype.togglePopup = function (status) {
        var overlay = document.querySelector("#overlay");
        var popup = document.querySelector("#popup");
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
    };
    myApp.prototype.insertColumnInit = function () {
        var _this = this;
        var elem = document.querySelector('#insertNewColumn');
        elem.addEventListener("click", function () {
            _this.insertColumnPopup();
        });
    };
    myApp.prototype.editBoardPopup = function (type) {
        if (type === void 0) { type = undefined; }
        var popup = document.querySelector("#popup");
        if (type === "insert") {
            popup.innerHTML = this.editBoardPopupTemplate();
        }
        this.togglePopup("open");
    };
    myApp.prototype.editBoardPopupTemplate = function (type) {
        if (type === void 0) { type = undefined; }
        var str = "<div>\n            <h1>Edit Board</h1>\n            <div>\n                <h2>Board Name</h2>\n                <div class=\"input-box\">".concat(this.board.name, "</div>\n            </div>\n        </div>");
        return str;
    };
    myApp.prototype.insertColumnPopup = function () {
        this.editBoardPopup("insert");
    };
    return myApp;
}());
var app;
fetch('./data/dev-data.json').then(function (res) { return res.json(); }).then(function (data) {
    app = new myApp(data);
});
