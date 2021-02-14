const create_form = document.querySelector(".create_modal form");
const search_form = document.getElementById("search_form_id");
const list = document.getElementsByClassName("list")[0];
const main = document.querySelector("#main");
var next_page = 0;
var previous_page = 0;

$(document).ready( () => {
    getRequest( 0 );
});


// var spans = document.getElementsByTagName('span');
// spans[1].onclick = nextPage();
// spans[2].onclick = prevPage();

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    const modal = document.getElementById("create_modal_id");

    if (event.target == modal) {
      createFormClose();
    }
  }

create_form.addEventListener("submit", function(e){
    e.preventDefault();
    const in_bookName = document.getElementById("bookName").value;
    const in_issueNumber = document.getElementById("issueNumber").value;
    const in_publishDate = document.getElementById("publishDate").value;
    const in_description = document.getElementById("description").value;
    const img = document.getElementById("img").value;
    const url = 'http://localhost:8080/api/v1/books';

    const data = {
        "bookName" : in_bookName,
        "issueNumber" : parseInt(in_issueNumber, 10),
        "publishDate" : in_publishDate,
        "description" : in_description
    };

    fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-Type' : 'application/json',
        authorization : 'Setler nepredsk4zuemo'
    }
    }).catch(function(error){
        alert('Error:', error);
        // console.error('Error:', error);
    });

    // .then( async function(response){
    //     // const json = await response.json(); // await
    //     console.log('Response:', response.status);
    // })
});

search_form.addEventListener("submit", function(e){
    e.preventDefault();
    get_request( 0 );
});

function createFormClose() {
    document.getElementById('create_modal_id').style.display='none';
}

async function getRequest( page ) {
    const size = 6;
    var total_elem = 0;
    const url = `http://localhost:8080/api/v1/books?page=${page}&size=${size}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            authorization: 'Setler nepredsk4zuemo'
        }
        }).then( async (response) => {
            const json = await response.json();

            // removing all li tags from ul
            $(list).empty(); 
            if( json.page.totalElements == 0 ){
                alert("DB is empty");
            } else{
                for( i = 0; i < json._embedded.bookDtoList.length; i++ ){
                    create_block(json._embedded.bookDtoList[i]);
                }
                listSort( list );
                total_elem = json.page.totalElements;
            }
        }).then( () => {
            // console.log(total_elem, " / ", size);
            // console.log("total/size", parseInt(total_elem / size));

            if( page < parseInt(total_elem / size) )
                next_page = page + 1;
            else
                next_page = page;
            if( page == 0 )
                previous_page = page;
            else
                previous_page = page - 1;

            // console.log( next_page, previous_page);
        }).catch( (error) => {
            console.error('Error: ', error);
    });
}

function create_block( book_json ){
    bookName = book_json.bookName;
    issueNumber = book_json.issueNumber;
    bookId = bookName.replace(/\s/g, '') + issueNumber;
    satisfactionScore = book_json.satisfactionScore;

    let li = document.createElement("li");
    li.classList.add("book");
    // li.onclick = get_book();
    let HTMLbox = `
        <h2 class="name">
            <span>${bookName}#${issueNumber}</span>
        </h2>
        <div class="satisfactionScore"><sup>${satisfactionScore}</sup></div>
        <button class="upratebtn" id="${bookId}" onclick="upRate(this)">Up</button>
        <button class="downratebtn" id="${bookId}" onclick="downRate(this)">Down</button>
    `;
    li.innerHTML = HTMLbox;
    // li.style.backgroundImage = cover;    <img>
    list.appendChild(li);
}

function listSort( ul ){
    var new_ul = ul.cloneNode(false);

    var li_array = [];
    for(var i = ul.childNodes.length; i--;){
        if(ul.childNodes[i].nodeName === 'LI')
        li_array.push(ul.childNodes[i]);
    }

    // Sort the li_array in descending order
    li_array.sort(function(a, b){
        return parseInt(b.getElementsByClassName("satisfactionScore")[0].childNodes[0].innerText , 10) - 
                parseInt(a.getElementsByClassName("satisfactionScore")[0].childNodes[0].innerText , 10);
    });

    for(var i = 0; i < li_array.length; i++){
        new_ul.appendChild(li_array[i]);
    }
    // console.log(ul.parentNode);
    // console.log(ul);
    // console.log(new_ul);
    // ul.parentNode.replaceChild(new_ul, ul);
    main.replaceChild(new_ul, main.childNodes[0]);
}

function upRate( book ){
    id = book.id;
    
    url = `http://localhost:8080/api/v1/books/up?id=${id}`;
    
    fetch(url, {
        method: 'PUT'
        });
}

function downRate( book ){
    id = book.id;
    
    url = `http://localhost:8080/api/v1/books/down?id=${id}`;
    
    fetch(url, {
        method: 'PUT'
        });
}

// function get

function nextPage(){
    getRequest(next_page);
}

function prevPage(){
    getRequest(previous_page);
}