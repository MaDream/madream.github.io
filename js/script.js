    let list;

    function ready() 
    {
        document.getElementById('btnNew').onclick = function()
        {
            let action = {
                mode: 'add',
                text: document.getElementById('TODOinput').value
            };
            document.getElementById('TODOinput').value = '';
            let actionJSON = JSON.stringify(action);
            setLastAction(actionJSON);
            newElement(action.text);
        };

        let searchInput = document.getElementById('searchString');

        searchInput.oninput = function()
        {
            let action = 
            {
                mode: 'search',
                text: searchInput.value
            }
            let actionJSON = JSON.stringify(action);
            setLastAction(actionJSON);
            doSearch(action.text);
        };

        let lis = JSON.parse(localStorage.getItem('TODOlist'));
        for (let i = 0; i < lis.length; ++i)
            newElement(lis[i].content);
        localStorage.clear();
    };

    document.addEventListener("DOMContentLoaded", ready);

    let newElement = function(value)
    {
        if (value.length == 0)
            alert('Nigga?');
        
        else
        {
            let newItem = document.createTextNode(value);
            let someSpan = document.createElement('span');
            someSpan.className = 'item';
            let someLi = document.createElement('li');
            someLi.style = 'margin-top: 5px;';
            someSpan.appendChild(newItem);
            someLi.appendChild(someSpan);

            let delBtn = document.createElement('button');
            delBtn.innerText = 'Remove';
            delBtn.style = "margin-left: 5px;";
            delBtn.className = 'delete';
            delBtn.onclick = function () 
            {
                let item = this.parentNode;
                let span = item.getElementsByTagName('span');
                let action = 
                {
                    mode: 'remove',
                    text: span[0].innerText
                }
                let actionJSON = JSON.stringify(action);
                setLastAction(actionJSON);
                deleteElement(action.text);
            };
            someLi.appendChild(delBtn);

            let myBody = document.getElementById('list');
            myBody.appendChild(someLi);
    
            list = document.getElementById('list');
            let spans = list.getElementsByTagName('span');
            let obj = '[ ';
            for (let i = 0; i < spans.length; ++i)
            {
                obj = obj + '{ \"content\" : "' + spans[i].innerText + '\" }';
                if (i != spans.length - 1)
                    obj += ', ';
            }
            obj += ' ]';
            console.log(obj);
            localStorage.setItem('TODOlist', obj);
        }
    }


    let deleteElement = function(value)
    {
        let listOfLi = document.getElementsByTagName('li');
        let items = list.getElementsByTagName('span');
        for (let i = 0; i < items.length; ++i)
        {
            if (items[i].innerText.search(value) != -1)
            {
                listOfLi[i].parentNode.removeChild(listOfLi[i]);
                list = document.getElementById('list');
                return;
            }
        }
    };
    let doSearch = function(value)
    {
        if (document.getElementsByClassName('item').length < 1)
        {
            alert('Your list is empty!');
        }
        else
        {
            document.getElementById('searchString').value = value;
            let listOfLi = document.getElementsByTagName('li');
            let items = list.getElementsByTagName('span');
            for (let i = 0; i < items.length; ++i)
            {
                if (items[i].innerText.toLowerCase().search(value.toLowerCase()) == -1)
                    listOfLi[i].style = 'display: none;';
                else
                    listOfLi[i].style = 'margin-top: 5px;';
            }
        }
    };
    
    let parseLastAction = function()
    {
        let action = JSON.parse(localStorage.getItem('lastAction'));
        if (action.mode == 'add')
            newElement(action.text);
        else if (action.mode == 'remove')
            deleteElement(action.text);
        else if (action.mode == 'search')
            doSearch(action.text);
    };

    let setLastAction = function(actionJSON)
    {
        localStorage.setItem('lastAction', actionJSON);
    };

    window.addEventListener('storage', storageEventHandler, false);
    function storageEventHandler(event)
    {
        if (event.key == 'lastAction')
        {
            parseLastAction();
            let emptyAction = { mode: 'none' };
            setLastAction(JSON.stringify(emptyAction));
        }
            
    };
