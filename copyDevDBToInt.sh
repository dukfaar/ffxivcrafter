mongodump -d mean-dev -o ~/temp/mongodump
mongorestore -d mean-integration ~/temp/mongodump/mean-dev
