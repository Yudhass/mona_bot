const { makeWASocket, useMultiFileAuthState, } = require('@whiskeysockets/baileys')
const pino = require('pino')
const fs = require('fs');

var fileConfigAdmin = "config/admin.json";
var salamBrand = "\n\nPayment? : /Payment\nReady Stok? : /ChatAdmin\n\n[*LAPAK YUDHAS*]"

// command ==> listAdmin
async function listAdmin(filePath) {
    // Baca isi file JSON ke dalam memori
    const dataLama = JSON.parse(await fs.promises.readFile(filePath));
    let adminValues = dataLama["admin"];
    // load data lama
    let dataAdminLama = []
    for (const admin in adminValues) {
        const value = adminValues[admin];
        dataAdminLama.push(value)
    }
    return dataAdminLama
}
// command ==> addAdmin 083160890310
async function addAdminConfig(newData, filePath) {
    try {
        // Baca isi file JSON ke dalam memori
        const dataLama = JSON.parse(await fs.promises.readFile(filePath));
        let adminValues = dataLama["admin"];
        // load data lama
        let dataAdminLama = []
        for (const admin in adminValues) {
            const value = adminValues[admin];
            dataAdminLama.push(value)
        }
        if (dataAdminLama.includes(newData)) {
            // console.log("Admin Dengan Nomor Ini Sudah Terdaftar");
            return "Admin Dengan Nomor Ini Sudah Terdaftar";
        } else {
            // add data lama + data baru
            dataAdminLama.push(newData)
            // cek max admin
            if (dataAdminLama.length > 5) {
                // console.log("Admin Max 5 Orang");
                return "Admin Max 5 Orang";
            } else {
                // buat object json
                const dataAdminBaru = {
                    "admin": {}
                };
                for (let i = 0; i <= dataAdminLama.length; i++) {
                    const keyadmin = "admin" + i;
                    dataAdminBaru["admin"][keyadmin] = dataAdminLama[i];
                }
                await fs.promises.writeFile(filePath, JSON.stringify(dataAdminBaru, null, 2));
                // console.log("Admin Berhasil Ditambahkan");
                return "Admin Berhasil Ditambahkan";
            }
        }
    } catch (error) {
        console.error("Gagal menambahkan data ke file:", error);
    }
}

// command ==> updateAdmin nomorAdminLama(62) nomorAdminBaru
async function updateAdminConfig(adminLama, adminBaru, filePath) {
    try {
        adminLama = adminLama + "@s.whatsapp.net"
        // Baca isi file JSON ke dalam memori
        const dataLama = JSON.parse(await fs.promises.readFile(filePath));
        let adminValues = dataLama["admin"];
        // load data lama
        let dataAdminLama = []
        for (const admin in adminValues) {
            let value = adminValues[admin];
            dataAdminLama.push(value)
        }

        if (dataAdminLama.includes(adminLama) == false) {
            // console.log("Nomor Admin Tidak Ditemukan");
            return "Nomor Admin Tidak Ditemukan";
        } else {
            for (let i = 0; i < dataAdminLama.length; i++) {
                if (dataAdminLama[i] == adminLama) {
                    dataAdminLama.splice(i, 1);
                    break
                }
            }

            if (dataAdminLama.includes(adminBaru) == false) {
                dataAdminLama.push(adminBaru)
                // buat object json
                const dataAdminBaru = {
                    "admin": {}
                };
                for (let i = 0; i <= dataAdminLama.length; i++) {
                    const keyadmin = "admin" + i;
                    dataAdminBaru["admin"][keyadmin] = dataAdminLama[i];
                }
                await fs.promises.writeFile(filePath, JSON.stringify(dataAdminBaru, null, 2));
                // console.log("Admin Berhasil Diubah");
                return "Admin Berhasil Diubah";
            } else {
                return "Admin Sudah Terdaftar"
            }
        }
    } catch (error) {
        console.error("Gagal menambahkan data ke file:", error);
    }
}

