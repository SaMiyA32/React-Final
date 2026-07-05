
import mongoose, { Document, Schema } from 'mongoose';


export interface IContact extends Document {
    name: string;
    email: string;
    phone?: string; 
    subject: string;
    message: string;
    category: 'Sales' | 'Technical Support' | 'Warranty Claims' | 'Custom Builds' | 'General Inquiry'; 
    createdAt: Date;
    updatedAt: Date;
    isRead: boolean; 
}


const ContactSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address']
    },
    phone: {
        type: String,
        trim: true,
        minlength: [7, 'Phone number must be at least 7 characters long'],
        maxlength: [15, 'Phone number cannot exceed 15 characters'],
        required: false 
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        minlength: [3, 'Subject must be at least 3 characters long']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        minlength: [10, 'Message must be at least 10 characters long']
    },
    category: {
        type: String,
        enum: ['Sales', 'Technical Support', 'Warranty Claims', 'Custom Builds', 'General Inquiry'],
        default: 'General Inquiry',
        required: [true, 'Category is required']
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true 
});


const Contact = mongoose.model<IContact>('Contact', ContactSchema);
export default Contact;
