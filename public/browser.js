// Html list element stored in function
let itemTemplate=(item)=>{
    return ` <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id=${item._id} class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id=${item._id} class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}

//initial page load render
//
let ourHTML =items.map((item)=>{
    return itemTemplate(item)
}).join("")

// insert lists elements into <ul> elements
document.getElementById("item-list").insertAdjacentHTML("beforeend",ourHTML)

//to create item
let createInput=document.getElementById("create-field")
// Below code,After user click on submittiontion button
// axios send reg from browser to server
document.getElementById("create-form").addEventListener("submit",(e)=>{
    e.preventDefault()
    axios.post("/create-item",{text: createInput.value}).then((response)=>{
        //after data stored in db ,this data render on screeen
        document.getElementById("item-list").insertAdjacentHTML("beforeend",itemTemplate(response.data))
        createInput.value=""
        createInput.focus()
    }).catch(()=>{
        console.log("please ")})
})


document.addEventListener("click",(e)=>{
    
    // Edite button feature
    if(e.target.classList.contains("edit-me")){
        let editedValue=prompt("Edit It..", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        // browser req to node.js server 
        //Below we try to send data from browser env to node.js env 
       if(editedValue){
        axios.post("/update-item",{newV:editedValue, id: e.target.getAttribute("data-id")}).then(()=>{
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = editedValue
        }).catch(()=>{
            console.log("please try again later")})
       }
    }
    // Delete Buttuon feature
    if(e.target.classList.contains("delete-me")){ 
        if(confirm("Do you want to Delete this data permanentally?")){
            axios.post("/delete-item",{id: e.target.getAttribute("data-id")}).then(()=>{
                e.target.parentElement.parentElement.remove()
            }).catch(()=>{
                console.log("please try again later")})
        }
    }

}
)
    

       
      

