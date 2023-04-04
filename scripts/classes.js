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
        docMain.classList.add("folder-label");

        const docInputRadio = document.createElement("input");
        docInputRadio.setAttribute("type", "radio");
        docInputRadio.setAttribute("name", "folder");
        docInputRadio.classList.add("folder-radio");

        const docSpan = document.createElement("span");
        docSpan.classList.add("folder-span", "effect-hover");

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
        docLi.classList.add("effect-hover");

        const docLabel = document.createElement("label");
        docLabel.classList.add("task-label");
        //docLabel.setAttribute("for", task.id.toString());

        const docLabelCheckbox = document.createElement("input");
        docLabelCheckbox.setAttribute("type", "checkbox");
        if (task.isCompleted)
            docLabelCheckbox.setAttribute("checked", "");
        //docLabelCheckbox.setAttribute("id", task.id.toString());
        docLabelCheckbox.classList.add("task-checkbox");

        const docLabelSpan = document.createElement("span");
        docLabelSpan.classList.add("task-span");

        docLabel.append(docLabelCheckbox, docLabelSpan);

        const docTextLabel = document.createElement("label");
        docTextLabel.classList.add("task-text");
        const docSpanText = document.createTextNode(task.text);
        docTextLabel.append(docSpanText);

        const docButton = document.createElement("input");
        docButton.setAttribute("type", "button");
        docButton.setAttribute("value", "\u2716");
        docButton.classList.add("task-close");

        docLi.append(docLabel, docTextLabel, docButton);

        return {
            main: docLi,
            checkbox: docLabelCheckbox,
            crossButton: docButton,
        };
    }
}