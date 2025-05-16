import {item_db} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";

$("#item_save").on('click' , function (){
    let code = $('#code').val();
    let itemName = $('#itemName').val();
    let qty = $('#qty').val();
    let price = $('#price').val();

    if (code === '' || itemName === '' || qty === '' || price === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

    }else {
        let item_data = new ItemModel(code,itemName,qty,price);

        item_db.push(item_data);
        console.log(item_db);
        loadTableData();
        clear();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
    }
})

function loadTableData(){
    $('#item_tbody').empty();

    item_db.map((item,index)=>{
        let code = item.code;
        let itemName = item.itemName;
        let qty = item.qty;
        let price = item.price;

        let data = `<tr>
                        <td>${index+1}</td>
                        <td>${itemName}</td>
                        <td>${qty}</td>
                        <td>${price}</td>`
        $('#item_tbody').append(data);
    })
}

let idx = -1;

$("#item_tbody").on('click' , 'tr' , function (){
    idx = $(this).index();
    console.log(idx);

    let obj = item_db[idx]
    console.log(obj)

    let code = obj.code;
    let itemName = obj.itemName;
    let qty = obj.qty;
    let price = obj.price;

    $("#code").val(code);
    $("#itemName").val(itemName);
    $("#qty").val(qty);
    $("#price").val(price);
})

$("#item_update").on('click' , function (){
    if (idx === -1){
        alert("please select item")
        return
    }

    let code = $('#code').val();
    let itemName = $('#itemName').val();
    let qty = $('#qty').val();
    let price = $('#price').val();

    item_db[idx].code = code;
    item_db[idx].itemName = itemName;
    item_db[idx].qty = qty;
    item_db[idx].price = price;

    loadTableData();

    idx = -1
    clear();

    Swal.fire({
        title: "Updated Successfully!",
        icon: "success",
    });

})

$("#item_delete").on('click' , function (){
    if (idx === -1){
        alert("select items")
        return
    }

    Swal.fire({
        title: 'Are you sure?',
        text: "This Customer will be removed permanently.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
    }).then((result)=>{
        if (result.isConfirmed){
            item_db.splice(idx,1);

            loadTableData();

            idx = -1;
            clear();

            Swal.fire({
                title: 'Deleted!',
                text: 'The Customer has been removed.',
                icon: 'success'
            });
        }
    })
})
function clear(){
    $('#code').val('');
    $('#itemName').val('');
    $('#qty').val('');
    $('#price').val('');

}