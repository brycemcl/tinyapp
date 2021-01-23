# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). The short urls will fingerprint and track views. The raw data is accessible to the user on the details page for the url. Users are also able to edit the short urls to something memorable(/netflix instead of /s8fkj7).

## Final Product

!["Login Screen"](/screenshots/Login%20Screen.jpeg)
!["Create New Url Screen"](/screenshots/Create%20New%20Url.jpeg)
!["Edit Existing Urls screen. User can change either the short or long url"](/screenshots/Edit%20Url.jpeg)
!["My Urls shows all the urls the user owns"](/screenshots/My%20Urls.jpeg)
!["Url Details shows details for the url and allows the user to download the view data"](/screenshots/Url%20Details.jpeg)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- fingerprintjs
- Docker (optional)
- Docker-compose (optional)

## Getting Started

### Baremetal

- Set environment variables
  - NODE_ENV: production
  - PORT: 8080
  - SECRET: "Generate a secret key"
- Install all dependencies (using the `npm install` command).
- Run the server using the `npm start` command.

### Containerised

- Generate secret and place in a `secret.env` file.
- Run the server using the `docker-compose up` command.
