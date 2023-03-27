class UniqueGen {
    currentState;
    constructor() {
        this.currentState = 0x0;
    }

    getUnique() {
        this.currentState++;
        return this.currentState;
    }

    reset() {
        this.currentState = 0;
    }
}

class Folder {
    constructor(name, idGenerator) {
        this.name = name;
        this.tasks = [];
        this.idgen = idGenerator;
        this.id = this.idgen.getUnique();
        this.doc = Folder.createDocFolderElement(this);
    }

    //Adds new task to folader array and returns added task;
    addTask(text) {
        let newTask = new Task(text, this.idgen.getUnique());
        this.tasks.push(newTask);
        return newTask;
    }

    //Removes <task> from the array of tasks if it exists there
    removeTask(task) {
        this.tasks = this.tasks.filter(el => el != task);
    }

    static createDocFolderElement(folder) {
        const docMain = document.createElement("label");
        docMain.classList.add("folder-radio-representation-label");
        //docMain.setAttribute("for", folder.id.toString());

        const docInputRadio = document.createElement("input");
        docInputRadio.setAttribute("type", "radio");
        //docInputRadio.setAttribute("id", folder.id.toString());
        docInputRadio.setAttribute("name", "folder");
        docInputRadio.classList.add("folder-radio");

        const docSpan = document.createElement("span");
        docSpan.classList.add("folder-radio-representation-span", "effect-hover");

        const docSpanText = document.createTextNode(folder.name);

        docSpan.appendChild(docSpanText);

        docMain.append(docInputRadio, docSpan);


        return {
            main: docMain,
        };
    }


}

class Task {
    constructor(text, id) {
        this.text = text;
        this.id = id;
        this.isCompleted = false;
        this.doc = Task.createDocListElement(this);

    }

    //Returns object with fields
    //  main - Root DOM element of task representation
    //  checkbox - DOM element that refers to a checkbox
    //  crossButton - button in the top-right corner
    static createDocListElement(task) {
        const docLi = document.createElement("li")

        const docLabel = document.createElement("label");
        docLabel.classList.add("todo-checkbox-representation-label");
        //docLabel.setAttribute("for", task.id.toString());

        const docLabelCheckbox = document.createElement("input");
        docLabelCheckbox.setAttribute("type", "checkbox");
        //docLabelCheckbox.setAttribute("id", task.id.toString());
        docLabelCheckbox.classList.add("checkbox-input");

        const docLabelSpan = document.createElement("span");
        docLabelSpan.classList.add("todo-checkbox-representation-span");

        docLabel.append(docLabelCheckbox, docLabelSpan);

        const docSpan = document.createElement("span");
        docSpan.classList.add("todo-task-span");
        const docSpanText = document.createTextNode(task.text);
        docSpan.append(docSpanText);

        const docButton = document.createElement("input");
        docButton.setAttribute("type", "button");
        docButton.setAttribute("value", "\u2716");
        docButton.classList.add("todo-task-remove-button");

        docLi.append(docLabel, docSpan, docButton);

        return {
            main: docLi,
            checkbox: docLabelCheckbox,
            crossButton: docButton,
        };
    }
}