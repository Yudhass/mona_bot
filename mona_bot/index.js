const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');

var fileConfigAdmin = "config/admin.json";
var salamBrand = "\n\nPayment? : /payment\nReady Stok? : /chatadmin\n\n[*LAPAK YUDHAS*]";


// Fungsi untuk mendapatkan data admin dari file JSON
async function listAdmin(filePath) {
    const dataLama = JSON.parse(await fs.promises.readFile(filePath));
    let adminValues = dataLama["admin"];
    let dataAdminLama = [];
    for (const admin in adminValues) {
        const value = adminValues[admin];
        dataAdminLama.push(value);
    }
    return dataAdminLama;
}

// Fungsi untuk menambahkan admin baru ke dalam file JSON
async function addAdminConfig(newData, filePath) {
    try {
        const dataLama = JSON.parse(await fs.promises.readFile(filePath));
        let adminValues = dataLama["admin"];
        let dataAdminLama = [];
        for (const admin in adminValues) {
            const value = adminValues[admin];
            dataAdminLama.push(value);
        }
        if (dataAdminLama.includes(newData)) {
            return "Admin Dengan Nomor Ini Sudah Terdaftar";
        } else {
            dataAdminLama.push(newData);
            if (dataAdminLama.length > 5) {
                return "Admin Max 5 Orang";
            } else {
                const dataAdminBaru = { "admin": {} };
                for (let i = 0; i <= dataAdminLama.length; i++) {
                    const keyadmin = "admin" + i;
                    dataAdminBaru["admin"][keyadmin] = dataAdminLama[i];
                }
                await fs.promises.writeFile(filePath, JSON.stringify(dataAdminBaru, null, 2));
                return "Admin Berhasil Ditambahkan";
            }
        }
    } catch (error) {
        console.error("Gagal menambahkan data ke file:", error);
    }
}

// Fungsi untuk mengupdate admin dalam file JSON
async function updateAdminConfig(adminLama, adminBaru, filePath) {
    try {
        adminLama = adminLama + "@s.whatsapp.net";
        const dataLama = JSON.parse(await fs.promises.readFile(filePath));
        let adminValues = dataLama["admin"];
        let dataAdminLama = [];
        for (const admin in adminValues) {
            let value = adminValues[admin];
            dataAdminLama.push(value);
        }
        if (!dataAdminLama.includes(adminLama)) {
            return "Nomor Admin Tidak Ditemukan";
        } else {
            for (let i = 0; i < dataAdminLama.length; i++) {
                if (dataAdminLama[i] == adminLama) {
                    dataAdminLama.splice(i, 1);
                    break;
                }
            }
            if (!dataAdminLama.includes(adminBaru)) {
                dataAdminLama.push(adminBaru);
                const dataAdminBaru = { "admin": {} };
                for (let i = 0; i <= dataAdminLama.length; i++) {
                    const keyadmin = "admin" + i;
                    dataAdminBaru["admin"][keyadmin] = dataAdminLama[i];
                }
                await fs.promises.writeFile(filePath, JSON.stringify(dataAdminBaru, null, 2));
                return "Admin Berhasil Diubah";
            } else {
                return "Admin Sudah Terdaftar";
            }
        }
    } catch (error) {
        console.error("Gagal menambahkan data ke file:", error);
    }
}

// Fungsi untuk menghapus admin dari file JSON
async function deleteAdmin(adminLama, filePath) {
    try {
        const dataLama = JSON.parse(await fs.promises.readFile(filePath));
        let adminValues = dataLama["admin"];
        let dataAdminLama = [];
        for (const admin in adminValues) {
            let value = adminValues[admin];
            dataAdminLama.push(value);
        }
        if (!dataAdminLama.includes(adminLama)) {
            return "Nomor Admin Tidak Ditemukan";
        } else {
            for (let i = 0; i < dataAdminLama.length; i++) {
                if (dataAdminLama[i] == adminLama) {
                    dataAdminLama.splice(i, 1);
                    break;
                }
            }
            const dataAdminBaru = { "admin": {} };
            for (let i = 0; i <= dataAdminLama.length; i++) {
                const keyadmin = "admin" + i;
                dataAdminBaru["admin"][keyadmin] = dataAdminLama[i];
            }
            await fs.promises.writeFile(filePath, JSON.stringify(dataAdminBaru, null, 2));
            return "Admin Berhasil Dihapus";
        }
    } catch (error) {
        console.error("Gagal menambahkan data ke file:", error);
    }
}

