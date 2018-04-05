'use strict'

var path = require('path')
var rootPath = path.join(__dirname, '/../..')

var sslBase = '/etc/letsencrypt/live/dukfaar.com/'

module.exports = {
  root: rootPath,
  http: {
    port: process.env.PORT || 3000
  },
  favicon: rootPath + '/packages/custom/ffxivcrafter/public/assets/img/icons/favicon.ico',
  hostname: process.env.HOST || process.env.HOSTNAME,
  db: process.env.MONGOHQ_URL,
  templateEngine: 'swig',

  // The secret should be set to a non-guessable string that
  // is used to compute a session hash
  sessionSecret: 'MEAN',

  // The name of the MongoDB collection to store sessions in
  sessionCollection: 'sessions',

  // The session cookie settings
  sessionCookie: {
    path: '/',
    httpOnly: true,
    // If secure is set to true then it will cause the cookie to be set
    // only when SSL-enabled (HTTPS) is used, and otherwise it won't
    // set a cookie. 'true' is recommended yet it requires the above
    // mentioned pre-requisite.
    secure: false,
    // Only set the maxAge to null if the cookie shouldn't be expired
    // at all. The cookie will expunge when the browser is closed.
    maxAge: null
  },
  public: {
    languages: [{
      locale: 'en',
      direction: 'ltr'
    }, {
      locale: 'he',
      direction: 'rtl'
    }],
    currentLanguage: 'en',
    loginPage: '/auth/login',
    cssFramework: 'bootstrap'
  },
  clusterSticky: false,
  stickyOptions: {
    proxy: true, // activate layer 4 patching
    header: 'x-forwarded-for', // provide here your header containing the users ip
    num: (process.env.CPU_COUNT || require('os').cpus().length) - 1
  },
  // The session cookie name
  sessionName: 'connect.sid',
  // Set bodyParser options
  bodyParser: {
    json: {limit: '50mb'},
    urlencoded: {limit: '50mb', extended: true}
  },
  emailFrom: 'raincollector@dukfaar.com', // sender address like ABC <abc@example.com>
  mailer: {
    sendmail: true
  },
  imageStorageBase: rootPath + '/../rc_imageStorage/',
  newsletterStorageBase: rootPath + '/../rc_newsletterStorage/'
}
