const TelegramBot = require("node-telegram-bot-api")
const token = "7100351607:AAEEy-3c5OOCBjzegzW6e8ikOty0q14YOfM"
const BMKG_ENPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/"

console.log("Bot Siap")

const options = { polling: true }
const botMona = new TelegramBot(token, options)

// botMona.on("message", (calback) => console.log(calback))
// botMona.on("message", (calback) => {
//                     const id = calback.from.id
//                     botMona.sendMessage(id, calback.text)
// })

const prefix = "."
const sayHi = new RegExp(`^${prefix}halo$`)
const infoGempa = new RegExp(`^${prefix}gempa$`)

botMona.onText(/\/start/, function onStart(msg) {
  const opts = {
    reply_markup: {
      keyboard: [
        ['REQ'],
        ['Buy']
      ]
    },
    parse_mode: 'Markdown',
    reply_to_message_id: msg.message_id
  };
  botMona.sendMessage(msg.from.id, "*You are welcome!*\nWe would like to introduce you our new [product](https://xxx.yyy/zzz)", opts);
});

botMona.onText(sayHi, (calback) => {
  // botMona.sendMessage(calback.from.id, '*bold \*text*')
  var options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Yes",
            callback_data: "btn_yes"
          },
          {
            text: "No",
            callback_data: "btn_no"
          },
        ]
      ]
    }
  };
  botMona.sendMessage(calback.chat.id, "answer.", options);
})

botMona.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  let response;

  if (query.data === 'btn_yes') {
    response = 'You clicked Yes!';
  } else if (query.data === 'btn_no') {
    response = 'You clicked No!';
  }

  botMona.sendMessage(chatId, response);
});

botMona.onText(infoGempa, async (calback) => {
  const { message_id: originalMessageId, from: { username }, chat: { id: chatId } } = calback;

  const apiCall = await fetch(BMKG_ENPOINT + "autogempa.json");
  const { Infogempa: { gempa: { Tanggal, Jam, Coordinates, Lintang, Bujur, Magnitude, Kedalaman, Wilayah, Potensi, Dirasakan, Shakemap } } } = await apiCall.json();

  const BMKG_IMAGE = BMKG_ENPOINT + Shakemap;
  const resultText = `
*Telah terjadi gempa pada:*
Tanggal: ${Tanggal} | Jam: ${Jam}
Koordinat: ${Coordinates}
Lintang: ${Lintang}
Bujur: ${Bujur}
Magnitude: ${Magnitude} SR
Kedalaman: ${Kedalaman}
Wilayah: ${Wilayah}
Potensi: ${Potensi}
Dirasakan: ${Dirasakan}
    `;

  const option = {
    parse_mode: 'Markdown',
    caption: resultText,
    reply_to_message_id: originalMessageId
  };

  botMona.sendPhoto(chatId, BMKG_IMAGE, option)
});




/*
api gempa
{
  Infogempa: {
    gempa: {
      Tanggal: '04 Jul 2024',
      Jam: '04:51:22 WIB',
      DateTime: '2024-07-03T21:51:22+00:00',
      Coordinates: '-4.87,122.69',
      Lintang: '4.87 LS',
      Bujur: '122.69 BT',
      Magnitude: '2.8',
      Kedalaman: '5 km',
      Wilayah: 'Pusat gempa berada di darat 3.3 km BaratDaya Duruka',
      Potensi: 'Gempa ini dirasakan untuk diteruskan pada masyarakat',
      Dirasakan: 'II - III Duruka',
      Shakemap: '20240704045122.mmi.jpg'
    }
  }
}

chat biasa
{
  message_id: 9,
  from: {
    id: 1316540307,
    is_bot: false,
    first_name: '-',
    username: 'OwnerLapakYudhas',
    language_code: 'en'
  },
  chat: {
    id: 1316540307,
    first_name: '-',
    username: 'OwnerLapakYudhas',
    type: 'private'
  },
  date: 1720054574,
  text: 'halo'
}

chat kirim gambar
{
  message_id: 11,
  from: {
    id: 1316540307,
    is_bot: false,
    first_name: '-',
    username: 'OwnerLapakYudhas',
    language_code: 'en'
  },
  chat: {
    id: 1316540307,
    first_name: '-',
    username: 'OwnerLapakYudhas',
    type: 'private'
  },
  date: 1720054619,
  photo: [
    {
      file_id: 'AgACAgUAAxkBAAMLZoXzWt6hM2Xy3C6j4AkSDOCipvcAApC8MRuzczFUi-7-wKuHzh0BAAMCAANzAAM1BA',
      file_unique_id: 'AQADkLwxG7NzMVR4',
      file_size: 662,
      width: 90,
      height: 38
    },
    {
      file_id: 'AgACAgUAAxkBAAMLZoXzWt6hM2Xy3C6j4AkSDOCipvcAApC8MRuzczFUi-7-wKuHzh0BAAMCAANtAAM1BA',
      file_unique_id: 'AQADkLwxG7NzMVRy',
      file_size: 7349,
      width: 320,
      height: 134
    },
    {
      file_id: 'AgACAgUAAxkBAAMLZoXzWt6hM2Xy3C6j4AkSDOCipvcAApC8MRuzczFUi-7-wKuHzh0BAAMCAAN4AAM1BA',
      file_unique_id: 'AQADkLwxG7NzMVR9',
      file_size: 10203,
      width: 405,
      height: 169
    }
  ],
  caption: 'Ini gambar bang'
}
*/