# [URL Shortener Microservice](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice)

- POST REQUEST /api/shorturl/ : devuelve un JSON con la URL original y su id. {"original_url":"www.google.com","short_url":1}
- Si la URL no es válida devuelve un error. Validado con dns.lookup(host, cb).
- Al consultar a la nueva URL(/api/shorturl/:id), se redirige a la URL original.