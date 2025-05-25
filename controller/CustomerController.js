import { customer_db } from "../db/db.js";
import CustomerModel from "../model/CustomerModel.js";


function generateCustomerId() {
    let nextId = customer_db.length + 1;
    return `C${nextId.toString().padStart(3, '0')}`;
}


$(document).ready(function () {
    $('#id').val(generateCustomerId());
});


$("#customer_save").on('click', function () {
    let id = $('#id').val() || generateCustomerId();
    let name = $('#name').val();
    let address = $('#address').val();
    let contact = $('#contact').val();

    const contactRegex = /^[0-9]{10}$/;

    if (name === '' || address === '' || contact === '') {
        Swal.fire({
            title: 'Error!',
            text: 'All fields are required!',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    } else if (!contactRegex.test(contact)) {
        Swal.fire({
            title: 'Error!',
            text: 'Contact number must be exactly 10 digits.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    } else {
        let customer_data = new CustomerModel(id, name, address, contact);

        customer_db.push(customer_data);
        console.log(customer_db);
        loadCustomers();
        clear();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
    }
});

function loadCustomers() {
    $('#customer_tbody').empty();
    customer_db.map((item, index) => {
        let data = `<tr>
                        <td>${index + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.address}</td>
                        <td>${item.contact}</td>
                    </tr>`;
        $('#customer_tbody').append(data);
    });
}


let idx = -1;
$("#customer_tbody").on('click', 'tr', function () {
    idx = $(this).index();
    let obj = customer_db[idx];

    $("#id").val(obj.id);
    $("#name").val(obj.name);
    $("#address").val(obj.address);
    $("#contact").val(obj.contact);
});


$("#customer_update").on('click', function () {
    if (idx === -1) {
        alert("Please select a Customer to update.");
        return;
    }

    let id = $("#id").val();
    let name = $("#name").val();
    let address = $("#address").val();
    let contact = $("#contact").val();

    const contactRegex = /^[0-9]{10}$/;

    if (name === '' || address === '' || contact === '') {
        Swal.fire({
            title: 'Error!',
            text: 'All fields are required!',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    } else if (!contactRegex.test(contact)) {
        Swal.fire({
            title: 'Error!',
            text: 'Contact number must be exactly 10 digits.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    customer_db[idx].id = id;
    customer_db[idx].name = name;
    customer_db[idx].address = address;
    customer_db[idx].contact = contact;

    loadCustomers();
    idx = -1;
    clear();

    Swal.fire({
        title: "Updated Successfully!",
        icon: "success",
    });
});


$("#customer_delete").on('click', function () {
    if (idx === -1) {
        alert("Please select a Customer to delete.");
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: "This Customer will be removed permanently.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            customer_db.splice(idx, 1);
            loadCustomers();
            idx = -1;
            clear();

            Swal.fire({
                title: 'Deleted!',
                text: 'The Customer has been removed.',
                icon: 'success'
            });
        }
    });
});


function clear() {
    $('#id').val(generateCustomerId());
    $('#name').val('');
    $('#address').val('');
    $('#contact').val('');
}
