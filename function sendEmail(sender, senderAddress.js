function sendEmail(sender, senderAddress, senderPhone, email, item, weight, price, notes, date, recipient, recipientAddress, recipientPhone) {
    const data = {
        sender,
        senderAddress,
        senderPhone,
        email,
        item,
        weight,
        price,
        notes,
        date,
        recipient,
        recipientAddress,
        recipientPhone
    };

    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(result => alert(result))
    .catch(error => console.error('Error:', error));
}
