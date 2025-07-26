import {EventEmitter} from "events";
import {resendService} from "@/lib/lib/resend";

const invoiceEvents = new EventEmitter();

invoiceEvents.on('sendInvoice', async (email: string) => {

});

export default invoiceEvents;