
const docTaskList = document.querySelector(".todo-list-ul");
const docFolders = document.querySelector(".section-folders");
const docTaskTextInput = document.querySelector(".input-todo");

const idGenerator = new UniqueGen();
let folders = [];
let currentFolder;

//addFolder(new Folder("Tasks", idGenerator));
//addFolder(new Folder("Shopping", idGenerator));
//addFolder(new Folder("Cleaning", idGenerator));
//addFolder(new Folder("Work", idGenerator));

//Tasks' representation
function clearDocTasks() {
	while (docTaskList.firstChild) {
		docTaskList.removeChild(docTaskList.lastChild);
	}

}

function fillDocTasksFromFolder(folder) {
	for (let i = 0; i < folder.tasks.length; i++) {
		docTaskList.appendChild(folder.tasks[i].doc.main);
	}
}


//Folders
function changeFolder(folder) {
	if (!folder) {
		clearDocTasks();
		currentFolder = null;
	}
	if (currentFolder !== folder) {
		clearDocTasks();
		currentFolder = folder;
		fillDocTasksFromFolder(folder);
	}
	let index = folders.indexOf(currentFolder);
    localStorage.setItem("currentFolder", JSON.stringify(index === -1 ? null : index));
}

function addFolder(folder) {
	if (!folder) {
		return;
	}
	if (!folders.find(inFolder => inFolder === folder)) {
		folders.push(folder);
		docFolders.appendChild(folder.doc.main);
		folder.doc.main.addEventListener("click", (event) => {
			changeFolder(folder);
		})

		// localStorage
		folder.saveToLocalStorage();

		refreshFoldersHeader();
	}
}

function refreshFoldersHeader() {
	let foldersNames = folders.map((el) => {
		return Folder.lsPrefix + el.name;
	})
	localStorage.setItem("foldersNames", JSON.stringify(foldersNames));
}

function removeFolder(folder) {
	if (!folder) {
		return;
	}
	folders = folders.filter(fl => fl !== folder);
	docFolders.removeChild(folder.doc.main);
	if (currentFolder === folder) {
		if (folders.length > 0) {
			changeFolder(folders[0]);
		} else {
			changeFolder(null);
			clearDocTasks();
		}
	}

	//localStorage
	localStorage.removeItem(Folder.lsPrefix + folder.name);
	refreshFoldersHeader();
}

//Local storage
function loadFromLocalStorage() {
	let objFoldersNames = JSON.parse(localStorage.getItem("foldersNames"));
	if (objFoldersNames) {
		for (let i = 0; i < objFoldersNames.length; i++) {
			let folder = Folder.createFromLocalStorage(objFoldersNames[i]);
			if (folder) {
				addFolder(folder);
			}
		}
	}

	let objCurrentFolder = localStorage.getItem("currentFolder");
	if (objCurrentFolder) {
		changeFolder(folders[JSON.parse(objCurrentFolder)]);
		currentFolder.doc.radio.setAttribute("checked", "");
	}
}

