/*
    Redis is just like JSON, pretty much can be set as middlemen when dealing datas from relational database
    such as POSTGRES and MYSQL but much faster.

    i.e 
        Main database - Postgres
            powered with Redis

    When sending a request for a data from client to server. 
    
    If redis is added in the app,
    in most cases you would want to check if the our redis database has this values you are querying
    and return it back to the client (much quicker).

    Else if redis standalone database doesn't have the requested data. Grab them in the actual database 
    like POSTGRES or MYSQL and store the data to redis database then spit it out from the redis database.


    Or just send back the requested query from POSTGRES or MYSQL to the client while also saving it to the
    redis database for future access.

    -------------------------------------------------------------------
    |   REDIS BASIC COMMANDS
    |   
    |   To start up redis, enter this on the command line:
    |   redis-cli
    |   _______________________________________________________________
    |
    |   To quit, enter this on the command line:
    |   quit
    |   _______________________________________________________________
    |
    |   To set a key value pair, enter this on the command line:
    |   SET key value
    |       i.e.: SET name jake
    |       i.e.: SET name john
    |       i.e.: SET name jona
    |   _______________________________________________________________
    |
    |   To get value based on key, enter this on the command line:
    |   GET key
    |       i.e.: GET name
    |           - returns "jake" (based on line 33)
    |       i.e.: GET name
    |           - returns "john" (based on line 34)
    |       i.e.: GET name
    |           - returns "jona" (based on line 35)
    |   _______________________________________________________________
    |
    |   To delete a key, enter this on the command line:
    |   DEL key
    |       i.e.: DEL name
    |           - returns "(integer) 1" which means an item was deleted
    |           to verify. use GET [key that was deleted]
    |       i.e.: GET name
    |           - returns "(nil)" which means we had successfully deleted 
    |           that key of "name"
    |       
    |   Deleting multiple keys:
    |   DEL key key key
    |       i.e.: Del names hobbies age
    |   _______________________________________________________________
    |
    |   To check whether a key exists, enter this on the command line:
    |   EXISTS key
    |       i.e.: EXISTS name
    |           - If the query returns "(integer) 1" that means the key 
    |           of name exists.
    |       i.e.: EXISTS hotdog
    |           - If the query returns "(integer) 0" that means the key 
    |           of hotdog does NOT exists.
    |   _______________________________________________________________
    |   
    |   To get all keys, enter this on the command line:
    |   KEYS *
    |       - this should return all existing keys, if there aren't any
    |       existing keys, then normally it will return (empty array)
    |   _______________________________________________________________
    |   
    |   To get rid all of data in database, enter this on the command line:
    |   FLUSHALL
    |   _______________________________________________________________
    |   
    |   To get the ttl (time to live), enter this on the command line:
    |   TTL key
    |       i.e.: ttl name
    |           - returns "(integer) - 1" as default which means it won't
    |           expire at all.
    |   
    |   To add expiration for your keys, enter this on the command line:
    |   EXPIRE key time
    |       i.e.: EXPIRE name 10
    |           - Means this key of "name" will expire on 10seconds.
    |           to check the countdown of this expiration. You can just
    |           spam the "TTL key" to check it.
    |           - When you are still spamming the "ttl key", you will notice
    |           that the countdown will start from 10 and is decrementing.
    |           Once the "TTL key" returns "(integer) -2" 0 to -2, that
    |           means the key is already gone. To verify this, you can use 
    |           the "GET" query and it should return (nil).
    |
    |   Other things to consider about expiration, please check for docs about
    |   SETEX key time value
    |
    -------------------------------------------------------------------
    👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾
    -------------------------------------------------------------------
    |
    |   ADDING LIST to REDIS
    |   LPUSH key value
    |       - lpush means left push
    |       i.e.: LPUSH names john
    |       Check using "GET": GET names returns:
    |       (error) WRONGTYPE Operation against a key holding the wrong
    |       kind of value.    
    |       WOAHHH error😵‍💫 "GET" only work on strings and not lists/arrays
    |           
    |       To check a list, use this command instead:    
    |       LRANGE key startingIndex endingIndex
    |           i.e.: LRANGE names 0 -1           
    |           - 0 means start of the list and -1 UP TO end of the list
    |           returns "john"
    |           
    |       i.e.: LPUSH names jake james jona
    |       LRANGE key startingIndex endingIndex
    |           i.e.: LRANGE names 0 -1           
    |           - 0 means start of the list and -1 UP TO end of the list
    |           returns 
    |               "jona"
    |               "james"
    |               "jake"
    |               "john"
    |
    |       i.e.: RPUSH names jamie oliver
    |       LRANGE key startingIndex endingIndex
    |           i.e.: LRANGE names 0 -1           
    |           - 0 means start of the list and -1 UP TO end of the list
    |           returns 
    |               "jona"
    |               "james"
    |               "jake"
    |               "john"
    |               "jamie"
    |               "oliver"
    |       
    |   Things to research:
    |        LPOP
    |        RPOP
    -------------------------------------------------------------------
    👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾
    -------------------------------------------------------------------
    |
    |   SETS - sets is a list/array that is completely unique
    |
    |   SADD key value
    |       - SADD means SET ADD
    |   
    |       Setting multiple values
    |       i.e.: SADD hobbies "lifting" "jogging" "running"
    |
    |       Setting a single value
    |       i.e.: SADD hobbies "dancing"
    |
    |       Setting another value
    |       i.e.: SADD hobbies "dancing"
    |           - Notice that in here we are adding the value of 
    |           "dancing" once again. Since sets are used to be 
    |           unique, then this 2nd "dancing" value won't be added.
    |
    |   SMEMBERS key
    |       - Will return all members of the set of that key
    |       i.e.: SMEMBERS hobbies
    |
    |   SREM key value
    |       - SREM means set remove. Removing a value from a specific key
    |       i.e. SREM hobbies "dancing"
    |       - This should remove the "dancing" value from the key of "hobbies"
    |
    -------------------------------------------------------------------
    👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾👾
    -------------------------------------------------------------------
    |
    |   HASHES
    |
    |   HSET masterKey key value 
    |       i.e. HSET person name Jake
    |       i.e. HSET person age 24
    |       i.e. HSET person gender male
    |       i.e. HSET location address "purok jose palma"
    |
    |   HGET masterKey key
    |       i.e. HGET person name
    |           - returns "Jake"
    |       i.e. HGET person age
    |           - returns "24"
    |       i.e. HGET location address
    |           - returns "purok jose palma"
    |
    |   HGETALL masterKey
    |       i.e. HGETALL person
    |           - returns
    |              1) "name"
    |              2) "Jake"
    |              3) "age"
    |              4) "24"
    |              5) "gender"
    |              6) "male"
    |       i.e. HGETALL location
    |           - returns
    |              1) "address"
    |              2) "purok jose palma"
    |
    |   HDEL masterKey key
    |       i.e.: HDEL person name
    |       i.e.: HDEL person age
    |       Check your person hash "HGETALL person"
    |           - returns 
    |              1) "gender"
    |              2) "male"
    |
    |   HEXISTS masterKey key
    |       i.e.: HEXISTS person name
    |           - returns
    |              (integer) 0
    |       i.e.: HEXISTS person age
    |           - returns
    |              (integer) 0
    |       i.e.: HEXISTS person gender
    |           - returns
    |              (integer) 1
    |
*/