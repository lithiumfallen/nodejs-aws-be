const NodeCache = require( "node-cache" );

const cache = new NodeCache();

function nodeCache(routes, duration) {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      next();
      return;
    }

    const key = '__node__cache' + req.originalUrl || req.url;
    const cachedContent = cache.get(key);
    const isRouteCachable = routes.some(route => req.originalUrl.startsWith(route));

    if (!isRouteCachable) {
      next();
      return;
    }

    if (cachedContent) {
      console.log('response from cache');
      res.send(JSON.parse(cachedContent));
      return;
    } else {
      res.sendResponse = res.send;
      res.send = body => {
        if (isRouteCachable) {
          console.log(key);
          cache.set(key, body, duration);
        }
        res.sendResponse(body);
      }
      next();
    }
  };
}

module.exports = nodeCache;
