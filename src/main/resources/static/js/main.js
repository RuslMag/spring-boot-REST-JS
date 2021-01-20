let showUser = '/api/user/profile';
let listUsers = '/api/admin/listUsers'
let getUserById = '/api/admin/user/';
let updateUserInfo = '/api/admin/user/update';
let deleteUserInfo = '/api/admin/user/delete/';
let createUser = '/api/admin/user/create';

let navbarInfo = $('#navBarInfo li');
let userInfo = $('#userInfo tbody');
let listUsersAdmin = $('#listUsersInfo tbody');
let updateButtonModal = $('#updateButtonInModal div');
let deleteButtonModal = $('#deleteButtonInModal div');
let createUserRoles = document.getElementById('roleSelect');
let createUserButton = document.getElementById('createUser');
let listUserNav = document.getElementById('list-users-tab');
let newUserNav = document.getElementById('create-user-tab');

$(document).ready(function () {
    navbar();
    showUserInfo();
    showAllUsers();
});

//удаляем дублирующуюся кнопку "изменить" нажатием на "закрыть"
let closeButtonUpdate = document.getElementById('closeUpdateModal');
closeButtonUpdate.onclick = function () {
    document.getElementById('updButtInModal').remove();
};

//удаляем дублирующуюся кнопку "удалить" нажатием на "закрыть"
let closeButtonDelete = document.getElementById('closeDeleteModal');
closeButtonDelete.onclick = function () {
    document.getElementById('delButtInModal').remove();
};

createUserButton.onclick = function () {
    void createNewUser();
};

listUserNav.onclick = function () {
    showUserTable();
};

newUserNav.onclick = function () {
    hideUserTable();
};

/*выводим юзера с ролью в навбаре*/
function navbar() {
    fetch(showUser)
        .then((response) => {
            if (!response.ok) {
                throw Error("Ошибка : " + response.status);
            }
            return response.json();
        })
        .then((data) => {
            const roles = data.roles.map(role => {
                return role.name;
            }).join(", ");

            let a = document.createElement('p');

            a.setAttribute('class', "text-white h6 nav-link");
            a.appendChild(document.createTextNode(data.email + " с ролью : " + `${roles.toString()}`));
            navbarInfo.append(a);
        })
        .catch(error => {
            console.log(error);
        });
}

/* отображаем инфо о юзере в /user */
function showUserInfo() {
    fetch(showUser)
        .then((response) => {
            if (!response.ok) {
                throw Error("Error : " + response.status);
            }
            return response.json();
        })
        .then((data) => {

            const userRoles = data.roles.map(role => {
                return role.name;
            }).join(", ");

            const idCol = "<td>" + data.id + "</td>";
            const usernameCol = "<td>" + data.username + "</td>";
            const ageCol = "<td>" + data.age + "</td>";
            const cityCol = "<td>" + data.city + "</td>";
            const emailCol = "<td>" + data.email + "</td>";
            const userRolesCol = "<td>" + userRoles + "</td>";
            const userRow = "<tr>" + idCol + usernameCol + ageCol + cityCol + emailCol + userRolesCol + "</tr>";

            userInfo.append(userRow);

        })
        .catch(error => {
            console.log(error);
        });
}

/* Отображаем список юзеров в админ панели */
function showAllUsers() {

    fetch(listUsers)
        .then((response) => {
            if (!response.ok) {
                throw Error("Error: " + response.status);
            }
            return response.json();
        })
        .then((data) => {
            data.map(user => {

                const userRoles = user.roles.map(role => {
                    return role.name;
                }).join(", ");

                let buttonEdit = document.createElement('a');
                let buttonDelete = document.createElement('a');

                let tr = document.createElement('tr');
                tr.setAttribute('id', "userDataTable");

                let counter = 0, td;

                for (let o in user) {
                    let td = document.createElement('td');

                    if (counter < 6) {
                        td.appendChild(document.createTextNode(user[o]));
                        tr.appendChild(td);
                    }
                    counter++;
                    if (counter === 7) {
                        td.appendChild(document.createTextNode(userRoles));
                        tr.appendChild(td);
                    }
                }

                buttonEdit.setAttribute('id', "updateButton");
                buttonEdit.setAttribute('class', "btn btn-primary");
                buttonEdit.setAttribute('data-bs-toggle', "modal");
                buttonEdit.setAttribute('data-bs-target', "#upd");
                buttonEdit.setAttribute('onclick', "fillingModalFormUpdate" + "(" + user.id + ")");
                buttonEdit.appendChild(document.createTextNode("Изменить"));

                buttonDelete.setAttribute('id', "deleteButton");
                buttonDelete.setAttribute('class', "btn btn-danger");
                buttonDelete.setAttribute('data-bs-toggle', "modal");
                buttonDelete.setAttribute('data-bs-target', "#del");
                buttonDelete.setAttribute('onclick', "fillingModalFormDelete" + "(" + user.id + ")");
                buttonDelete.appendChild(document.createTextNode("Удалить"));

                td = document.createElement('td');
                td.appendChild(buttonEdit);
                tr.appendChild(td);
                td = document.createElement('td');
                td.appendChild(buttonDelete);
                tr.appendChild(td);

                listUsersAdmin.append(tr);

            });
        })
        .catch(error => {
            console.log(error);
        })
}

