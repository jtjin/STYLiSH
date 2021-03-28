const express = require('express');

const router = express.Router();

// Connecting to MySQL server
const mysql = require('../modules/mysql_connect');

// Connecting to Redis
const redis = require('../modules/redis_connect');

// For Campaigns
router.get('/marketing/campaigns', async (req, res, next) => {
  try {
    let cacheCampaigns;
    // Check campaign from cache
    if (redis.client.ready) {
      cacheCampaigns = await redis.get('campaign');
    }
    if (cacheCampaigns) {
      console.log('Get campaign from cache');
      res.json({ data: JSON.parse(cacheCampaigns) });
      return;
    }

    // If cacheCampaigns not exists, get campaigns from DB and set it in redis
    const campaigns = await mysql.query('SELECT * FROM campaign', []);
    for (let i = 0; i < campaigns.length; i += 1) {
      campaigns[i].picture = `/assets/${campaigns[i].product_id}/${campaigns[i].picture}`;
    }
    res.json({ data: campaigns });

    if (redis.client.ready) {
      await redis.set('campaign', JSON.stringify(campaigns));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
