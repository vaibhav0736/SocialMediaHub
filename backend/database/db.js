

// Import the SQLite driver
const Database =require('better-sqlite3');
const path=require('path');
const fs=require('fs');


// Path to our database file
const DB_PATH = path.join(__dirname, 'social_media.db');

// Initialize database connection
const db = new Database(DB_PATH);

// Enable foreign keys (SQLite feature, off by default)
db.pragma('foreign_keys = ON');


function initializeDatabase()
{

        // Read and execute our schema file

    const schemaPath=path.join(__dirname,'schema.sql');
    const schema=fs.readFileSync(schemaPath,'utf8');

    // Execute multiple statements (schema.sql has DROP + CREATE)
    db.exec(schema);

    console.log("db  schema created succesfully");

    const seedPath = path.join(__dirname, 'seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');

    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (userCount.count === 0) {
        db.exec(seed);
        console.log('Sample data seeded successfully');
    } else {
        console.log('Database already has data, skipping seed');
    }
    
}


// HELPER FUNCTIONS - These make queries easier
// =============================================

// Get one row
function getOne(sql, params = []) {
    return db.prepare(sql).get(...params);
}

// Get multiple rows
function getAll(sql, params = []) {
    return db.prepare(sql).all(...params);
}

// Run insert/update/delete (returns lastInsertRowid)
function run(sql, params = []) {
    return db.prepare(sql).run(...params);
}


module.exports={
    db,
    initializeDatabase,
    getOne,
    getAll,
    run
}