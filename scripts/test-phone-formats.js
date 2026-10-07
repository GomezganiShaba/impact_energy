function normaliseMalawiPhone(raw) {
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("265")) {
    return `+${digits}`;
  }
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  if (digits.length >= 8 && digits.length <= 9) {
    return `+265${digits}`;
  }
  return `+${digits}`;
}

function isValid(val) {
  return /^\+265\d{8,9}$/.test(val) || /^\+\d{10,15}$/.test(val);
}

const testNumbers = [
  "0881682589",
  "0881 682 589",
  "+265 881 682 589",
  "+265881682589",
  "881682589",
  "0999 123 456",
  "0999123456",
  "0888123456",
  "01750123",            // Malawi landline 7-digit
  "+265 0881 682 589",   // Malawi with country code AND leading 0
  "265881682589",
  "+265 (0) 881 682 589",
  "099 12 34 56",        // 8-digit local
  "99123456",            // 8-digit local without 0
  "0881-682-589",
  "+44 7911 123456",     // UK number
  "+1 212 555 1234",     // US number
  "0881682589 / 0999123456" // Two numbers
];

for (const raw of testNumbers) {
  const norm = normaliseMalawiPhone(raw);
  const ok = isValid(norm);
  console.log(`${raw.padEnd(25)} -> ${norm.padEnd(20)} : ${ok ? 'PASS' : 'FAIL ❌'}`);
}
