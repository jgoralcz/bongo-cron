const axios = require('axios');
const { scheduleJob: ScheduleJob } = require('node-schedule');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'error';

const bongoBotAPI = axios.create({
  baseURL: process.env.API_URL,
  auth: { username: process.env.USERNAME, password: process.env.PASSWORD },
  headers: { 'Content-type': 'application/json' },
});

ScheduleJob('minute', '0 * * * * *', async () => {
  const now = new Date();
  const minute = now.getMinutes();
  const hour = now.getHours();

  await bongoBotAPI.delete('/refresh/guilds/rolls/minute').catch(error => logger.error(error));
  await bongoBotAPI.put('/refresh/count/minute').catch(error => logger.error(error));
  await bongoBotAPI.patch('/rolls/reset', { minute }).catch(error => logger.error(error));
  await bongoBotAPI.patch('/claims/reset', { hour, minute }).catch(error => logger.error(error));
});
