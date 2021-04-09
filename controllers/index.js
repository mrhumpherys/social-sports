const router = require('express').Router();
const apiRoutes = require('./api');
// TURN ON LATER AFTER TESTING
const homeRoutes = require('./home-routes');
const dashboardRoutes = require('./dashboard-routes');
//const profileRoutes = require('./profile-routes');

router.use('/api', apiRoutes);
// TURN ON LATER FOR HOME PAGE AND USER DASHBOARD
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);
//router.use('/profile', profileRoutes);
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;