// command ==> deleteAdmin nomorAdmin(083160890310)
async function deleteAdmin(adminLama, filePath) {
    try {
        // read file json
        const dataLama = JSON.parse(await fs.promises.readFile(filePath));
        let adminValues = dataLama["admin"];
        // load data lama
        let dataAdminLama = []
        for (const admin in adminValues) {
            let value = adminValues[admin];
            dataAdminLama.push(value)
        }

        if (dataAdminLama.includes(adminLama) == false) {
            // console.log("Nomor Admin Tidak Ditemukan" + adminLama + dataAdminLama);
            // 623160890310@s.whatsapp.net
            // 6283160890310@s.whatsapp.net
            return "Nomor Admin Tidak Ditemukan";
        } else {
            for (let i = 0; i < dataAdminLama.length; i++) {
                if (dataAdminLama[i] == adminLama) {
                    dataAdminLama.splice(i, 1);
                    break
                }
            }

            const dataAdminBaru = {
                "admin": {}
            };
            for (let i = 0; i <= dataAdminLama.length; i++) {
                const keyadmin = "admin" + i;
                dataAdminBaru["admin"][keyadmin] = dataAdminLama[i];
            }
            await fs.promises.writeFile(filePath, JSON.stringify(dataAdminBaru, null, 2));
            // console.log("List Admin Berhasil Diubah");
            return "Admin Berhasil Dihapus";
        }
    } catch (error) {
        console.error("Gagal menambahkan data ke file:", error);
    }
}

