
# CPegle

CPegle is a project idea i got during my endsem exams that if there is omegle why not have something simmilar for CP so i made CPegle.Which uses Codeforces API endpoints to get questions and verify whether a user exists in Codeforces.


## Features
 
### User Authentication
 - Login: Secure login functionality for existing users.
 - Signup: Easy registration process for new users.
 - It also uses zod for input validation.

### Compete And Chat 
- So when a user Signs In/Up he/she is redirected to the dashboard page
- The dashboard page has a button to register which is to register particularly to set a map with username as key and socket with its value
- Now, if a user wants to compete he clicks start competion which will pair him with a user to compete a link will be sent out and whoever submits first WINS and they could also chat during or after the competion which is implemented using Websockets

- The dashboard has a logout button which on clicking will redirect to the sign in page clearing all the local storage
## Technologies Used

### Frontend
- **React:** <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" width="20"/>
- **Vite:** <img src="https://vitejs.dev/logo.svg" alt="Vite" width="20"/>

### Backend
- **Node.js:** <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" alt="Node.js" width="20"/>
- **Express:** <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" alt="Express" width="50"/>

### Real-Time Communication
- ws: a Node.js WebSocket library

### Database
- **MongoDB:** <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" alt="MongoDB" width="50"/>

### Authentication
- **JWT (JSON Web Tokens):** <img src="https://jwt.io/img/pic_logo.svg" alt="JWT" width="20"/>
## Setup and Installation

1. **Clone the Repository:**
    ```sh
    git clone https://github.com/balani491/CPegle
    cd CPegle
    ```

2. **Install Dependencies:**
    - Navigate to the frontend and install dependencies:
        ```sh
        cd frontend
        npm install
        ```
    - Navigate to the backend and install dependencies:
        ```sh
        cd backend
        npm install
        ```

3. **Environment Variables:**
    - Create a `.env` file in the backend directory and configure your MongoDB URI, JWT secret, and other necessary environment variables.
	 Example `.env` file:
	```sh
	PORT1=3000
    DATABASE_URL={YOUR_MONGO_DB_CONNECTION_STRING}
    JWT_SECRET = {YOUR_JWT_SECRET}

	```

4. **Run the Application:**
    - Start the backend server:
        ```sh
        cd backend
        tsc -b
        node src/index.js
        ```
    - Start the frontend development server:
        ```sh
        cd frontend
        npm run dev
        ```

## Usage

Once a user logs in he could compete and chat.
## Contribution And Improvements

Contributors are welcome to contribute.The Website is hosted on https://cpegle.netlify.app/ 

The backend is currently hosted as a Web Service in Render

### Possible And Future Improvements:-

-  Add firebase authentication to verify email
- Send attachments in a message
-  WebRTC implementation so that users could see and talk as well
- Proper queue implementation using Redis
-  Add CI/CD pipeline
- Unit Testing with jest or vitest
- Change Password with mobile/email verification
- An LLM to answer some coding related doubt.
- In house questions and IDE so that we don't need to rely on Codeforces API
