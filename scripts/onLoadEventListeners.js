
loadFromLocalStorage();

for (let i = 0; i < folders.length; i++) {
    docFolders.appendChild(folders[i].doc.main);
}

document.querySelector("body").addEventListener("keydown", (event) => {
    //console.log(event.key);
    if (event.altKey && event.key === 'c') {
        localStorage.clear();
    }
})

docTaskTextInput.addEventListener("keydown", (event) => {
    if (event.keyCode === 13 && docTaskTextInput.value.length > 0) {
        if (!currentFolder) {
            if (folders.length === 0) {
                console.log("There's no folder to add task to. Creating default one.")
                let defaultFolder = new Folder("Tasks");
                defaultFolder.doc.radio.setAttribute("checked", "");
                addFolder(defaultFolder);
            }
            changeFolder(folders[0]);
        }
        let newTask = currentFolder.addTask(docTaskTextInput.value);
        currentFolder.saveToLocalStorage();
        docTaskList.appendChild(newTask.doc.main);

        newTask.doc.crossButton.addEventListener("click", (event) => {
            docTaskList.removeChild(newTask.doc.main);
            currentFolder.removeTask(newTask);
            currentFolder.saveToLocalStorage();
        });

        newTask.doc.checkbox.addEventListener('change', (event) => {
            newTask.isCompleted = !newTask.isCompleted;
            currentFolder.saveToLocalStorage();
        });



        docTaskTextInput.value = "";
    }
})