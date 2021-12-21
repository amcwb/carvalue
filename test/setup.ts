import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';


global.beforeEach(async () => {
    await rm(join(__dirname, '..', 'db-test.sqlite')).catch(e=>0)
})

global.afterEach(async () => {
    const conn  = getConnection();
    await conn.close();
})