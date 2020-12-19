const express = require('express');
const axios = require('axios');
const nodeCache = require('./middlewares');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

console.log(process.env.cart);
console.log(process.env.products);


app.use(express.json());
app.use(nodeCache(['/products'], 120));

app.all('/:recipient*', async (req, res) => {
  try {
    console.log('originalUrl', req.originalUrl);
    console.log('method', req.method);
    console.log('body', req.body);
    console.log('recipient', req.params.recipient);

    const recipientHost = process.env[req.params.recipient];

    if (recipientHost) {
      const recipientUrl = generateRecipientUrl(recipientHost, req.params.recipient, req.originalUrl);
      const axiosConfig = {
        method: req.method,
        url: recipientUrl,
        ...(Object.keys(req.body || {}).length > 0 && { data: req.body })
      };

      console.log(axiosConfig);
      const { data } = await axios(axiosConfig);
      res.send(data);
    } else {
      res.status(502).send({ error: 'Cannot process request'})
    }
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data)    
    } else {
      res.status(500).send(error.message);
    }
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

// convert /cart/* to /*/cart
function generateRecipientUrl(host, recipient, url) {
  const recipientUrl = recipient.startsWith('cart')
    ? host + url.replace('/cart', '') + '/cart'
    : host + url;

  console.log('recipientUrl', recipientUrl);

  return recipientUrl;
}