// ======================================================================
// Masalah Produk
// ======================================================================
const arrayDataProduk = [];
const arrayDataProdukLainnya = [];
const arrayDataCari = []
function getDataProduk(arrData, key) {
    console.log(arrData, key);
    for (let i = 0; i < arrData.length; i++) {
        if (arrData[i][0] === key) {
            return arrData[i][1];
        }
    }
    // Jika key tidak ditemukan, return null atau nilai default
    return null;
}
function getAllKeyProduk(arrayProduk) {
    let arrBaru = []
    for (let i = 0; i < arrayProduk.length; i++) {
        arrBaru.push(arrayProduk[i][0])
    }
    // Jika key tidak ditemukan, return null atau nilai default
    return arrBaru;
}
async function fetchData(arrayProduk, sheetProduk) {
    try {
        // Gunakan dynamic import() untuk mengimpor modul node-fetch
        const { default: fetch } = await import('node-fetch');

        // sheetID you can find in the URL of your spreadsheet after "spreadsheet/d/"
        const sheetId = "1WKqz8Nx6LSAtVWuNbt5fBCW9x3YBdQrdEr7WBXOi-YI";
        // sheetName is the name of the TAB in your spreadsheet (default is "Sheet1")
        const sheetName = encodeURIComponent(sheetProduk);
        const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${sheetName}`;
        let count = 0;

        const res = await fetch(sheetURL);
        const rep = await res.text();
        let data = JSON.parse(rep.substr(47).slice(0, -2));
        let panjangData = data.table.rows.length;
        // console.log(panjangData);

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
async function fetchDataPayment(sheetProduk) {
    try {
        // Gunakan dynamic import() untuk mengimpor modul node-fetch
        const { default: fetch } = await import('node-fetch');

        // sheetID you can find in the URL of your spreadsheet after "spreadsheet/d/"
        const sheetId = "1WKqz8Nx6LSAtVWuNbt5fBCW9x3YBdQrdEr7WBXOi-YI";
        // sheetName is the name of the TAB in your spreadsheet (default is "Sheet1")
        const sheetName = encodeURIComponent(sheetProduk);
        const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${sheetName}`;
        let count = 0;

        const res = await fetch(sheetURL);
        const rep = await res.text();
        let data = JSON.parse(rep.substr(47).slice(0, -2));
        let panjangData = data.table.rows.length;
        // console.log();
        return data.table.rows[0].c[0].v
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// ======================================================================
// Masalah Server
// ======================================================================
function isBot(credential) {
    if (credential === true) {
        return true
    } return credential
}

async function connectToWhatsApp() {
    const auth = await useMultiFileAuthState("session");
    const socket = makeWASocket({
        // can provide additional config here
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

        // console.log(pesan.substring(0, 1))

        if (pesan) {
            // fitur seting admin config
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
                            // return console.log("Nomor Admin Tidak Ditemukan");
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
                            // return console.log("Nomor Admin Tidak Ditemukan");
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
                        if (nomorAdminLama != 'undefined') {
                            nomorAdminLama = "62" + nomorAdminLama.substring(1);
                            nomorAdminLama = nomorAdminLama + "@s.whatsapp.net"
                            let info = await deleteAdmin(nomorAdminLama, fileConfigAdmin)
                            await socket.sendMessage(chat.key.remoteJid, { text: info + " dengan nomor " + perintah[1] })
                        }
                    } else {
                        await socket.sendMessage(chat.key.remoteJid, { text: "Perintah tidak lengkap :) \nsilahkan gunakan perintah : DeleteAdmin nomor_admin_lama" })
                    }
                }
            }

            if (pesan == 'list' || pesan == 'List') {
                await fetchData(arrayDataProduk, "Data_Produk_Premium")
                await fetchData(arrayDataProdukLainnya, "Data_Produk_Lainnya")
                let dataP = getAllKeyProduk(arrayDataProduk)
                let dataPL = getAllKeyProduk(arrayDataProdukLainnya)
                let pesan = ""
                pesan += "*PRICES LIST ON LAPAK YUDHAS*\n\n"
                if (dataP.length != 0) {
                    pesan += `🛍 Aplikasi Premium\n`
                    for (let i = 0; i < dataP.length; i++) {
                        pesan += `➥ #` + dataP[i] + "\n"
                    }
                    pesan += "\n"
                }
                if (dataPL.length != 0) {
                    pesan += `🛍 Produk Lainnya\n`
                    for (let i = 0; i < dataPL.length; i++) {
                        pesan += `➥ #` + dataPL[i] + "\n"
                    }
                }
                pesan += salamBrand
                await socket.sendMessage(chat.key.remoteJid, { text: pesan })
            }
            // untuk cari produk
            if (pesan.substring(0, 1) == '#') {
                const keyProduk = pesan.substr(1);
                await fetchData(arrayDataCari, "Data_Produk_Premium");
                await fetchData(arrayDataCari, "Data_Produk_Lainnya");
                const produk = getDataProduk(arrayDataCari, keyProduk);
                // console.log(arrayDataCari);
                let pesanRespon = "";
                if (produk == null) {
                    pesanRespon += "Produk yang anda cari tidak ada \nSilahkan chat admin jika ada yang ingin ditanyakan";
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
                const keyPesan = pesan.substr(1);
                if (keyPesan == 'Payment' || keyPesan == 'payment') {
                    let rek = await fetchDataPayment("PAYMENT");
                    pesanRespon += rek
                    pesanRespon += salamBrand;
                    await socket.sendMessage(chat.key.remoteJid, { text: pesanRespon });
                }
                if (keyPesan == 'ChatAdmin' || keyPesan == 'chatadmin' || keyPesan == 'chatAdmin' || keyPesan == 'Chatadmin') {
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
            }
            if (pesan == '.ping') {
                await socket.sendMessage(chat.key.remoteJid, { text: "Test Ping" }, { quote: chat });
                await socket.sendMessage(chat.key.remoteJid, { text: "Bot Sudah Berjalan Bang" })
            }
            if (pesan == 'Yud') {
                await socket.sendMessage(chat.key.remoteJid, { text: "Test Ping" }, { quote: chat });
                await socket.sendMessage(chat.key.remoteJid, { text: "Bot Sudah Berjalan Bang" })
            }
        }
    })
}


connectToWhatsApp()

