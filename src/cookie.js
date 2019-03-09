/*
ДЗ 7 - Создать редактор cookie с возможностью фильтрации

7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
- имя
- значение
- удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
- имя
- значение
- добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

7.3: На странице должно быть текстовое поле для фильтрации cookie
В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
Если в поле фильтра пусто, то должны выводиться все доступные cookie
Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
*/

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

function isMatching(full, chunk) {
    let result = full.toUpperCase().includes(chunk.toUpperCase())

    return result
}

function deleteCookie(cookie_name, el) {
            var cookie_date = new Date();  // Текущая дата и время
            cookie_date.setTime(cookie_date.getTime() - 1);
            document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
            el.remove()
        }

        function setCookie(valIn) {

            let objCookie = document.cookie.split('; ').reduce((prev, current) => {
                const [name, value] = current.split('=')
                prev[name] = value
                return prev
            }, {})

            for (let cookie of Object.keys(objCookie)) {
                if (valIn) {
                    if (isMatching(cookie, valIn)) {

                        let val = objCookie[cookie]
                        let tr = document.createElement('tr')
                        let trName = document.createElement('td')
                        trName.innerText = cookie
                        tr.appendChild(trName)

                        let trValue = document.createElement('td')
                        trValue.innerText = val
                        tr.appendChild(trValue)

                        let removeBtn = document.createElement('button')
                        removeBtn.innerText = 'Remove'
                        tr.appendChild(removeBtn)
                        removeBtn.addEventListener('click', (e) => deleteCookie(cookie, e.target.closest('tr')))


                        listTable.appendChild(tr)
                    }
                } else {
                    let val = objCookie[cookie]
                    let tr = document.createElement('tr')
                    let trName = document.createElement('td')
                    trName.innerText = cookie
                    tr.appendChild(trName)

                    let trValue = document.createElement('td')
                    trValue.innerText = val
                    tr.appendChild(trValue)

                    let removeBtn = document.createElement('button')
                    removeBtn.innerText = 'Remove'
                    tr.appendChild(removeBtn)
                    removeBtn.addEventListener('click', (e) => deleteCookie(cookie, e.target.closest('tr')))


                    listTable.appendChild(tr)
                }
            }


        }

    filterNameInput.addEventListener('keyup', function () {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie

    listTable.innerHTML = ""
    if (this.value === '') {
        setCookie()
    } else {
        setCookie(this.value)
    }

});


        addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    if (addNameInput.value !== '' && addValueInput.value !== '') {
        listTable.innerHTML = ''
        document.cookie = `${addNameInput.value}=${addValueInput.value}`


        setCookie()

        addNameInput.value = ''
        addValueInput.value = ''
    }


});