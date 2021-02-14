// let search_form = document.querySelector(".control form");
let create_form = document.querySelector(".create_modal form");
let search_form = document.getElementById("search_form_id");
// let list = document.getSelection(".list");
let list = document.getElementsByClassName("list")[0];

function create_form_close() {
    document.getElementById('create_modal_id').style.display='none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    const modal = document.getElementById("create_modal_id");

    if (event.target == modal) {
      create_form_close();
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
    get_request();
});

async function get_request() {
    url = "http://localhost:8080/api/v1/books?page=0&size=6";
    
    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            authorization: 'Setler nepredsk4zuemo'
        }
        }).then( async (response) => {
            const json = await response.json();
            // console.log('Response: ', json);

            // removing all li tags from ul
            $(list).empty(); 
            if( json.page.totalElements == 0 ){
                alert("DB is empty");
            } else{
                for( i = 0; i < json._embedded.bookDtoList.length; i++ ){
                    create_block(json._embedded.bookDtoList[i]);
                }
            }
        }).catch( (error) => {
            console.error('Error: ', error);
    });
}

function create_block( book_json ){
    bookName = book_json.bookName;
    issueNumber = book_json.issueNumber;
    bookId = bookName.replace(/\s/g, '') + issueNumber;
    satisfactionScore = book_json.satisfactionScore;

    // console.log(json);
    let li = document.createElement("li");
    li.classList.add("book");
    let HTMLbox = `
        <h2 class="name">
            <span>${bookName}#${issueNumber}</span>
        </h2>
        <div vclass="satisfactionScore"><sup>${satisfactionScore}</sup></div>
        <button class="upratebtn" id="${bookId}" onclick="upRate(this)">Up</button>
        <button class="downratebtn" id="${bookId}" onclick="downRate(this)">Down</button>
    `;
    li.innerHTML = HTMLbox;
    // li.style.backgroundImage = cover;    <img>
    list.appendChild(li);
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