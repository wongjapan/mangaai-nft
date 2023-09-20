const fs = require('fs');
const desc = "With this Membership NFT, enjoy special privileges in the Manga AI community for a whole year from the minting date."

const IMAGE_URL = 'https://mintnft.mangaai.org/assets/image.png'

const build_metadata = (token_id) => {

  let metadata = {};

  metadata.name = `Manga AI Membership NFT #${token_id}`;
  metadata.description = desc;
  metadata.image = IMAGE_URL;
  metadata.external_url = "https://mangaai.org";

  // save json file

  fs.writeFileSync(`./metadata/${token_id}.json`, JSON.stringify(metadata));

}

for (let i = 0; i < 333; i++) {
  build_metadata(i);
}

