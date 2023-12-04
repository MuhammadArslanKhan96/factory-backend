// Your existing mailOptions object


// Helper function to generate OTP email HTML
export const generateOtpEmailHtml = (otp: string) => {
    return `
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background-color: #f4f4f4;
            }
    
            .otp-container {
                text-align: center;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            .otp-input {
                width: 40px;
                height: 40px;
                font-size: 18px;
                text-align: center;
                margin: 0 8px;
                border: 1px solid #ccc;
                border-radius: 5px;
                outline: none;
            }
    
            .submit-btn {
                margin-top: 20px;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                background-color: #4caf50;
                color: #fff;
                border: none;
                border-radius: 5px;
                outline: none;
            }
            .heading{
                line-height: 30px;
                letter-spacing: 30px;
                
            }
        </style>
    </head>
    
    <body>
        <div class="otp-container">
            <h2>Copy  OTP</h2>
            <p>An OTP has been sent to your registered email address.</p>
            <h1 class="heading">${otp}</h1>
        </div>
    </body>
    
    </html>
    `;
}

// Use the mailOptions object as needed

