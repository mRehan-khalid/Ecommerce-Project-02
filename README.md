
******************************************************************************************************************************************************************************************
# SmartReact — E-commerce Frontend                                                                                                                                                        

This is the **React frontend** for the **E-commerce System (I like Calling it SmartReach)**.  
It provides a clean, user-friendly interface for both **Admin** and **User** panels, integrates with a **Laravel backend**, and follows **modern React development best practices**.

******************************************************************************************************************************************************************************************
## Project Overview
---

### Key Features
- **Admin Panel**
  - Add, update, delete, and view products  
  - Search and manage product listings  
- **User Panel**
  - Search and view products  
  - Add to cart and manage quantities  
  - Place orders and view order history  
  - Generate **PDF/Excel** invoices  
- **Authentication**
  - Session-based login and registration with validations  
- **API Integration**
  - Communicates efficiently with the Laravel backend  
- **Environment Configuration**
  - Simple `.env` setup for development and production  


## Tech Stack & Versions

| Technology                  | Version   |
|-----------------------------|-----------|
| **React.js**                |  19.2.4   |
| **React Router DOM**        | 6.30.3    |
| **MDB React UI Kit**        |10.0.0     |
| **React Bootstrap**         | 2.10.10   |
| **Framer Motion**           | 12.34.1   |
| **React Toastify**          | 11.0.5    |
| **Node.js / npm**           | ≥ 20.19.0 |

> All versions are listed in `package.json`.

******************************************************************************************************************************************************************************************
## Project Structure
---

```
src/
├── components/        # Reusable components
├── pages/             # Main pages (Login, Register, AddProduct, UpdateProduct)
├── Header/            # Navbar / Header component
├── environment.js     # Environment configuration
├── App.js             # Main app routes
└── index.js           # App entry point
```

- Each component/page includes its own dedicated CSS file.  
- Modular styling is used with minimal external dependencies.  

---
## Setup Instructions
---


### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Ecommerce-Project-02.git
cd TechGym-Frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:
```bash
REACT_APP_SERVER_URL=http://localhost:8000/api
```

In `environment.js`, use the variable as follows:
```js
export const environment = {
  production: process.env.NODE_ENV === "production",
  serverUrl: process.env.REACT_APP_SERVER_URL
};
```

> Replace the URL with your production backend URL when deploying.

### 4. Run the Application
```bash
npm start
```

- The app runs at `http://localhost:3000`  
- Ensure your Laravel backend is active on port `8000` (or your configured port)

---
## Authentication & Roles
---

|        Role       |                                    Description                              |
|-------------------|-----------------------------------------------------------------------------|
| **Admin**         | One admin exists (`user_role = "admin"`) created manually via database. ----|
| **User**          | All registered users with `user_role = "user"`. ----------------------------|

### Validations
- Email format and password strength validation  
- Duplicate registration prevention  

---

## Application Features

### Admin Panel
- Search products  
- View product list  
- Add new products (with image upload)  
- Update existing products  
- Delete products  

---

### User Panel
- Search and view products  
- Add to cart and adjust quantities  
- Remove products from cart  
- Place orders with invoice generation  
- View past orders  

---

### General Features
- Loading spinners during API calls  
- Toast notifications for success/error messages  
- Real-time frontend cart updates synced via backend APIs  
- Clear modular architecture and component separation  

Example API call:
```js
const response = await fetch(`${environment.serverUrl}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```
---

## Assumptions

- Authentication uses session/token-based login (not JWT)
- Only one admin exists, created manually in database
- Cart updates are real-time on the frontend but persist via backend API
- Backend handles database operations, validations, and file storage

---

## Dependencies

- `react`, `react-dom`
- `react-router-dom`
- `mdb-react-ui-kit`
- `react-bootstrap`
- `framer-motion`
- `react-toastify`
- `bootstrap`

> All dependencies are in `package.json`.

---

## Best Practices Followed

- Modular and reusable React components  
- Separate routes for admin and user functionalities  
- Proper use of `.env` for API configuration  
- Minimal and meaningful interface design  
- CSS separation per component  
- Efficient data management using React Hooks (`useState`, `useEffect`, `useRef`)  

---

## Future Enhancements

- Add advanced search filters  
- Implement JWT authentication  
- Add unit testing for components  
- Dockerize frontend for deployment  
- Enable lazy loading for product lists and images  

---

## Notes for Evaluators

- Two main panels: **Admin** and **User**  
- Backend API communication handled dynamically through environment variables  
- Lightweight, fast setup for local testing  
- Follows standard React project structure and clean UI principles  

---

******************************************************************************************************************************************************************************************

### Author
- **Name:** Muhammad Rehan Khalid  
- **Email:** muhammadrehan02@gmail.com  
- **GitHub:** [https://github.com/mRehan-khalid]

---

If you find this project useful, consider giving it a star on GitHub!
