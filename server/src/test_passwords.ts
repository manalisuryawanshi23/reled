import { Client } from 'pg';

const passwords = ['', 'admin', 'root', 'password', '1234', '123456', '12345', 'postgres123', 'pgadmin'];

async function testPasswords() {
  for (const pw of passwords) {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: pw,
    });
    try {
      await client.connect();
      console.log(`\n>>> CONNECTION SUCCESSFUL WITH PASSWORD: "${pw}" <<<\n`);
      await client.end();
      return;
    } catch (e: any) {
      console.log(`Password "${pw}" failed: ${e.message}`);
    }
  }
  console.log('\nCould not connect with any common default passwords.');
}

testPasswords();
