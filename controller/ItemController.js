import { item_db } from "../db/db.js";
import ItemModel from "../model/ItemModel.js";

// Auto-generate item code like I001, I002, ...
function generateItemCode() {
    let nextId = item_db.length + 1;
    return `I${nextId.toString().padStart(3, '0')}`;
}

// Set initial code on load
$(document).ready(function () {
    $('#code').val(generateItemCode());
});

// Save item
$("#item_save").on('click', function () {
    let code = $('#code').val() || generateItemCode();
    let itemName = $('#itemName').val();
    let qty = $('#qty').val();
    let price = $('#price').val();

    if (itemName === '' || qty === '' || price === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    } else {
        let item_data = new ItemModel(code, itemName, qty, price);

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
});

// Load item table
function loadTableData() {
    $('#item_tbody').empty();

    item_db.map((item, index) => {
        let data = `<tr>
                        <td>${index + 1}</td>
                        <td>${item.itemName}</td>
                        <td>${item.qty}</td>
                        <td>${item.price}</td>
                    </tr>`;
        $('#item_tbody').append(data);
    });
}

// Row click to populate fields
let idx = -1;
$("#item_tbody").on('click', 'tr', function () {
    idx = $(this).index();

    let obj = item_db[idx];

    $("#code").val(obj.code);
    $("#itemName").val(obj.itemName);
    $("#qty").val(obj.qty);
    $("#price").val(obj.price);
});

// Update item
$("#item_update").on('click', function () {
    if (idx === -1) {
        alert("Please select an item to update.");
        return;
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

    idx = -1;
    clear();

    Swal.fire({
        title: "Updated Successfully!",
        icon: "success",
    });
});

// Delete item
$("#item_delete").on('click', function () {
    if (idx === -1) {
        alert("Please select an item to delete.");
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: "This item will be removed permanently.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            item_db.splice(idx, 1);
            loadTableData();
            idx = -1;
            clear();

            Swal.fire({
                title: 'Deleted!',
                text: 'The item has been removed.',
                icon: 'success'
            });
        }
    });
});

// Clear input fields and auto-generate next code
function clear() {
    $('#code').val(generateItemCode());
    $('#itemName').val('');
    $('#qty').val('');
    $('#price').val('');
}
