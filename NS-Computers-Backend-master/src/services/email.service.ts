import nodemailer from 'nodemailer';
import { env } from '../config/env.config';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465, 
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    });
  }

  
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: env.SMTP_FROM,
        to: email,
        subject: '🚀 Welcome to NS Computers!',
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; width: 100%; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <!-- Header with Gradient Background -->
            <div style="background: linear-gradient(135deg, #ff4d4d, #ff1a1a); padding: 20px 15px; text-align: center; width: 100%; box-sizing: border-box;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600; line-height: 1.3;">
                <span style="font-size: 28px; display: block; margin-bottom: 5px;">🖥️</span>
                NS-<span style="color: #ffeb3b;">Computers</span>
              </h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 14px; line-height: 1.4;">Your Trusted Technology Partner</p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 20px 15px; background: #ffffff; box-sizing: border-box; width: 100%;">
              <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 20px; line-height: 1.4;">👋 Welcome Aboard, ${name}!</h2>
              
              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 15px 0;">
                Thank you for joining the NS-Computers family! We're thrilled to have you with us. 🎉
              </p>
              
              <div style="background: #f8f9ff; border-radius: 8px; padding: 15px; margin: 20px 0; box-sizing: border-box; width: 100%;">
                <h3 style="color: #1a1a1a; margin: 0 0 12px 0; font-size: 17px; line-height: 1.4;">🌟 Welcome to NS Computers! 🌟</h3>
                <p style="margin: 0 0 12px 0; color: #333; font-size: 14px; line-height: 1.5;">
                  At NS Computers, we're passionate about bringing you the latest in technology and computing solutions. 
                  From high-performance gaming rigs 💻 to powerful workstations, we've got you covered!
                </p>
                <p style="margin: 0 0 8px 0; color: #333; font-size: 15px; font-weight: 600;">
                  🚀 Why choose us?
                </p>
                <ul style="margin: 0 0 0 15px; padding: 0; color: #333; font-size: 14px; line-height: 1.6;">
                  <li style="margin-bottom: 6px;">🛒 Wide selection of top-brand computers and accessories</li>
                  <li style="margin-bottom: 6px;">⚡ Lightning-fast delivery to your doorstep</li>
                  <li style="margin-bottom: 6px;">🔒 Secure shopping with multiple payment options</li>
                  <li style="margin-bottom: 6px;">🛠️ Expert technical support and warranty services</li>
                  <li>💰 Exclusive member-only deals and discounts</li>
                </ul>
              </div>
              
              <div style="background: #fff8f8; border-left: 4px solid #ff4d4d; padding: 12px 15px; margin: 20px 0; border-radius: 0 4px 4px 0; box-sizing: border-box; width: 100%;">
                <p style="margin: 0; color: #333; font-style: italic; font-size: 14px; line-height: 1.5;">
                  💡 <strong>Pro Tip:</strong> Complete your profile to get personalized recommendations and exclusive offers!
                </p>
              </div>
              
              <div style="text-align: center; margin: 25px 0; width: 100%;">
                <a href="${env.CORS_ORIGIN}" 
                   style="display: inline-block; background: #ff1a1a; color: white; 
                          padding: 12px 25px; text-decoration: none; border-radius: 4px; 
                          font-weight: 600; font-size: 15px; text-transform: uppercase;
                          box-shadow: 0 2px 4px rgba(0,0,0,0.1); width: 90%; max-width: 280px;
                          box-sizing: border-box; margin: 0 auto;">
                  🛍️ Start Shopping Now
                </a>
              </div>
              
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 5px 0;">
                Need help? Our support team is here for you at 
                <a href="mailto:support@nscomputers.com" style="color: #ff1a1a; text-decoration: none; word-break: break-all;">
                  support@nscomputers.com
                </a> 📧
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 13px; color: #777777; border-top: 1px solid #eeeeee; box-sizing: border-box; width: 100%;">
              <div style="margin-bottom: 10px; line-height: 1.8;">
                <a href="${env.CORS_ORIGIN}/about" style="color: #ff1a1a; text-decoration: none; margin: 0 8px; display: inline-block;">About Us</a>
                <span style="color: #dddddd; margin: 0 5px;">•</span>
                <a href="${env.CORS_ORIGIN}/products" style="color: #ff1a1a; text-decoration: none; margin: 0 8px; display: inline-block;">Products</a>
                <span style="color: #dddddd; margin: 0 5px;">•</span>
                <a href="${env.CORS_ORIGIN}/contact" style="color: #ff1a1a; text-decoration: none; margin: 0 8px; display: inline-block;">Contact</a>
              </div>
              <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.4;">
                © ${new Date().getFullYear()} NS-Computers. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 11px; color: #aaaaaa; line-height: 1.4;">
                You're receiving this email because you signed up for an NS-Computers account.
              </p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  async sendOrderReceiptEmail(email: string, name: string, order: any): Promise<boolean> {
    try {
      const mailOptions = {
        from: env.SMTP_FROM,
        to: email,
        subject: `🛒 Order Confirmation - Order #${order._id}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; width: 100%; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <div style="background: linear-gradient(135deg, #ff4d4d, #ff1a1a); padding: 25px 15px; text-align: center; width: 100%; box-sizing: border-box;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600; line-height: 1.3;">
                <span style="font-size: 28px; display: block; margin-bottom: 5px;">🛒</span>
                NS-<span style="color: #ffeb3b;">Computers</span>
              </h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 14px; line-height: 1.4;">Order Placed Successfully</p>
            </div>
            
            <div style="padding: 25px 20px; background: #ffffff; box-sizing: border-box; width: 100%;">
              <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 20px; line-height: 1.4;">Thank you for your order, ${name}!</h2>
              <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                We have received your order and are currently processing it. Here are your order details:
              </p>
              
              <div style="background: #f8f9ff; border: 1px solid #eef0fd; border-radius: 8px; padding: 20px; margin-bottom: 25px; box-sizing: border-box; width: 100%;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
                  <tr>
                    <td style="padding: 6px 0; color: #666;"><strong>Order ID:</strong></td>
                    <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #ff1a1a;">#${order._id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #666;"><strong>Order Date:</strong></td>
                    <td style="padding: 6px 0; text-align: right;">${new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #666;"><strong>Payment Status:</strong></td>
                    <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #ef4444; text-transform: uppercase;">Pending</td>
                  </tr>
                </table>
              </div>

              <h3 style="color: #333; font-size: 16px; margin: 0 0 10px 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">Order Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333; margin-bottom: 25px;">
                <thead>
                  <tr style="border-bottom: 1px solid #eee; color: #777;">
                    <th style="text-align: left; padding: 8px 0; font-weight: 600;">Item Description</th>
                    <th style="text-align: right; padding: 8px 0; font-weight: 600;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid #fcfcfc;">
                    <td style="padding: 12px 0;">
                      <div style="font-weight: bold; color: #111;">${order.itemName}</div>
                    </td>
                    <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #ff1a1a;">
                      LKR ${order.totalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style="background: #fff8f8; border-left: 4px solid #ff4d4d; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 25px; box-sizing: border-box; width: 100%;">
                <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                  <tr>
                    <td style="color: #555;"><strong>Subtotal:</strong></td>
                    <td style="text-align: right; color: #333;">LKR ${order.totalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  </tr>
                  <tr>
                    <td style="color: #555; padding-top: 5px;"><strong>Shipping:</strong></td>
                    <td style="text-align: right; color: #333; padding-top: 5px;">Free</td>
                  </tr>
                  <tr style="border-top: 1px dashed #ffcccc;">
                    <td style="color: #111; font-weight: bold; padding-top: 10px; font-size: 17px;">Total:</td>
                    <td style="text-align: right; color: #ff1a1a; font-weight: bold; padding-top: 10px; font-size: 19px;">
                      LKR ${order.totalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                  </tr>
                </table>
              </div>

              <p style="color: #777777; font-size: 13px; line-height: 1.6; margin: 0;">
                If you have any questions or concerns regarding this order, please contact our support team at 
                <a href="mailto:support@nscomputers.com" style="color: #ff1a1a; text-decoration: none;">support@nscomputers.com</a>.
              </p>
            </div>
            
            <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee; box-sizing: border-box; width: 100%;">
              <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} NS-Computers. All rights reserved.</p>
              <p style="margin: 0;">Thank you for shopping with us!</p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending order receipt email:', error);
      return false;
    }
  }

  async sendOrderDeliveredEmail(email: string, name: string, order: any): Promise<boolean> {
    try {
      const mailOptions = {
        from: env.SMTP_FROM,
        to: email,
        subject: `🚚 Order Delivered - Order #${order._id}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; width: 100%; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <div style="background: linear-gradient(135deg, #4caf50, #2e7d32); padding: 25px 15px; text-align: center; width: 100%; box-sizing: border-box;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600; line-height: 1.3;">
                <span style="font-size: 28px; display: block; margin-bottom: 5px;">🚚</span>
                NS-<span style="color: #ffeb3b;">Computers</span>
              </h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 14px; line-height: 1.4;">Your Order Has Been Delivered!</p>
            </div>
            
            <div style="padding: 25px 20px; background: #ffffff; box-sizing: border-box; width: 100%;">
              <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 20px; line-height: 1.4;">Good news, ${name}!</h2>
              <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                Your order has been successfully delivered. We hope you love your new purchase! Here is a summary of the delivered order:
              </p>
              
              <div style="background: #f1f8e9; border: 1px solid #dcedc8; border-radius: 8px; padding: 20px; margin-bottom: 25px; box-sizing: border-box; width: 100%;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
                  <tr>
                    <td style="padding: 6px 0; color: #666;"><strong>Order ID:</strong></td>
                    <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #2e7d32;">#${order._id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #666;"><strong>Delivery Date:</strong></td>
                    <td style="padding: 6px 0; text-align: right;">${new Date().toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #666;"><strong>Delivered Item:</strong></td>
                    <td style="padding: 6px 0; text-align: right; font-weight: bold;">${order.itemName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #666;"><strong>Total Amount:</strong></td>
                    <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #2e7d32;">LKR ${order.totalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #fff8f8; border-left: 4px solid #4caf50; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 25px; box-sizing: border-box; width: 100%;">
                <p style="margin: 0; font-size: 14px; color: #333; line-height: 1.5;">
                  💡 <strong>Enjoying your new tech?</strong> We would love to hear your feedback! Share your shopping experience with us.
                </p>
              </div>

              <p style="color: #777777; font-size: 13px; line-height: 1.6; margin: 0;">
                If you did not receive this package or have any questions, please contact our support team immediately at 
                <a href="mailto:support@nscomputers.com" style="color: #2e7d32; text-decoration: none;">support@nscomputers.com</a>.
              </p>
            </div>
            
            <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee; box-sizing: border-box; width: 100%;">
              <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} NS-Computers. All rights reserved.</p>
              <p style="margin: 0;">Thank you for choosing NS Computers!</p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending order delivery email:', error);
      return false;
    }
  }

  async sendOrderShippedEmail(email: string, name: string, order: any): Promise<boolean> {
    try {
      const mailOptions = {
        from: env.SMTP_FROM,
        to: email,
        subject: `✈️ Your Order Has Been Shipped - Order #${order._id}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; width: 100%; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <div style="background: linear-gradient(135deg, #2196f3, #1976d2); padding: 25px 15px; text-align: center; width: 100%; box-sizing: border-box;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600; line-height: 1.3;">
                <span style="font-size: 28px; display: block; margin-bottom: 5px;">✈️</span>
                NS-<span style="color: #ffeb3b;">Computers</span>
              </h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 14px; line-height: 1.4;">On Its Way!</p>
            </div>
            
            <div style="padding: 25px 20px; background: #ffffff; box-sizing: border-box; width: 100%;">
              <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 20px; line-height: 1.4;">Great news, ${name}!</h2>
              <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                Your order has been shipped and is on its way to your delivery address. Here is a summary of the shipped items:
              </p>
              
              <div style="background: #e3f2fd; border: 1px solid #bbdefb; border-radius: 8px; padding: 20px; margin-bottom: 25px; box-sizing: border-box; width: 100%;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
                  <tr>
                    <td style="padding: 6px 0; color: #666;"><strong>Order ID:</strong></td>
                    <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #1976d2;">#${order._id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #666;"><strong>Shipped Date:</strong></td>
                    <td style="padding: 6px 0; text-align: right;">${new Date().toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #666;"><strong>Shipped Item:</strong></td>
                    <td style="padding: 6px 0; text-align: right; font-weight: bold;">${order.itemName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #666;"><strong>Total Value:</strong></td>
                    <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #1976d2;">LKR ${order.totalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #fff8f8; border-left: 4px solid #2196f3; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 25px; box-sizing: border-box; width: 100%;">
                <p style="margin: 0; font-size: 14px; color: #333; line-height: 1.5;">
                  📦 <strong>Tracking Tip:</strong> You will receive another notification once the package arrives at your destination.
                </p>
              </div>

              <p style="color: #777777; font-size: 13px; line-height: 1.6; margin: 0;">
                If you have any questions, please contact our support team at 
                <a href="mailto:support@nscomputers.com" style="color: #1976d2; text-decoration: none;">support@nscomputers.com</a>.
              </p>
            </div>
            
            <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee; box-sizing: border-box; width: 100%;">
              <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} NS-Computers. All rights reserved.</p>
              <p style="margin: 0;">Thank you for choosing NS Computers!</p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending order shipping email:', error);
      return false;
    }
  }

  async sendContactFormEmail(shopEmail: string, contactData: any): Promise<boolean> {
    try {
      const mailOptions = {
        from: env.SMTP_FROM,
        to: shopEmail,
        replyTo: contactData.email,
        subject: `📩 New Contact Message: ${contactData.subject}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; width: 100%; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <div style="background: linear-gradient(135deg, #ff4d4d, #ff1a1a); padding: 25px 15px; text-align: center; width: 100%; box-sizing: border-box;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600; line-height: 1.3;">
                <span style="font-size: 28px; display: block; margin-bottom: 5px;">📩</span>
                NS-<span style="color: #ffeb3b;">Computers</span>
              </h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 14px; line-height: 1.4;">New Contact Message Received</p>
            </div>
            
            <div style="padding: 25px 20px; background: #ffffff; box-sizing: border-box; width: 100%;">
              <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 18px; line-height: 1.4; border-bottom: 2px solid #ff1a1a; padding-bottom: 6px;">Sender Details</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 6px 0; color: #666; width: 120px;"><strong>Name:</strong></td>
                  <td style="padding: 6px 0;">${contactData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;"><strong>Email:</strong></td>
                  <td style="padding: 6px 0;"><a href="mailto:${contactData.email}" style="color: #ff1a1a; text-decoration: none;">${contactData.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;"><strong>Phone:</strong></td>
                  <td style="padding: 6px 0;">${contactData.phone || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;"><strong>Category:</strong></td>
                  <td style="padding: 6px 0;"><span style="background: #fff0f0; color: #ff1a1a; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; text-transform: uppercase;">${contactData.category}</span></td>
                </tr>
              </table>

              <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 18px; line-height: 1.4; border-bottom: 2px solid #ff1a1a; padding-bottom: 6px;">Message Content</h2>
              <div style="background: #f9f9f9; border-radius: 6px; padding: 15px; border: 1px solid #eee; margin-bottom: 20px; box-sizing: border-box; width: 100%;">
                <p style="margin: 0 0 8px 0; color: #555; font-size: 13px; text-transform: uppercase; font-weight: bold;">Subject: ${contactData.subject}</p>
                <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${contactData.message}</p>
              </div>

              <div style="text-align: center; margin: 25px 0; width: 100%;">
                <a href="mailto:${contactData.email}" 
                   style="display: inline-block; background: #ff1a1a; color: white; 
                          padding: 12px 25px; text-decoration: none; border-radius: 4px; 
                          font-weight: 600; font-size: 15px; text-transform: uppercase;
                          box-shadow: 0 2px 4px rgba(0,0,0,0.1); width: 90%; max-width: 250px;
                          box-sizing: border-box; margin: 0 auto;">
                  ✉️ Reply to Sender
                </a>
              </div>
            </div>
            
            <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 11px; color: #777777; border-top: 1px solid #eeeeee; box-sizing: border-box; width: 100%;">
              <p style="margin: 0;">This email was automatically generated from the NS Computers contact form submission.</p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending contact form email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
