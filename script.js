function showpoly(a) {
    let str1 = "";
    let nobits = a.length;

    for (let x = 0; x < nobits - 2; x++) {
        if (a[x] === '1') {
            if (str1.length === 0) {
                str1 += "x**" + (nobits - x - 1);
            } else {
                str1 += "+x**" + (nobits - x - 1);
            }
        }
    }

    if (a[nobits - 2] === '1') {
        if (str1.length === 0) {
            str1 += "x";
        } else {
            str1 += "+x";
        }
    }

    if (a[nobits - 1] === '1') {
        str1 += "+1";
    }

    return str1;
}

function toList(x) {
    let l = [];
    for (let i = 0; i < x.length; i++) {
        l.push(parseInt(x[i]));
    }
    return l;
}

function toString(x) {
    let str1 = "";
    for (let i = 0; i < x.length; i++) {
        str1 += x[i];
    }
    return str1;
}

function divide(val1, val2) {
    let a = toList(val1);
    let b = toList(val2);
    let working = toString(val1) + "\n";

    let res = "";
    let addspace = "";

    while (b.length <= a.length && a.length > 0) {
        if (a[0] === 1) {
            a.shift();
            for (let j = 0; j < b.length - 1; j++) {
                a[j] ^= b[j + 1];
            }
            if (a.length > 0) {
                working += addspace + toString(b) + "\n";
                working += addspace + "-".repeat(b.length) + "\n";
                addspace += " ";
                working += addspace + toString(a) + "\n";
                res += "1";
            }
        } else {
            a.shift();
            working += addspace + "0".repeat(b.length) + "\n";
            working += addspace + "-".repeat(b.length) + "\n";
            addspace += " ";
            working += addspace + toString(a) + "\n";

            res += "0";
        }
    }

    const output = "Result is\t" + res + "\n" +
        "Remainder is\t" + toString(a) + "\n\n" +
        "Working is\t\n\n" + res.padStart(val1.length) + "\n" +
        "-".repeat(val1.length) + "\n" +
        working;

    return output;
}

function performDivision() {
    const val1 = document.getElementById("val1").value;
    const val2 = document.getElementById("val2").value;

    const output = divide(val1, val2);
    document.getElementById("output").innerText = output;
}


function generateFrame() {
    var sof = document.getElementById("sof").value;
    var id = document.getElementById("id").value;
    var rtr = document.getElementById("rtr").value;
    var ctl = document.getElementById("ctl").value;
    var dlc = document.getElementById("dlc").value;
    var data = document.getElementById("data").value;
    var crc = document.getElementById("crc").value;
    var ack = document.getElementById("ack").value;
    var ackdel = document.getElementById("ackdel").value;
    var eof = document.getElementById("eof").value;

    // Vérification du nombre de bits dans l'ID
    if (id.length > 11) {
      alert("Erreur : l'identifiant (ID) ne peut pas dépasser 11 bits.");
      return; // Arrête la fonction si l'ID est invalide
    }

    // Vérification de la valeur de EOF
    if (eof !== "1111111") {
      alert(
        "Erreur : la valeur de l'EOF doit être normalisée à '1111111'."
      );
      return; // Arrête la fonction si l'EOF est incorrect
    }

    // Convert data field to hexadecimal
    var hexData = "";
    for (var i = 0; i < data.length; i += 4) {
      var chunk = data.substr(i, 4); // Get the next 4 bits
      var hexChunk = parseInt(chunk, 2).toString(16).toUpperCase(); // Convert to hexadecimal
      hexData += hexChunk + " ";
    }

    // Convert ID field to hexadecimal
    var idHex = parseInt(id, 2).toString(16).toUpperCase(); // Convert to hexadecimal

    // Convert dlc field to decimal
    var dlcDecimal = convertToDecimal(dlc);

    var frame =
      sof +
      " " +
      id +
      " " +
      rtr +
      " " +
      ctl +
      " " +
      dlc +
      " " +
      data +
      " " +
      crc +
      " " +
      ack +
      " " +
      ackdel +
      " " +
      eof;
    document.getElementById("outputFrame").innerText =
      "Trame CAN : " + frame;
    document.getElementById("hexData").innerText =
      "Data Field (Hexadecimal) : 0x" + hexData;
    document.getElementById("dlcDecimal").innerText =
      "DLC (Decimal) : " + dlcDecimal;
    document.getElementById("idHex").innerText =
      "ID (Hexadécimal) : 0x" + idHex;

    // Determine the frame type based on RTR bit
    var frameTypeLabel = document.getElementById("frameType");
    if (rtr === "1") {
      frameTypeLabel.innerText = "Type de trame : Requête";
    } else if (rtr === "0") {
      frameTypeLabel.innerText = "Type de trame : Donnée";
    } else {
      frameTypeLabel.innerText = "";
    }

    const val2 = document.getElementById("val2").value;
    const crcValue = document.getElementById("crc").value;
    let crc1 = calculateCRC(crcValue, val2);
    document.getElementById("crcValue").innerText = "Valeur CRC : " + crc1; // Affiche la valeur CRC dans le label "crcValue"
  }

  function convertToDecimal(binary) {
    // Convertit le binaire en décimal
    var decimal = parseInt(binary, 2);
    return decimal;
  }

  function calculateCRC(value1, value2) {
    let a = value1.split("").map(Number);
    let b = value2.split("").map(Number);
    let crc = [];

    // Add zeros to the right of value1
    let numZeros = b.length - 1;
    a = a.concat(Array(numZeros).fill(0));

    while (b.length <= a.length) {
      if (a[0] === 1) {
        a.shift();
        for (let j = 0; j < b.length - 1; j++) {
          a[j] ^= b[j + 1];
        }
      } else {
        a.shift();
      }
    }

    // Extract the CRC bits from a
    crc = a.slice(a.length - numZeros);

    return crc.join("");
  }
