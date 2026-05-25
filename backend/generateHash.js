const bcrypt = require('bcryptjs');

bcrypt.hash('password123', 10).then(hash => {
    console.log('Real bcrypt hash of password123:');
    console.log(hash);
});
