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
    constructor(name) {
        this.name = name;
        this.tasks = [];
        this.doc = Folder.createDocFolderElement(this);
    }

    //Adds new task to folader array and returns added task;
    addTask(text, isComplited = false) {
        let newTask = new Task(text, isComplited);
        this.tasks.push(newTask);
        return newTask;
    }

    //Removes <task> from the array of tasks if it exists there
    removeTask(task) {
        this.tasks = this.tasks.filter(el => el != task);
    }

    saveToLocalStorage() {
        let objTasks = [];
        for (let j = 0; j < this.tasks.length; j++) {
            objTasks.push({
                text: this.tasks[j].text,
                isCompleted: this.tasks[j].isCompleted,
            });
        }

        let objFolder = {
            name: this.name,
            tasks: objTasks,
        }
        localStorage.setItem(Folder.lsPrefix + this.name, JSON.stringify(objFolder));
    }

    static lsPrefix = "f";
    static createFromLocalStorage(name) {
        let objFolder = JSON.parse(localStorage.getItem(name));
        if (objFolder) {
            let folder = new Folder(objFolder.name);
            for (let i = 0; i < objFolder.tasks.length; i++) {
                let newTask = folder.addTask(objFolder.tasks[i].text, objFolder.tasks[i].isCompleted);
                newTask.doc.crossButton.addEventListener("click", (event) => {
                    docTaskList.removeChild(newTask.doc.main);
                    folder.removeTask(newTask);
                    folder.saveToLocalStorage();
                });

                newTask.doc.checkbox.addEventListener('change', (event) => {
                    newTask.isCompleted = !newTask.isCompleted;
                    folder.saveToLocalStorage();
                });

            }
            return folder;
        } else
            return undefined;
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
            radio: docInputRadio,
        };
    }


}

class Task {
    constructor(text, isCompleted = false) {
        this.text = text;
        this.isCompleted = isCompleted;
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
        if (task.isCompleted)
            docLabelCheckbox.setAttribute("checked", "");
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