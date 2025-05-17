
export default class OrdersModel {
    constructor(oId, cId, iCode, oQty, oPrice) {
        this.oId = oId;
        this.cId = cId;
        this.iCode = iCode;
        this.oQty = oQty;
        this.oPrice = oPrice;
    }

    getTotal() {
        return (parseFloat(this.oQty) * parseFloat(this.oPrice)).toFixed(2);
    }
}