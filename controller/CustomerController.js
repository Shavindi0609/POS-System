import {customer_db} from "../db/db";
import CustomerModel from "../model/CustomerModel.js";

$("#customer_save").on('click' , function (){
    let id = $('#id').val();
    let name = $('#name').val();
    let address = $('#address').val();
    let contact = $('#contact').val();
})