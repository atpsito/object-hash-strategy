import { createHash, compareHashes } from "../../functions/hash.ts";
import { getDataFromCompare } from "../../functions/hash.ts";
import { HashSchema } from "../../types/hash.types.ts";

const data = {
  id: 1,
  name: "Imagine Dragons",
  genre: "Rock",
  description:
    "Imagine Dragons is an American rock band from Las Vegas, Nevada.",
  songs: [
    {
      id: 1,
      artist_id: 1,
      title: "Radioactive",
      album: "Night Visions",
      year: 2012,
      genre: "Rock",
      duration: "3:06",
      url: "https://www.youtube.com/watch?v=ktvTqknDobU"
    },
    {
      id: 2,
      artist_id: 1,
      title: "Demons",
      album: "Night Visions",
      year: 2013,
      genre: "Rock",
      duration: "3:11",
      url: "https://m.youtube.com/watch?v=m_m_m_m_m_m_m_m_m_m"
    }
  ]
};

const newData = { ...data };

const schema: HashSchema<typeof data> = {
  hash: true,
  id: "id",
  songs: {
    hash: true,
    id: "id",
    parentHash: true
  }
};

const dataObjectHash = createHash(data, schema);
console.log(dataObjectHash);
// {
//     hash: '3f7f8b0b7787fb28666da87a803878587286c531',
//     id: 1,
//     songsHash: '74e00c297d092cb744bc3c6f90c3a20840d6be19',
//     songs: [
//       { hash: '3d5d5e3db08d36a5e00623f94b8624d9e80dd2ab', id: 1 },
//       { hash: '91b74e916e3a856bc987f066c465298916ae994c', id: 2 }
//     ]
//   }
newData.songs[1].url = "https://www.youtube.com/watch?v=mWRsgZuwf_8";
const newDataObjectHash = createHash(newData, schema);
console.log(newDataObjectHash);
// {
//     hash: '3f7f8b0b7787fb28666da87a803878587286c531',
//     id: 1,
//     songsHash: '211c8c3369e0b7e823acce56261692b7828724da',
//     songs: [
//       { hash: '3d5d5e3db08d36a5e00623f94b8624d9e80dd2ab', id: 1 },
//       { hash: 'dfc19ec50d6c07acee917fa931f1ed9edacf28f7', id: 2 }
//     ]
//   }

const compareResponse = compareHashes(newDataObjectHash, dataObjectHash);
console.log(compareResponse);

// {
//     id: 1,
//     action: 'none',
//     songs: [ { id: 1, action: 'none' }, { action: 'update', id: 2 } ]
//   }

const dataResponse = getDataFromCompare(newData, compareResponse, schema);

console.dir(dataResponse, { depth: null });

// {
//     id: 1,
//     action: 'none',
//     songs: [
//       { id: 1, action: 'none' },
//       {
//         action: 'update',
//         id: 2,
//         data: {
//           id: 2,
//           artist_id: 1,
//           title: 'Demons',
//           album: 'Night Visions',
//           year: 2013,
//           genre: 'Rock',
//           duration: '3:11',
//           url: 'https://www.youtube.com/watch?v=mWRsgZuwf_8'
//         }
//       }
//     ]
//   }