/* создаем/передаем json и обновляем юзера в базе*/
async function updateUser() {

    let idEdit = '#idEdit';
    let userNameEdit = '#userNameEdit';
    let ageEdit = '#userAgeEdit';
    let cityEdit = '#userCityEdit';
    let emailEdit = '#userEmailEdit';
    let passwordEdit = '#userPasswordEdit';

    let elementUpdateUserRoles = document.getElementById('roleSelectEdit');
    let roleSelectedValues = Array.from(elementUpdateUserRoles.selectedOptions).map(el => el.value);
    let roleArray = convertToRoleSet(roleSelectedValues);

    let data = {
        id: $(idEdit).val(),
        username: $(userNameEdit).val(),
        age: $(ageEdit).val(),
        city: $(cityEdit).val(),
        email: $(emailEdit).val(),
        password: $(passwordEdit).val(),
        roles: roleArray
    };

    const response = await fetch(updateUserInfo, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });

    document.getElementById('updButtInModal').remove();

    clearTable();
    showAllUsers();
    return response.json();
}

/* Заполняем форму для редактирования, создаем кнопку*/
function fillingModalFormUpdate(id) {

    let updateButton = document.createElement('button');

    updateButton.setAttribute('type', "button");
    updateButton.setAttribute('id', "updButtInModal");
    updateButton.setAttribute('class', "btn btn-success");
    updateButton.setAttribute('data-dismiss', "modal");
    updateButton.setAttribute('onclick', "updateUser" + "(" + id + ")");
    updateButton.appendChild(document.createTextNode("Изменить"));
    updateButtonModal.append(updateButton);

    fetch(getUserById + id).then(function (response) {
        response.json().then(function (data) {

            $('#idEdit').val(id);
            $('#userNameEdit').val(data.username);
            $('#userAgeEdit').val(data.age);
            $('#userCityEdit').val(data.city);
            $('#userEmailEdit').val(data.email);
            $('#userPasswordEdit').val(data.password);

        });
    });
}

/* создаем массив ролей */
function convertToRoleSet(Array) {
    let roleArray = [];

    if (Array.indexOf("ROLE_USER") !== -1) {
        roleArray.unshift({id: 2, name: "ROLE_USER"});
    }
    if (Array.indexOf("ROLE_ADMIN") !== -1) {
        roleArray.unshift({id: 1, name: "ROLE_ADMIN"});
    }
    return roleArray;
}

/* создаем/передаем json и удаляем юзера */
async function deleteUser(value) {

    await fetch(deleteUserInfo + value, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    });

    document.getElementById('delButtInModal').remove();
    clearTable();
    showAllUsers();
}

/*заполнение модальной формы на удаление*/
function fillingModalFormDelete(id) {

    let deleteButton = document.createElement('button');

    deleteButton.setAttribute('type', "button");
    deleteButton.setAttribute('id', "delButtInModal");
    deleteButton.setAttribute('class', "btn btn-danger");
    deleteButton.setAttribute('data-dismiss', "modal");
    deleteButton.setAttribute('onclick', "deleteUser" + "(" + id + ")");
    deleteButton.appendChild(document.createTextNode("Удалить"));

    deleteButtonModal.append(deleteButton);

    fetch(getUserById + id).then(function (response) {
        response.json().then(function (data) {

            const userRoles = data.roles.map(role => {
                return role.name;
            }).join(", ");

            $('#idDelete').val(id);
            $('#userNameDelete').val(data.username);
            $('#userAgeDelete').val(data.age);
            $('#userCityDelete').val(data.city);
            $('#userEmailDelete').val(data.email);
            $('#userPasswordDelete').val(data.password);
            $('#roleSelectDelete').val(userRoles);
        });
    });
}

/*создание нового пользователя*/
async function createNewUser() {

    document.getElementById('hideUsersTable').hidden = true;
    document.getElementById('hideCreateUser').hidden = false;

    let rolesValues = Array.from(createUserRoles.selectedOptions).map(el => el.value);
    let roleArray = convertToRoleSet(rolesValues);

    let data = {

        username: $('#name').val(),
        age: $('#age').val(),
        city: $('#city').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        roles: roleArray
    };

    const response = await fetch(createUser, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    })
        .catch(error => {
            console.log(error);
        });
    return response.json();
}

function showUserTable() {
    if (document.getElementById("userDataTable") == null) {
        showAllUsers();
    }
    document.getElementById('hideUsersTable').hidden = false;
    document.getElementById('hideCreateUser').hidden = true;
}

function hideUserTable() {
    document.getElementById('hideUsersTable').hidden = true;
    document.getElementById('hideCreateUser').hidden = false;
    clearTable();
}

/*очищаем таблицу со списком юзеров в админке*/
function clearTable() {
    while (document.getElementById("userDataTable") != null) {
        document.getElementById("userDataTable").remove();
    }
}