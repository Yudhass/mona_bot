
const keyValueArray = [];
function getValueByKey(key) {
    for (let i = 0; i < keyValueArray.length; i++) {
        if (keyValueArray[i][0] === key) {
            return keyValueArray[i][1];
        }
    }
    // Jika key tidak ditemukan, return null atau nilai default
    return null;
}

// Gunakan dynamic import() untuk mengimpor modul node-fetch
import('node-fetch').then(async ({ default: fetch }) => {
    // sheetID you can find in the URL of your spreadsheet after "spreadsheet/d/"
    const sheetId = "1WKqz8Nx6LSAtVWuNbt5fBCW9x3YBdQrdEr7WBXOi-YI";
    // sheetName is the name of the TAB in your spreadsheet (default is "Sheet1")
    const sheetName = encodeURIComponent("Data_Produk");
    const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${sheetName}`;
    let count = 0

    try {
        const res = await fetch(sheetURL);
        const rep = await res.text();
        let data = JSON.parse(rep.substr(47).slice(0, -2));
        let panjangData = data.table.rows.length
        console.log(panjangData);
        // let data = JSON.parse(rep);
        // console.log(data.table.rows[0]);
        // console.log(data.table.rows.length);
        for (let i = 1; i < panjangData; i++) {
            let dataProduk = data.table.rows[i];
            if (dataProduk == 'undefined') {
                continue
            }
            // console.log(dataProduk.c[1]);
            keyValueArray[count] = [dataProduk.c[0].v, dataProduk.c[1].v];
            count += 1
        }

        // console.log(getValueByKey('Youtube'));
        console.log(keyValueArray[1][0]);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}).catch(err => {
    console.error("Error importing node-fetch:", err);
});