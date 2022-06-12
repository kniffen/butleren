import router from './router.js'

const port = process.env.APP_PORT || 5000

router.listen(port, () => console.log(`Router: Listening on port ${port}`))