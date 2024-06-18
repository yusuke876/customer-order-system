const prices = {
    '特秀': { '15': 9200, '10': 6200, '5': 3400, '3': 2300 },
    '秀（紅含む）': { '15': 7700, '10': 5200, '5': 2900, '3': 1800 },
    '家庭用': { '15': 6200, '10': 4200, '5': 2400, '3': 1300 },
    '20玉': { '15': 7200, '10': 4700, '5': 2400, '3': 1300 },
    '20玉家庭用': { '15': 5700, '10': 3700, '5': 1900 },
    '20玉以下の玉': { '15': 4000 },
    '大キズ': { '15': 2500 }
};

function addRecipient() {
    const recipientsDiv = document.getElementById('recipients');
    const newRecipientDiv = document.createElement('div');
    newRecipientDiv.classList.add('recipient-group');
    newRecipientDiv.innerHTML = `
        <div class="form-group">
            <label for="recipient">送り先 <span class="required">*</span></label>
            <input type="text" name="recipient" required>
            <div class="error"></div>
        </div>
        <div class="form-group">
            <label for="recipientPostal">送り先の郵便番号 <span class="required">*</span></label>
            <input type="text" name="recipientPostal" oninput="fetchAddress(this.value, 'recipientAddress')" required>
            <div class="error"></div>
        </div>
        <div class="form-group">
            <label for="recipientAddress">送り先の住所 <span class="required">*</span></label>
            <input type="text" name="recipientAddress" required>
            <div class="error"></div>
        </div>
        <div class="form-group">
            <label for="recipientPhone">送り先の電話番号 <span class="required">*</span></label>
            <input type="text" name="recipientPhone" required>
            <div class="error"></div>
        </div>
    `;
    recipientsDiv.appendChild(newRecipientDiv);
}

function validateForm() {
    let valid = true;
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    requiredFields.forEach(field => {
        const errorDiv = field.nextElementSibling;
        if (!field.value) {
            errorDiv.textContent = '未記入';
            valid = false;
        } else {
            errorDiv.textContent = '';
        }
    });
    return valid;
}

function submitOrder() {
    if (!validateForm()) {
        return;
    }

    const sender = document.getElementById('sender').value;
    const senderAddress = document.getElementById('senderAddress').value;
    const senderPhone = document.getElementById('senderPhone').value;
    const email = document.getElementById('email').value;
    const item = document.getElementById('item').value;
    const weight = document.getElementById('weight').value;
    const notes = document.getElementById('notes').value;
    const date = new Date().toLocaleDateString('ja-JP');
    const price = prices[item][weight];

    const recipients = document.querySelectorAll('.recipient-group');
    recipients.forEach(recipientDiv => {
        const recipient = recipientDiv.querySelector('input[name="recipient"]').value;
        const recipientAddress = recipientDiv.querySelector('input[name="recipientAddress"]').value;
        const recipientPhone = recipientDiv.querySelector('input[name="recipientPhone"]').value;

        const orderTable = document.getElementById('orderTable').getElementsByTagName('tbody')[0];
        const newRow = orderTable.insertRow();

        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);
        const cell5 = newRow.insertCell(4);
        const cell6 = newRow.insertCell(5);
        const cell7 = newRow.insertCell(6);
        const cell8 = newRow.insertCell(7);
        const cell9 = newRow.insertCell(8);
        const cell10 = newRow.insertCell(9);
        const cell11 = newRow.insertCell(10);
        const cell12 = newRow.insertCell(11);
        const cell13 = newRow.insertCell(12);

        cell1.textContent = sender;
        cell2.textContent = senderAddress;
        cell3.textContent = senderPhone;
        cell4.textContent = recipient;
        cell5.textContent = recipientAddress;
        cell6.textContent = recipientPhone;
        cell7.textContent = item;
        cell8.textContent = `${weight}kg`;
        cell9.textContent = `${price}円`;
        cell10.textContent = email;
        cell11.textContent = notes;
        cell12.textContent = date;
        cell13.innerHTML = '<span class="remove-btn" onclick="removeOrder(this)">キャンセル</span>';
    });

    sendEmail(sender, senderAddress, senderPhone, email, item, weight, price, notes, date);

    alert('注文が送信されました');
}

function removeOrder(element) {
    const row = element.parentElement.parentElement;
    row.parentElement.removeChild(row);
}

function sendEmail(sender, senderAddress, senderPhone, email, item, weight, price, notes, date) {
    const subject = '新しい注文が送信されました';
    const body = `注文の詳細:
    送り主: ${sender}
    送り主の住所: ${senderAddress}
    送り主の電話番号: ${senderPhone}
    メールアドレス: ${email}
    依頼品目: ${item}
    重量: ${weight}kg
    料金: ${price}円
    備考: ${notes}
    注文日: ${date}`;

    Email.send({
        Host: "smtp.yourisp.com",
        Username: "username",
        Password: "password",
        To: 'boll1996@gmail.com',
        From: email,
        Subject: subject,
        Body: body,
    }).then(message => alert("メールが送信されました"));
}

async function fetchAddress(postalCode, addressFieldId) {
    if (postalCode.length === 7) {
        try {
            const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`);
            const data = await response.json();
            if (data.results) {
                const address = data.results[0].address1 + data.results[0].address2 + data.results[0].address3;
                document.getElementById(addressFieldId).value = address;
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    }
}
