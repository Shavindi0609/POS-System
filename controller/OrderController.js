import { orders_db, customers_db, item_db } from "../db/db.js";
import OrderModel from "../model/OrderModel.js";

let selectedIndex = -1;

// Generate next Order ID
function generateOrderId() {
    const nextId = orders_db.length + 1;
    return `O${nextId.toString().padStart(3, '0')}`;
}

// Set initial Order ID
$(document).ready(() => {
    $("#oId").val(generateOrderId());
});

// Clear input fields and reset Order ID
function clearFields() {
    $("#oId").val(generateOrderId());
    $("#oDate").val('');
    $("#cId").val('');
    $("#cName").val('');
    $("#telephone").val('');
    $("#iCode").val('');
    $("#oQty").val('');
    $("#oPrice").val('');
}

// Load orders into table
export function loadTableData() {
    $("#order_tbody").empty();
    let total = 0;

    orders_db.forEach((order, index) => {
        const rowTotal = order.oQty * order.oPrice;
        total += rowTotal;

        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${order.cId}</td>
                <td>${order.iCode}</td>
                <td>${order.oQty}</td>
                <td>${order.oPrice}</td>
                <td>${rowTotal.toFixed(2)}</td>
            </tr>`;
        $("#order_tbody").append(row);
    });

    $("#subTotalDisplay").text(total.toFixed(2));
    $("#totalDisplay").text(total.toFixed(2));
}

// Save Order
export function handleSave() {
    const oId = $("#oId").val();
    const cId = $("#cId").val();
    const iCode = $("#iCode").val();
    const oQty = $("#oQty").val();
    const oPrice = $("#oPrice").val();

    if (!oId || !cId || !iCode || !oQty || !oPrice) {
        return Swal.fire("Error", "All fields are required!", "error");
    }

    const newOrder = new OrderModel(oId, cId, iCode, oQty, oPrice);
    orders_db.push(newOrder);
    loadTableData();
    clearFields();
    Swal.fire("Success", "Order saved successfully!", "success");
}

// Row click
export function handleRowClick() {
    $("#order_tbody").on("click", "tr", function () {
        selectedIndex = $(this).index();
        const order = orders_db[selectedIndex];
        $("#oId").val(order.oId);
        $("#cId").val(order.cId);
        $("#iCode").val(order.iCode);
        $("#oQty").val(order.oQty);
        $("#oPrice").val(order.oPrice);

        // Auto-fill customer info
        const customer = customers_db.find(c => c.cId === order.cId);
        if (customer) {
            $("#cName").val(customer.cName);
            $("#telephone").val(customer.telephone);
        }

        // Auto-fill item price
        const item = item_db.find(i => i.code === order.iCode);
        if (item) {
            $("#oPrice").val(item.price);
        }
    });
}

// Update
export function handleUpdate() {
    if (selectedIndex === -1) {
        return Swal.fire("Error", "Please select an order to update!", "warning");
    }

    orders_db[selectedIndex].oId = $("#oId").val();
    orders_db[selectedIndex].cId = $("#cId").val();
    orders_db[selectedIndex].iCode = $("#iCode").val();
    orders_db[selectedIndex].oQty = $("#oQty").val();
    orders_db[selectedIndex].oPrice = $("#oPrice").val();

    loadTableData();
    clearFields();
    selectedIndex = -1;

    Swal.fire("Success", "Order updated successfully!", "success");
}

// Delete
export function handleDelete() {
    if (selectedIndex === -1) {
        return Swal.fire("Error", "Please select an order to delete!", "warning");
    }

    Swal.fire({
        title: "Are you sure?",
        text: "This item will be deleted permanently.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            orders_db.splice(selectedIndex, 1);
            loadTableData();
            clearFields();
            selectedIndex = -1;

            Swal.fire("Deleted!", "Order deleted successfully!", "success");
        }
    });
}

// Auto-fill customer name and telephone on cId change
$("#cId").on("change keyup", function () {
    const cId = $(this).val();
    const customer = customers_db.find(c => c.cId === cId);

    if (customer) {
        $("#cName").val(customer.cName);
        $("#telephone").val(customer.telephone);
    } else {
        $("#cName").val('');
        $("#telephone").val('');
    }
});

// Auto-fill item price on item code select
$("#iCode").on("change", function () {
    const iCode = $(this).val();
    const item = item_db.find(i => i.code === iCode);

    if (item) {
        $("#oPrice").val(item.price);
    } else {
        $("#oPrice").val('');
    }
});

// Button bindings
$("#orderDetails_save").on('click', handleSave);
$("#orderDetails_update").on('click', handleUpdate);
$("#orderDetails_delete").on('click', handleDelete);

// Initialize
loadTableData();
handleRowClick();
