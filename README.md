# Title

    Inventory Management 

1. Objective

    The goal of this project is to develop a React application that displays the table which contains different products. The table contains name, brand, product avaibility, and buttons to edit data and to see the history of a product in sidebar. The application should support adding and editing data through user interactions,  By the end, you'll have a responsive app that handles dynamic data, with tools for metadata input and state management, suitable for beginners learning React and diagram libraries.
    

## Tech Stack

- **Programming Language and Framework**: JavaScript with React (version 18 or later recommended for hooks and context).
- **Libraries**:
    - React Flow: For rendering interactive diagrams (install via npm).
    - Optional: React Context or Redux for state management; use built-in React hooks if keeping it simple.
- **Development Environment**:
    - Node.js (version 16 or higher) and npm (or yarn) for package management.
    - A code editor like Visual Studio Code (VS Code) for writing and debugging code.
- **Hardware Specifications**: A computer with at least 4GB RAM, a modern web browser (e.g., Chrome, Firefox) for testing, and internet access for installing packages and accessing documentation.
- **Other Tools**: Git for version control (optional but recommended), and a terminal/command prompt for running commands.
No special hardware is required beyond a standard development setup. Ensure your system has permissions to install global packages if needed.

## Completion Instructions

## **Backend Tasks (Node.js, Express, SQLite)**

### **2.1. Products API Endpoints**

### **A. Get Products List API (GET `/api/products`)**

- **Goal:** Return all products.
- **Implementation:** Use `db.all()` to fetch all records from the `products` table.
- *(Bonus: Implement query parameters for pagination and sorting here.)*

### **B. Update Product API (PUT `/api/products/:id`)**

- **Goal:** Update product details and track inventory history.
- **Steps:**
    1. **Validation:** Use `express-validator` to ensure fields like `name` and `stock` meet requirements (e.g., `stock` is a number, `name` is unique or belongs to the current ID).
    2. **Fetch Old Data:** Before updating, fetch the current product data, specifically the `stock`.
    3. **Update:** Use `db.run()` with a `UPDATE` query.
    4. **Inventory History Tracking:** If `stock` has changed, insert a new record into the `inventory_history` table.

### **Import/Export Functionality**

### **A. Import Products API (POST `/api/products/import`)**

- **Middleware:** Use **`multer`** to handle the file upload.JavaScript

```
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// In router: router.post('/import', upload.single('csvFile'), (req, res) => { ... });

```

### **Export Products API (GET `/api/products/export`)**

-**Goal:** Return all products as a CSV file.
-**Steps:**
1. Fetch all products from the database.
2. Format the data into a CSV string (e.g., using a library or manual string manipulation, ensuring headers are included).
3. Set appropriate response headers:JavaScript

```     
  `res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
  res.status(200).send(csvData);`

```
### **Inventory History Endpoint**

- **Create GET Endpoint:** `GET /api/products/:id/history`
- **Implementation:** Fetch records from the `inventory_history` table where `product_id` matches the route parameter.
- **Sorting:** Ensure the results are sorted by `change_date` in **descending** order.

## Frontend Tasks (ReactJS)**

### **1. Main Product Page Structure**

- **Layout:** Use a grid or Flexbox for layout.
- **Header Elements:**
    - **Left Side:** Search Bar, Category Filter, "Add New Product" button.
    - **Right Side:** "Import" button, "Export" button.

### **2. Product Search & Filtering**

1. **Search Bar:**
    - Component state manages the query string.
    - On change, trigger an API call to `GET /api/products/search?name={query}` (requires implementing this search endpoint in the backend).
2. **Category Filter:**
    - Populate the dropdown by fetching unique categories from the product list (or a dedicated backend endpoint).
    - Filtering can be done client-side if the product list is small, or by making an API call: `GET /api/products?category={category}`.

### **3. Products Table (Component: `ProductTable.js`)**

- **Responsiveness:** Use CSS media queries or a responsive UI framework (like Bootstrap or Tailwind CSS) to ensure the table adjusts well on smaller screens.
- **Stock Status Display:** Implement logic to map the `stock` value to a visual status:
    - `stock == 0`: **Out of Stock** (Red Label)
    - `stock > 0`: **In Stock** (Green Label)

### **4. Inline Editing**

1. **State Management:** In the `ProductTable` component (or a `ProductRow` component), add a state like `isEditing` for each row.
2. **"Edit" Click:** Set `isEditing` to `true`. Replace static text fields in the row with `<input>` or `<select>` elements, pre-filled with the current data.

### **.5. Import/Export Functionality**

1. **Export Button:**
    - On click, use `window.open` or `axios` with `responseType: 'blob'` to download the file from `GET /api/products/export`.


### **6. Inventory History Sidebar**

1. **Trigger:** Clicking a row or a specific button (e.g., "View History") should select a product.
2. **Sidebar Component:**
    - When a product is selected, the sidebar appears.
    - It fetches data from the backend: `GET /api/products/{product_id}/history`.
    - Display the history logs (Old Quantity, New Quantity, Date, etc.) in a clear, formatted list.

## Bonus Tasks and Deployment

### **Pagination & Sorting**

Add table header click handlers to change sort parameters. Use state for currentPage, pageSize, sortField, sortOrder.

### **Authentication**

Implement JWT (JSON Web Tokens). Add login/register components. Store JWT in browser storage (e.g., Local Storage). Include the token in the Authorization header of all protected API calls.

### **Responsive Design**

Use CSS Flexbox/Grid for the overall layout. Implement media queries for different breakpoints (mobile, tablet, desktop). Ensure the product table is manageable on small screens (e.g., by hiding less critical columns).


## Project Structure

Organize your project files logically for easy navigation. Here's a typical structure for this React app:

```
- **Inventory-Management/** (root folder)
    -**backend/** : Backend folder.
        -**node_modules/**: Auto-generated dependencies (don't edit).
        -**server.js/**: Express setup and routing
        -**inventory.js/**: All static JSON data
        -**package.json/**: Lists dependencies and scripts.
    -**frontend/** : Frontend folder.
        - **node_modules/**: Auto-generated dependencies (don't edit).
        - **public/**: Static files like index.html and favicon.
        - **src/**: Main source code.
            - **components/**: Reusable UI parts.
               - Sidebar.js: Shows the history of a product.
               - ProductRow.js: Displays the row of a table.
               - Login.js: Login and registration page.
               - ProductTable.js: Renders structured data beautifully.
               - ProtectRoute.js Handles authentication for login users.
            - App.js: Main app component that ties everything together.
            - index.js: Entry point for rendering the app.
            - metadata.json: Sample JSON file for nodes and edges.
            - App.css: Styles for the app layout.
    - package.json: Lists dependencies and scripts.
    - tailwind.config.js
    - [README.md](http://readme.md/): Project documentation.
```

This structure separates concerns: Components for UI, src for logic, and root for config.


### Guidelines to develop a project

- Create a new React app using Create React App (CRA), which sets up a basic structure.
- Run: `npx create-react-app dynamic-diagram-flow`.
- Navigate into the project folder: `cd dynamic-diagram-flow`.
- Start the development server: `npm start`. This opens the app in your browser at `http://localhost:3000`. Verify it runs without errors.


### Third-party packages

    - React Flow: For rendering interactive diagrams (install via npm).
    - Optional: React Context or Redux for state management; use built-in React hooks if keeping it simple.

### Backend Deployment Link:

***Render** : 