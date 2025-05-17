import {orders_db} from "../db/db.js";
import OrderModel from "../model/OrderModel.js";

let selectedIndex = -1;

function clearFields() {
    $("#oId").val('');
    $("#oDate").val('');
    $("#cId").val('');
    $("#cName").val('');
    $("#telephone").val('');
    $("#iCode").val('');
    $("#oQty").val('');
    $("#oPrice").val('');
}

export function loadTableData() {
    $("#order_tbody").empty();
    let total = 0;

    orders_db.forEach((order, index) =>{
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
               </tr>
            `;
             $("#order_tbody").append(row);
        });

    $("#subTotalDisplay").text(total.toFixed(2));
    $("#totalDisplay").text(total.toFixed(2));

}

export function handleSave(){
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
    Swal.fire("Success", "Item added successfully!", "success");
}

export function handleRowClick() {
    $("#order_tbody").on("click" , "tr", function () {
        selectedIndex = $(this).index();
        const order = orders_db[selectedIndex];
        $("#oId").val(order.oId);
        $("#cId").val(order.cId);
        $("#iCode").val(order.iCode);
        $("#oQty").val(order.oQty);
        $("#oPrice").val(order.oPrice);
    });
}

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
    Swal.fire("Success", "Item updated successfully!", "success");
}

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
            Swal.fire("Deleted!", "Item deleted successfully!", "success");
        }
    });
}

$("#orderDetails_save").on('click', handleSave);
$("#orderDetails_update").on('click', handleUpdate);
$("#orderDetails_delete").on('click', handleDelete);

loadTableData();
handleRowClick();