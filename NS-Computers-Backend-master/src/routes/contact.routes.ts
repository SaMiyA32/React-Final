
import { Router } from 'express';
import {
    submitContactForm,
    getAllContactMessages,
    getContactMessage,
    markMessageAsRead,
    deleteContactMessage
} from '../controller/contact.controller';
import { authenticateToken } from '../middleware/auth.middleware'; 

const contactRouter: Router = Router();


contactRouter.post('/save-contact', submitContactForm);



contactRouter.get('/get-all-messages', getAllContactMessages);
contactRouter.get('/get-all-messages/:id', getContactMessage);
contactRouter.put('/update-message/:id',  markMessageAsRead);
contactRouter.delete('/delete-message/:id', deleteContactMessage);

export default contactRouter;
