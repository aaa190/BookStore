# BookStore

API Server using NodeJs Express


## How to run

1. modify the .env file to suite your connection to db and mailtrap creds
2. if you want you can run mongodb in a docker container locally if you have docker and docker-compose installed on your system by executing:
    ```shell script
    sudo docker-compose up -d
    ```
3. execute:
    ```shell script
    npm install
    ```
4. execute:
    ```shell script
    npm start
    ```
   
   
## How to use

1. Import `BookStore.postman_collection.json` collection into postman, this collection contains all the apis used in this project with examples
2. Create some staff by calling createStaff api (create staff with different roles to test correctly)
3. you can then call getAllStaff to see the staff objects and use the returned staff id in the login
4. login and get a token by sending the staff id in the login api
5. use this token to test the rest of the apis


## Notes 

1. I did not use passwords just for simplicity
2. To borrow a book an api named `borrowBook` is called and passing in the body the book id and customer id, that will internally call the update book status api