// Fungsi untuk mendapatkan data produk berdasarkan kodenya
function getDataProduk(arrayP1, arrayP2, key) {
    // console.log(key + "\n");
    for (let i = 0; i < arrayP1.length; i++) {
        // console.log(arrayP1[i][0]);
        if (arrayP1[i][0] == key) {
            return arrayP1[i][1];
        }
    }
    for (let i = 0; i < arrayP2.length; i++) {
        // console.log(arrayP2[i][0]);
        if (arrayP2[i][0] == key) {
            return arrayP2[i][1];
        }
    }
    return null;
}

// Fungsi untuk mendapatkan semua key produk dari array produk
function getAllKeyProduk(arrayProduk) {
    let arrBaru = []
    for (let i = 0; i < arrayProduk.length; i++) {
        arrBaru.push(arrayProduk[i][0])
    }
    return arrBaru;
}

// Fungsi untuk mengambil data produk dari spreadsheet
async function fetchData(arrayProduk, sheetProduk) {
    try {
        const { default: fetch } = await import('node-fetch');
        const sheetId = "1WKqz8Nx6LSAtVWuNbt5fBCW9x3YBdQrdEr7WBXOi-YI";
        const sheetName = encodeURIComponent(sheetProduk);
        const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${sheetName}`;
        let count = 0;

        const res = await fetch(sheetURL);
        const rep = await res.text();
        let data = JSON.parse(rep.substr(47).slice(0, -2));
        let panjangData = data.table.rows.length;

        for (let i = 1; i < panjangData; i++) {
            let dataProduk = data.table.rows[i];
            if (dataProduk === 'undefined') {
                continue;
            }
            arrayProduk[count] = [dataProduk.c[0].v, dataProduk.c[1].v];
            count += 1;
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Fungsi untuk mengambil data pembayaran dari spreadsheet
async function fetchDataPayment(sheetProduk) {
    try {
        const { default: fetch } = await import('node-fetch');
        const sheetId = "1WKqz8Nx6LSAtVWuNbt5fBCW9x3YBdQrdEr7WBXOi-YI";
        const sheetName = encodeURIComponent(sheetProduk);
        const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${sheetName}`;
        const res = await fetch(sheetURL);
        const rep = await res.text();
        let data = JSON.parse(rep.substr(47).slice(0, -2));
        return data.table.rows[0].c[0].v;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Fungsi untuk mengecek apakah pengguna adalah bot atau bukan
function isBot(credential) {
    if (credential === true) {
        return true
    }
    return credential
}

// Fungsi untuk menghubungkan ke WhatsApp
async function connectToWhatsApp() {
    const auth = await useMultiFileAuthState("session");
    const socket = makeWASocket({
        printQRInTerminal: true,
        browser: ["LAPAK YUDHAS BOT!!", "Safari", "1.0.0"],
        auth: auth.state,
        logger: pino({ level: 'silent' }),
    });

    socket.ev.on("creds.update", auth.saveCreds);
    socket.ev.on("connection.update", async ({ connection }) => {
        if (connection === "open") {
            console.log("BOT WHATSS APP SUDAH SIAP ✅ -- BY LAPAK YUDHAS!");
        } else if (connection === "close") {
            await connectToWhatsApp();
        }
    });

    socket.ev.on("messages.upsert", async ({ messages, type }) => {
        const chat = messages[0]
        const pesan = (chat.message?.extendedTextMessage?.text ?? chat.message?.ephemeralMessage?.message?.extendedTextMessage.text ?? chat.message?.conversation) || "";

        if (pesan) {
            try {
                if (isBot(chat.key.fromMe) == true) {
                    const perintah = pesan.split(" ")
                    if (perintah[0] == 'listAdmin' || perintah[0] == 'ListAdmin' || perintah[0] == 'listadmin' || perintah[0] == 'Listadmin') {
                        const dataAdmin = await listAdmin(fileConfigAdmin)
                        let pesan = ""
                        if (dataAdmin.length == 0) {
                            pesan = "Tidak Ada Admin Yang Terdaftar"
                        } else {
                            pesan += "Daftar List Admin Bot Lapak Yudhas \n\n"
                            for (let i = 0; i < dataAdmin.length; i++) {
                                let nomorAdmin = dataAdmin[i].split("@")
                                nomorAdmin = "https://wa.me/" + nomorAdmin[0]
                                pesan += "Admin " + (parseInt(i) + 1) + " ==> " + nomorAdmin + "\n"
                            }
                        }
                        await socket.sendMessage(chat.key.remoteJid, { text: pesan })
                    }
                    else if (perintah[0] == 'addAdmin' || perintah[0] == 'AddAdmin' || perintah[0] == 'Addadmin' || perintah[0] == 'addadmin') {
                        let nomorAdmin = perintah[1]
                        if (nomorAdmin != 'undefined') {
                            if (nomorAdmin.startsWith("0")) {
                                nomorAdmin = "62" + nomorAdmin.substring(1);
                                nomorAdmin += "@s.whatsapp.net"
                            }
                            const [cekNomor] = await socket.onWhatsApp(nomorAdmin)
                            if (typeof cekNomor == 'undefined') {
                                await socket.sendMessage(chat.key.remoteJid, { text: "Admin tidak ditemukan dengan nomor " + perintah[1] })
                            } else {
                                const infoAdmin = nomorAdmin
                                let info = await addAdminConfig(infoAdmin, fileConfigAdmin);
                                await socket.sendMessage(
                                    nomorAdmin, {
                                    text: "Halo Anda Diangkat Menjadi Admin Dari Bot Lapak Yudhas :)"
                                });
                                await socket.sendMessage(chat.key.remoteJid, { text: info + "Admin berhasil didaftarkan dengan nomor " + perintah[1] })
                            }
                        } else {
                            await socket.sendMessage(chat.key.remoteJid, { text: "Perintah tidak lengkap :) \nsilahkan gunakan perintah : AddAdmin nomor_admin_baru" })
                        }
                    }
                    else if (perintah[0] == 'updateAdmin' || perintah[0] == 'Updateadmin' || perintah[0] == 'updateadmin' || perintah[0] == 'UpdateAdmin') {
                        let nomorAdminLama = perintah[1]
                        let nomorAdminBaru = perintah[2]
                        if (nomorAdminLama != 'undefined' || nomorAdminBaru != 'undefined') {
                            nomorAdminBaru = "62" + nomorAdminBaru.substring(1);
                            nomorAdminBaru = nomorAdminBaru + "@s.whatsapp.net"
                            const [cekNomor] = await socket.onWhatsApp(nomorAdminBaru)
                            if (typeof cekNomor == 'undefined') {
                                await socket.sendMessage(chat.key.remoteJid, { text: "Admin tidak ditemukan dengan nomor " + perintah[1] })
                            } else {
                                let info = await updateAdminConfig(nomorAdminLama, nomorAdminBaru, fileConfigAdmin);
                                await socket.sendMessage(chat.key.remoteJid, { text: info + " dengan nomor " + perintah[1] })
                            }
                        } else {
                            await socket.sendMessage(chat.key.remoteJid, { text: "Perintah tidak lengkap :) \nsilahkan gunakan perintah : UpdateAdmin nomor_admin_lama nomor_admin_baru" })
                        }
                    }
                    else if (perintah[0] == 'deleteAdmin' || perintah[0] == 'Deleteadmin' || perintah[0] == 'deleteadmin' || perintah[0] == 'DeleteAdmin') {
                        let nomorAdminLama = perintah[1]
                        if (nomorAdminLama != 'undefined') {
                            if (nomorAdminLama.startsWith("0")) {
                                nomorAdminLama = "62" + nomorAdminLama.substring(1);
                                nomorAdminLama += "@s.whatsapp.net"
                            }
                            const [cekNomor] = await socket.onWhatsApp(nomorAdminLama)
                            if (typeof cekNomor == 'undefined') {
                                await socket.sendMessage(chat.key.remoteJid, { text: "Admin tidak ditemukan dengan nomor " + perintah[1] })
                            } else {
                                let info = await deleteAdmin(nomorAdminLama, fileConfigAdmin);
                                await socket.sendMessage(chat.key.remoteJid, { text: info + " dengan nomor " + perintah[1] })
                            }
                        } else {
                            await socket.sendMessage(chat.key.remoteJid, { text: "Perintah tidak lengkap :) \nsilahkan gunakan perintah : DeleteAdmin nomor_admin_lama" })
                        }
                    }
                } else {
                    // Bagian untuk menanggapi pesan dari pengguna (non-bot)
                }
                const arrayDataProduk = [];
                const arrayDataProdukLainnya = [];
                if (pesan == 'list' || pesan == 'List') {
                    await fetchData(arrayDataProduk, "Data_Produk_Premium");
                    await fetchData(arrayDataProdukLainnya, "Data_Produk_Lainnya");
                    let dataP = getAllKeyProduk(arrayDataProduk);
                    let dataPL = getAllKeyProduk(arrayDataProdukLainnya);
                    let pesanList = "*PRICES LIST ON LAPAK YUDHAS*\n\n";
                    if (dataP.length !== 0) {
                        pesanList += "🛍 Aplikasi Premium\n";
                        for (let i = 0; i < dataP.length; i++) {
                            pesanList += `➥ #${dataP[i]}\n`;
                        }
                        pesanList += "\n";
                    }
                    if (dataPL.length !== 0) {
                        pesanList += "🛍 Produk Lainnya\n";
                        for (let i = 0; i < dataPL.length; i++) {
                            pesanList += `➥ #${dataPL[i]}\n`;
                        }
                    }
                    pesanList += salamBrand;
                    await socket.sendMessage(chat.key.remoteJid, { text: pesanList });
                }
                // untuk cari produk
                if (pesan.substring(0, 1) == '#') {
                    const keyProduk = pesan.substr(1);
                    await fetchData(arrayDataProduk, "Data_Produk_Premium");
                    await fetchData(arrayDataProdukLainnya, "Data_Produk_Lainnya");
                    const produk = getDataProduk(arrayDataProduk, arrayDataProdukLainnya, keyProduk);
                    let pesanRespon = "";
                    if (produk === null) {
                        pesanRespon += "Produk yang Anda cari tidak ditemukan.\nSilakan hubungi admin jika ada yang ingin ditanyakan.";
                        pesanRespon += salamBrand;
                        await socket.sendMessage(chat.key.remoteJid, { text: pesanRespon });
                    } else {
                        pesanRespon += produk;
                        pesanRespon += salamBrand;
                        await socket.sendMessage(chat.key.remoteJid, { text: pesanRespon });
                    }
                }
                if (pesan.substring(0, 1) == '/') {
                    let pesanRespon = "";
                    const keyPesan = pesan.substr(1).toLowerCase();
                    if (keyPesan === 'payment') {
                        let rek = await fetchDataPayment("PAYMENT");
                        pesanRespon += rek;
                        pesanRespon += salamBrand;
                        await socket.sendMessage(chat.key.remoteJid, { text: pesanRespon });
                    }
                    if (keyPesan === 'chatadmin') {
                        const dataAdmin = await listAdmin(fileConfigAdmin);
                        let pesanAdmin = "";
                        if (dataAdmin.length === 0) {
                            pesanAdmin = "Tidak Ada Admin Yang Terdaftar";
                        } else {
                            pesanAdmin += "Daftar List Admin Bot Lapak Yudhas\n\n";
                            for (let i = 0; i < dataAdmin.length; i++) {
                                let nomorAdmin = dataAdmin[i].split("@");
                                nomorAdmin = "https://wa.me/" + nomorAdmin[0];
                                pesanAdmin += `Admin ${i + 1} ==> ${nomorAdmin}\n`;
                            }
                        }
                        await socket.sendMessage(chat.key.remoteJid, { text: pesanAdmin });
                    }
                }
                if (pesan == '.ping') {
                    await socket.sendMessage(chat.key.remoteJid, { text: "Test Ping" }, { quote: chat });
                    await socket.sendMessage(chat.key.remoteJid, { text: "Bot Sudah Berjalan Bang" })
                }
                if (pesan == 'Yud') {
                    await socket.sendMessage(chat.key.remoteJid, { text: "Test Ping" }, { quote: chat });
                    await socket.sendMessage(chat.key.remoteJid, { text: "Bot Sudah Berjalan Bang" })
                }

            } catch (error) {
                console.error("Error:", error);
            }
        }
    });

    return socket;
}

// Panggil fungsi untuk menghubungkan ke WhatsApp
connectToWhatsApp();