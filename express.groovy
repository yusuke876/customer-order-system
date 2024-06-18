const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    const { sender, senderAddress, senderPhone, email, item, weight, price, notes, date, recipient, recipientAddress, recipientPhone } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'your-email-service',
        auth: {
            user: 'your-email@example.com',
            pass: 'your-email-password'
        }
    });

    const mailOptions = {
        from: email,
        to: 'boll1996@gmail.com',
        subject: '新しい注文が送信されました',
        text: `注文の詳細:
        送り主: ${sender}
        送り主の住所: ${senderAddress}
        送り主の電話番号: ${senderPhone}
        メールアドレス: ${email}
        依頼品目: ${item}
        重量: ${weight}kg
        料金: ${price}円
        備考: ${notes}
        注文日: ${date}
        送り先: ${recipient}
        送り先の住所: ${recipientAddress}
        送り先の電話番号: ${recipientPhone}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('メールが送信されました');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
