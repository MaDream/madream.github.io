    let list;

    function ready() 
    {
        localStorage.clear();
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

        let lis = localStorage.getItem('TODOlist');
        if (lis !== null && lis != '')
            document.getElementById('list').innerHTML = lis;
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
            let lis = list.getElementsByTagName('li');
            localStorage.setItem('TODOlist', lis.innerHtml);
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
